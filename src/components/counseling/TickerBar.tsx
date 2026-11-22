import React from "react";

export function TickerBar() {
  const text =
    "ACHIEVE YOUR GOALS FASTER THAN EVER BEFORE • PROFESSIONAL GUIDANCE AND SUPPORT • JOIN THOUSANDS OF SUCCESSFUL CLIENTS TODAY • START YOUR JOURNEY • ";

  return (
    <div className="w-full bg-[#0F2342] border-b border-[#E8C872] text-[#E8C872] overflow-hidden py-2.5 select-none z-30 relative">
      <div className="whitespace-nowrap flex font-mono text-[11px] sm:text-xs font-semibold tracking-wider">
        <div className="animate-ticker inline-flex shrink-0">
          <span>{text}</span>
          <span>{text}</span>
        </div>
        <div className="animate-ticker inline-flex shrink-0" aria-hidden="true">
          <span>{text}</span>
          <span>{text}</span>
        </div>
      </div>
    </div>
  );
}
