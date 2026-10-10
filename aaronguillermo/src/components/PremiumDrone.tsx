export default function PremiumDrone({ dark, mouse }: { dark: boolean; mouse: { x: number; y: number } }) {
  const stroke = dark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.75)";
  const props: [number, number][] = [[24, 27], [60, 27], [24, 57], [60, 57]];

  return (
    <svg
      width="84" height="84" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true" className="premium-companion drop-shadow-xl"
      style={{ transform: `translate3d(${-mouse.x * 6}px, ${-mouse.y * 6}px, 0)`, transition: "transform 0.3s ease-out" }}
    >
      <defs>
        <linearGradient id="droneBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={dark ? "#555b69" : "#ffffff"} />
          <stop offset="100%" stopColor={dark ? "#171b25" : "#b8c5d7"} />
        </linearGradient>
        <radialGradient id="droneCore">
          <stop offset="0%" stopColor="#64D2FF" />
          <stop offset="100%" stopColor="#5E5CE6" />
        </radialGradient>
      </defs>

      <circle cx="42" cy="42" r="37" fill={dark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.025)"} stroke={stroke} strokeWidth="1" strokeDasharray="2 5">
        <animateTransform attributeName="transform" type="rotate" from="360 42 42" to="0 42 42" dur="50s" repeatCount="indefinite" />
      </circle>

      <rect x="30" y="34" width="24" height="16" rx="7" fill="url(#droneBody)" stroke={stroke} strokeWidth="1.1" />
      <circle cx="42" cy="42" r="3.2" fill="url(#droneCore)">
        <animate attributeName="opacity" values="1;0.5;1" dur="1.8s" repeatCount="indefinite" />
      </circle>

      <path d="M27 30L34 36M57 30L50 36M27 54L34 48M57 54L50 48" stroke={stroke} strokeWidth="1.1" strokeLinecap="round" />

      {props.map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="5.5" stroke={stroke} strokeWidth="1" fill="none" />
          <line x1={cx - 5.5} y1={cy} x2={cx + 5.5} y2={cy} stroke={stroke} strokeWidth="1">
            <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="0.6s" repeatCount="indefinite" />
          </line>
        </g>
      ))}
    </svg>
  );
}
