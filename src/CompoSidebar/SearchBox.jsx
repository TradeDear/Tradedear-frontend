import React, { useState, useEffect } from "react";

const SearchBox = ({ onSelect }) => {
  const [q, setQ] = useState("");
  const [suggests, setSuggests] = useState([]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!q) { setSuggests([]); return; }

      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(q)}&quote=USD`);
        const data = await res.json();
        setSuggests(data);
      } catch (e) {
        console.error("Product search failed", e);
      }
    }, 300); 

    return () => clearTimeout(timer);
  }, [q]);

  return (
    <div className="search-box">
    
    <input
  id="stockInput"
  value={q}
  onChange={(e) => setQ(e.target.value)}
  placeholder="Search BTC, ETH..."
  className="w-[90%] my-1 px-3 py-2 rounded-2xl border-none shadow-[0_0_10px_rgba(114,165,233,0.3)]"
/>

  {/* Suggestions List */}
  <ul className="list-none m-0 p-0 border-gray-300 rounded-lg max-h-[240px] overflow-y-auto bg-white shadow-md font-[Segoe_UI]">
  {suggests.map((p) => (
    <li
      key={p.id}
      onClick={() => {
        onSelect(p.id);
        setQ("");
        setSuggests([]);
      }}
      className="px-4 py-2 text-[15px] border-b border-gray-200 cursor-pointer hover:bg-blue-50 hover:text-blue-600 hover:font-medium transition-all"
    >
      {p.id} ({p.base_currency}/{p.quote_currency})
    </li>
  ))}
</ul>

    </div>
  );
};

export default SearchBox;
