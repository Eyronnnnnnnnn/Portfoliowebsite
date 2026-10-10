import { useEffect, useState } from "react";
import { GITHUB_USERNAME } from "../data/portfolio";
export type Contribution = { date: string; count: number; level: number };
export default function useContributions() {
  const [days, setDays] = useState<Contribution[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    let active = true;
    setStatus("loading");
    fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`, { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error("Activity unavailable");
        const data = await response.json();
        if (!Array.isArray(data.contributions) || !data.contributions.every((day: Contribution) => typeof day.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(day.date) && Number.isInteger(day.count) && day.count >= 0 && Number.isInteger(day.level) && day.level >= 0 && day.level <= 4)) throw new Error("Invalid activity");
        if (active) { setDays([...data.contributions].sort((a, b) => a.date.localeCompare(b.date)).slice(-364)); setStatus("ready"); }
      }).catch(() => { if (active) setStatus("error"); }).finally(() => window.clearTimeout(timeout));
    return () => { active = false; controller.abort(); window.clearTimeout(timeout); };
  }, [attempt]);
  return { days, status, retry: () => setAttempt(value => value + 1) };
}
