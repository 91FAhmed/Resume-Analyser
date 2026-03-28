"use client";

import React, { useRef } from "react";
import Link from "next/link";

const GradientButton = ({ children, className = "", forward = "#", ...props }) => {
  const btnRef = useRef(null);

  const createRipple = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const ripple = document.createElement("span");
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255,255,255,0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: md-ripple 0.55s ease-out forwards;
      pointer-events: none;
    `;
    btn.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  };

  return (
    <>
      <style>{`
        @keyframes md-ripple {
          to { transform: scale(1); opacity: 0; }
        }
      `}</style>
      <Link
        href={forward}
        ref={btnRef}
        onClick={createRipple}
        {...props}
        style={{
          position: "relative",
          overflow: "hidden",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          borderRadius: "100px",
          padding: "10px 24px",
          fontFamily: "'Google Sans', 'Nunito', sans-serif",
          fontWeight: 600,
          fontSize: "14px",
          letterSpacing: "0.1px",
          color: "#fff",
          background: "linear-gradient(135deg, #6750A4 0%, #9C7BEA 100%)",
          boxShadow: "0 1px 3px rgba(103,80,164,0.3), 0 4px 12px rgba(103,80,164,0.2)",
          textDecoration: "none",
          border: "none",
          cursor: "pointer",
          transition: "box-shadow 0.2s ease, transform 0.15s ease",
          userSelect: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(103,80,164,0.4), 0 6px 20px rgba(103,80,164,0.3)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 1px 3px rgba(103,80,164,0.3), 0 4px 12px rgba(103,80,164,0.2)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
        onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.97)"; }}
        onMouseUp={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
        className={className}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <path d="M12 16l-6-6h12l-6 6z" fill="white" />
        </svg>
        {children}
      </Link>
    </>
  );
};

export default GradientButton;