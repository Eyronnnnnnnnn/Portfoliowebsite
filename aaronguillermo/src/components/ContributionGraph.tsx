import { useId, useRef, useState } from "react";
import useContributions from "../hooks/useContributions";
import { GITHUB_URL, GITHUB_USERNAME } from "../data/portfolio";

const dotSizes = [2, 4, 6, 9, 12];
const dotColors = ["#262629", "#606064", "#8A8A8E", "#B6B6BA", "#DEDEE0"];
// Stable count thresholds keep the same activity looking the same across dates.
const activityLevel = (count: number) =>
  count === 0 ? 0 : count <= 3 ? 1 : count <= 6 ? 2 : count <= 9 ? 3 : 4;

export default function GithubDotContribution() {
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

  function showTooltip(index: number, cell: HTMLButtonElement) {
    const bounds = container.current?.getBoundingClientRect();
    if (bounds) {
      const center = cell.getBoundingClientRect().left + 7.5 - bounds.left;
      setTooltipLeft(Math.max(0, Math.min(center - 120, bounds.width - 240)));
    }
    setSelected(index);
  }

  return (
    <div ref={container} className="contribution-calendar w-full min-w-0 font-mono">
      {status === "ready" ? (
        <>
          {active && (
            <div id={tooltipId} role="tooltip" className="contribution-tooltip" style={{ left: tooltipLeft }}>
              {active.date} · {active.count} {active.count === 1 ? "contribution" : "contributions"}
            </div>
          )}
          <div className="contribution-scroll" onScroll={() => {
            const focused = cells.current.findIndex(cell => cell === document.activeElement);
            if (focused >= 0) showTooltip(focused, cells.current[focused]!);
            else setSelected(null);
          }}>
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
                    <span aria-hidden="true" className="contribution-dot" style={{ width: dotSizes[level], height: dotSizes[level], backgroundColor: dotColors[level] }} />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[9px] uppercase tracking-[0.1em]">
            <span>{total.toLocaleString()} contributions in the last {days.length} days</span>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="hover:text-[#DEDEE0]">@{GITHUB_USERNAME} &#8599;</a>
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
  );
}
