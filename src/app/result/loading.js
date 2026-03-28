export default function Loading() {
  return (
    <>
      <style>{`
        @keyframes md3-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes md3-dash {
          0%   { stroke-dashoffset: 175; }
          50%  { stroke-dashoffset: 30; }
          100% { stroke-dashoffset: 175; }
        }
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1; }
        }
        .shimmer-line {
          background: linear-gradient(
            90deg,
            #F4EFF4 0%,
            #EAE0FF 50%,
            #F4EFF4 100%
          );
          background-size: 600px 100%;
          animation: shimmer 1.5s ease-in-out infinite;
          border-radius: 8px;
        }
        .dot-1 { animation: dotPulse 1.3s ease-in-out infinite 0s; }
        .dot-2 { animation: dotPulse 1.3s ease-in-out infinite 0.2s; }
        .dot-3 { animation: dotPulse 1.3s ease-in-out infinite 0.4s; }
        /* Spin the whole SVG — arc dashes independently */
        .spinner-svg { animation: md3-spin 1.4s linear infinite; transform-origin: center; }
        .spinner-arc { animation: md3-dash 1.4s ease-in-out infinite; transform-origin: center; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#FFFBFE",
          fontFamily: "'Google Sans', 'Nunito', 'Segoe UI', sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0",
          padding: "24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decorative orb */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(103,80,164,0.06) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />

        {/* Material 3 Circular Progress Indicator */}
        <div style={{ animation: "fadeIn 0.5s cubic-bezier(0.4,0,0.2,1) both" }}>
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            className="spinner-svg"
          >
            <defs>
              <linearGradient id="spinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6750A4" />
                <stop offset="100%" stopColor="#CDB8FF" />
              </linearGradient>
            </defs>
            {/* Track */}
            <circle cx="32" cy="32" r="26" fill="none" stroke="#E8DEF8" strokeWidth="5.5" />
            {/* Arc — dashes while the whole SVG rotates */}
            <circle
              cx="32" cy="32" r="26"
              fill="none"
              stroke="url(#spinGrad)"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeDasharray="163"
              strokeDashoffset="175"
              className="spinner-arc"
              style={{ transformOrigin: "32px 32px" }}
            />
          </svg>
        </div>

        {/* Brand + label */}
        <div
          style={{
            marginTop: "28px",
            textAlign: "center",
            animation: "fadeIn 0.5s cubic-bezier(0.4,0,0.2,1) 0.15s both",
          }}
        >
          <div
            style={{
              fontSize: "22px",
              fontWeight: 800,
              letterSpacing: "-0.5px",
              background: "linear-gradient(135deg, #6750A4, #9C7BEA)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "6px",
            }}
          >
            Analyserz
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              color: "#79747E",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            <span>Analyzing your resume</span>
            <span className="dot-1" style={{ display: "inline-block", width: "4px", height: "4px", borderRadius: "50%", background: "#9C7BEA" }} />
            <span className="dot-2" style={{ display: "inline-block", width: "4px", height: "4px", borderRadius: "50%", background: "#9C7BEA" }} />
            <span className="dot-3" style={{ display: "inline-block", width: "4px", height: "4px", borderRadius: "50%", background: "#9C7BEA" }} />
          </div>
        </div>

        {/* Skeleton card preview */}
        <div
          style={{
            marginTop: "48px",
            width: "100%",
            maxWidth: "440px",
            borderRadius: "20px",
            background: "#FFFBFE",
            boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(103,80,164,0.07)",
            border: "1px solid rgba(103,80,164,0.08)",
            overflow: "hidden",
            animation: "fadeIn 0.5s cubic-bezier(0.4,0,0.2,1) 0.3s both",
          }}
        >
          {/* Card header skeleton */}
          <div
            style={{
              padding: "20px 24px",
              background: "linear-gradient(135deg, #F6F0FF 0%, #EEF0FF 100%)",
              borderBottom: "1px solid rgba(103,80,164,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
              <div className="shimmer-line" style={{ height: "10px", width: "45%" }} />
              <div className="shimmer-line" style={{ height: "18px", width: "70%" }} />
              <div className="shimmer-line" style={{ height: "20px", width: "30%", borderRadius: "100px" }} />
            </div>
            {/* Score circle skeleton */}
            <div
              style={{
                width: "88px",
                height: "88px",
                borderRadius: "50%",
                flexShrink: 0,
              }}
              className="shimmer-line"
            />
          </div>

          {/* Card image skeleton */}
          <div
            className="shimmer-line"
            style={{ height: "160px", borderRadius: 0 }}
          />

          {/* Footer skeleton */}
          <div
            style={{
              padding: "14px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div className="shimmer-line" style={{ height: "12px", width: "38%" }} />
            <div
              className="shimmer-line"
              style={{ width: "32px", height: "32px", borderRadius: "50%" }}
            />
          </div>
        </div>

        {/* Second partial skeleton card */}
        <div
          style={{
            marginTop: "16px",
            width: "100%",
            maxWidth: "440px",
            borderRadius: "20px",
            background: "#FFFBFE",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(103,80,164,0.05)",
            border: "1px solid rgba(103,80,164,0.06)",
            overflow: "hidden",
            opacity: 0.55,
            animation: "fadeIn 0.5s cubic-bezier(0.4,0,0.2,1) 0.45s both",
          }}
        >
          <div
            style={{
              padding: "20px 24px",
              background: "linear-gradient(135deg, #F6F0FF 0%, #EEF0FF 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
              <div className="shimmer-line" style={{ height: "10px", width: "35%" }} />
              <div className="shimmer-line" style={{ height: "18px", width: "55%" }} />
            </div>
            <div
              className="shimmer-line"
              style={{ width: "88px", height: "88px", borderRadius: "50%", flexShrink: 0 }}
            />
          </div>
        </div>
      </div>
    </>
  );
}