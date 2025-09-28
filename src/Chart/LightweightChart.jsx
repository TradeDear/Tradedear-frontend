import { useEffect, useMemo, useRef, useState } from "react";
import { createChart, CrosshairMode } from "lightweight-charts";
import PricesWS from "../lib/pricesWs";

// 🔐 
async function fetchCandles({ baseUrl, symbol, interval = "1m", limit = 300 }) {
  const token = localStorage.getItem("token");
  const url = `${baseUrl}/api/market/candles?symbol=${encodeURIComponent(
    symbol
  )}&interval=${interval}&limit=${limit}`;

  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to load candles");
  const data = await res.json();

  return data.map((c) => ({
    time: Math.floor(c.time / 1000),
    open: Number(c.open),
    high: Number(c.high),
    low: Number(c.low),
    close: Number(c.close),
  }));
}

export default function LightweightChart({ symbol = "BTC-USD", interval = "1m" }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);

  const candleCache = useRef({}); // { "BTC-USD:1m": [...], "ETH-USD:5m": [...] }

  const wsClient = useMemo(() => new PricesWS(), []);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
  const isDark = currentTheme === "dark";
  useEffect(() => {
    if (!containerRef.current) return;

    chartRef.current = createChart(containerRef.current, {
      layout: {
        background: { color: isDark ? "#0f1115" : "#ffffff" },
        textColor: isDark ? "#d6deeb" : "#1f2937",
      },
      grid: {
        vertLines: { color: isDark ? "#1c212b" : "#e5e7eb" },
        horzLines: { color: isDark ? "#1c212b" : "#e5e7eb" },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: isDark ? "#2a2f3a" : "#d1d5db" },
      localization: { locale: "en-IN" },
      timeScale: {
        borderColor: isDark ? "#2a2f3a" : "#d1d5db",
        timeVisible: true, 
      },
    });

    candleSeriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderUpColor: "#22c55e",
      borderDownColor: "#ef4444",
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      chartRef.current.applyOptions({
        width: Math.floor(width),
        height: Math.floor(height),
      });
      chartRef.current.timeScale().fitContent();
    });
    ro.observe(containerRef.current);

    setTimeout(() => chartRef.current.timeScale().fitContent(), 50);

    return () => {
      ro.disconnect();
      chartRef.current?.remove();
      chartRef.current = null;
    };
  }, [isDark]);
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");

    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
    const key = `${symbol}:${interval}`;

    const loadCandles = async () => {
      if (candleCache.current[key]) {
        candleSeriesRef.current?.setData(candleCache.current[key]);
        chartRef.current?.timeScale().fitContent();
        setLoading(false);
      }

      try {
        const candles = await fetchCandles({ baseUrl, symbol, interval, limit: 300 });
        if (!mounted) return;
        candleCache.current[key] = candles;
        candleSeriesRef.current?.setData(candles);
        chartRef.current?.timeScale().fitContent();
        setLoading(false);
      } catch (e) {
        if (!mounted) return;
        console.error(e);
        setError("Failed to load historical candles");
        setLoading(false);
      }
    };

    loadCandles();

    return () => {
      mounted = false;
    };
  }, [symbol, interval]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    wsClient.connect(token); 

    const key = `${symbol}:${interval}`;

wsClient.on("message", (msg) => {
  console.log("🔥 WS message received:", msg);
  if (msg.type === "candle" && msg.symbol === symbol && msg.interval === interval) {
    const c = msg.data;
    const candle = {
      time: Math.floor(c.timeMs / 1000),
      open: Number(c.o),
      high: Number(c.h),
      low: Number(c.l),
      close: Number(c.c),
    };
    candleSeriesRef.current?.update(candle);

    const key = `${symbol}:${interval}`;
    if (candleCache.current[key]) {
      candleCache.current[key] = [...candleCache.current[key].slice(-299), candle];
    }
  }
});


    wsClient.subscribe([`${symbol}:${interval}`]);

    return () => {
      wsClient.unsubscribe([`${symbol}:${interval}`]);
    };
  }, [wsClient, symbol, interval]);

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col">
      {loading && !candleCache.current[`${symbol}:${interval}`] && (
        <div className="text-xs opacity-70">Loading candles…</div>
      )}
      {error && <div className="text-xs text-red-600">{error}</div>}
    </div>
  );
}
