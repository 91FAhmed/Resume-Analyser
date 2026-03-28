import Navbar from "@/components/Navbar";
import ResumeCard from "@/components/ResumeCard";
import { resumes } from "@/constants";

export default function Home() {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseOrb {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50%       { transform: scale(1.08); opacity: 0.9; }
        }
        .hero-title {
          animation: fadeUp 0.7s cubic-bezier(0.4,0,0.2,1) 0.1s both;
        }
        .hero-sub {
          animation: fadeUp 0.7s cubic-bezier(0.4,0,0.2,1) 0.25s both;
        }
        .hero-cta {
          animation: fadeUp 0.7s cubic-bezier(0.4,0,0.2,1) 0.4s both;
        }
        .hero-stats {
          animation: fadeUp 0.7s cubic-bezier(0.4,0,0.2,1) 0.55s both;
        }
      `}</style>

      <main
        style={{
          minHeight: "100vh",
          background: "#FFFBFE",
          fontFamily: "'Google Sans', 'Nunito', 'Segoe UI', sans-serif",
        }}
      >
        {/* Top padding for sticky nav */}
        <div style={{ paddingTop: "20px", paddingLeft: "16px", paddingRight: "16px" }}>
          <Navbar forward="/upload">Upload Resume</Navbar>
        </div>

        {/* Hero Section */}
        <section
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "72px 24px 56px",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Decorative orbs */}
          <div
            style={{
              position: "absolute",
              top: "40px",
              left: "10%",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(103,80,164,0.12) 0%, transparent 70%)",
              animation: "pulseOrb 6s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "60px",
              right: "8%",
              width: "240px",
              height: "240px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(156,123,234,0.1) 0%, transparent 70%)",
              animation: "pulseOrb 8s ease-in-out infinite 2s",
              pointerEvents: "none",
            }}
          />

          {/* Eyebrow chip */}
          <div className="hero-title">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 16px",
                borderRadius: "100px",
                background: "#EAE0FF",
                marginBottom: "24px",
              }}
            >
              <span style={{ fontSize: "18px" }}>✨</span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#6750A4",
                  letterSpacing: "0.3px",
                }}
              >
                AI-Powered Resume Intelligence
              </span>
            </div>
          </div>

          <h1
            className="hero-title"
            style={{
              margin: "0 auto 20px",
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: "-1px",
              color: "#1C1B1F",
              maxWidth: "700px",
            }}
          >
            Track Applications &{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #6750A4, #9C7BEA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Boost Your Score
            </span>
          </h1>

          <p
            className="hero-sub"
            style={{
              margin: "0 auto 36px",
              fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
              color: "#49454F",
              maxWidth: "520px",
              lineHeight: 1.7,
              fontWeight: 400,
            }}
          >
            Monitor your job applications and get instant ATS compatibility
            scores with actionable tips to land more interviews.
          </p>

          {/* Stat pills */}
          <div
            className="hero-stats"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "8px",
            }}
          >
            {[
              { icon: "📄", label: "ATS Score", value: "Instant" },
              { icon: "💡", label: "Suggestions", value: "Smart" },
              { icon: "🎯", label: "Match Rate", value: "Improved" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 18px",
                  borderRadius: "16px",
                  background: "#F4EFF4",
                  border: "1px solid rgba(103,80,164,0.1)",
                }}
              >
                <span style={{ fontSize: "16px" }}>{stat.icon}</span>
                <div style={{ textAlign: "left" }}>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#79747E",
                      fontWeight: 500,
                      letterSpacing: "0.3px",
                    }}
                  >
                    {stat.label}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#6750A4",
                      fontWeight: 700,
                      letterSpacing: "-0.2px",
                    }}
                  >
                    {stat.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        {resumes.length > 0 && (
          <div
            style={{
              maxWidth: "900px",
              margin: "0 auto",
              padding: "0 24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "32px",
              }}
            >
              <div style={{ flex: 1, height: "1px", background: "rgba(103,80,164,0.1)" }} />
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#79747E",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                Your Resumes
              </span>
              <div
                style={{
                  padding: "2px 10px",
                  borderRadius: "100px",
                  background: "#EAE0FF",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#6750A4",
                }}
              >
                {resumes.length}
              </div>
              <div style={{ flex: 1, height: "1px", background: "rgba(103,80,164,0.1)" }} />
            </div>
          </div>
        )}

        {/* Resume Grid */}
        {resumes.length > 0 && (
          <section
            style={{
              maxWidth: "900px",
              margin: "0 auto",
              padding: "0 24px 80px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
              gap: "20px",
            }}
          >
            {resumes.map((resume, i) => (
              <div
                key={resume.id}
                style={{
                  animationDelay: `${i * 80}ms`,
                }}
              >
                <ResumeCard resume={resume} />
              </div>
            ))}
          </section>
        )}

        {/* Empty state */}
        {resumes.length === 0 && (
          <div
            style={{
              maxWidth: "420px",
              margin: "0 auto",
              padding: "48px 24px 80px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "24px",
                background: "linear-gradient(135deg, #EAE0FF, #D0BCFF)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                fontSize: "36px",
              }}
            >
              📋
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: "20px", fontWeight: 700, color: "#1C1B1F" }}>
              No resumes yet
            </h3>
            <p style={{ margin: "0 0 28px", fontSize: "14px", color: "#79747E", lineHeight: 1.6 }}>
              Upload your first resume to get an instant ATS score and personalized improvement tips.
            </p>
          </div>
        )}
      </main>
    </>
  );
}