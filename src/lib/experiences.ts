export type GalleryImage = {
  src: string;
  label: string;
  width?: number;
  height?: number;
  browserLabel?: string;
  mediaType?: "image" | "video";
};

export type Experience = {
  slug: string;
  role: string;
  company: string;
  location: string;
  date: string;
  category: string;
  showOnHomepage?: boolean;
  summary: string;
  description: string[];
  highlights: string[];
  techStack: string[];
  gallery: GalleryImage[];
  galleryLayout?: "stacked" | "grid";
};

export const experiences: Experience[] = [
  {
    slug: "kitt-medical",
    role: "Full Stack Software Engineer",
    company: "Kitt Medical",
    location: "UK",
    date: "August 1, 2025",
    category: "Healthcare SaaS / Full Stack Engineering",
    summary:
      "Full-stack engineering for Kitt Medical, a UK healthcare platform for allergy response in schools and businesses.",
    description: [
      "Kitt combines emergency adrenaline pens, staff training, incident reporting, and operational software in one subscription platform.",
      "I shipped product features, backend systems, frontend surfaces, third-party integrations, attribution, customer tooling, and workflow automation.",
      "The software supports emergency allergy response across schools and businesses.",
    ],
    highlights: [
      "Full-stack product features across frontend and backend",
      "Node.js, TypeScript, TypeORM, and MySQL backend work",
      "Next.js frontend development",
      "Monday.com, Typeform, and CRM integrations",
      "Meta Ads and Google Ads attribution",
      "Customer tooling, production debugging, and workflow automation",
      "Software for emergency allergy response",
    ],
    techStack: [
      "Next.js",
      "TypeScript",
      "MySQL",
      "TypeORM",
      "Krystal Server",
      "Vercel",
      "Git",
      "GitHub",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "GitHub Actions",
      "Monday API",
      "Typeform API",
    ],
    gallery: [
      {
        src: "/experience/kitt-medical/todo-dashboard.png",
        label: "Kitt Medical task dashboard for medication restocking",
        width: 1915,
        height: 874,
        browserLabel: "Kitt Medical / Team dashboard",
      },
    ],
  },
  {
    slug: "shortmagic-ai",
    role: "Co-founder",
    company: "Shortmagic.ai (AI SaaS)",
    location: "Casablanca",
    date: "April 7, 2024",
    category: "AI SaaS",
    summary:
      "AI SaaS that turns prompts and source material into short-form content workflows.",
    description: [
      "Shortmagic turned Reddit posts, PDFs, YouTube videos, and prompts into video concepts, slideshows, visuals, voiceovers, and subtitles.",
      "I worked across the generation flow, branding tools, and the path from source material to publishable asset.",
      "The product reduced the time between an idea and a finished post.",
    ],
    highlights: [
      "AI-generated short-form content workflows",
      "Prompt-to-slideshow generation",
      "Support for source material like Reddit posts, PDFs, and YouTube videos",
      "Branding layer for creators and product marketing",
    ],
    techStack: [
      "AWS",
      "Next.js",
      "Prisma",
      "TypeScript",
      "Vercel",
      "GitHub",
      "GitHub Actions",
      "Tailwind CSS",
      "AWS Lambda",
      "AWS S3",
      "Stripe",
    ],
    galleryLayout: "grid",
    gallery: [
      {
        src: "/experience/shortmagic-ai/marketing-site.png",
        label: "Shortmagic marketing website",
        width: 922,
        height: 669,
        browserLabel: "Shortmagic / Marketing site",
      },
      {
        src: "/experience/shortmagic-ai/ai-video-workflow.png",
        label: "Shortmagic AI video creation workflow",
        width: 1527,
        height: 936,
        browserLabel: "Shortmagic / AI video studio",
      },
    ],
  },
  {
    slug: "feedbackloop",
    role: "Founder",
    company: "FeedbackLoop (Acquired)",
    location: "Casablanca",
    date: "Jan 10, 2024",
    category: "B2B Web App",
    summary:
      "Built when I was 15, FeedbackLoop scaled to 700 users as a product for prioritizing feedback and publishing transparent roadmaps.",
    description: [
      "FeedbackLoop collected requests, helped teams prioritize them, and published public roadmaps.",
      "I built the product and handled marketing, blog content, SEO, and distribution.",
      "It reached 700 users before acquisition.",
    ],
    highlights: [
      "Feedback collection for B2B teams",
      "Feature prioritization and public roadmaps",
      "Marketing, blog, SEO, and distribution",
      "Built at 15; scaled to 700 users",
      "Built, launched, and acquired",
    ],
    techStack: [
      "Next.js",
      "Prisma",
      "TypeScript",
      "Vercel",
      "GitHub",
      "GitHub Actions",
      "Tailwind CSS",
      "Stripe",
    ],
    galleryLayout: "grid",
    gallery: [
      {
        src: "/experience/feedbackloop/marketing-site.png",
        label: "FeedbackLoop marketing website",
        width: 1599,
        height: 812,
        browserLabel: "FeedbackLoop / Marketing site",
      },
      {
        src: "/experience/feedbackloop/roadmap-board.png",
        label: "FeedbackLoop public product roadmap",
        width: 1881,
        height: 937,
        browserLabel: "FeedbackLoop / Public roadmap",
      },
    ],
  },
  {
    slug: "tagu",
    role: "Co-founder",
    company: "TagU (B2B SaaS)",
    location: "Casablanca",
    date: "April 20, 2023",
    category: "B2B SaaS",
    summary:
      "B2B SaaS for async collaboration and team workflows, built at 15 with four friends.",
    description: [
      "TagU combined team workspaces, collaboration features, a browser extension, and subscriptions.",
      "I built the landing page, extension frontend, backend features, workspace flows, settings, and payment logic.",
      "It was an end-to-end product build rather than a marketing site alone.",
    ],
    highlights: [
      "Built at 15 with four friends",
      "Next.js and Tailwind CSS landing page on Vercel",
      "React and Tailwind CSS extension frontend",
      "Supabase backend features",
      "Settings pages and payment logic",
      "Team workspace features",
    ],
    techStack: [
      "React.js",
      "TypeScript",
      "Chrome API",
      "Supabase",
      "Stripe",
      "Tailwind CSS",
    ],
    galleryLayout: "grid",
    gallery: [
      {
        src: "/experience/tagu/product-demo.mp4",
        label: "TagU product demo",
        browserLabel: "TagU / Product demo",
        mediaType: "video",
      },
      {
        src: "/experience/tagu/use-cases.png",
        label: "TagU collaboration use cases",
        width: 1067,
        height: 747,
        browserLabel: "TagU / Use cases",
      },
    ],
  },
];

export function getExperience(slug: string) {
  return experiences.find((experience) => experience.slug === slug);
}
