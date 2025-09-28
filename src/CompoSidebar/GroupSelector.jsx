import React from "react";

const GroupSelector = ({ groups, activeGroup, setActiveGroup }) => {
  return (
    // 
   <div className="flex justify-between text-center mx-4 my-0 px-2 py-2">
  {groups.map((g) => (
    <button
      key={g}
      className={`text-[rgb(80,43,226)] text-xl w-8 border border-[rgb(178,184,177)] rounded px-1 ${
        activeGroup === g ? "bg-[rgb(80,43,226)] text-white font-bold" : ""
      }`}
      onClick={() => setActiveGroup(g)}
    >
      {g}
    </button>
  ))}
</div>

  );
};

export default GroupSelector;
