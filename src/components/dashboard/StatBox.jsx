import React from "react";

export default function StatBox({ label, value, color, border }) {
  return (
    <div
      className={`bg-white border-4 ${border} p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]`}
    >
      <h3 className="text-xs font-black text-[#1A4734] uppercase tracking-widest opacity-60 mb-2">
        {label}
      </h3>
      <p className={`text-5xl font-black ${color} tracking-tighter`}>{value}</p>
    </div>
  );
}
