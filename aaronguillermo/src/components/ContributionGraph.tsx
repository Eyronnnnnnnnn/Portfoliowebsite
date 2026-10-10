import { useId, useRef, useState } from "react";
import useContributions from "../hooks/useContributions";
import { GITHUB_URL, GITHUB_USERNAME } from "../data/portfolio";
import type { CSSProperties } from "react";
import type { Theme } from "../theme/palette";

const dotSizes = [2, 4, 6, 9, 12];
const darkDotColors = ["#262629", "#606064", "#8A8A8E", "#B6B6BA", "#DEDEE0"];
const lightDotColors = ["#DADADD", "#ABABB0", "#85858C", "#5E5E66", "#35353C"];
// Stable count thresholds keep the same activity looking the same across dates.
const activityLevel = (count: number) =>
  count === 0 ? 0 : count <= 3 ? 1 : count <= 6 ? 2 : count <= 9 ? 3 : 4;

export default function GithubDotContribution({ dark, T }: { dark: boolean; T: Theme }) {
  const { days, status, retry } = useContributions();
  const [selected, setSelected] = useState<number | null>(null);
  const [focusIndex, setFocusIndex] = useState(0);
  const [tooltipLeft, setTooltipLeft] = useState(0);
  const container = useRef<HTMLDivElement>(null);
  const cells = useRef<(HTMLButtonElement | null)[]>([]);
  const tooltipId = useId();
  const total = days.reduce((sum, day) => sum + day.count, 0);
  const active = selected === null ? null : days[selected];
  const firstDate = days.length ? Date.parse(`${days[0].date}T00:00:00Z`) : 0;
  const weekdayOffset = new Date(firstDate).getUTCDay();
  const dotColors = dark ? darkDotColors : lightDotColors;
  const activeDays = days.filter(day => day.count > 0).length;
  const weeks = Math.ceil((weekdayOffset + days.length) / 7);
  const months = days.flatMap((day, index) => {
    const date = new Date(`${day.date}T00:00:00Z`);
    const column = Math.floor((weekdayOffset + index) / 7) + 1;
    return (index === 0 || date.getUTCDate() === 1) && column <= weeks - 2
      ? [{ label: date.toLocaleDateString("en", { month: "short", timeZone: "UTC" }), column }]
      : [];
  }).filter((month, index, all) => index === all.length - 1 || all[index + 1].column - month.column >= 3);

  function showTooltip(index: number, cell: HTMLButtonElement) {
    const bounds = container.current?.getBoundingClientRect();
    if (bounds) {
      const rect = cell.getBoundingClientRect();
      const center = rect.left + rect.width / 2 - bounds.left;
      setTooltipLeft(Math.max(0, Math.min(center - 120, bounds.width - 240)));
    }
    setSelected(index);
  }

  return (
    <div className="contribution-calendar w-full min-w-0" data-theme={dark ? "dark" : "light"} style={{ color: T.muted, backgroundColor: T.glass, borderColor: T.glassBorder, "--contribution-ink": T.text, "--contribution-scrollbar": dark ? "#343438" : "#C3C3C8", "--contribution-columns": weeks || 53 } as CSSProperties}>
      <div className="flex items-center justify-between gap-3 text-[8px]">
        <h2 className="font-mono uppercase tracking-[0.16em]">GitHub activity</h2>
        <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="contribution-profile">@{GITHUB_USERNAME} <span aria-hidden="true">&#8599;</span></a>
      </div>
      {status === "ready" && <div className="contribution-summary">
        <div><strong style={{ color: T.text }}>{total.toLocaleString()}</strong><span>contributions in the last {days.length} days</span></div>
        <span className="contribution-active"><i aria-hidden="true" />{activeDays} active days</span>
      </div>}
      <div ref={container} className="relative pt-[16px]">
      {status === "ready" ? (
        <>
          {active && (
            <div id={tooltipId} role="tooltip" className="contribution-tooltip" style={{ left: tooltipLeft }}>
              <strong>{active.count} {active.count === 1 ? "contribution" : "contributions"}</strong><span> · {new Date(`${active.date}T00:00:00Z`).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}</span>
            </div>
          )}
          <div className="contribution-scroll" onScroll={() => {
            const focused = cells.current.findIndex(cell => cell === document.activeElement);
            if (focused >= 0) showTooltip(focused, cells.current[focused]!);
            else setSelected(null);
          }}>
            <div className="contribution-plot">
            <div className="contribution-months" aria-hidden="true">{months.map(month => <span key={month.column} style={{ gridColumn: `${month.column} / span 3` }}>{month.label}</span>)}</div>
            <div
              className="contribution-dots"
              role="group"
              aria-label={`${total} contributions across ${days.length} days. Use arrow keys to explore dates.`}
            >
              {days.map((day, index) => {
                const level = activityLevel(day.count);
                const position = weekdayOffset + Math.round((Date.parse(`${day.date}T00:00:00Z`) - firstDate) / 86400000);
                return (
                  <button
                    key={day.date}
                    ref={element => { cells.current[index] = element; }}
                    type="button"
                    className="contribution-cell"
                    style={{ gridColumn: Math.floor(position / 7) + 1, gridRow: position % 7 + 1 }}
                    tabIndex={index === focusIndex ? 0 : -1}
                    aria-label={`${day.count} ${day.count === 1 ? "contribution" : "contributions"} on ${day.date}`}
                    aria-describedby={selected === index ? tooltipId : undefined}
                    onMouseEnter={event => showTooltip(index, event.currentTarget)}
                    onMouseLeave={() => setSelected(null)}
                    onFocus={event => { setFocusIndex(index); showTooltip(index, event.currentTarget); }}
                    onBlur={() => setSelected(null)}
                    onClick={event => showTooltip(index, event.currentTarget)}
                    onKeyDown={event => {
                      if (event.key === "Escape") { setSelected(null); return; }
                      const offsets: Record<string, number> = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -7, ArrowRight: 7 };
                      const next = event.key === "Home" ? 0 : event.key === "End" ? days.length - 1 : event.key in offsets ? Math.max(0, Math.min(days.length - 1, index + offsets[event.key])) : null;
                      if (next !== null) {
                        event.preventDefault();
                        cells.current[next]?.focus();
                      }
                    }}
                  >
                    <span aria-hidden="true" className="contribution-dot" data-level={level} style={{ width: dotSizes[level], height: dotSizes[level], backgroundColor: dotColors[level] }} />
                  </button>
                );
              })}
            </div>
            </div>
          </div>
          <div className="contribution-footer">
            <span>Small steps. Consistent progress.</span>
            <div className="contribution-legend" aria-label="Larger, stronger dots indicate more contributions"><span>Less</span>{dotSizes.map((size, level) => <span key={level} className="contribution-legend-cell" aria-hidden="true"><i className="contribution-dot" style={{ width: size, height: size, backgroundColor: dotColors[level] }} /></span>)}<span>More</span></div>
          </div>
        </>
      ) : (
        <div className="min-h-28 flex flex-col justify-center items-center gap-3 text-xs" role="status">
          {status === "loading" ? "Loading GitHub activity…" : (
            <>
              <span>GitHub activity is temporarily unavailable.</span>
              <button onClick={retry} className="underline underline-offset-4">Try again</button>
            </>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
