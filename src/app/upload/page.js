"use client";

import React, { useState, useRef } from "react";
import Navbar from "@/components/Navbar";

export default function UploadPage() {
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (file && file.type === "application/pdf") {
      setResume(file);
      setError(null);
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) { setError("Please upload a resume PDF."); return; }
    setLoading(true);
    setError(null);
    setResult(null);
    const formData = new FormData();
    formData.append("company", company);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("resume", resume, resume.name);
    try {
      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Failed to parse server response.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (s) => {
    if (s >= 80) return { bg: "#E6F4EA", color: "#137333", track: "#81C995" };
    if (s >= 60) return { bg: "#FEF7E0", color: "#8A6100", track: "#FBBC04" };
    return { bg: "#FCE8E6", color: "#C5221F", track: "#EA4335" };
  };

  const fields = [
    { label: "Company Name", placeholder: "e.g. Google, Stripe…", value: company, setter: setCompany, icon: "🏢" },
    { label: "Job Title", placeholder: "e.g. Senior Frontend Engineer", value: title, setter: setTitle, icon: "💼" },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes resultReveal {
          from { opacity: 0; transform: translateY(24px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes scoreCount {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes dash {
          0%   { stroke-dashoffset: 200; }
          50%  { stroke-dashoffset: 30; }
          100% { stroke-dashoffset: 200; }
        }
        @keyframes spinTrack {
          to { transform: rotate(360deg); }
        }
        .field-wrap { animation: fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both; }
        .result-wrap { animation: resultReveal 0.5s cubic-bezier(0.4,0,0.2,1) both; }
        .md3-input {
          width: 100%;
          padding: 14px 16px 14px 44px;
          border-radius: 12px;
          border: 1.5px solid #CAC4D0;
          background: #FFFBFE;
          font-family: inherit;
          font-size: 15px;
          color: #1C1B1F;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .md3-input:focus {
          border-color: #6750A4;
          box-shadow: 0 0 0 3px rgba(103,80,164,0.12);
        }
        .md3-input::placeholder { color: #938F99; }
        .md3-textarea {
          width: 100%;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1.5px solid #CAC4D0;
          background: #FFFBFE;
          font-family: inherit;
          font-size: 15px;
          color: #1C1B1F;
          outline: none;
          resize: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
          line-height: 1.6;
        }
        .md3-textarea:focus {
          border-color: #6750A4;
          box-shadow: 0 0 0 3px rgba(103,80,164,0.12);
        }
        .md3-textarea::placeholder { color: #938F99; }
        .tip-item {
          animation: slideIn 0.4s cubic-bezier(0.4,0,0.2,1) both;
        }
      `}</style>

      <main
        style={{
          minHeight: "100vh",
          background: "#FFFBFE",
          fontFamily: "'Google Sans', 'Nunito', 'Segoe UI', sans-serif",
          paddingBottom: "80px",
        }}
      >
        <div style={{ paddingTop: "20px", paddingLeft: "16px", paddingRight: "16px" }}>
          <Navbar forward="/" >Back to Home</Navbar>
        </div>

        <section style={{ maxWidth: "620px", margin: "0 auto", padding: "48px 20px 0" }}>
          {/* Page header */}
          <div
            style={{ textAlign: "center", marginBottom: "40px", animation: "fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both" }}
          >
            <div
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "6px 16px", borderRadius: "100px", background: "#EAE0FF", marginBottom: "20px",
              }}
            >
              <span style={{ fontSize: "16px" }}>🚀</span>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#6750A4", letterSpacing: "0.3px" }}>
                AI-Powered Analysis
              </span>
            </div>
            <h1
              style={{
                margin: "0 0 12px",
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.8px",
                lineHeight: 1.2,
                color: "#1C1B1F",
              }}
            >
              Analyze Your{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #6750A4, #9C7BEA)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Resume
              </span>
            </h1>
            <p style={{ margin: 0, fontSize: "15px", color: "#49454F", lineHeight: 1.6 }}>
              Get an instant ATS score and actionable tips to land more interviews.
            </p>
          </div>

          {/* Form card */}
          <div
            style={{
              background: "#FFFBFE",
              borderRadius: "24px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.07), 0 8px 24px rgba(103,80,164,0.09)",
              border: "1px solid rgba(103,80,164,0.09)",
              padding: "32px",
              animation: "fadeUp 0.5s cubic-bezier(0.4,0,0.2,1) 0.1s both",
            }}
          >
            <form onSubmit={handleSubmit}>
              {/* Text inputs */}
              {fields.map(({ label, placeholder, value, setter, icon }, i) => (
                <div
                  key={label}
                  className="field-wrap"
                  style={{ marginBottom: "20px", animationDelay: `${0.15 + i * 0.07}s` }}
                >
                  <label
                    style={{
                      display: "block", fontSize: "13px", fontWeight: 600,
                      color: "#49454F", marginBottom: "8px", letterSpacing: "0.2px",
                    }}
                  >
                    {label}
                  </label>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute", left: "14px", top: "50%",
                        transform: "translateY(-50%)", fontSize: "17px", pointerEvents: "none",
                      }}
                    >
                      {icon}
                    </span>
                    <input
                      type="text"
                      placeholder={placeholder}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="md3-input"
                    />
                  </div>
                </div>
              ))}

              {/* Textarea */}
              <div
                className="field-wrap"
                style={{ marginBottom: "20px", animationDelay: "0.29s" }}
              >
                <label
                  style={{
                    display: "block", fontSize: "13px", fontWeight: 600,
                    color: "#49454F", marginBottom: "8px", letterSpacing: "0.2px",
                  }}
                >
                  Job Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Paste the job description here for a more accurate match score…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="md3-textarea"
                />
              </div>

              {/* File drop zone */}
              <div
                className="field-wrap"
                style={{ marginBottom: "28px", animationDelay: "0.36s" }}
              >
                <label
                  style={{
                    display: "block", fontSize: "13px", fontWeight: 600,
                    color: "#49454F", marginBottom: "8px", letterSpacing: "0.2px",
                  }}
                >
                  Resume (PDF)
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    borderRadius: "16px",
                    border: `2px dashed ${dragging ? "#6750A4" : resume ? "#34A853" : "#CAC4D0"}`,
                    background: dragging
                      ? "rgba(103,80,164,0.04)"
                      : resume
                      ? "rgba(52,168,83,0.04)"
                      : "#FAFAFA",
                    padding: "32px 20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    cursor: "pointer",
                    transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  <div
                    style={{
                      width: "52px", height: "52px", borderRadius: "16px",
                      background: resume ? "#E6F4EA" : dragging ? "#EAE0FF" : "#F4EFF4",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "24px",
                      transition: "all 0.2s",
                    }}
                  >
                    {resume ? "✅" : dragging ? "📂" : "📄"}
                  </div>

                  {resume ? (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "#137333" }}>
                        {resume.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#5F6368", marginTop: "2px" }}>
                        {(resume.size / 1024).toFixed(1)} KB · Click to replace
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: dragging ? "#6750A4" : "#49454F" }}>
                        {dragging ? "Drop it here!" : "Click to upload or drag & drop"}
                      </div>
                      <div style={{ fontSize: "12px", color: "#938F99", marginTop: "3px" }}>
                        PDF only · Max 20 MB
                      </div>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    style={{ display: "none" }}
                    onChange={(e) => handleFile(e.target.files[0])}
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "12px 16px", borderRadius: "12px",
                    background: "#FCE8E6", marginBottom: "20px",
                  }}
                >
                  <span style={{ fontSize: "16px" }}>⚠️</span>
                  <span style={{ fontSize: "14px", color: "#C5221F", fontWeight: 500 }}>{error}</span>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "100px",
                  border: "none",
                  background: loading
                    ? "#CAC4D0"
                    : "linear-gradient(135deg, #6750A4 0%, #9C7BEA 100%)",
                  color: loading ? "#938F99" : "#fff",
                  fontSize: "15px",
                  fontWeight: 700,
                  letterSpacing: "0.2px",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  boxShadow: loading ? "none" : "0 2px 8px rgba(103,80,164,0.3)",
                  transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.boxShadow = "0 4px 16px rgba(103,80,164,0.4)";
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.boxShadow = "0 2px 8px rgba(103,80,164,0.3)";
                }}
              >
                {loading ? (
                  <>
                    {/* Inline MD3 spinner */}
                    <svg width="20" height="20" viewBox="0 0 20 20" style={{ flexShrink: 0 }}>
                      <circle cx="10" cy="10" r="7" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" fill="none" />
                      <circle
                        cx="10" cy="10" r="7"
                        stroke="white" strokeWidth="2.5" fill="none"
                        strokeLinecap="round"
                        strokeDasharray="44"
                        strokeDashoffset="30"
                        style={{ transformOrigin: "10px 10px", animation: "spin 0.9s linear infinite" }}
                      />
                    </svg>
                    Analyzing…
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="white" strokeWidth="2" />
                    </svg>
                    Analyze Resume
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results */}
          {result && (
            <div
              className="result-wrap"
              style={{
                marginTop: "28px",
                borderRadius: "24px",
                background: "#FFFBFE",
                boxShadow: "0 1px 4px rgba(0,0,0,0.07), 0 8px 24px rgba(103,80,164,0.09)",
                border: "1px solid rgba(103,80,164,0.09)",
                overflow: "hidden",
              }}
            >
              {/* Result header */}
              <div
                style={{
                  padding: "24px 28px",
                  background: "linear-gradient(135deg, #F6F0FF 0%, #EEF0FF 100%)",
                  borderBottom: "1px solid rgba(103,80,164,0.08)",
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                {/* Score circle */}
                {result.score != null && (() => {
                  const sc = getScoreColor(result.score);
                  const r = 34, stroke = 6, norm = r - stroke / 2;
                  const circ = 2 * Math.PI * norm;
                  const offset = circ * (1 - result.score / 100);
                  return (
                    <div style={{ position: "relative", width: "80px", height: "80px", flexShrink: 0 }}>
                      <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: "rotate(-90deg)" }}>
                        <circle cx="40" cy="40" r={norm} stroke="#E8DEF8" strokeWidth={stroke} fill="none" />
                        <circle
                          cx="40" cy="40" r={norm}
                          stroke={sc.track} strokeWidth={stroke} fill="none"
                          strokeLinecap="round"
                          strokeDasharray={circ}
                          strokeDashoffset={offset}
                          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
                        />
                      </svg>
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: "18px", fontWeight: 800, color: "#1C1B1F", lineHeight: 1, animation: "scoreCount 0.5s cubic-bezier(0.4,0,0.2,1) 0.3s both" }}>
                          {result.score}
                        </span>
                        <span style={{ fontSize: "9px", color: "#79747E", fontWeight: 500 }}>/100</span>
                      </div>
                    </div>
                  );
                })()}

                <div>
                  <div
                    style={{
                      display: "inline-block", padding: "3px 12px", borderRadius: "100px",
                      background: result.score >= 80 ? "#E6F4EA" : result.score >= 60 ? "#FEF7E0" : "#FCE8E6",
                      color: result.score >= 80 ? "#137333" : result.score >= 60 ? "#8A6100" : "#C5221F",
                      fontSize: "12px", fontWeight: 700, marginBottom: "6px",
                    }}
                  >
                    {result.score >= 80 ? "Excellent" : result.score >= 60 ? "Good" : "Needs Work"}
                  </div>
                  <div style={{ fontSize: "17px", fontWeight: 700, color: "#1C1B1F" }}>Analysis Complete</div>
                  {result.filename && (
                    <div style={{ fontSize: "12px", color: "#79747E", marginTop: "2px" }}>
                      {result.filename} · {result.size ? `${(result.size / 1024).toFixed(1)} KB` : ""}
                    </div>
                  )}
                </div>
              </div>

              {/* Tips */}
              {result.tips?.length > 0 && (
                <div style={{ padding: "24px 28px" }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#49454F", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "16px" }}>
                    Improvement Tips
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {result.tips.map((tip, i) => (
                      <div
                        key={i}
                        className="tip-item"
                        style={{
                          display: "flex", alignItems: "flex-start", gap: "12px",
                          padding: "14px 16px", borderRadius: "14px",
                          background: "#F4EFF4",
                          border: "1px solid rgba(103,80,164,0.08)",
                          animationDelay: `${i * 0.07}s`,
                        }}
                      >
                        <div
                          style={{
                            width: "24px", height: "24px", borderRadius: "50%",
                            background: "#EAE0FF", display: "flex", alignItems: "center",
                            justifyContent: "center", flexShrink: 0, marginTop: "1px",
                          }}
                        >
                          <span style={{ fontSize: "11px", fontWeight: 800, color: "#6750A4" }}>{i + 1}</span>
                        </div>
                        <span style={{ fontSize: "14px", color: "#1C1B1F", lineHeight: 1.6 }}>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </>
  );
}