import React from "react";
import Link from "next/link";

const GradientButton = ({ children, className = "", forward = "#", ...props }) => {
  return (
    <Link
      href={forward}
      {...props}
      className={`
        relative inline-flex items-center justify-center
        rounded-full px-10 py-2 font-semibold text-md
        text-white
        bg-gradient-to-tl 
        from-slate-800 
        via-violet-500 
        to-zinc-400
        shadow-lg shadow-violet-500/20
        transition-all duration-300
        hover:scale-[1.03]
        active:scale-[0.97]
        focus:outline-none focus:ring-2 focus:ring-violet-500/50
        
        ${className}
      `}
    >
      {children}
    </Link>
  );
};

export default GradientButton;
