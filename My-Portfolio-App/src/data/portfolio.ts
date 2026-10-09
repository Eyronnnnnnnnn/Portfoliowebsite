export const GITHUB_USERNAME = "Eyronnnnnnnnn";
export const GITHUB_URL = `https://github.com/${GITHUB_USERNAME}`;
export const YEARS = [2026, 2025, 2024];
const DEVICON_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";
export const PROJECTS: Record<number, { id: number; title: string; desc: string; tags: string[] }[]> = {
  2026: [
    { id: 1, title: "Meridian Analytics", desc: "Spatial analytics dashboard for real-time IoT sensor data across Metro Manila.", tags: ["React","Node.js","WebSockets"] },
    { id: 2, title: "PayChain", desc: "Blockchain-backed payroll system for SMEs in Southeast Asia.", tags: ["Solidity","Next.js","PostgreSQL"] },
  ],
  2025: [
    { id: 3, title: "Lumen Mobile", desc: "Circadian-rhythm mindfulness app with adaptive notifications.", tags: ["React Native","Supabase"] },
    { id: 4, title: "Atlas Platform", desc: "Interactive climate storytelling platform.", tags: ["D3.js","React","Python"] },
  ],
  2024: [
    { id: 5, title: "ShopOS", desc: "E-commerce OS with POS, inventory, and analytics unified.", tags: ["TypeScript","Prisma","Stripe"] },
    { id: 6, title: "DevPulse", desc: "GitHub-integrated dev activity tracker with Slack digest reports.", tags: ["Go","GitHub API"] },
  ],
};

export const EXPERIENCE = [
  { role: "Full Stack Developer", company: "Freelance / Remote", period: "2024 — Present", desc: "Building production-ready web and mobile apps. Specializing in React, Node.js, and cloud systems." },
  { role: "Junior Software Engineer", company: "TechBridge PH", period: "2023 — 2024", desc: "Developed internal dashboards and APIs. Migrated legacy codebases to Next.js + PostgreSQL." },
];

// NOTE: placeholder degree/period for MMSU — update with your actual program and dates.
export const EDUCATION = [
  { degree: "Add your program here", school: "Mariano Marcos State University", period: "20XX — 20XX", note: "Add honors / note", logo: "mmsu" as const },
];

export const CERTS = [
  {
    name: "Associate AI Engineer for Developers",
    issuer: "DataCamp",
    year: "2025",
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


