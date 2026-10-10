export const GITHUB_USERNAME = "Eyronnnnnnnnn";
export const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}`;
import chaindaanCover from "../assets/chaindaan-cover.svg";
import chaindaanLogo from "../assets/photos/ChainDaan-logo/chaindaan.logo.png";
export const YEARS = [2026, 2025, 2024];
const DEVICON_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";
export type Project = { id: number; title: string; desc: string; tags: string[]; image: string; icon?: string; role?: string; details?: string; status?: string };
export const PROJECTS: Record<number, Project[]> = {
2026: [
  {
    id: 1,
    title: "Chaindaan",
    desc: "An ongoing academic project where I apply and develop my software development skills as a BSIT student.",
    image: chaindaanCover,
    icon: chaindaanLogo,
    role: "Full Stack Developer (Solo Developer)",
    details: "Driving the full-stack development of Chain-Daan as the solo developer in a five-member BSIT team, translating project requirements into an integrated application across the frontend and backend.",
    status: "In Development",
    tags: ["React.js", "Node.js", "Express.js", "MongoDB", "Cloudinary", "Socket.IO"],
  },
],
};

export const EXPERIENCE = [
  {
    role: "Full Stack Developer (Solo Developer)",
    company: "Chain-Daan | Academic Software Engineering Project",
    period: "2026 — Present",
    desc: "Driving the full-stack development of Chain-Daan as the solo developer in a five-member BSIT team, translating project requirements into an integrated application across the frontend and backend.",
  },
];

// NOTE: placeholder degree/period for MMSU — update with your actual program and dates.
export const EDUCATION = [
  { degree: "Bachelor of Science in Information Technology", school: "Mariano Marcos State University", period: "Graduating in 2028", note: "1st Year College Schoolar", logo: "mmsu" as const },
  { degree: "(STEM)Science Technology Engineering and Mathemathics", school: "Catagtaguen National Highschool", period: "Graduated 2024", note: "Honor Student", logo: "generic" as const },
  { degree: "Junior Highschool", school: "Catagtaguen National Highschool", period: "Graduated 2022", note: "", logo: "generic" as const },
  { degree: "Elementary", school: "Macayepyep Elementary school", period: "Grade 6", note: "Grade 6 Graduated", logo: "generic" as const },
  { degree: "Elementary", school: "R and O Academy", period: "Grade 1-5", note: "", logo: "generic" as const },
];

export type Certificate = { name: string; issuer: string; year: string; color: string; desc: string; image?: string };
// Set image to the certificate image URL or an imported local asset.
export const CERTS: Certificate[] = [
  {
    name: "Associate AI Engineer for Developers",
    issuer: "DataCamp",
    year: "2026",
    color: "#f5a623",
   desc: "Developed skills in integrating generative AI into software applications, including working with large language models, prompt engineering, and building AI-powered solutions.",
  },
  {
    name: "Introduction to AI Literacy and Responsible Use",
    issuer: "Commission on Higher Education (CHED) Bagong Pilipinas (ACHIEVE program) Mapúa University(MAPUA)",
    year: "2026",
    color: "#f5a623",
   desc: "Developed skills in integrating generative AI into software applications, including working with large language models, prompt engineering, and building AI-powered solutions.",
  },

 
];

export type Skill = { name: string; src?: string; custom?: "sql" | "nosql"; invertOnDark?: boolean };
export const SKILLS: Skill[] = [
  { name: "HTML", src: `${DEVICON_BASE}/html5/html5-original.svg` },
  { name: "CSS", src: `${DEVICON_BASE}/css3/css3-original.svg` },
  { name: "JavaScript", src: `${DEVICON_BASE}/javascript/javascript-original.svg` },
  { name: "Java", src: `${DEVICON_BASE}/java/java-original.svg` },
  { name: "React.js", src: `${DEVICON_BASE}/react/react-original.svg` },
  { name: "Next.js", src: `${DEVICON_BASE}/nextjs/nextjs-original.svg`, invertOnDark: true },
  { name: "Node.js", src: `${DEVICON_BASE}/nodejs/nodejs-original.svg` },
  { name: "Express.js", src: `${DEVICON_BASE}/express/express-original-wordmark.svg`, invertOnDark: true },
  { name: "SQL", custom: "sql" },
  { name: "NoSQL", custom: "nosql" },
  { name: "MongoDB", src: `${DEVICON_BASE}/mongodb/mongodb-original.svg` },
  { name: "Docker", src: `${DEVICON_BASE}/docker/docker-original.svg` },
  { name: "Git", src: `${DEVICON_BASE}/git/git-original.svg` },
  { name: "GitHub", src: `${DEVICON_BASE}/github/github-original.svg`, invertOnDark: true },
  { name: "VS Code", src: `${DEVICON_BASE}/vscode/vscode-original.svg` },
];

export const SKILL_GROUPS: { name: string; skills: Skill[] }[] = [
  { name: "Frontend", skills: SKILLS.filter((s) => ["HTML", "CSS", "JavaScript", "React.js", "Next.js"].includes(s.name)) },
  { name: "Backend", skills: SKILLS.filter((s) => ["Java", "Node.js", "Express.js"].includes(s.name)) },
  { name: "Databases", skills: SKILLS.filter((s) => ["SQL", "NoSQL", "MongoDB"].includes(s.name)) },
  { name: "Software Engineering", skills: ["Agile", "Scrum", "System Design", "System Architecture"].map((name) => ({ name })) },
  { name: "AI Tools", skills: ["Codex", "Claude (Anthropic)", "Generative AI"].map((name) => ({ name })) },
  { name: "Deployment Platforms", skills: [{ name: "Vercel" }, { name: "Render" }, ...SKILLS.filter((s) => s.name === "Docker")] },
  { name: "Tools", skills: [...SKILLS.filter((s) => ["Git", "GitHub", "VS Code"].includes(s.name)), { name: "Figma", src: `${DEVICON_BASE}/figma/figma-original.svg` }] },
];


