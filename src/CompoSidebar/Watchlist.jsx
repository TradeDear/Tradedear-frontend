import React from "react";
import StockRow from "./StockRow";

const Watchlist = ({ stocks = [], onDelete }) => {
  if (!Array.isArray(stocks)) {
    console.error("❌ Watchlist expects 'stocks' as an array, got:", stocks);
    return <ul className="watchlist"><li>Error: Invalid stock data</li></ul>;
  }

  return (
  <ul className="flex flex-col gap-2 p-2 list-none">

      {stocks.length === 0 ? (
        <li>No stocks added</li>
      ) : (
        stocks.map((stock) => (
          <StockRow
            key={stock.name}   
            {...stock}
            onDelete={onDelete}
          />
        ))
      )}
    </ul>
  );
};

export default Watchlist;
