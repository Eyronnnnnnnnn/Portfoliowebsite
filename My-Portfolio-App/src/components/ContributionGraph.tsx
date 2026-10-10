import { useState } from "react";
import useContributions from "../hooks/useContributions";
import { GITHUB_URL, GITHUB_USERNAME } from "../data/portfolio";
import type { Theme } from "../theme/palette";

export default function GithubDotContribution({
  dark,
  T,
}: {
  dark: boolean;
  T: Theme;
}) {
  const { days, status, retry } = useContributions();
  const [selected, setSelected] = useState<number | null>(null);
  const total = days.reduce((sum, day) => sum + day.count, 0);
  const active = selected === null ? null : days[selected];
  const colors = dark
    ? ["#34343c", "#656571", "#9696a3", "#c8c8d3", "#ffffff"]
    : ["#d0d0d8", "#aaaab8", "#7c7c8f", "#505064", "#252534"];
  return (
    <div
      className="contribution-calendar w-full flex flex-col gap-3"
      style={{ color: T.text }}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap text-xs font-mono px-1">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${status === "ready" ? "bg-emerald-400" : "bg-amber-400"}`}
          />
          <span className="font-semibold">
            {status === "ready"
              ? `${total.toLocaleString()} Contributions`
              : "GitHub Contributions"}
          </span>
        </div>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="text-[10px] hover:opacity-70"
          style={{ color: T.muted }}
        >
          @{GITHUB_USERNAME} ↗
        </a>
      </div>
      <div
        className="rounded-2xl p-3 sm:p-4"
        style={{
          background: dark ? "#08080a" : "#eeeeF2",
          border: `1px solid ${T.glassBorder}`,
        }}
      >
        {status === "ready" ? (
          <>
            <div
              className="contribution-dots"
              role="img"
              aria-label={`${total} contributions across ${days.length} days.`}
            >
              {days.map((day, index) => (
                <span
                  key={day.date}
                  title={`${day.count} contributions on ${day.date}`}
                  onMouseEnter={() => setSelected(index)}
                  className="contribution-dot"
                  style={{
                    backgroundColor: colors[day.level],
                    boxShadow:
                      day.level === 4 && dark ? "0 0 5px #ffffff35" : undefined,
                  }}
                />
              ))}
            </div>
            <div
              className="mt-3 pt-2.5 flex flex-wrap items-center justify-between gap-2 border-t text-[10px]"
              style={{ borderColor: T.glassBorder, color: T.muted }}
            >
              <span>
                {active
                  ? `${active.count} contributions · ${active.date}`
                  : `Activity over the last ${days.length} days`}
              </span>
              <span className="flex items-center gap-1.5">
                Less{" "}
                {colors.map((color) => (
                  <i
                    key={color}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: color }}
                  />
                ))}{" "}
                More
              </span>
            </div>
          </>
        ) : (
          <div
            className="min-h-28 flex flex-col justify-center items-center gap-3 text-xs"
            role="status"
            style={{ color: T.muted }}
          >
            {status === "loading" ? (
              "Loading GitHub activity…"
            ) : (
              <>
                <span>GitHub activity is temporarily unavailable.</span>
                <button
                  onClick={retry}
                  className="underline underline-offset-4"
                >
                  Try again
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
