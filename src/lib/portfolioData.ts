export type ProjectTab = "web" | "graphic" | "motion" | "uiux";

export interface ProjectItem {
  id: string;
  tab: ProjectTab;
  title: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  imageUrl?: string;
  isIframe?: boolean;
  proofUrl?: string;
  badge?: string;
}

export interface ExperienceItem {
  id: string;
  type: "intern" | "job";
  title: string;
  role: string;
  location: string;
  date: string;
  tag?: string;
  bullets: string[];
  proofUrl?: string;
}

export interface AchievementItem {
  id: string;
  label: string;
  text: string;
  proofUrl?: string;
}

export interface EducationData {
  school: string;
  major: string;
  locationStatus: string;
  verifyUrl?: string;
  achievements: AchievementItem[];
}

export interface CertificateItem {
  id: string;
  title: string;
  org: string;
  credentialNo?: string;
  date?: string;
  verifyUrl?: string;
  borderColor?: string;
}

// Default Projects
export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: "proj-web-1",
    tab: "web",
    title: "All Social Video Downloader",
    description: "Download video from all social media platforms — TikTok, Instagram, YouTube & others. Paste link, download instantly.",
    tags: ["Next.js", "API", "Social Media"],
    liveUrl: "https://all-social-download-video.vercel.app/",
    isIframe: true,
    badge: "#01",
  },
  {
    id: "proj-web-2",
    tab: "web",
    title: "Tarot Card Reader",
    description: "Interactive tarot card reader app — fun, mystical, and who knows, maybe accurate. Perfect for casual or serious reads.",
    tags: ["React", "UI/UX", "Fun Project"],
    liveUrl: "https://tarot-ten-taupe.vercel.app/",
    isIframe: true,
    badge: "#02",
  },
  {
    id: "proj-graphic-1",
    tab: "graphic",
    title: "Dudul Anak Baik",
    description: "Illustration 'Dudul Anak Baik'. Cute and friendly character design with a signature neobrutalism visual style.",
    tags: ["Illustration", "Graphic", "Art"],
    imageUrl: "/dudul-artwork.webp",
    badge: "#01",
  },
  {
    id: "proj-graphic-2",
    tab: "graphic",
    title: "Visual Photo",
    description: "Creative photo manipulation with dynamic color grading to create an expressive artistic nuance.",
    tags: ["Creative", "Design", "Grading"],
    imageUrl: "/photo-visual.webp",
    badge: "#02",
  },
  {
    id: "proj-motion-1",
    tab: "motion",
    title: "Kinetic Motion & Micro-Animations",
    description: "Dynamic motion graphics and micro-interactions created with After Effects and GSAP to deliver lively, engaging web experiences.",
    tags: ["After Effects", "GSAP", "2D Animation"],
    imageUrl: "/Animations.gif",
    badge: "#01",
  },
];

// Default Work Experiences & Internships
export const DEFAULT_EXPERIENCES: ExperienceItem[] = [
  {
    id: "exp-intern-1",
    type: "intern",
    title: "PT Segara Lentera Teknologi",
    role: "Web Development — Intern",
    location: "South Jakarta",
    date: "March 2025 – Present",
    tag: "TECH / WEB DEV",
    bullets: [
      "Built over 15+ responsive websites, increasing average page load speed by 30% and improving user experience (UX).",
      "Led a team of 2+ members, enhancing website performance and scalability by 40%.",
      "Designed and implemented async/concurrent features, optimizing backend processing efficiency and doubling rendering speeds.",
      "Optimized website accessibility to meet WCAG standards, making it suitable for complex sites.",
      "Integrated AI features into web application designs and implementations.",
      "Addressed revisions from supervisors and provided constructive feedback to elevate digital product quality.",
    ],
  },
  {
    id: "exp-job-1",
    type: "job",
    title: "PT Sumber Alfaria Trijaya Tbk",
    role: "Store Crew — Contract Employee",
    location: "Tangerang",
    date: "November 2021 – July 2022",
    proofUrl: "https://www.instagram.com/p/CY6Jm0dBf8s/?hl=id&img_index=1",
    bullets: [
      "Developed successful upselling strategies, increasing average customer transactions by 25% and contributing to store target achievements.",
      "Managed all product operations efficiently from stock count to shelf arrangement to maintain a visually appealing layout.",
      "Maintained store cleanliness and presentation, creating a comfortable shopping environment and improving customer satisfaction.",
      "Proactively recommended products based on customer needs and preferences, driving satisfaction and additional sales.",
      "Implemented First In First Out (FIFO) principles for new warehouse stock and shelf replenishment.",
      "Ensured sales shelves were always neatly filled and clean for customer convenience and satisfaction.",
      "Processed cashier transactions politely while promoting ongoing store campaigns and promotional items.",
    ],
  },
  {
    id: "exp-job-2",
    type: "job",
    title: "Wendy's",
    role: "Kitchen Crew — Contract Employee",
    location: "Central Jakarta",
    date: "October 2022 – May 2023",
    bullets: [
      "Prepared food ingredients and products in compliance with brand standards and policies without delay.",
      "Collaborated with kitchen teammates to complete food production efficiently and maintain consistent cooking quality.",
      "Carefully maintained food quality compliance to standard procedures and minimized food preparation defects.",
      "Applied First In First Out (FIFO) principles in raw material usage to prevent waste.",
    ],
  },
];

// Default Education & Achievements
export const DEFAULT_EDUCATION: EducationData = {
  school: "Universitas Pamulang",
  major: "Bachelor of Computer Science",
  locationStatus: "Tangerang — Currently Enrolled",
  verifyUrl: "https://pddikti.kemdiktisaintek.go.id/detail-mahasiswa/yTRHeSUMXwTVL5h1p4Jtsz-1y1ySDhzuM_dCtC_15sYwSWeSoGQikxT6PQHK4ghn1mHZtQ==",
  achievements: [
    {
      id: "achieve-1",
      label: "Achievements",
      text: "Developed a project published in SINTA 5 scientific journal.",
      proofUrl: "https://garuda.kemdiktisaintek.go.id/documents/detail/6586037",
    },
  ],
};

// Default Certificates
export const DEFAULT_CERTIFICATES: CertificateItem[] = [
  {
    id: "cert-1",
    title: "Belajar Dasar AI (Learn AI Basics)",
    org: "Dicoding Indonesia",
    credentialNo: "No. IL2C5B030V025",
    date: "October 1, 2025",
    verifyUrl: "https://www.dicoding.com/certificates/0LZ056D0NX65",
    borderColor: "border-orange-500",
  },
  {
    id: "cert-2",
    title: "Fundamentals of Machine Learning",
    org: "Digital Talent Scholarship",
    credentialNo: "No. 1151504945-144",
    verifyUrl: "https://digitalent.komdigi.go.id/cek-sertifikat?registrasi=19510546840-144",
    borderColor: "border-blue-400",
  },
  {
    id: "cert-3",
    title: "Programming (Micro Skill)",
    org: "Digital Talent Scholarship",
    credentialNo: "No. 2220702650-7619",
    borderColor: "border-black",
  },
];

const STORAGE_KEYS = {
  PROJECTS: "portfolio_custom_projects_v1",
  EXPERIENCES: "portfolio_custom_experiences_v1",
  EDUCATION: "portfolio_custom_education_v1",
  CERTIFICATES: "portfolio_custom_certificates_v1",
  SKILLS: "portfolio_custom_skills_v1",
};

// Helper: load from localStorage or fallback
export function getSavedProjects(): ProjectItem[] {
  if (typeof window === "undefined") return DEFAULT_PROJECTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading projects from storage", e);
  }
  return DEFAULT_PROJECTS;
}

export function saveProjects(projects: ProjectItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
}

export function getSavedExperiences(): ExperienceItem[] {
  if (typeof window === "undefined") return DEFAULT_EXPERIENCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXPERIENCES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading experiences from storage", e);
  }
  return DEFAULT_EXPERIENCES;
}

export function saveExperiences(experiences: ExperienceItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(experiences));
}

export function getSavedEducation(): EducationData {
  if (typeof window === "undefined") return DEFAULT_EDUCATION;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EDUCATION);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading education from storage", e);
  }
  return DEFAULT_EDUCATION;
}

export function saveEducation(education: EducationData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.EDUCATION, JSON.stringify(education));
}

export function getSavedCertificates(): CertificateItem[] {
  if (typeof window === "undefined") return DEFAULT_CERTIFICATES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CERTIFICATES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading certificates from storage", e);
  }
  return DEFAULT_CERTIFICATES;
}

export function saveCertificates(certificates: CertificateItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(certificates));
}

export interface SkillsData {
  softSkills: string[];
  hardSkills: string[];
  softwareSkills: string[];
}

export const DEFAULT_SKILLS: SkillsData = {
  softSkills: [
    "Analytical Thinking",
    "Empathy",
    "Diplomacy",
    "Komunikasi",
    "Open-mindedness",
    "Responsibility",
    "Leadership",
    "Research",
    "Adaptability",
    "Visionary",
    "Critical Thinking",
    "Curiosity",
    "Time Management",
  ],
  hardSkills: [
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Vue.js",
    "Node.js",
    "Angular",
    "MySQL",
    "SQLite",
    "UI/UX Design",
    "Mobile Analytics",
    "Website Analytics",
  ],
  softwareSkills: [
    "VS Code",
    "Postman",
    "GitHub",
    "Git",
    "Figma",
    "Adobe XD",
    "After Effects",
    "Affinity Designer",
    "Framer",
    "Tableau",
    "Digital Illustration",
    "Color Grading",
  ],
};

export function getSavedSkills(): SkillsData {
  if (typeof window === "undefined") return DEFAULT_SKILLS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SKILLS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading skills from storage", e);
  }
  return DEFAULT_SKILLS;
}

export function saveSkills(skills: SkillsData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
}

export function resetAllPortfolioData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.PROJECTS);
  localStorage.removeItem(STORAGE_KEYS.EXPERIENCES);
  localStorage.removeItem(STORAGE_KEYS.EDUCATION);
  localStorage.removeItem(STORAGE_KEYS.CERTIFICATES);
  localStorage.removeItem(STORAGE_KEYS.SKILLS);
}
