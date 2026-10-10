import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Project } from "../data/portfolio";
import type { Theme } from "../theme/palette";

function ProjectImage({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);
  return failed ? <div className="flex aspect-[4/3] items-center justify-center text-sm">{project.title} — preview unavailable</div> : <img src={project.image} alt={`${project.title} project cover`} onError={() => setFailed(true)} className="block w-full h-full object-contain" />;
}

function ProjectModal({ project, T, onClose }: { project: Project; T: Theme; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    const focused = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => { dialog?.close(); document.body.style.overflow = overflow; focused?.focus(); };
  }, []);
  return createPortal(<dialog ref={ref} aria-labelledby={titleId} onCancel={onClose} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} className="premium-modal" style={{ color: T.text, backgroundColor: T.bg, borderColor: T.glassBorder }}>
    <div className="relative grid md:grid-cols-[1.15fr_1fr]">
      <button autoFocus onClick={onClose} aria-label="Close project" className="modal-close" style={{ background: T.bg, borderColor: T.glassBorder }}>×</button>
      <div className="project-modal-image min-w-0 flex items-center p-4 sm:p-6"><div className="w-full overflow-hidden rounded-2xl border" style={{ borderColor: T.glassBorder }}><ProjectImage project={project} /></div></div>
      <div className="min-w-0 p-6 md:p-9 md:pt-16 space-y-6">
        <div><p className="text-[10px] tracking-[.2em] font-mono mb-3" style={{ color: T.muted }}>PROJECT OVERVIEW</p><h2 id={titleId} className="text-3xl font-semibold tracking-tight">{project.title}</h2>{project.status && <span className="glass-chip mt-4" style={{ borderColor: T.glassBorder, color: T.accent }}>{project.status}</span>}</div>
        <div className="space-y-3 text-sm leading-relaxed" style={{ color: T.muted }}><p>{project.desc}</p>{project.details && <p>{project.details}</p>}</div>
        {project.role && <div className="border-t pt-5" style={{ borderColor: T.glassBorder }}><p className="text-[10px] tracking-widest mb-2" style={{ color: T.muted }}>MY ROLE</p><p className="text-xs font-medium">{project.role}</p></div>}
        <div><h3 className="text-[10px] tracking-widest mb-3" style={{ color: T.muted }}>TECH STACK</h3><div className="flex flex-wrap gap-2">{project.tags.map((tag) => <span key={tag} className="glass-chip" style={{ borderColor: T.glassBorder }}>{tag}</span>)}</div></div>
      </div>
    </div>
  </dialog>, document.body);
}

export default function ProjectPreview({ project, T }: { project: Project; T: Theme }) {
  const [open, setOpen] = useState(false);
  return <>
    <button onClick={() => setOpen(true)} aria-label={`View ${project.title} project`} className="project-preview group w-full text-left grid sm:grid-cols-[.85fr_1.15fr] overflow-hidden rounded-2xl border" style={{ borderColor: T.glassBorder, color: T.text }}>
      <span className="block overflow-hidden aspect-[4/3]"><ProjectImage project={project} /></span>
      <span className="flex min-w-0 flex-col justify-center p-5 sm:p-6 gap-3">
        <span className="text-[9px] font-mono tracking-widest uppercase" style={{ color: T.accent }}>{project.status || "Project"}</span>
        <span className="text-xl font-semibold tracking-tight">{project.title}</span>
        <span className="text-xs leading-relaxed" style={{ color: T.muted }}>{project.desc}</span>
        <span className="flex flex-wrap gap-2">{project.tags.map((tag) => <span key={tag} className="glass-chip" style={{ borderColor: T.glassBorder }}>{tag}</span>)}</span>
        <span className="text-[11px] mt-2" style={{ color: T.accent }}>Explore project <span aria-hidden="true">↗</span></span>
      </span>
    </button>
    {open && <ProjectModal project={project} T={T} onClose={() => setOpen(false)} />}
  </>;
}
