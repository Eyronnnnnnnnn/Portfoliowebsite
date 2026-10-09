import { useEffect, useState } from "react";
import profilePhoto from "./assets/photos/profile.png";
import ContributionGraph from "./components/ContributionGraph";
import RobotCompanions from "./components/RobotCompanions";
import ProjectCard from "./components/ProjectCard";
import { CERTS, EDUCATION, EXPERIENCE, GITHUB_URL, PROJECTS, SKILLS, YEARS } from "./data/portfolio";

export default function App() {
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem("portfolio-theme") === "light" ? "light" : "dark"; } catch { return "dark"; } });
  const [year, setYear] = useState<number | "all">(YEARS[0]);
  const [imageError, setImageError] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.title = "Aaron D Guillermo — Full Stack Developer";
    try { localStorage.setItem("portfolio-theme", theme); } catch { /* Storage can be disabled. */ }
  }, [theme]);
  const projects = year === "all" ? YEARS.flatMap(value => PROJECTS[value] ?? []) : PROJECTS[year] ?? [];

  return <div className="portfolio-shell">
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><nav className="nav-inner" aria-label="Main navigation">
      <a className="wordmark" href="#home"><span className="brand-mark">a<span>.</span></span><span>Aaron Guillermo<span className="brand-caption">DEVELOPER & BUILDER</span></span></a>
      <div className="nav-links"><a href="#projects">Work</a><a href="#about">About</a><a className="nav-contact" href="#contact">Let’s talk <span>↗</span></a><button className="theme-toggle" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? "☼" : "☾"}</button></div>
    </nav></header>
    <main id="main" className="page-container">
      <section id="home" className="hero" aria-labelledby="hero-heading">
        <div className="hero-copy"><div className="hero-intro"><div className="portrait">{imageError ? <span>AG</span> : <img src={profilePhoto} alt="Aaron D Guillermo" width="64" height="64" onError={() => setImageError(true)} />}</div><div><span className="availability"><i/> Open to opportunities</span><p>Metro Manila, Philippines</p></div></div>
          <p className="eyebrow hero-eyebrow">SOFTWARE · SYSTEMS · DESIGN</p>
          <h1 id="hero-heading">Thoughtful interfaces.<br/><span>Reliable systems.</span></h1>
          <p className="hero-description">I’m Aaron, a full stack developer turning complex ideas into clear, carefully crafted digital experiences.</p>
          <div className="hero-actions"><a className="button-primary" href="#projects">Explore my work <span>↘</span></a><a className="button-secondary" href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub ↗</a></div>
        </div><RobotCompanions/>
      </section>
      <ContributionGraph/>
      <section id="projects" className="content-section" aria-labelledby="projects-heading"><div className="section-heading"><div><p className="eyebrow">01 / SELECTED WORK</p><h2 id="projects-heading">Ideas, brought to life.</h2></div><div className="year-filter" role="group" aria-label="Filter projects by year">{[...YEARS, "all" as const].map(value => <button key={value} aria-pressed={year === value} onClick={() => setYear(value)}>{value === "all" ? "All" : value}</button>)}</div></div><div className="project-grid">{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index}/>)}</div></section>
      <section id="about" className="content-section about-grid" aria-labelledby="about-heading"><div className="about-copy"><p className="eyebrow">02 / A LITTLE ABOUT ME</p><h2 id="about-heading">Built with intention.<br/><span className="muted">Down to the details.</span></h2><p>I’m Aaron D Guillermo, a full stack developer based in Metro Manila. I focus on React, Next.js, Node.js, and cloud platforms.</p><p>I care about the parts that make a product feel right: clear interfaces, responsive interactions, and dependable systems underneath.</p><div className="principle"><span>↳</span> Simplicity is the result of thoughtful work.</div></div><div className="panel experience-panel"><p className="eyebrow">THE JOURNEY</p><h3>Experience</h3>{EXPERIENCE.map(item => <article className="experience-item" key={item.role}><div className="experience-title"><h4>{item.role}</h4><span>{item.period}</span></div><p className="company">{item.company}</p><p>{item.desc}</p></article>)}</div></section>
      <section className="panel skills-panel" aria-labelledby="skills-heading"><div><p className="eyebrow">03 / MY TOOLKIT</p><h2 id="skills-heading">The tools behind the work.</h2></div><div className="skill-grid">{SKILLS.map(skill => <div className="skill" key={skill.name}>{skill.src ? <img src={skill.src} width="22" height="22" alt="" loading="lazy" style={{ filter: theme === "dark" && skill.invertOnDark ? "invert(1)" : undefined }}/> : <span className="database-icon" aria-hidden="true">▤</span>}<span>{skill.name}</span></div>)}</div></section>
      <section className="content-section credentials-grid"><div className="panel"><p className="eyebrow">04 / EDUCATION</p><h3>Learning, always.</h3>{EDUCATION.map(item => <div className="education-item" key={item.school}><span className="education-icon" aria-hidden="true">⌂</span><div><h4>{item.school}</h4>{!item.degree.startsWith("Add ") && <p>{item.degree}</p>}{!item.period.includes("20XX") && <p>{item.period}</p>}</div></div>)}</div><div className="panel"><div className="section-heading"><div><p className="eyebrow">05 / CREDENTIALS</p><h3>Continuing to grow.</h3></div><button className="text-link" aria-expanded={showCredentials} aria-controls="credential-list" onClick={() => setShowCredentials(!showCredentials)}>{showCredentials ? "Less −" : "Details +"}</button></div><div id="credential-list">{CERTS.map(item => <article className="credential" key={item.name}><div><h4>{item.name}</h4><span>{item.year}</span></div><p>{item.issuer}</p>{showCredentials && <p className="credential-description">{item.desc}</p>}</article>)}</div></div></section>
      <section id="contact" className="contact-section"><div><p className="eyebrow">HAVE SOMETHING IN MIND?</p><h2>Let’s build something<br/><span>worth using.</span></h2><p>Open to software roles, collaborations, and thoughtful projects.</p></div><a className="button-primary" href="mailto:aarondev@gmail.com">Let’s talk <span>↗</span></a></section>
      <footer className="site-footer"><span>© {new Date().getFullYear()} Aaron D Guillermo</span><span>Made with care. Built with React.</span><a href="#home">Back to top ↑</a></footer>
    </main>
  </div>;
}
