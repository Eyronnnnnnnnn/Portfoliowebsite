import { useId } from "react";
export default function RobotCompanions() {
  const id = useId().replace(/:/g, "");
  return (
    <div className="robot-scene" aria-hidden="true">
      <div className="orbital-ring" />
      <svg
        className="companion companion-main"
        viewBox="0 0 200 200"
        fill="none"
      >
        <defs>
          <linearGradient
            id={`${id}-metal`}
            x1="35"
            y1="40"
            x2="150"
            y2="175"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fafcff" />
            <stop offset=".32" stopColor="#b8c6d8" />
            <stop offset=".65" stopColor="#71819b" />
            <stop offset="1" stopColor="#d8e5f2" />
          </linearGradient>
          <linearGradient
            id={`${id}-glass`}
            x1="65"
            y1="55"
            x2="130"
            y2="110"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#293a51" />
            <stop offset="1" stopColor="#080e19" />
          </linearGradient>
          <radialGradient id={`${id}-glow`}>
            <stop stopColor="#7dd3fc" stopOpacity=".5" />
            <stop offset="1" stopColor="#7dd3fc" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="101" cy="182" rx="48" ry="8" fill={`url(#${id}-glow)`} />
        <path d="M99 43V29" stroke="#9aacc3" strokeWidth="4" />
        <circle cx="99" cy="25" r="5" fill="#a5f3fc" />
        <rect
          x="31"
          y="68"
          width="15"
          height="31"
          rx="7"
          fill={`url(#${id}-metal)`}
        />
        <rect
          x="154"
          y="68"
          width="15"
          height="31"
          rx="7"
          fill={`url(#${id}-metal)`}
        />
        <rect
          x="41"
          y="43"
          width="118"
          height="82"
          rx="32"
          fill={`url(#${id}-metal)`}
          stroke="#e5eefb"
          strokeOpacity=".7"
        />
        <rect
          x="51"
          y="53"
          width="98"
          height="58"
          rx="23"
          fill={`url(#${id}-glass)`}
        />
        <path
          d="M63 64C79 57 116 57 135 64"
          stroke="white"
          strokeOpacity=".15"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <g className="robot-eyes">
          <rect x="73" y="74" width="12" height="19" rx="6" fill="#a5f3fc" />
          <rect x="115" y="74" width="12" height="19" rx="6" fill="#a5f3fc" />
        </g>
        <path
          d="M94 100Q100 104 106 100"
          stroke="#7dd3fc"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect
          x="72"
          y="130"
          width="56"
          height="34"
          rx="16"
          fill={`url(#${id}-metal)`}
        />
        <path d="M83 141H116" stroke="white" strokeOpacity=".45" />
        <circle cx="100" cy="149" r="3" fill="#22d3ee" />
        <path
          d="M60 133L52 151M140 133L148 151"
          stroke={`url(#${id}-metal)`}
          strokeWidth="11"
          strokeLinecap="round"
        />
      </svg>
      <svg
        className="companion companion-small"
        viewBox="0 0 120 120"
        fill="none"
      >
        <ellipse
          cx="60"
          cy="60"
          rx="52"
          ry="16"
          transform="rotate(-23 60 60)"
          stroke="#94a3b8"
          strokeOpacity=".45"
        />
        <circle
          cx="60"
          cy="59"
          r="29"
          fill={`url(#${id}-metal)`}
          stroke="#e2e8f0"
        />
        <rect
          x="38"
          y="47"
          width="44"
          height="23"
          rx="11"
          fill={`url(#${id}-glass)`}
        />
        <circle cx="51" cy="58" r="4" fill="#a5f3fc" />
        <circle cx="69" cy="58" r="4" fill="#a5f3fc" />
        <circle cx="13" cy="77" r="4" fill="#a5f3fc" />
      </svg>
      <span className="robot-caption">
        <i /> A little curiosity. Always in motion.
      </span>
    </div>
  );
}
