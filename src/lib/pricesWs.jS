export default class PricesWS {
  constructor(url = import.meta.env.VITE_WS_URL || "ws://localhost:4000/ws", debug = false) {
    this.url = url;
    this.ws = null;
    this.token = null;
    this.subscribed = new Set();
    this.debug = debug;
    this.events = new Map();
    this._shouldReconnect = true;
    this._reconnectDelay = 3000;
    this._maxReconnectDelay = 30000;
    this._reconnectAttempts = 0;
    this._maxAttempts = 10;
    this._reconnectTimer = null;
    this._heartbeatInterval = null;
    this._messageQueue = [];
  }

  on(event, handler) {
    this.events.set(event, handler);
  }

  _emit(event, payload) {
    this.events.get(event)?.(payload);
  }

  connect(token) {
    this.token = token;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      if (this.debug) console.info("✅ WS Connected:", this.url);

      if (this.token) {
        this._send({ action: "auth", token: this.token });
      }

      this._reconnectDelay = 3000;
      this._reconnectAttempts = 0;

      this._heartbeatInterval = setInterval(() => {
        this._send({ action: "ping" });
      }, 15000);

      this._emit("open");
      this._flushQueue();
    };

    this.ws.onmessage = (event) => {
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch {
        if (this.debug) console.warn("❌ WS message parse failed:", event.data);
        return;
      }

      if (msg.type === "auth_ok") {
        if (this.debug) console.info("🔐 Auth successful:", msg.user || "user");
        if (this.subscribed.size > 0) {
          this._send({ action: "subscribe", product_ids: [...this.subscribed] });
        }
      }

      this._emit("message", msg);
    };

    this.ws.onclose = (e) => {
      if (this.debug) console.warn("⚠️ WS Disconnected:", e.code, e.reason || "");
      this._emit("close", e);
      clearInterval(this._heartbeatInterval);

      if (this._shouldReconnect) {
        if (this._reconnectAttempts >= this._maxAttempts) {
          this._emit("error", "Max reconnect attempts reached");
          return;
        }

        this._reconnectAttempts++;
        clearTimeout(this._reconnectTimer);
        this._reconnectTimer = setTimeout(() => {
          this._reconnectDelay = Math.min(this._reconnectDelay * 2, this._maxReconnectDelay);
          this.connect(this.token);
        }, this._reconnectDelay);
      }
    };

    this.ws.onerror = (err) => {
      if (this.debug) console.error("❌ WS Error:", err);
      this._emit("error", err);
    };
  }

  _send(obj) {
    const msg = JSON.stringify(obj);
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this._messageQueue.push(msg);
      return;
    }

    try {
      this.ws.send(msg);
    } catch (err) {
      if (this.debug) console.error("❌ WS send error:", err);
    }
  }

  _flushQueue() {
    while (this._messageQueue.length > 0) {
      this.ws.send(this._messageQueue.shift());
    }
  }

  subscribe(symbols = []) {
    const newOnes = symbols.filter((s) => !this.subscribed.has(s));
    if (newOnes.length === 0) return;

    newOnes.forEach((s) => this.subscribed.add(s));
    this._send({ action: "subscribe", product_ids: newOnes });
  }

  unsubscribe(symbols = []) {
    symbols.forEach((s) => this.subscribed.delete(s));
    if (symbols.length > 0) {
      this._send({ action: "unsubscribe", product_ids: symbols });
    }
  }

  close() {
    this._shouldReconnect = false;
    clearTimeout(this._reconnectTimer);
    clearInterval(this._heartbeatInterval);

    try {
      this.ws?.close();
    } catch (err) {
      if (this.debug) console.warn("❌ Error closing WS:", err);
    }

    this.ws = null;
  }

  get readyState() {
    return this.ws?.readyState;
  }
}
