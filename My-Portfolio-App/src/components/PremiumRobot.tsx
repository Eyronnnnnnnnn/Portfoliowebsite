export default function PremiumRobot({ dark, mouse }: { dark: boolean; mouse: { x: number; y: number } }) {
  const stroke = dark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.75)";

  return (
    <svg
      width="84" height="84" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true" className="premium-companion drop-shadow-xl"
      style={{ transform: `translate3d(${mouse.x * 6}px, ${mouse.y * 6}px, 0)`, transition: "transform 0.3s ease-out" }}
    >
      <defs>
        <linearGradient id="robotBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={dark ? "#555b69" : "#ffffff"} />
          <stop offset="100%" stopColor={dark ? "#171b25" : "#b8c5d7"} />
        </linearGradient>
        <linearGradient id="robotEyeGlow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FF375F" />
          <stop offset="50%" stopColor="#BF5AF2" />
          <stop offset="100%" stopColor="#0A84FF" />
        </linearGradient>
      </defs>

      <circle cx="42" cy="42" r="37" fill={dark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.025)"} stroke={stroke} strokeWidth="1" strokeDasharray="2 5">
        <animateTransform attributeName="transform" type="rotate" from="0 42 42" to="360 42 42" dur="40s" repeatCount="indefinite" />
      </circle>

      <circle cx="42" cy="20" r="2.4" fill="url(#robotEyeGlow)">
        <animate attributeName="opacity" values="1;0.4;1" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <path d="M42 22.4V29" stroke={stroke} strokeWidth="1.1" />

      <rect x="26" y="29" width="32" height="21" rx="10" fill="url(#robotBody)" stroke={stroke} strokeWidth="1.1" />

      <g>
        <circle cx="35" cy="39.5" r="2.6" fill="url(#robotEyeGlow)" />
        <circle cx="49" cy="39.5" r="2.6" fill="url(#robotEyeGlow)" />
        <animate attributeName="opacity" values="1;1;0.15;1" keyTimes="0;0.85;0.9;1" dur="4.5s" repeatCount="indefinite" />
      </g>

      <path d="M32 53C32 53 36 58 42 58C48 58 52 53 52 53" stroke={stroke} strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}


