import { DARK, LIGHT, type Theme } from "./theme/palette";
import { GITHUB_URL, YEARS, PROJECTS, EXPERIENCE, EDUCATION, CERTS, SKILLS, SKILL_GROUPS, type Skill, type Certificate } from "./data/portfolio";
import GithubDotContribution from "./components/ContributionGraph";
import PremiumRobot from "./components/PremiumRobot";
import PremiumDrone from "./components/PremiumDrone";
import { useEffect, useMemo, useRef, useState } from "react";
import ProfilePhoto from "./components/ProfilePhoto";
import ProjectPreview from "./components/ProjectPreview";
import mmsuLogo from "./assets/photos/Education-logo/Teal Mariano Marcos State University Seal.png";
import chaindaanLogo from "./assets/photos/ChainDaan-logo/chaindaan.logo.png";

type Page = "home" | "projects" | "certifications" | "about" | "education" | "skills";

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
    backgroundImage: "linear-gradient(135deg, rgba(255,255,255,.075), transparent 45%, rgba(135,170,255,.025))",
    backdropFilter: "saturate(180%) blur(30px)",
    WebkitBackdropFilter: "saturate(180%) blur(30px)",
    border: `1px solid ${T.glassBorder}`,
    borderRadius: 26,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,.12), inset 0 -1px 0 rgba(255,255,255,.025), 0 16px 48px rgba(0,0,0,.12)",
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
// ---------------------------------------------------------------------------
// Education mark — an original monoline emblem (white strokes only), NOT a
// reproduction of any institution's official seal/logo. Swap in the real
// crest asset yourself if you have the rights to use it.
// ---------------------------------------------------------------------------
function EduMark({ variant }: { variant: "mmsu" | "generic" }) {
  if (variant === "mmsu") return <img src={mmsuLogo} alt="Mariano Marcos State University seal" className="w-11 h-11 object-contain shrink-0" />;
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: "linear-gradient(135deg, #1c1c1f, #0a0a0c)", border: "1px solid rgba(255,255,255,0.14)" }}
    >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10 12 5 2 10l10 5 10-5Z" />
          <path d="M6 12v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5" />
        </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skill badges — real tech logos (via devicon) for branded tools, original
// monoline icons for the generic "SQL" / "NoSQL" categories. Grayscale at
// rest, full color on hover — a minimalist grid that still reads clearly.
// ---------------------------------------------------------------------------
function SkillBadge({ skill, T }: { skill: Skill; T: Theme }) { return <span className="glass-chip skill-text" style={{ color: T.text, borderColor: T.glassBorder }}>{skill.name}</span>; }

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
            {(PROJECTS[y] ?? []).map((p) => <ProjectPreview key={p.id} project={p} T={T} />)}
          </div>
        </section>
      ))}
    </div>
  );
}

function CertificateImage({ certificate, T }: { certificate: Certificate; T: Theme }) {
  const [failed, setFailed] = useState(false);
  return certificate.image && !failed ? (
    <img src={certificate.image} alt={`${certificate.name} certificate`} onError={() => setFailed(true)} className="w-full h-full object-contain" />
  ) : (
    <div className="flex h-full min-h-48 flex-col items-center justify-center gap-3 p-6 text-center" style={{ background: T.glass, color: T.muted }}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M7 8h10M7 11h6m2 5-1 6 3-2 3 2-1-6"/><circle cx="17" cy="15" r="3"/></svg>
      <span className="text-xs">Certificate image coming soon</span>
      <span className="text-[10px]">{certificate.issuer}</span>
    </div>
  );
}

function CertificateModal({ certificate, T, onClose }: { certificate: Certificate; T: Theme; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);
  return (
    <dialog ref={dialogRef} aria-labelledby="certificate-title" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }} className="premium-modal" style={{ backgroundColor: T.bg, color: T.text, borderColor: T.glassBorder }}>
      <div className="relative grid md:grid-cols-[1.2fr_1fr]">
        <button autoFocus onClick={onClose} aria-label="Close certificate" className="absolute right-3 top-3 z-10 rounded-full w-9 h-9 text-xl" style={{ background: T.bg, border: `1px solid ${T.glassBorder}` }}>×</button>
        <div className="min-h-60 md:min-h-96 p-5 flex items-center justify-center"><CertificateImage certificate={certificate} T={T} /></div>
        <div className="p-6 pt-12 md:p-8 md:pt-16 flex flex-col justify-center gap-4">
          <span className="text-[10px] font-mono" style={{ color: T.muted }}>CERTIFICATE · {certificate.year}</span>
          <h2 id="certificate-title" className="text-xl font-semibold tracking-tight">{certificate.name}</h2>
          <span className="text-xs self-start rounded-xl border px-3 py-2" style={{ borderColor: T.glassBorder, color: T.accent }}>Provider: {certificate.issuer}</span>
          <p className="text-sm leading-relaxed" style={{ color: T.muted }}>{certificate.desc}</p>
        </div>
      </div>
    </dialog>
  );
}

function AllEducationPage({ T }: { T: Theme }) {
  return <div className="space-y-6">
    <div><p className="text-[10px] font-mono mb-1" style={{ color: T.muted }}>EDUCATION</p><h2 className="text-2xl sm:text-3xl font-bold tracking-tight">My learning journey.</h2></div>
    <section style={bubble(T)} className="p-6 sm:p-8">
      {EDUCATION.map((e, index) => <div key={`${e.school}-${index}`} className="flex gap-4 py-5 border-b last:border-0" style={{ borderColor: T.glassBorder }}>
        <EduMark variant={e.logo} /><div><h3 className="text-sm font-semibold">{e.degree}</h3><p className="text-xs text-emerald-500 mt-2">{e.school}</p><p className="text-xs mt-2" style={{ color: T.muted }}>{e.period}{e.note && ` · ${e.note}`}</p></div>
      </div>)}
    </section>
  </div>;
}

function AllSkillsPage({ T }: { T: Theme }) {
  return <div className="space-y-6">
    <div><p className="text-[10px] font-mono mb-1" style={{ color: T.muted }}>SKILL SET</p><h2 className="text-2xl sm:text-3xl font-bold tracking-tight">What I build with.</h2></div>
    <div style={bubble(T)} className="px-5 sm:px-6 py-2">{SKILL_GROUPS.map((group) => <section key={group.name} className="grid sm:grid-cols-[145px_1fr] gap-3 py-4 border-b last:border-0" style={{ borderColor: T.glassBorder }}>
      <h3 className="text-xs font-medium pt-1" style={{ color: T.muted }}>{group.name}</h3><div className="flex flex-wrap items-center gap-1.5">{group.skills.map((skill) => <SkillBadge key={skill.name} skill={skill} T={T} />)}</div>
    </section>)}</div>
  </div>;
}

function AllCertificationsPage({ T }: { T: Theme }) {
  const [selected, setSelected] = useState<Certificate | null>(null);
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-mono mb-1" style={{ color: T.muted }}>CERTIFICATIONS</p>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Certificates & credentials.</h2>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {CERTS.map((c) => (
          <section key={c.name} style={bubble(T)} className="p-6">
            <button onClick={() => setSelected(c)} aria-label={`View ${c.name} certificate`} className="block w-full aspect-[4/3] overflow-hidden rounded-2xl border mb-5 hover:opacity-80 transition-opacity" style={{ borderColor: T.glassBorder }}><CertificateImage certificate={c} T={T} /></button>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <img src={c.logo} alt={c.logoAlt} className="w-8 h-8 shrink-0 rounded-lg object-contain bg-white p-1" />
                <h3 className="text-sm font-semibold">{c.name}</h3>
              </div>
              <span className="text-[10px] font-mono" style={{ color: T.muted }}>{c.year}</span>
            </div>
            <span className="inline-block text-[10px] rounded-lg border px-2 py-1 mb-3" style={{ color: T.accent, borderColor: T.glassBorder }}>Provider: {c.issuer}</span>
            <p className="text-xs font-light leading-relaxed" style={{ color: T.text }}>{c.desc}</p>
          </section>
        ))}
      </div>
      {selected && <CertificateModal certificate={selected} T={T} onClose={() => setSelected(null)} />}
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
  const [dark, setDark] = useState(false);
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
        {page === "education" && <AllEducationPage T={T} />}
        {page === "skills" && <AllSkillsPage T={T} />}

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
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border shadow-2xl cursor-pointer click-active flex items-center justify-center"
                    onClick={() => playIosClickSound()}
                    style={{
                      borderColor: T.glassBorder,

                    }}
                  >
                    <ProfilePhoto />
                  </div>
                </div>

                <p className="text-[14px] font-mono tracking-widest uppercase mb-2" style={{ color: T.muted }}>
                  Full Stack Developer | Software Engineer | Generative AI
                </p>
                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
                  Aaron D Guillermo
                </h1>
                <p className="mt-3 text-xs sm:text-sm max-w-md leading-relaxed" style={{ color: T.muted }}>
                  Full Stack Software Engineer crafting scalable web applications, integrating generative AI, and designing seamless user experiences.
                </p>

                <nav aria-label="Social profiles" className="flex items-center gap-2.5 mt-6">
                  <a href="https://www.facebook.com/aaronguillermo.aaronguillermo/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook" className="social-link" style={{ color: T.text, backgroundColor: T.glass, borderColor: T.glassBorder }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.095 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.026 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.931-1.956 1.887v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.095 24 18.1 24 12.073Z" /></svg>
                  </a>
                  <a href="https://www.linkedin.com/in/aaron-guillermo-8983882a1/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn" className="social-link" style={{ color: T.text, backgroundColor: T.glass, borderColor: T.glassBorder }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0Z" /></svg>
                  </a>
                  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub" className="social-link" style={{ color: T.text, backgroundColor: T.glass, borderColor: T.glassBorder }}>
                    <GithubMark size={16} />
                  </a>
                </nav>
              </div>
            </section>

            {/* GitHub Contribution Section */}
            <section className="w-full min-w-0" aria-label="GitHub contributions">
              <GithubDotContribution />
            </section>

            {/* About & Philosophy */}
            <div className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-5">
              <div className="space-y-5">
              <section
                onClick={() => playIosClickSound()}
                className="click-active p-6 rounded-3xl border cursor-pointer"
                style={{ backgroundColor: dark ? "#0a0a0c" : "#ffffff", borderColor: T.glassBorder }}
              >
                <p className="text-[10px] font-mono mb-4 text-gray-500">01 — PHILOSOPHY</p>
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
                  <p className="text-[10px] font-mono" style={{ color: T.muted }}>02 — ABOUT</p>
                  <span className="text-[10px]" style={{ color: T.muted }}>Read the story →</span>
                </div>
                <p className="text-xs sm:text-sm font-light leading-relaxed" style={{ color: T.text }}>
                 Third-year BSIT student at Mariano Marcos State University (Ilocos Norte), with a strong interest in full-stack development and generative AI. Focused on building practical web applications, creating intuitive user experiences, and exploring AI-powered solutions.
                </p>
              </section>
              </div>
              <section className="app-builder-card relative flex flex-col p-6 rounded-[26px] overflow-hidden min-h-64">
                <h2 className="relative text-[10px] font-mono tracking-wider">03 — APP BUILDER</h2>
                <div className="relative flex items-start pt-5">
                  <a href="https://appbuildersph.com/apps/chaindaan" target="_blank" rel="noopener noreferrer" aria-label="View ChainDaan on App Builders PH" className="app-builder-item relative flex w-full min-w-0 items-center gap-3 rounded-2xl px-4 py-3.5 overflow-hidden">
                    <img src={chaindaanLogo} alt="ChainDaan logo" className="relative w-10 h-10 shrink-0 rounded-xl border border-white/15 shadow-sm" />
                    <span className="relative flex min-w-0 flex-1 flex-col gap-1">
                      <span className="text-sm font-medium tracking-tight">ChainDaan</span>
                      <span className="text-[10px] font-normal tracking-wide text-emerald-100/80">Open in App Builders</span>
                    </span>
                    <span aria-hidden="true" className="relative text-sm text-emerald-100/80">↗</span>
                  </a>
                </div>
              </section>
            </div>

            {/* Experience */}
            <section style={bubble(T)} className="p-6">
              <p className="text-[10px] font-mono mb-4" style={{ color: T.muted }}>04 — EXPERIENCE</p>
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
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-mono" style={{ color: T.muted }}>05 — EDUCATION</p>
                  <button onClick={() => goTo("education")} className="text-[10px] hover:opacity-70" style={{ color: T.muted }}>See all →</button>
                </div>
                <div className="space-y-4">
                  {EDUCATION.slice(0, 2).map((e, i) => (
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
                  <p className="text-[10px] font-mono" style={{ color: T.muted }}>06 — CERTIFICATES</p>
                  <button onClick={() => goTo("certifications")} className="text-[10px] hover:opacity-70 transition-opacity" style={{ color: T.muted }}>
                    View all →
                  </button>
                </div>
                <div className="space-y-2">
                  {CERTS.map((c) => (
                    <div key={c.name} className="flex justify-between items-start gap-3 py-2 text-xs">
                      <div className="min-w-0"><span className="font-medium">{c.name}</span>
                        <span className="block w-fit mt-2 rounded-lg border px-2 py-1 text-[9px] leading-relaxed" style={{ color: T.accent, borderColor: T.glassBorder }}>Provider: {c.issuer}</span>
                      </div>
                      <span className="text-[10px] font-mono shrink-0" style={{ color: T.muted }}>{c.year}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Skills */}
            <section style={bubble(T)} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-mono" style={{ color: T.muted }}>07 — SKILLS</p>
                <button onClick={() => goTo("skills")} className="text-[10px] hover:opacity-70" style={{ color: T.muted }}>View all →</button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SKILLS.map((s) => <SkillBadge key={s.name} skill={s} T={T} />)}
              </div>
            </section>

            {/* Projects */}
            <section id="projects" style={bubble(T)} className="p-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[10px] font-mono" style={{ color: T.muted }}>08 — PROJECTS</p>
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
                {projects.map((p) => <ProjectPreview key={p.id} project={p} T={T} compact onExplore={() => goTo("projects")} />)}
              </div>
            </section>

            {/* Contact */}
            <section id="contact" onClick={() => playIosClickSound()} className="p-8 rounded-3xl border text-center cursor-pointer click-active" style={bubble(T)}>
              <p className="text-[10px] font-mono mb-2" style={{ color: T.muted }}>09 — CONTACT</p>
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
