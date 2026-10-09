import { DARK, LIGHT, type Theme } from "./theme/palette";
import { GITHUB_URL, YEARS, PROJECTS, EXPERIENCE, EDUCATION, CERTS, SKILLS, type Skill } from "./data/portfolio";
import GithubDotContribution from "./components/ContributionGraph";
import PremiumRobot from "./components/PremiumRobot";
import PremiumDrone from "./components/PremiumDrone";
import { useEffect, useMemo, useRef, useState } from "react";
import ProfilePhoto from "./components/ProfilePhoto";

type Page = "home" | "projects" | "certifications" | "about";

// Siri's signature gradient sweep — used for the scroll progress line and a few glow accents.
const SIRI_GRADIENT =
  "linear-gradient(90deg, #FF375F, #FF9F0A, #BF5AF2, #5E5CE6, #0A84FF, #64D2FF, #FF375F)";

// Synthesized iOS Sound Effect using Web Audio API (Zero external audio file dependency)
function playIosClickSound() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.035);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.035);
  } catch {
    // Ignore audio autoplay restrictions
  }
}

function bubble(T: Theme, extra?: React.CSSProperties): React.CSSProperties {
  return {
    backgroundColor: T.glass,
    backdropFilter: "saturate(180%) blur(30px)",
    WebkitBackdropFilter: "saturate(180%) blur(30px)",
    border: `1px solid ${T.glassBorder}`,
    borderRadius: 26,
    boxShadow: "0 18px 70px rgba(0,0,0,.10)",
    ...extra,
  };
}

// ---------------------------------------------------------------------------
// Siri-style scroll progress line
// ---------------------------------------------------------------------------
function SiriProgressBar() {
  const [target, setTarget] = useState(0);
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollHeight = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
      setTarget(scrollHeight > 0 ? Math.min(100, (scrollTop / scrollHeight) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Ease the visible value toward the real scroll target every frame, so the
  // line glides smoothly instead of jumping with each scroll tick.
  useEffect(() => {
    const step = () => {
      setDisplay((prev) => {
        const next = prev + (target - prev) * 0.12;
        return Math.abs(next - target) < 0.05 ? target : next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[70] h-[3px] bg-transparent pointer-events-none">
      <div
        className="h-full"
        style={{
          width: `${display}%`,
          backgroundImage: SIRI_GRADIENT,
          backgroundSize: "300% 100%",
          animation: "siriFlow 6s linear infinite",
          boxShadow: "0 0 14px 1px rgba(191,90,242,0.55), 0 0 6px 1px rgba(10,132,255,0.55)",
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ambient background — a faint grid plus a few softly blurred Siri-gradient
// orbs that drift slowly behind the content. Fixed, non-interactive, sits
// behind everything (z-index 0) so it reads as atmosphere, not decoration.
// ---------------------------------------------------------------------------
function AmbientBackground({ dark }: { dark: boolean }) {
  const gridLine = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.045)";

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Minimal grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${gridLine} 1px, transparent 1px), linear-gradient(90deg, ${gridLine} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        }}
      />

      {/* Drifting Siri-gradient orbs */}
      <div
        className="absolute rounded-full siri-orb-a"
        style={{
          width: 520, height: 520, top: "-10%", left: "-8%",
          background: "radial-gradient(circle, rgba(191,90,242,0.30), rgba(94,92,230,0.14) 45%, transparent 70%)",
          filter: "blur(70px)",
          opacity: dark ? 0.55 : 0.35,
        }}
      />
      <div
        className="absolute rounded-full siri-orb-b"
        style={{
          width: 460, height: 460, top: "20%", right: "-12%",
          background: "radial-gradient(circle, rgba(10,132,255,0.28), rgba(100,210,255,0.12) 45%, transparent 70%)",
          filter: "blur(70px)",
          opacity: dark ? 0.5 : 0.3,
        }}
      />
      <div
        className="absolute rounded-full siri-orb-c"
        style={{
          width: 420, height: 420, bottom: "-8%", left: "30%",
          background: "radial-gradient(circle, rgba(255,55,95,0.22), rgba(255,159,10,0.10) 45%, transparent 70%)",
          filter: "blur(80px)",
          opacity: dark ? 0.4 : 0.25,
        }}
      />
    </div>
  );
}

function GithubMark({ size = 12, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.07.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .3.21.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z"/>
    </svg>
  );
}

function Magnetic({ as: Tag = "a", className, style, children, strength = 14, ...rest }: any) {
  const ref = useRef<HTMLElement>(null);
  const [t, setT] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    setT({ x: (relX / rect.width) * strength, y: (relY / rect.height) * strength });
  };
  const handleLeave = () => setT({ x: 0, y: 0 });

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{ ...style, transform: `translate3d(${t.x}px, ${t.y}px, 0)`, transition: "transform 0.18s cubic-bezier(0.16,1,0.3,1)" }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// ---------------------------------------------------------------------------
// Project card with a soft cursor-tracked Siri-tinted spotlight on hover
// ---------------------------------------------------------------------------
function ProjectCard({ p, T }: { p: { id: number; title: string; desc: string; tags: string[] }; T: Theme }) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hovering, setHovering] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  return (
    <div
      onMouseMove={onMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => playIosClickSound()}
      className="relative p-4 rounded-2xl border cursor-pointer click-active overflow-hidden transition-transform duration-200"
      style={{ borderColor: T.glassBorder, transform: hovering ? "translateY(-2px)" : "translateY(0)" }}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: hovering ? 1 : 0,
          background: `radial-gradient(220px circle at ${pos.x}% ${pos.y}%, rgba(191,90,242,0.16), rgba(10,132,255,0.10) 40%, transparent 70%)`,
        }}
      />
      <div className="relative">
        <h3 className="text-xs sm:text-sm font-semibold mb-1">{p.title}</h3>
        <p className="text-xs font-light mb-2" style={{ color: T.muted }}>{p.desc}</p>
        <div className="flex gap-1.5">
          {p.tags.map((t) => (
            <span key={t} className="px-2 py-0.5 text-[9px] font-mono rounded bg-white/5 text-gray-400">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Education mark — an original monoline emblem (white strokes only), NOT a
// reproduction of any institution's official seal/logo. Swap in the real
// crest asset yourself if you have the rights to use it.
// ---------------------------------------------------------------------------
function EduMark({ variant }: { variant: "mmsu" | "generic" }) {
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: "linear-gradient(135deg, #1c1c1f, #0a0a0c)", border: "1px solid rgba(255,255,255,0.14)" }}
    >
      {variant === "mmsu" ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l8 4-8 4-8-4 8-4Z" />
          <path d="M6 9.5V15c0 1.5 2.5 3 6 3s6-1.5 6-3V9.5" />
          <path d="M20 6v6" />
          <circle cx="20" cy="13.4" r="0.8" fill="#fff" stroke="none" />
        </svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10 12 5 2 10l10 5 10-5Z" />
          <path d="M6 12v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5" />
        </svg>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skill badges — real tech logos (via devicon) for branded tools, original
// monoline icons for the generic "SQL" / "NoSQL" categories. Grayscale at
// rest, full color on hover — a minimalist grid that still reads clearly.
// ---------------------------------------------------------------------------
function CustomTechIcon({ kind, active }: { kind: "sql" | "nosql"; active: boolean }) {
  const color = active ? (kind === "sql" ? "#0A84FF" : "#30D5C8") : "#9a9aa2";
  return kind === "sql" ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
      <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function SkillBadge({ skill, T, dark }: { skill: Skill; T: Theme; dark: boolean }) {
  const [hover, setHover] = useState(false);
  const needsInvert = dark && skill.invertOnDark;
  const iconFilter = [
    needsInvert ? "invert(1)" : "",
    hover ? "grayscale(0) opacity(1)" : "grayscale(1) opacity(0.7)",
  ].filter(Boolean).join(" ");

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => playIosClickSound()}
      className="click-active flex flex-col items-center gap-1.5 w-16 cursor-pointer"
    >
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300"
        style={{
          background: T.glass,
          backdropFilter: "blur(14px) saturate(160%)",
          WebkitBackdropFilter: "blur(14px) saturate(160%)",
          border: `1px solid ${T.glassBorder}`,
          boxShadow: hover ? "0 8px 24px rgba(191,90,242,0.28), 0 0 0 1px rgba(191,90,242,0.25)" : "0 4px 14px rgba(0,0,0,0.10)",
          transform: hover ? "translateY(-3px) scale(1.06)" : "translateY(0) scale(1)",
        }}
      >
        {skill.custom ? (
          <CustomTechIcon kind={skill.custom} active={hover} />
        ) : (
          <img
            src={skill.src}
            alt={skill.name}
            width={24}
            height={24}
            style={{ filter: iconFilter, transition: "filter 0.3s ease" }}
          />
        )}
      </div>
      <span className="text-[9px] font-mono text-center leading-tight" style={{ color: T.muted }}>{skill.name}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// "Another page" sub-views — pushed in over the home content, with a Back
// control in the header, rather than a real route (no router in this file).
// ---------------------------------------------------------------------------
function AllProjectsPage({ T }: { T: Theme }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-mono mb-1" style={{ color: T.muted }}>ALL PROJECTS</p>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Everything I've shipped.</h2>
      </div>
      {YEARS.map((y) => (
        <section key={y} style={bubble(T)} className="p-6">
          <p className="text-[10px] font-mono mb-4" style={{ color: T.muted }}>{y}</p>
          <div className="space-y-3">
            {(PROJECTS[y] ?? []).map((p) => <ProjectCard key={p.id} p={p} T={T} />)}
          </div>
        </section>
      ))}
    </div>
  );
}

function AllCertificationsPage({ T }: { T: Theme }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-mono mb-1" style={{ color: T.muted }}>CERTIFICATIONS</p>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Certificates & credentials.</h2>
      </div>
      <div className="space-y-4">
        {CERTS.map((c) => (
          <section key={c.name} style={bubble(T)} className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                <h3 className="text-sm font-semibold">{c.name}</h3>
              </div>
              <span className="text-[10px] font-mono" style={{ color: T.muted }}>{c.year}</span>
            </div>
            <p className="text-xs font-medium mb-2" style={{ color: T.muted }}>{c.issuer}</p>
            <p className="text-xs font-light leading-relaxed" style={{ color: T.text }}>{c.desc}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

function AboutStoryPage({ T }: { T: Theme }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-mono mb-1" style={{ color: T.muted }}>THE STORY</p>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">How I got here.</h2>
      </div>
      <section style={bubble(T)} className="p-6 sm:p-8 space-y-5">
        <p className="text-[10px] font-mono" style={{ color: T.muted }}>
          Placeholder copy below — swap in your real story.
        </p>
        <p className="text-sm font-light leading-relaxed" style={{ color: T.text }}>
          It started with a broken laptop and too much curiosity. I taught myself HTML and CSS by rebuilding pages I liked, one tag at a time, before I ever wrote a line of JavaScript on purpose.
        </p>
        <p className="text-sm font-light leading-relaxed" style={{ color: T.text }}>
          School — Mariano Marcos State University — shaped how I think about building things: slow down, get the fundamentals right, then move fast. That habit followed me into Manila, where I traded textbooks for production bugs and learned more in six months of shipping than in years of tutorials.
        </p>
        <p className="text-sm font-light leading-relaxed" style={{ color: T.text }}>
          Today I build full-stack products — React and Next.js on the front, Node and databases underneath — and I still get the same rush from a clean deploy that I did from my first working "Hello World."
        </p>
        <p className="text-xs font-mono" style={{ color: T.muted }}>— Aaron</p>
      </section>
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(true);
  const [year, setYear] = useState(2026);
  const [scrollY, setScrollY] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [page, setPage] = useState<Page>("home");

  const T = dark ? DARK : LIGHT;
  const projects = useMemo(() => PROJECTS[year] ?? [], [year]);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const goTo = (p: Page) => {
    playIosClickSound();
    setPage(p);
  };

  const robotX = Math.sin(scrollY * 0.003) * 12;
  const robotY = Math.cos(scrollY * 0.0025) * 8;
  const isScrolled = scrollY > 50;

  return (
    <div
      className="min-h-screen overflow-x-hidden transition-colors duration-500 pt-16"
      style={{ backgroundColor: T.bg, color: T.text, fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <style>{`
        html { scroll-behavior: smooth; }

        @keyframes floatRobot {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }

        @keyframes siriFlow {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }

        @keyframes pageIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes driftA {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(60px, 40px) scale(1.12); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes driftB {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(-50px, 50px) scale(1.08); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes driftC {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(30px, -40px) scale(1.15); }
          100% { transform: translate(0, 0) scale(1); }
        }

        .siri-orb-a { animation: driftA 22s ease-in-out infinite; }
        .siri-orb-b { animation: driftB 26s ease-in-out infinite; }
        .siri-orb-c { animation: driftC 30s ease-in-out infinite; }

        .floating-bot { animation: floatRobot 4s ease-in-out infinite; }

        .page-enter { animation: pageIn 0.35s cubic-bezier(0.16,1,0.3,1); }

        .click-active { transition: transform 0.15s ease, box-shadow 0.25s ease; }
        .click-active:active { transform: scale(0.96) !important; }

        .scrollbar-none::-webkit-scrollbar { display: none; }

        @media (prefers-reduced-motion: reduce) {
          .floating-bot, .page-enter, .siri-orb-a, .siri-orb-b, .siri-orb-c, [style*="siriFlow"] {
            animation: none !important;
          }
        }
      `}</style>

      <AmbientBackground dark={dark} />
      <SiriProgressBar />

      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none p-2 sm:p-4">
        <nav
          className="pointer-events-auto flex items-center justify-between border shadow-lg"
          style={{
            width: isScrolled ? "90%" : "100%",
            maxWidth: isScrolled ? "460px" : "1024px",
            height: isScrolled ? "44px" : "56px",
            borderRadius: isScrolled ? "999px" : "16px",
            paddingLeft: "20px",
            paddingRight: "20px",
            backgroundColor: dark ? "rgba(10,10,12,0.8)" : "rgba(255,255,255,0.8)",
            backdropFilter: "blur(20px)",
            borderColor: T.glassBorder,
            transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <button
            onClick={() => goTo("home")}
            className="text-xs sm:text-sm font-semibold tracking-tight"
            style={{ color: T.text }}
          >
            Aaron D Guillermo
          </button>
          <div className="flex items-center gap-2">
            {page === "home" ? (
              <a href="#projects" onClick={() => playIosClickSound()} className="text-xs px-2.5 py-1 rounded-full" style={{ color: T.muted }}>
                Work
              </a>
            ) : (
              <button onClick={() => goTo("home")} className="text-xs px-2.5 py-1 rounded-full" style={{ color: T.muted }}>
                ← Back
              </button>
            )}
            <button
              onClick={() => { playIosClickSound(); setDark(!dark); }}
              aria-label="Toggle theme"
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs active:scale-90"
              style={{ backgroundColor: T.glass, border: `1px solid ${T.glassBorder}` }}
            >
              {dark ? "☼" : "☾"}
            </button>
          </div>
        </nav>
      </header>

      <main key={page} className="page-enter relative max-w-4xl mx-auto px-4 sm:px-6 py-5 space-y-6">
        {page === "projects" && <AllProjectsPage T={T} />}
        {page === "certifications" && <AllCertificationsPage T={T} />}
        {page === "about" && <AboutStoryPage T={T} />}

        {page === "home" && (
          <>
            {/* Hero Section with Premium Floating Robots */}
            <section className="relative min-h-[350px] flex items-center justify-center">
              <div
                className="absolute left-0 top-1/4 hidden md:block floating-bot cursor-pointer"
                onClick={() => playIosClickSound()}
                style={{ transform: `translate3d(${robotX}px, ${robotY}px, 0)` }}
              >
                <PremiumRobot dark={dark} mouse={mouse} />
              </div>

              <div
                className="absolute right-0 bottom-1/4 hidden md:block floating-bot cursor-pointer"
                onClick={() => playIosClickSound()}
                style={{ animationDelay: "-2s", transform: `translate3d(${-robotX}px, ${-robotY}px, 0)` }}
              >
                <PremiumDrone dark={dark} mouse={mouse} />
              </div>

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-5">
                 {/* for profile photo div */}
                  <div
                    className="w-35 h-35 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border shadow-2xl cursor-pointer click-active flex items-center justify-center"
                    onClick={() => playIosClickSound()}
                    style={{
                      borderColor: T.glassBorder,

                    }}
                  >
                    <ProfilePhoto />
                  </div>
                </div>

                <p className="text-[10px] font-mono tracking-widest uppercase mb-2" style={{ color: T.muted }}>
                  Software · Systems · Design
                </p>
                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
                  Aaron D Guillermo
                </h1>
                <p className="mt-3 text-xs sm:text-sm max-w-md leading-relaxed" style={{ color: T.muted }}>
                  Full Stack Developer building high-performance web systems and minimal user interfaces.
                </p>

                <div className="flex gap-3 mt-6">
                  <Magnetic
                    as="a"
                    href="#projects"
                    onClick={() => playIosClickSound()}
                    className="click-active px-5 py-2 rounded-full text-xs font-medium text-white shadow-lg"
                    style={{ backgroundColor: T.accent, display: "inline-block" }}
                  >
                    View Work ↘
                  </Magnetic>
                  <Magnetic
                    as="a"
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => playIosClickSound()}
                    className="click-active px-5 py-2 rounded-full text-xs font-medium border"
                    style={{ borderColor: T.glassBorder, color: T.text, display: "inline-block" }}
                  >
                    GitHub ↗
                  </Magnetic>
                </div>
              </div>
            </section>

            {/* GitHub Contribution Section */}
            <section style={bubble(T, { padding: 20 })} className="w-full">
              <GithubDotContribution dark={dark} T={T} />
            </section>

            {/* About & Philosophy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <section
                onClick={() => playIosClickSound()}
                className="click-active p-6 rounded-3xl border cursor-pointer"
                style={{ backgroundColor: dark ? "#0a0a0c" : "#ffffff", borderColor: T.glassBorder }}
              >
                <p className="text-[10px] font-mono mb-4 text-gray-500">00 — PHILOSOPHY</p>
                <blockquote className="text-base sm:text-lg font-light leading-snug">
                  "Simplicity is about subtracting the obvious and adding the meaningful."
                </blockquote>
              </section>

              <section
                onClick={() => goTo("about")}
                className="click-active p-6 rounded-3xl border cursor-pointer"
                style={bubble(T)}
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-mono" style={{ color: T.muted }}>01 — ABOUT</p>
                  <span className="text-[10px]" style={{ color: T.muted }}>Read the story →</span>
                </div>
                <p className="text-xs sm:text-sm font-light leading-relaxed" style={{ color: T.text }}>
                  Junior Full Stack Developer based in Metro Manila. Focused on React, Next.js, Node.js, and cloud platforms.
                </p>
              </section>
            </div>

            {/* Experience */}
            <section style={bubble(T)} className="p-6">
              <p className="text-[10px] font-mono mb-4" style={{ color: T.muted }}>02 — EXPERIENCE</p>
              {EXPERIENCE.map((e, i) => (
                <div key={i} onClick={() => playIosClickSound()} className="py-3 border-b last:border-none cursor-pointer click-active" style={{ borderColor: T.glassBorder }}>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-xs sm:text-sm font-semibold">{e.role}</h3>
                    <span className="text-[10px] font-mono" style={{ color: T.muted }}>{e.period}</span>
                  </div>
                  <p className="text-xs font-medium text-blue-500 mb-1">{e.company}</p>
                  <p className="text-xs font-light" style={{ color: T.muted }}>{e.desc}</p>
                </div>
              ))}
            </section>

            {/* Education & Certs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <section style={bubble(T)} className="p-6">
                <p className="text-[10px] font-mono mb-4" style={{ color: T.muted }}>03 — EDUCATION</p>
                <div className="space-y-4">
                  {EDUCATION.map((e, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <EduMark variant={e.logo} />
                      <div>
                        <h3 className="text-xs font-semibold">{e.degree}</h3>
                        <p className="text-xs text-emerald-500 mt-1">{e.school}</p>
                        <p className="text-[10px] mt-1" style={{ color: T.muted }}>{e.period} · {e.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section style={bubble(T)} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-mono" style={{ color: T.muted }}>04 — CERTIFICATES</p>
                  <button onClick={() => goTo("certifications")} className="text-[10px] hover:opacity-70 transition-opacity" style={{ color: T.muted }}>
                    View all →
                  </button>
                </div>
                <div className="space-y-2">
                  {CERTS.map((c) => (
                    <div key={c.name} className="flex justify-between items-center text-xs">
                      <span className="font-medium">{c.name}</span>
                      <span className="text-[10px] font-mono" style={{ color: T.muted }}>{c.year}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Skills */}
            <section style={bubble(T)} className="p-6">
              <p className="text-[10px] font-mono mb-4" style={{ color: T.muted }}>05 — SKILLS</p>
              <div className="flex flex-wrap gap-4 justify-center">
                {SKILLS.map((s) => <SkillBadge key={s.name} skill={s} T={T} dark={dark} />)}
              </div>
            </section>

            {/* Projects */}
            <section id="projects" style={bubble(T)} className="p-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[10px] font-mono" style={{ color: T.muted }}>06 — PROJECTS</p>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {YEARS.map((y) => (
                      <button
                        key={y}
                        onClick={() => { playIosClickSound(); setYear(y); }}
                        className="px-2.5 py-1 text-[10px] rounded-lg transition-colors"
                        style={{ backgroundColor: year === y ? T.text : "transparent", color: year === y ? T.bg : T.muted }}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => goTo("projects")}
                    className="px-2.5 py-1 text-[10px] rounded-lg border hover:opacity-80 transition-opacity"
                    style={{ borderColor: T.glassBorder, color: T.muted }}
                  >
                    View all →
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {projects.map((p) => <ProjectCard key={p.id} p={p} T={T} />)}
              </div>
            </section>

            {/* Contact */}
            <section id="contact" onClick={() => playIosClickSound()} className="p-8 rounded-3xl border text-center cursor-pointer click-active" style={bubble(T)}>
              <p className="text-[10px] font-mono mb-2" style={{ color: T.muted }}>07 — CONTACT</p>
              <h2 className="text-xl sm:text-2xl font-bold">Let's connect.</h2>
              <p className="text-xs mt-2 mb-5" style={{ color: T.muted }}>Open for software roles and projects.</p>
              <a href="mailto:aarondev@gmail.com" className="inline-block px-6 py-2.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: T.accent }}>
                aarondev@gmail.com →
              </a>
            </section>

            <footer className="text-center py-6 text-[10px] font-mono" style={{ color: T.muted }}>
              © 2026 Aaron D Guillermo · All rights reserved.
            </footer>
          </>
        )}
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Premium floating robot / drone
// ---------------------------------------------------------------------------
