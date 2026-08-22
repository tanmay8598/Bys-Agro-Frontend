


"use client";
import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="w-full bg-[#FFF9EE] border border-[#EDCD92] rounded-xl px-5 py-4 mb-3 cursor-pointer select-none transition-all duration-300 hover:shadow-sm"
      onClick={() => setOpen(!open)}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm lg:text-[18px] font-semibold text-[#1A3232]">
          {title}
        </h3>

        <div
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          <FaChevronDown className="text-[#1A3232] w-4 h-4" />
        </div>
      </div>

      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${open ? "max-h-125 opacity-100 mt-4" : "max-h-0 opacity-0"}
        `}
      >
        <div className="pt-4 text-[#1A3232] text-sm leading-relaxed border-t border-[#EDCD92]">
          {children}
        </div>
      </div>
    </div>
  );
}