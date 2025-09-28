import React, { useState, useEffect, useRef } from "react";
import SearchBox from "./SearchBox";
import GroupSelector from "./GroupSelector";
import Watchlist from "./Watchlist";
import PricesWS from "../lib/pricesWs";
import "../styles/Sidebar.css";

const groups = ["A", "B", "C", "D", "E", "F"];

const Sidebar = () => {
  const [activeGroup, setActiveGroup] = useState("A");
  const [watchlists, setWatchlists] = useState(
    Object.fromEntries(groups.map((g) => [g, []]))
  );

  const wsClientRef = useRef(null);
  const allSymbolsRef = useRef([]); 
   useEffect(() => {
    const loaded = {};
    groups.forEach((g) => {
      const saved = JSON.parse(localStorage.getItem(`watchlist_${g}`)) || [];
      loaded[g] = saved;
    });
    setWatchlists(loaded);

    allSymbolsRef.current = Object.values(loaded).flat().map((s) => s.name);
  }, []);

  useEffect(() => {
  const wsClient = wsClientRef.current;
  if (!wsClient || wsClient.readyState !== WebSocket.OPEN) return;

  if (allSymbolsRef.current.length > 0) {
    console.log("📡 Subscribing from sync effect:", allSymbolsRef.current);
    wsClient.subscribe(allSymbolsRef.current);
  }
  }, [watchlists]);

   useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("⚠️ No JWT token found. Please login first.");
      return;
    }

    const wsClient = new PricesWS();
    wsClientRef.current = wsClient;

    wsClient.onopen = () => {
      console.log("✅ WebSocket connected");
    
      if (allSymbolsRef.current.length > 0) {
        console.log("📡 Subscribing after connect:", allSymbolsRef.current);
        wsClient.subscribe(allSymbolsRef.current);
      }
    };

    wsClient.on("message", (msg) => {
  console.log("📨 WS message received:", msg);

  if (msg?.type === "ticker") {
    setWatchlists((prev) => {
      const updated = { ...prev };

      for (const g of groups) {
        updated[g] = updated[g].map((s) => {
          if (s.name === msg.product_id) {
            const priceUSD = parseFloat(msg.price);
            let changePercent = "0.00";

            if (msg.price_percent_chg_24_h !== undefined) {
              changePercent = parseFloat(msg.price_percent_chg_24_h).toFixed(2);
            } else if (msg.open_24h) {
              const open = parseFloat(msg.open_24h);
              if (open > 0) {
                changePercent = (((priceUSD - open) / open) * 100).toFixed(2);
              }
            }

            return {
              ...s,
              price: `$${priceUSD.toFixed(2)}`,
              change: `${changePercent}%`,
            };
          }
          return s;
        });

        localStorage.setItem(`watchlist_${g}`, JSON.stringify(updated[g]));
      }

      return updated;
    });
  }
});


    wsClient.connect(token);

    return () => {
      wsClient.close();
    };
  }, []);

  const addStockToGroup = (productId) => {
    setWatchlists((prev) => {
      const currentGroup = prev[activeGroup];
      if (currentGroup.some((s) => s.name === productId)) return prev;

      allSymbolsRef.current = [...allSymbolsRef.current, productId];
      wsClientRef.current?.subscribe([productId]);

      const updatedGroup = [
  { name: productId, price: "—", change: "—" },
  ...currentGroup,
];

       localStorage.setItem(
        `watchlist_${activeGroup}`,
        JSON.stringify(updatedGroup)
      );

      return { ...prev, [activeGroup]: updatedGroup };
    });
  };

     const deleteStockFromGroup = (productId) => {
           setWatchlists((prev) => {
      const updatedGroup = prev[activeGroup].filter((s) => s.name !== productId);

      allSymbolsRef.current = allSymbolsRef.current.filter((s) => s !== productId);
      wsClientRef.current?.unsubscribe([productId]);

      localStorage.setItem(
        `watchlist_${activeGroup}`,
        JSON.stringify(updatedGroup)
      );

      return { ...prev, [activeGroup]: updatedGroup };
    });
    };
     return (
    <aside className="flex flex-col h-screen w-[30%] border-r border-gray-300 bg-white"> 

      <div className="sticky top-0 z-[900] bg-white flex flex-col flex-shrink-0 p-1 border-b border-gray-200">
  <SearchBox onSelect={addStockToGroup} />
  <GroupSelector
    groups={groups}
    activeGroup={activeGroup}
    setActiveGroup={setActiveGroup}
  />
</div>

  <div className="flex-1 overflow-y-auto">
    <Watchlist
      stocks={watchlists[activeGroup]}
      onDelete={deleteStockFromGroup}
    />
  </div>
    </aside>
  );
};

export default Sidebar;
