import { useState, useEffect } from "react";
import LightweightChart from "../Chart/LightweightChart";

export default function Watchlist() {
  const [symbol, setSymbol] = useState("BTC-USD");
  const [interval, setInterval] = useState(() => localStorage.getItem("interval") || "1m");
  const [pendingInterval, setPendingInterval] = useState(interval);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setInterval(pendingInterval);
      localStorage.setItem("interval", pendingInterval); // ✅ Save to localStorage
    }, 300);
    return () => clearTimeout(timeout);
  }, [pendingInterval]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 bg-white-100">
        <select
          value={pendingInterval}
          onChange={(e) => setPendingInterval(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="1m">1m</option>
          <option value="5m">5m</option>
          <option value="15m">15m</option>
          <option value="1h">1h</option>
          <option value="1d">1d</option>
        </select>
      </div>
      <div className="flex-1 min-h-0">
        <LightweightChart symbol={symbol} interval={interval} />
      </div>
    </div>
  );
}
