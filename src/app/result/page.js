"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// ── Readable title from PascalCase/camelCase key ──────────────────────────
function keyToTitle(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .trim();
}

// ── JSON feedback parser ───────────────────────────────────────────────────
function parseMarkdown(text) {
  if (!text) return [];

  // Strip markdown code fences if AI wraps JSON in ```json ... ```
  const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/, "").trim();

  let data;
  try {
    data = JSON.parse(cleaned);
  } catch (e) {
    // Not JSON — fallback: show raw as single section
    return [{ title: "Analysis", items: [{ type: "text", content: text }] }];
  }

  const sections = [];

  for (const [key, value] of Object.entries(data)) {
    const title = keyToTitle(key);
    const items = [];

    if (Array.isArray(value)) {
      value.forEach((entry, idx) => {
        if (typeof entry === "string") {
          // Simple string array e.g. Skills: ["React", "Node.js"]
          items.push({ type: "bullet", content: entry });
        } else if (typeof entry === "object" && entry !== null) {
          // Object array e.g. WorkExperience, SuggestionsForImprovement
          // Add a divider between entries
          if (idx > 0) items.push({ type: "divider", content: "" });
          Object.entries(entry).forEach(([k, v]) => {
            if (Array.isArray(v)) {
              // Nested array e.g. Achievements: [...]
              items.push({ type: "subheading", content: k });
              v.forEach((line) => items.push({ type: "bullet", content: line }));
            } else {
              items.push({ type: "field", label: k, content: String(v) });
            }
          });
        }
      });
    } else if (typeof value === "object" && value !== null) {
      // Single object e.g. Education: { Degree: "...", Institution: "..." }
      Object.entries(value).forEach(([k, v]) => {
        items.push({ type: "field", label: k, content: String(v) });
      });
    } else {
      items.push({ type: "text", content: String(value) });
    }

    sections.push({ title, items });
  }

  return sections;
}

// ── Render a plain string with **bold** support ────────────────────────────
function renderInline(str) {
  if (!str) return null;
  const parts = str.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return <strong key={i} style={{ fontWeight: 700, color: "var(--md-on-surface)" }}>{p.slice(2, -2)}</strong>;
    }
    return p;
  });
}

// ── Section icon map ───────────────────────────────────────────────────────
function sectionIcon(title = "") {
  const t = title.toLowerCase();
  if (t.includes("skill")) return "⚡";
  if (t.includes("experience") || t.includes("work")) return "💼";
  if (t.includes("education")) return "🎓";
  if (t.includes("suggest") || t.includes("improve") || t.includes("tip")) return "💡";
  if (t.includes("summary") || t.includes("overview")) return "📋";
  if (t.includes("strength")) return "💪";
  if (t.includes("weakness") || t.includes("gap")) return "🔍";
  if (t.includes("certif") || t.includes("award")) return "🏆";
  return "📌";
}

function sectionColor(title = "") {
  const t = title.toLowerCase();
  if (t.includes("skill")) return { bg: "var(--md-primary-container)", accent: "var(--md-primary)" };
  if (t.includes("experience") || t.includes("work")) return { bg: "var(--md-surface-tint-2)", accent: "#3D5AFE" };
  if (t.includes("education")) return { bg: "var(--md-success-container)", accent: "var(--md-on-success)" };
  if (t.includes("suggest") || t.includes("improve") || t.includes("tip")) return { bg: "var(--md-warning-container)", accent: "var(--md-on-warning)" };
  if (t.includes("strength")) return { bg: "#E8F5E9", accent: "#2E7D32" };
  if (t.includes("weakness") || t.includes("gap")) return { bg: "var(--md-error-container)", accent: "var(--md-on-error)" };
  return { bg: "var(--md-surface-variant)", accent: "var(--md-on-surface-variant)" };
}

// ── Score helpers ──────────────────────────────────────────────────────────
function scoreColor(s) {
  if (s >= 80) return { bg: "var(--md-success-container)", color: "var(--md-on-success)", track: "#81C995", label: "Excellent" };
  if (s >= 60) return { bg: "var(--md-warning-container)", color: "var(--md-on-warning)", track: "#FBBC04", label: "Good" };
  return { bg: "var(--md-error-container)", color: "var(--md-on-error)", track: "#EA4335", label: "Needs Work" };
}

// ── Main component ─────────────────────────────────────────────────────────
export default function ResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fileId = searchParams.get("fileId");

  const containerRef = useRef(null);
  const [analysis, setAnalysis] = useState(null);
  const [pdfReady, setPdfReady] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [numPages, setNumPages] = useState(0);
  const [renderedPages, setRenderedPages] = useState([]);

  // ── 1. Load analysis from sessionStorage ──────────────────────────────
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("analysis");
      if (raw) setAnalysis(JSON.parse(raw));
    } catch (e) {
      console.error("sessionStorage read failed", e);
    }
  }, []);

  // ── 2. Load pdf.js script dynamically ─────────────────────────────────
  useEffect(() => {
    if (!fileId) { setPdfLoading(false); return; }
    if (window.pdfjsLib) { setPdfReady(true); return; }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js";
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
      setPdfReady(true);
    };
    script.onerror = () => { setPdfError("Failed to load PDF renderer."); setPdfLoading(false); };
    document.head.appendChild(script);
  }, [fileId]);

  // ── 3. Render all PDF pages into canvases once pdfjsLib is ready ──────
  useEffect(() => {
    if (!pdfReady || !fileId) return;

    let cancelled = false;
    async function renderAllPages() {
      setPdfLoading(true);
      setPdfError(null);
      try {
        const res = await fetch(
          `/api/pdf?id=${encodeURIComponent(fileId)}&t=${Date.now()}`,
          { cache: "no-store", headers: { "Cache-Control": "no-cache" } }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = await res.arrayBuffer();
        if (!buf.byteLength) throw new Error("Empty PDF response");

        const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
        if (cancelled) return;

        setNumPages(pdf.numPages);
        const pages = [];

        for (let p = 1; p <= pdf.numPages; p++) {
          const page = await pdf.getPage(p);
          const viewport = page.getViewport({ scale: 1.5 });

          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = "100%";
          canvas.style.display = "block";

          const ctx = canvas.getContext("2d");
          await page.render({ canvasContext: ctx, viewport }).promise;
          if (cancelled) return;

          pages.push({ canvas, pageNum: p });
        }

        setRenderedPages(pages);
      } catch (err) {
        console.error("PDF render error:", err);
        if (!cancelled) setPdfError("Could not render PDF. " + err.message);
      } finally {
        if (!cancelled) setPdfLoading(false);
      }
    }

    renderAllPages();
    return () => { cancelled = true; };
  }, [pdfReady, fileId]);

  // ── 4. Attach canvases to DOM container ───────────────────────────────
  useEffect(() => {
    if (!containerRef.current || renderedPages.length === 0) return;
    containerRef.current.innerHTML = "";
    renderedPages.forEach(({ canvas, pageNum }) => {
      if (numPages > 1) {
        const label = document.createElement("div");
        label.textContent = `Page ${pageNum} of ${numPages}`;
        label.style.cssText =
          "font-size:11px;color:#79747E;font-weight:600;text-align:right;padding:4px 8px;";
        containerRef.current.appendChild(label);
      }
      containerRef.current.appendChild(canvas);
    });
  }, [renderedPages, numPages]);

  // ── Parsed sections ────────────────────────────────────────────────────
  const sections = parseMarkdown(analysis?.feedback);
  const sc = analysis?.score != null ? scoreColor(analysis.score) : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700;800&display=swap');
        
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #FFFBFE;
          font-family: 'Google Sans', 'Nunito', 'Segoe UI', sans-serif;
          color: #1C1B1F;
        }

        /* ── CSS tokens ── */
        :root {
          --md-primary: #6750A4;
          --md-primary-light: #9C7BEA;
          --md-on-primary: #FFFFFF;
          --md-primary-container: #EAE0FF;
          --md-on-primary-container: #21005E;
          --md-surface: #FFFBFE;
          --md-surface-variant: #F4EFF4;
          --md-surface-tint: #F6F0FF;
          --md-surface-tint-2: #EEF0FF;
          --md-on-surface: #1C1B1F;
          --md-on-surface-variant: #49454F;
          --md-outline: #CAC4D0;
          --md-outline-variant: rgba(103,80,164,0.08);
          --md-success: #34A853;
          --md-success-container: #E6F4EA;
          --md-on-success: #137333;
          --md-warning-container: #FEF7E0;
          --md-on-warning: #8A6100;
          --md-error-container: #FCE8E6;
          --md-on-error: #C5221F;
          --md-muted: #79747E;
          --md-shadow-1: 0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(103,80,164,0.07);
          --md-shadow-2: 0 2px 8px rgba(0,0,0,0.09), 0 8px 24px rgba(103,80,164,0.1);
          --md-radius-sm: 12px;
          --md-radius-md: 16px;
          --md-radius-lg: 20px;
          --md-radius-xl: 24px;
          --md-radius-full: 100px;
          --md-transition: 0.2s cubic-bezier(0.4,0,0.2,1);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .fade-up { animation: fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both; }
        .stagger-1 { animation-delay: 0ms; }
        .stagger-2 { animation-delay: 80ms; }
        .stagger-3 { animation-delay: 160ms; }
        .stagger-4 { animation-delay: 240ms; }

        /* ── Navbar ── */
        .navbar {
          position: sticky; top: 12px; z-index: 50;
          max-width: 1140px; margin: 12px auto 0;
          padding: 0 20px; height: 60px;
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(20px);
          border-radius: 28px;
          box-shadow: 0 1px 8px rgba(103,80,164,0.08);
          border: 1px solid rgba(103,80,164,0.1);
        }
        .logo-mark {
          width: 34px; height: 34px; border-radius: 10px;
          background: linear-gradient(135deg, #6750A4, #9C7BEA);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 16px; font-weight: 800;
          box-shadow: 0 2px 8px rgba(103,80,164,0.35);
        }
        .logo-text {
          font-size: 1.0625rem; font-weight: 700;
          background: linear-gradient(135deg, #6750A4, #9C7BEA);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .btn-back {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 18px; border-radius: var(--md-radius-full);
          border: 1.5px solid var(--md-outline);
          background: transparent; color: var(--md-primary);
          font-family: inherit; font-size: 0.875rem; font-weight: 600;
          cursor: pointer; transition: all var(--md-transition);
          text-decoration: none;
        }
        .btn-back:hover {
          background: var(--md-primary-container);
          border-color: var(--md-primary);
        }

        /* ── Score ring ── */
        .score-ring-wrap {
          position: relative; width: 88px; height: 88px; flex-shrink: 0;
        }
        .score-inner {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
        }

        /* ── Section card ── */
        .section-card {
          border-radius: var(--md-radius-xl);
          background: var(--md-surface);
          border: 1px solid var(--md-outline-variant);
          box-shadow: var(--md-shadow-1);
          overflow: hidden;
          transition: box-shadow var(--md-transition), transform var(--md-transition);
        }
        .section-card:hover {
          box-shadow: var(--md-shadow-2);
          transform: translateY(-2px);
        }
        .section-header {
          padding: 16px 20px;
          display: flex; align-items: center; gap: 10px;
          border-bottom: 1px solid var(--md-outline-variant);
        }
        .section-icon {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }
        .section-body { padding: 16px 20px; }
        .section-items { display: flex; flex-direction: column; gap: 8px; }

        /* ── Bullet item ── */
        .item-bullet {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 10px 14px; border-radius: var(--md-radius-sm);
          background: var(--md-surface-variant);
          border: 1px solid var(--md-outline-variant);
          font-size: 0.9rem; line-height: 1.6; color: var(--md-on-surface);
        }
        .bullet-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--md-primary); flex-shrink: 0; margin-top: 8px;
        }
        .num-badge {
          min-width: 22px; height: 22px; border-radius: 50%;
          background: var(--md-primary-container);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.65rem; font-weight: 800; color: var(--md-primary);
          flex-shrink: 0; margin-top: 1px;
        }
        .item-text {
          padding: 6px 0; font-size: 0.9rem;
          line-height: 1.65; color: var(--md-on-surface);
        }

        /* ── PDF panel ── */
        .pdf-panel {
          border-radius: var(--md-radius-xl);
          background: var(--md-surface);
          border: 1px solid var(--md-outline-variant);
          box-shadow: var(--md-shadow-1);
          overflow: hidden;
          position: sticky; top: 88px;
        }
        .pdf-header {
          padding: 16px 20px;
          background: linear-gradient(135deg, var(--md-surface-tint), var(--md-surface-tint-2));
          border-bottom: 1px solid var(--md-outline-variant);
          display: flex; align-items: center; gap: 10px;
        }
        .pdf-canvas-wrap {
          overflow-y: auto; max-height: calc(100vh - 200px);
          background: #E8E8E8;
        }
        .pdf-canvas-wrap canvas { display: block; }

        /* ── Skeleton ── */
        .skeleton {
          background: linear-gradient(90deg, #F4EFF4 0%, #EAE0FF 50%, #F4EFF4 100%);
          background-size: 600px 100%;
          animation: shimmer 1.5s ease-in-out infinite;
          border-radius: 8px;
        }

        /* ── Spinner ── */
        .spinner {
          width: 32px; height: 32px; border-radius: 50%;
          border: 3px solid var(--md-primary-container);
          border-top-color: var(--md-primary);
          animation: spin 0.9s linear infinite;
        }

        /* ── Chip ── */
        .chip {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 12px; border-radius: var(--md-radius-full);
          font-size: 0.75rem; font-weight: 700;
        }

        /* ── Layout ── */
        .page-wrap {
          max-width: 1140px; margin: 0 auto;
          padding: 32px 20px 80px;
        }
        .two-col {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 860px) {
          .two-col { grid-template-columns: 1fr; }
          .pdf-panel { position: static; }
          .pdf-canvas-wrap { max-height: 480px; }
        }
      `}</style>

      <main style={{ minHeight: "100vh", background: "#FFFBFE" }}>

        {/* ── Navbar ── */}
        <div style={{ padding: "0 16px" }}>
          <nav className="navbar">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="logo-mark">A</div>
              <span className="logo-text">Analyserz</span>
            </div>
            <button className="btn-back" onClick={() => router.push("/upload")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              New Analysis
            </button>
          </nav>
        </div>

        <div className="page-wrap">

          {/* ── Header: job + score ── */}
          {analysis && (
            <div className="fade-up stagger-1" style={{
              borderRadius: "var(--md-radius-xl)",
              background: "linear-gradient(135deg, var(--md-surface-tint) 0%, var(--md-surface-tint-2) 100%)",
              border: "1px solid var(--md-outline-variant)",
              padding: "24px 28px",
              marginBottom: 24,
              display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap",
              boxShadow: "var(--md-shadow-1)",
            }}>
              {/* Score ring */}
              {sc && (() => {
                const r = 36, sw = 6, norm = r - sw / 2;
                const circ = 2 * Math.PI * norm;
                const offset = circ * (1 - (analysis.score || 0) / 100);
                return (
                  <div className="score-ring-wrap">
                    <svg width="88" height="88" viewBox="0 0 88 88" style={{ transform: "rotate(-90deg)", display: "block" }}>
                      <circle cx="44" cy="44" r={norm} stroke="#E8DEF8" strokeWidth={sw} fill="none" />
                      <circle cx="44" cy="44" r={norm}
                        stroke={sc.track} strokeWidth={sw} fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circ}
                        strokeDashoffset={offset}
                        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
                      />
                    </svg>
                    <div className="score-inner">
                      <span style={{ fontSize: 20, fontWeight: 800, lineHeight: 1 }}>{analysis.score}</span>
                      <span style={{ fontSize: 9, color: "var(--md-muted)", fontWeight: 500 }}>/100</span>
                    </div>
                  </div>
                );
              })()}

              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                  {sc && (
                    <span className="chip" style={{ background: sc.bg, color: sc.color }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.color, opacity: 0.8 }} />
                      {sc.label}
                    </span>
                  )}
                  <span className="chip" style={{ background: "var(--md-primary-container)", color: "var(--md-primary)" }}>
                    ✓ Analysis Complete
                  </span>
                </div>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--md-on-surface)", letterSpacing: -0.4 }}>
                  {analysis.title || "Position"}
                  <span style={{ color: "var(--md-muted)", fontWeight: 500, fontSize: "1rem" }}> @ </span>
                  {analysis.company || "Company"}
                </div>
                {analysis.description && (
                  <div style={{ fontSize: "0.8125rem", color: "var(--md-muted)", marginTop: 4, lineHeight: 1.5 }}>
                    {analysis.description.slice(0, 120)}{analysis.description.length > 120 ? "…" : ""}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── No analysis fallback ── */}
          {!analysis && (
            <div className="fade-up stagger-1" style={{
              padding: "32px", borderRadius: "var(--md-radius-xl)",
              background: "var(--md-error-container)", border: "1px solid rgba(234,67,53,0.15)",
              color: "var(--md-on-error)", marginBottom: 24, textAlign: "center",
            }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>⚠️</div>
              <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 6 }}>No analysis found</div>
              <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>Please go back and submit a resume for analysis.</div>
            </div>
          )}

          {/* ── Two-column layout ── */}
          <div className="two-col">

            {/* Left: AI feedback sections */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {analysis && sections.length === 0 && (
                // Fallback: no sections parsed, show raw
                <div className="section-card fade-up stagger-2" style={{ padding: "20px 24px" }}>
                  <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--md-on-surface)" }}>
                    {analysis.feedback}
                  </p>
                </div>
              )}

              {sections.map((sec, si) => {
                const col = sectionColor(sec.title);
                const icon = sectionIcon(sec.title);
                return (
                  <div key={si} className={`section-card fade-up`} style={{ animationDelay: `${80 + si * 60}ms` }}>
                    <div className="section-header" style={{ background: col.bg + "55" }}>
                      <div className="section-icon" style={{ background: col.bg }}>
                        {icon}
                      </div>
                      <span style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--md-on-surface)" }}>
                        {sec.title}
                      </span>
                      <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "var(--md-muted)", fontWeight: 500 }}>
                        {sec.items.length} {sec.items.length === 1 ? "item" : "items"}
                      </span>
                    </div>
                    <div className="section-body">
                      <div className="section-items">
                        {sec.items.map((item, ii) => {
                          if (item.type === "bullet") {
                            return (
                              <div key={ii} className="item-bullet">
                                <span className="bullet-dot" />
                                <span>{renderInline(item.content)}</span>
                              </div>
                            );
                          }
                          if (item.type === "numbered") {
                            return (
                              <div key={ii} className="item-bullet">
                                <span className="num-badge">{item.num}</span>
                                <span>{renderInline(item.content)}</span>
                              </div>
                            );
                          }
                          if (item.type === "field") {
                            return (
                              <div key={ii} style={{
                                display: "flex", gap: 8, alignItems: "baseline",
                                fontSize: "0.875rem", lineHeight: 1.6,
                              }}>
                                <span style={{ fontWeight: 700, color: "var(--md-primary)", whiteSpace: "nowrap", flexShrink: 0 }}>
                                  {item.label}:
                                </span>
                                <span style={{ color: "var(--md-on-surface)" }}>{item.content}</span>
                              </div>
                            );
                          }
                          if (item.type === "subheading") {
                            return (
                              <div key={ii} style={{
                                fontSize: "0.75rem", fontWeight: 700,
                                color: "var(--md-on-surface-variant)",
                                letterSpacing: "0.4px", textTransform: "uppercase",
                                marginTop: 8, marginBottom: 2,
                              }}>
                                {item.content}
                              </div>
                            );
                          }
                          if (item.type === "divider") {
                            return (
                              <div key={ii} style={{
                                height: 1, background: "var(--md-outline-variant)",
                                margin: "8px 0",
                              }} />
                            );
                          }
                          return (
                            <p key={ii} className="item-text">{renderInline(item.content)}</p>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: PDF preview */}
            <div>
              <div className="pdf-panel fade-up stagger-3">
                <div className="pdf-header">
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: "var(--md-error-container)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: 16,
                  }}>📄</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.875rem" }}>Uploaded Resume</div>
                    {numPages > 0 && (
                      <div style={{ fontSize: "0.75rem", color: "var(--md-muted)" }}>{numPages} page{numPages !== 1 ? "s" : ""}</div>
                    )}
                  </div>
                </div>

                <div className="pdf-canvas-wrap">
                  {/* Loading state */}
                  {pdfLoading && !pdfError && (
                    <div style={{ padding: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                      <div className="spinner" />
                      <span style={{ fontSize: "0.8125rem", color: "var(--md-muted)" }}>Rendering PDF…</span>
                      <div style={{ width: "100%", maxWidth: 280, display: "flex", flexDirection: "column", gap: 8 }}>
                        {[80, 60, 90, 50].map((w, i) => (
                          <div key={i} className="skeleton" style={{ height: 12, width: w + "%" }} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Error state */}
                  {pdfError && (
                    <div style={{
                      padding: 32, textAlign: "center",
                      background: "var(--md-error-container)", color: "var(--md-on-error)",
                    }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
                      <div style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: 4 }}>PDF could not be displayed</div>
                      <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>{pdfError}</div>
                    </div>
                  )}

                  {/* No fileId */}
                  {!fileId && !pdfLoading && (
                    <div style={{ padding: 40, textAlign: "center", color: "var(--md-muted)" }}>
                      <div style={{ fontSize: 40, marginBottom: 8 }}>🗂️</div>
                      <div style={{ fontSize: "0.875rem" }}>No resume file attached</div>
                    </div>
                  )}

                  {/* Canvas mount point */}
                  <div ref={containerRef} style={{ display: pdfLoading || pdfError ? "none" : "block" }} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}