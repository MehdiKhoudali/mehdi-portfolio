export type GalleryImage = {
  src: string;
  label: string;
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
};

export const experiences: Experience[] = [
  {
    slug: "kitt-medical",
    role: "Full Stack Software Engineer",
    company: "Kitt Medical",
    location: "Casablanca",
    date: "August 1, 2025",
    category: "Healthcare SaaS / Full Stack Engineering",
    summary:
      "Full-stack engineering work on Kitt Medical, a UK healthcare startup building emergency allergy and anaphylaxis response systems for schools and businesses.",
    description: [
      "Kitt Medical combines emergency adrenaline pens, staff training, incident reporting, and operational software into one subscription platform. The product sits at the intersection of healthcare, operations, and SaaS, with real-world emergency use cases behind the software.",
      "My work covered full-stack product features, backend systems, frontend surfaces, third-party integrations, marketing attribution, customer success tooling, production debugging, and workflow automation.",
      "The company is especially interesting because the software supports practical allergy safety infrastructure for schools and businesses, with public traction across training, incident management, and wider awareness.",
    ],
    highlights: [
      "Built and shipped full-stack product features",
      "Backend engineering with Node.js, TypeScript, TypeORM, and MySQL",
      "Frontend development with Next.js",
      "Third-party integrations across Monday.com, Typeform, and CRM workflows",
      "Marketing attribution systems for Meta Ads and Google Ads",
      "Customer success tooling, production debugging, and workflow automation",
      "Worked on operational SaaS with real-world emergency allergy response use cases",
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
    gallery: [],
  },
  {
    slug: "nf-tech",
    role: "Software engineer",
    company: "NF TECH (Agency)",
    location: "Casablanca",
    date: "Feb 1, 2024",
    category: "Agency / Client Work",
    showOnHomepage: false,
    summary:
      "Agency engineering work across client-facing products, implementation details, and delivery-focused software projects.",
    description: [
      "NF TECH was agency-style engineering work: moving across requirements, implementation, client needs, and the practical details of getting software shipped.",
      "This page can expand into selected client-safe work, technical responsibilities, and the kinds of products built inside the agency context.",
    ],
    highlights: [
      "Client-facing software delivery",
      "Product implementation work",
      "Engineering across multiple requirements",
    ],
    techStack: [],
    gallery: [],
  },
  {
    slug: "shortmagic-ai",
    role: "Co-founder",
    company: "Shortmagic.ai (AI SaaS)",
    location: "Casablanca",
    date: "April 7, 2024",
    category: "AI SaaS",
    summary:
      "An AI SaaS product for turning prompts and source material into short-form content workflows.",
    description: [
      "Shortmagic.ai was built around a simple idea: make short-form content production faster for creators, faceless accounts, and marketing experiments.",
      "The product helped transform prompts and source material such as Reddit posts, PDFs, and YouTube videos into short-form video concepts, slideshow assets, AI-generated visuals, voiceovers, and subtitles.",
      "The focus was not just generation, but reducing the distance between an idea and a publishable asset while giving creators ways to add branding and redirect attention back to their own product or website.",
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
    gallery: [],
  },
  {
    slug: "feedbackloop",
    role: "Founder",
    company: "FeedbackLoop (Acquired)",
    location: "Casablanca",
    date: "Jan 10, 2024",
    category: "B2B Web App",
    summary:
      "A lightweight feedback management product for collecting user feedback, prioritizing requests, and publishing a transparent roadmap.",
    description: [
      "FeedbackLoop was a B2B feedback product designed to help teams capture what users were asking for and turn that signal into clearer product decisions.",
      "The product centered on feedback collection, feature-request prioritization, and public roadmap visibility, so teams could keep customers informed while still managing product direction internally.",
      "Alongside product work, I also worked on marketing, blog content, SEO, and social media distribution, helping scale the product to over 700 users before it was later acquired.",
    ],
    highlights: [
      "Feedback collection for B2B teams",
      "Feature request prioritization",
      "Public-facing roadmap and feedback pages",
      "Marketing, blog, SEO, and social media work",
      "Scaled to over 700 users",
      "Built, launched, and later acquired",
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
    gallery: [],
  },
  {
    slug: "tagu",
    role: "Co-founder",
    company: "TagU (B2B SaaS)",
    location: "Casablanca",
    date: "April 20, 2023",
    category: "B2B SaaS",
    summary:
      "A B2B SaaS product built with four friends to improve async collaboration and team workflows.",
    description: [
      "TagU was a SaaS product built with four friends around async work, team collaboration, and the small workflow gaps that slow teams down.",
      "The work covered the public landing page, extension frontend, backend features, workspace flows, settings screens, and payment logic.",
      "It was an early full-product build: not just a landing page, but the product surface, collaboration model, and business mechanics around subscriptions and team workspaces.",
    ],
    highlights: [
      "Built the landing page with Next.js and Tailwind CSS, hosted on Vercel",
      "Worked on the extension frontend with React and Tailwind CSS",
      "Worked on the backend with Supabase",
      "Built settings pages and payment logic",
      "Built team workspace features",
    ],
    techStack: [
      "React.js",
      "TypeScript",
      "Chrome API",
      "Supabase",
      "Stripe",
      "Tailwind CSS",
    ],
    gallery: [],
  },
];

export function getExperience(slug: string) {
  return experiences.find((experience) => experience.slug === slug);
}
