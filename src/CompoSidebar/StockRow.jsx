import React, { useEffect, useRef, useState } from "react";

const StockRow = ({ name, price, change, onDelete, onChart }) => {
  const [flashColor, setFlashColor] = useState(null);
  const lastPriceRef = useRef(null);

  useEffect(() => {
    if (price && price !== "—") {
      const numeric = parseFloat(price.replace("$", ""));
      if (!isNaN(numeric) && lastPriceRef.current !== null) {
        if (numeric > lastPriceRef.current) {
          setFlashColor("green");
        } else if (numeric < lastPriceRef.current) {
          setFlashColor("red");
        }
      
        setTimeout(() => setFlashColor(null), 500);
      }
      lastPriceRef.current = numeric;
    }
  }, [price]);
  const changeNum = Number(change?.replace("%", ""));
  const isValid = !isNaN(changeNum);
  const isPositive = isValid ? changeNum >= 0 : true;

  return (
  
    <li className="flex justify-between items-center bg-white shadow-sm mt-1 p-2 rounded">

      <span>{name}</span>

      <div
        className="price"
        style={{
          color: flashColor || (isValid ? (isPositive ? "green" : "red") : "inherit"),
        
          transition: "color 0.3s ease",
        }}
      >
        {price}
      </div>

      <div
        className="change"
        style={{
          color: isValid ? (isPositive ? "green" : "red") : "inherit",
        }}
      >
        {change}
      </div>

      <div className="bs-button">
       
       <button className="w-8 h-8 mx-1 rounded-lg text-white cursor-pointer bg-[rgb(137,133,242)]">chrt</button>
<button className="w-8 h-8 mx-1 rounded-lg text-white cursor-pointer bg-teal-600">B</button>
<button className="w-8 h-8 mx-1 rounded-lg text-white cursor-pointer bg-[rgb(207,27,27)]">S</button>


        <span
  className="material-symbols-outlined text-red-600 hover:text-red-800 cursor-pointer ml-2 text-[20px] align-middle"
  onClick={() => onDelete(name)}
>
  close
</span>

      </div>
    </li>
  );
};

export default StockRow;
