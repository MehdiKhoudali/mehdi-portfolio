export type PublishedBenchmarkResult = {
  id: "luna" | "terra" | "sol";
  label: string;
  model: string;
  status: "Passed";
  attempt: number;
  effort: "Medium";
  durationMs: number;
  inputTokens: number;
  cachedInputTokens: number;
  outputTokens: number;
  reasoningTokens: number;
  previewUrl: string;
  summary: string;
};

export const saasLandingTask = {
  id: "saas-landing-page",
  title: "SaaS landing page",
  product: "Relay",
  version: "1.0.0",
  description:
    "Build a polished, production-ready product page for a fictional project-operations SaaS from the same detailed brand, content, interaction, and responsive-design brief.",
  requirements: [
    "Responsive navigation and product-led hero",
    "Trust metrics, features, workflow, and pricing",
    "Functional billing toggle, FAQ, and mobile menu",
    "Semantic, keyboard-accessible, self-contained build",
  ],
};

export const saasLandingResults: PublishedBenchmarkResult[] = [
  {
    id: "luna",
    label: "Luna",
    model: "gpt-5.6-luna",
    status: "Passed",
    attempt: 1,
    effort: "Medium",
    durationMs: 374104,
    inputTokens: 520640,
    cachedInputTokens: 465408,
    outputTokens: 14070,
    reasoningTokens: 812,
    previewUrl: "/benchmarks/saas-landing-page/luna/index.html",
    summary:
      "Delivered the complete responsive page, including the product dashboard, navigation, outcome metrics, pricing interaction, FAQ, closing CTA, and reduced-motion support.",
  },
  {
    id: "terra",
    label: "Terra",
    model: "gpt-5.6-terra",
    status: "Passed",
    attempt: 1,
    effort: "Medium",
    durationMs: 326677,
    inputTokens: 239999,
    cachedInputTokens: 203008,
    outputTokens: 15643,
    reasoningTokens: 767,
    previewUrl: "/benchmarks/saas-landing-page/terra/index.html",
    summary:
      "Completed the full product story with a dashboard-led hero, responsive sections, functional pricing and FAQ controls, accessible focus states, and self-contained assets.",
  },
  {
    id: "sol",
    label: "Sol",
    model: "gpt-5.6-sol",
    status: "Passed",
    attempt: 1,
    effort: "Medium",
    durationMs: 357648,
    inputTokens: 251349,
    cachedInputTokens: 212736,
    outputTokens: 16038,
    reasoningTokens: 586,
    previewUrl: "/benchmarks/saas-landing-page/sol/index.html",
    summary:
      "Implemented the complete Relay experience with a custom interface composition, responsive navigation, full content flow, interactive pricing and FAQ, and accessible motion behavior.",
  },
];
