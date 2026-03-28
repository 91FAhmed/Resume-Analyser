const ScoreCircle = ({ score = 75 }) => {
  const radius = 38;
  const stroke = 7;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = score / 100;
  const strokeDashoffset = circumference * (1 - progress);

  const getColor = (s) => {
    if (s >= 80) return { from: "#34A853", to: "#81C995" };
    if (s >= 60) return { from: "#FBBC04", to: "#FFD666" };
    return { from: "#EA4335", to: "#FF7B6E" };
  };

  const { from, to } = getColor(score);
  const gradId = `score-grad-${score}`;

  return (
    <div
      style={{
        position: "relative",
        width: "88px",
        height: "88px",
        flexShrink: 0,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 88 88"
        style={{ transform: "rotate(-90deg)" }}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx="44"
          cy="44"
          r={normalizedRadius}
          stroke="#E8DEF8"
          strokeWidth={stroke}
          fill="transparent"
        />
        {/* Progress */}
        <circle
          cx="44"
          cy="44"
          r={normalizedRadius}
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </svg>

      {/* Label */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
        }}
      >
        <span
          style={{
            fontSize: "17px",
            fontWeight: 700,
            color: "#1C1B1F",
            fontFamily: "'Google Sans', 'Nunito', sans-serif",
            letterSpacing: "-0.5px",
          }}
        >
          {score}
        </span>
        <span
          style={{
            fontSize: "9px",
            fontWeight: 500,
            color: "#79747E",
            letterSpacing: "0.5px",
            marginTop: "1px",
          }}
        >
          /100
        </span>
      </div>
    </div>
  );
};

export default ScoreCircle;