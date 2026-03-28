"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Button from "./Button";

const Navbar = ({ children, forward = "/upload", ...props }) => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      style={{
        position: "sticky",
        top: "16px",
        zIndex: 50,
        maxWidth: "860px",
        margin: "0 auto",
        borderRadius: "28px",
        padding: "0 28px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled
          ? "rgba(255,255,255,0.92)"
          : "rgba(255,255,255,0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: scrolled
          ? "0 2px 20px rgba(103,80,164,0.12), 0 1px 4px rgba(0,0,0,0.06)"
          : "0 1px 8px rgba(103,80,164,0.08)",
        border: "1px solid rgba(103,80,164,0.1)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          textDecoration: "none",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #6750A4 0%, #9C7BEA 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(103,80,164,0.35)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
              fill="white"
              fillOpacity="0.9"
            />
            <path d="M14 2v6h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8 13h8M8 17h5" stroke="#6750A4" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <span
          style={{
            fontSize: "18px",
            fontWeight: 700,
            letterSpacing: "-0.3px",
            background: "linear-gradient(135deg, #6750A4, #9C7BEA)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "'Google Sans', 'Nunito', sans-serif",
          }}
        >
          Analyserz
        </span>
      </div>

      {pathname !== "/upload" && (
        <Button forward={forward}>{children}</Button>
      )}
    </nav>
  );
};

export default Navbar;