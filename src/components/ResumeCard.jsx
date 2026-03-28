"use client"
import Link from "next/link";
import Image from "next/image";
import ScoreCircle from "@/components/ScoreCircle";

const ResumeCard = ({ resume }) => {
  const { id, companyName, jobTitle, feedback, imagePath } = resume;

  const score = feedback?.overallScore ?? 0;
  const getScoreBadge = (s) => {
    if (s >= 80) return { label: "Excellent", bg: "#E6F4EA", color: "#137333" };
    if (s >= 60) return { label: "Good", bg: "#FEF7E0", color: "#8A6100" };
    return { label: "Needs Work", bg: "#FCE8E6", color: "#C5221F" };
  };
  const badge = getScoreBadge(score);

  return (
    <Link
      href={`/resume/${id}`}
      style={{
        display: "block",
        textDecoration: "none",
        borderRadius: "20px",
        background: "#FFFBFE",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(103,80,164,0.08)",
        overflow: "hidden",
        transition: "box-shadow 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.2s cubic-bezier(0.4,0,0.2,1)",
        animation: "cardFadeUp 0.5s cubic-bezier(0.4,0,0.2,1) both",
        border: "1px solid rgba(103,80,164,0.08)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1), 0 12px 32px rgba(103,80,164,0.16)";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(103,80,164,0.08)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <style>{`
        @keyframes cardFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Card Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 24px",
          background: "linear-gradient(135deg, #F6F0FF 0%, #EEF0FF 100%)",
          borderBottom: "1px solid rgba(103,80,164,0.08)",
          gap: "12px",
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          {/* Company chip */}
          {companyName && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "6px",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "#6750A4",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#6750A4",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  fontFamily: "'Google Sans', 'Nunito', sans-serif",
                }}
              >
                {companyName}
              </span>
            </div>
          )}

          <h2
            style={{
              margin: 0,
              fontSize: "17px",
              fontWeight: 700,
              color: "#1C1B1F",
              fontFamily: "'Google Sans', 'Nunito', sans-serif",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.3,
            }}
          >
            {jobTitle || "Resume"}
          </h2>

          {/* Score badge */}
          <div
            style={{
              display: "inline-block",
              marginTop: "8px",
              padding: "2px 10px",
              borderRadius: "100px",
              background: badge.bg,
              color: badge.color,
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.2px",
            }}
          >
            {badge.label}
          </div>
        </div>

        <ScoreCircle score={score} />
      </div>

      {/* Resume Preview */}
      {imagePath && (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "220px",
            overflow: "hidden",
            background: "#F4EFF4",
          }}
        >
          <Image
            src={imagePath}
            alt="Resume preview"
            fill
            className="object-cover object-top"
            sizes="(max-width: 640px) 100vw, 500px"
            style={{ transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)" }}
          />
          {/* Bottom fade */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "60px",
              background: "linear-gradient(to top, rgba(255,251,254,0.9), transparent)",
            }}
          />
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: "13px", color: "#79747E", fontFamily: "'Google Sans', 'Nunito', sans-serif" }}>
          View full analysis
        </span>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "#EAE0FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="#6750A4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default ResumeCard;