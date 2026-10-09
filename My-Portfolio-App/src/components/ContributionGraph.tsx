import { useState } from "react";
import useContributions from "../hooks/useContributions";
import { GITHUB_URL } from "../data/portfolio";
export default function ContributionGraph() {
  const { days, status, retry } = useContributions();
  const [selected, setSelected] = useState<number | null>(null);
  const total = days.reduce((sum, day) => sum + day.count, 0);
  const active = selected === null ? null : days[selected];
  return <section className="panel contribution-panel" aria-labelledby="activity-heading">
    <div className="section-heading"><div><p className="eyebrow">CONSISTENCY, IN CODE</p><h2 id="activity-heading">GitHub activity <span className="status-dot" /></h2></div><a className="text-link" href={GITHUB_URL} target="_blank" rel="noreferrer">View GitHub ↗</a></div>
    {status === "ready" ? <><div className="activity-summary"><strong>{total.toLocaleString()}</strong><span>contributions in the last {days.length} days</span></div>
      <div className="contribution-grid" role="img" aria-label={`${total} contributions over ${days.length} days. Use the slider to explore dates.`}>{days.map(day => <span key={day.date} className={`contribution-cell level-${day.level}`} title={`${day.count} contributions on ${day.date}`} />)}</div>
      <div className="activity-footer"><span>{active ? `${active.count} contributions · ${active.date}` : "A little progress, every day."}</span><span className="legend">Less {[0,1,2,3,4].map(level => <i key={level} className={`level-${level}`} />)} More</span></div>
      <label className="activity-explorer"><span>Explore a day</span><input aria-label="Explore daily contributions" aria-valuetext={active ? `${active.date}: ${active.count} contributions` : "Choose a date"} type="range" min="0" max={Math.max(0, days.length - 1)} value={selected ?? Math.max(0, days.length - 1)} onChange={event => setSelected(Number(event.target.value))} /></label>
    </> : <div className="activity-empty" role="status">{status === "loading" ? "Loading GitHub contributions…" : <><span>GitHub activity is temporarily unavailable.</span><button className="text-link" onClick={retry}>Try again ↻</button></>}</div>}
  </section>;
}
