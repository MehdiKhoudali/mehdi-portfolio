export type BenchmarkModel = "luna" | "terra" | "sol";
export type BenchmarkEffort = "Low" | "Medium" | "High";

export type PublishedBenchmarkResult = {
  id: string;
  modelKey: BenchmarkModel;
  label: string;
  model: string;
  status: "Passed";
  attempt: number;
  effort: BenchmarkEffort;
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
    id: "luna-low",
    modelKey: "luna",
    label: "Luna",
    model: "gpt-5.6-luna",
    status: "Passed",
    attempt: 1,
    effort: "Low",
    durationMs: 195901,
    inputTokens: 281327,
    cachedInputTokens: 243712,
    outputTokens: 7965,
    reasoningTokens: 194,
    previewUrl: "/benchmarks/saas-landing-page/luna-low/index.html",
    summary: "Completed the full responsive Relay page and passed both production build and artifact verification at low reasoning effort.",
  },
  {
    id: "luna-medium",
    modelKey: "luna",
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
    summary: "Delivered the complete responsive page, including the product dashboard, navigation, outcome metrics, pricing interaction, FAQ, closing CTA, and reduced-motion support.",
  },
  {
    id: "luna-high",
    modelKey: "luna",
    label: "Luna",
    model: "gpt-5.6-luna",
    status: "Passed",
    attempt: 1,
    effort: "High",
    durationMs: 782999,
    inputTokens: 799631,
    cachedInputTokens: 737024,
    outputTokens: 39829,
    reasoningTokens: 1833,
    previewUrl: "/benchmarks/saas-landing-page/luna-high/index.html",
    summary: "Produced a comprehensive high-reasoning implementation with a full product narrative, responsive behavior, and verified production artifacts.",
  },
  {
    id: "terra-low",
    modelKey: "terra",
    label: "Terra",
    model: "gpt-5.6-terra",
    status: "Passed",
    attempt: 1,
    effort: "Low",
    durationMs: 345601,
    inputTokens: 296670,
    cachedInputTokens: 260096,
    outputTokens: 16326,
    reasoningTokens: 257,
    previewUrl: "/benchmarks/saas-landing-page/terra-low/index.html",
    summary: "Built and verified the complete Relay landing experience at low reasoning effort, including responsive and interactive requirements.",
  },
  {
    id: "terra-medium",
    modelKey: "terra",
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
    summary: "Completed the full product story with a dashboard-led hero, responsive sections, functional pricing and FAQ controls, accessible focus states, and self-contained assets.",
  },
  {
    id: "terra-high",
    modelKey: "terra",
    label: "Terra",
    model: "gpt-5.6-terra",
    status: "Passed",
    attempt: 1,
    effort: "High",
    durationMs: 442654,
    inputTokens: 412585,
    cachedInputTokens: 366080,
    outputTokens: 20903,
    reasoningTokens: 964,
    previewUrl: "/benchmarks/saas-landing-page/terra-high/index.html",
    summary: "Delivered a verified high-reasoning build with the complete content flow, responsive navigation, pricing controls, and FAQ interactions.",
  },
  {
    id: "sol-low",
    modelKey: "sol",
    label: "Sol",
    model: "gpt-5.6-sol",
    status: "Passed",
    attempt: 1,
    effort: "Low",
    durationMs: 281234,
    inputTokens: 233915,
    cachedInputTokens: 206592,
    outputTokens: 11151,
    reasoningTokens: 254,
    previewUrl: "/benchmarks/saas-landing-page/sol-low/index.html",
    summary: "Completed and verified the responsive Relay product page at low reasoning effort with all required interaction states intact.",
  },
  {
    id: "sol-medium",
    modelKey: "sol",
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
    summary: "Implemented the complete Relay experience with a custom interface composition, responsive navigation, full content flow, interactive pricing and FAQ, and accessible motion behavior.",
  },
  {
    id: "sol-high",
    modelKey: "sol",
    label: "Sol",
    model: "gpt-5.6-sol",
    status: "Passed",
    attempt: 1,
    effort: "High",
    durationMs: 693605,
    inputTokens: 640265,
    cachedInputTokens: 584704,
    outputTokens: 31537,
    reasoningTokens: 3849,
    previewUrl: "/benchmarks/saas-landing-page/sol-high/index.html",
    summary: "Created a detailed high-reasoning implementation with the full responsive product journey, interactive states, and verified production output.",
  },
];
