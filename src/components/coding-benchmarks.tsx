"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type BenchmarkCategory = "Interface" | "Visual" | "Interaction";

type Benchmark = {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  category: BenchmarkCategory;
  description: string;
  tests: string[];
  status: string;
  preview: "landing" | "dashboard" | "visualization" | "game";
};

const benchmarks: Benchmark[] = [
  {
    id: "saas-landing-page",
    number: "01",
    title: "SaaS landing page",
    shortTitle: "Landing page",
    category: "Interface",
    description:
      "A complete product launch page built from a detailed brand, content, interaction, and responsive-design brief.",
    tests: ["Brief fidelity", "Responsive UI", "Accessibility"],
    status: "Brief in review",
    preview: "landing",
  },
  {
    id: "screenshot-dashboard",
    number: "02",
    title: "Screenshot-to-code dashboard",
    shortTitle: "Dashboard",
    category: "Visual",
    description:
      "A working dashboard reconstructed from a single visual reference, local assets, and a concise interaction contract.",
    tests: ["Visual similarity", "Interactions", "Mobile adaptation"],
    status: "Reference in progress",
    preview: "dashboard",
  },
  {
    id: "data-visualization",
    number: "03",
    title: "Interactive data visualization",
    shortTitle: "Data visualization",
    category: "Interaction",
    description:
      "A dense dataset turned into an explorable interface with filtering, tooltips, time controls, and clear storytelling.",
    tests: ["Data accuracy", "Exploration", "Performance"],
    status: "Dataset selected",
    preview: "visualization",
  },
  {
    id: "browser-game",
    number: "04",
    title: "Small browser game",
    shortTitle: "Browser game",
    category: "Interaction",
    description:
      "A compact one-button game testing state, animation, input handling, feedback, difficulty, and finish-level polish.",
    tests: ["Game loop", "Input handling", "Visual polish"],
    status: "Mechanics in review",
    preview: "game",
  },
];

const categories = ["All", "Interface", "Visual", "Interaction"] as const;

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4">
      <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.35" />
    </svg>
  );
}

function BenchmarkPreview({ type }: { type: Benchmark["preview"] }) {
  if (type === "landing") {
    return (
      <div className="absolute inset-0 flex flex-col bg-[#d9dfd2] p-5 text-[#171a16]">
        <div className="mb-8 flex items-center justify-between border-b border-black/15 pb-3 text-[8px] uppercase tracking-[0.18em]">
          <span>Northstar</span>
          <span>Product · Pricing · Login</span>
        </div>
        <div className="mt-auto max-w-[80%]">
          <div className="mb-3 h-2 w-14 rounded-full bg-[#cf5b35]" />
          <p className="text-2xl leading-[0.92] font-semibold tracking-[-0.05em]">
            Ship the work that matters.
          </p>
          <div className="mt-5 flex gap-2">
            <span className="h-7 w-20 rounded-full bg-[#171a16]" />
            <span className="h-7 w-16 rounded-full border border-black/25" />
          </div>
        </div>
      </div>
    );
  }

  if (type === "dashboard") {
    return (
      <div className="absolute inset-0 grid grid-cols-[2.8rem_1fr] bg-[#ebe9e3] text-[#181818]">
        <div className="border-r border-black/10 bg-[#20221f] p-3">
          <div className="size-4 rounded-full bg-[#d0ff74]" />
          <div className="mt-8 space-y-3">
            {[0, 1, 2, 3].map((item) => (
              <div className="h-1.5 rounded-full bg-white/20" key={item} />
            ))}
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-[8px] uppercase tracking-[0.2em]">Overview</span>
            <span className="size-5 rounded-full bg-black/10" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {["42.8K", "18.2%", "2.4K"].map((value) => (
              <div className="border border-black/10 bg-white/65 p-2" key={value}>
                <p className="text-[7px] text-black/40">Metric</p>
                <p className="mt-2 text-sm font-semibold">{value}</p>
              </div>
            ))}
          </div>
          <div className="relative mt-2 h-20 overflow-hidden border border-black/10 bg-white/65">
            <svg viewBox="0 0 300 90" className="absolute inset-0 size-full" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 70 C35 55 45 72 78 45 S132 58 160 30 S215 46 245 20 S280 28 300 8" fill="none" stroke="#7a9e44" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  if (type === "visualization") {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[#101719] p-5">
        <div className="flex items-center justify-between text-[8px] uppercase tracking-[0.18em] text-white/50">
          <span>Signal field / 24h</span>
          <span>Live dataset</span>
        </div>
        <div className="absolute inset-x-5 bottom-5 top-12 border border-white/10">
          {[12, 31, 56, 74, 91].map((left, index) => (
            <span
              className="absolute rounded-full border border-[#8ef0cf]/60 bg-[#8ef0cf]/20 shadow-[0_0_22px_rgba(142,240,207,0.35)]"
              key={left}
              style={{
                left: `${left}%`,
                top: `${18 + ((index * 29) % 64)}%`,
                width: `${8 + index * 3}px`,
                height: `${8 + index * 3}px`,
              }}
            />
          ))}
          <div className="absolute inset-x-3 bottom-3 flex items-end gap-1">
            {[28, 46, 21, 65, 42, 76, 54, 88, 61, 72, 48, 81].map((height, index) => (
              <span className="flex-1 bg-white/12" key={index} style={{ height: `${height / 2}px` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#1a1320]">
      <div className="absolute inset-x-4 top-4 flex items-center justify-between text-[8px] uppercase tracking-[0.18em] text-white/55">
        <span>Wave 07</span>
        <span>Score 12,840</span>
      </div>
      <div className="absolute left-1/2 top-1/2 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ff8b63]/35 shadow-[0_0_60px_rgba(255,88,83,0.2)]">
        <div className="absolute inset-5 rounded-full border border-[#ff8b63]/50" />
        <div className="absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#ff6b5f] shadow-[0_0_24px_rgba(255,107,95,0.7)]" />
      </div>
      <span className="absolute bottom-9 left-1/2 h-8 w-2 -translate-x-1/2 rounded-full bg-[#a5ffdb] shadow-[0_0_20px_rgba(165,255,219,0.7)]" />
      <div className="absolute inset-x-4 bottom-4 h-1 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-2/3 bg-[#a5ffdb]" />
      </div>
    </div>
  );
}

export function CodingBenchmarks() {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All");

  const visibleBenchmarks = useMemo(
    () =>
      activeCategory === "All"
        ? benchmarks
        : benchmarks.filter((benchmark) => benchmark.category === activeCategory),
    [activeCategory],
  );

  return (
    <main className="grain min-h-screen bg-[#070707] text-[#efefea]">
      <div className="glass-shell flex min-h-screen w-full flex-col border-white/15">
        <header className="glass-section border-b border-white/15 px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Tools navigation"
            className="reveal flex items-center justify-between border-b border-white/15 py-5 text-sm text-white/55 sm:py-6"
          >
            <Link className="transition-colors hover:text-white/85" href="/">
              Mehdi.K
            </Link>
            <div className="flex items-center gap-5 sm:gap-7">
              <span className="text-white/85">Tools</span>
              <Link className="transition-colors hover:text-white/85" href="/#about">
                About
              </Link>
            </div>
          </nav>

          <div className="grid gap-12 py-12 sm:py-16 lg:grid-cols-[1fr_0.46fr] lg:py-20">
            <div className="reveal reveal-delay-1">
              <p className="mb-6 text-xs uppercase tracking-[0.18em] text-white/40">
                Tool 01 / Coding agent field tests
              </p>
              <h1 className="max-w-5xl text-6xl leading-[0.88] font-semibold tracking-[-0.055em] text-white sm:text-8xl lg:text-[8.5rem]">
                CODE, UNDER PRESSURE.
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-white/58 sm:text-xl sm:leading-9">
                A transparent gallery of coding agents building the same visual,
                interactive software tasks—complete with previews, evidence, time,
                and cost.
              </p>
            </div>

            <aside className="project-meta-card reveal reveal-delay-2 self-end border border-white/15">
              <div className="border-b border-white/12 px-4 py-4 text-xs uppercase tracking-[0.18em] text-white/38 sm:px-5">
                Suite status
              </div>
              {[
                ["01", "Benchmarks", "04"],
                ["02", "Published runs", "00"],
                ["03", "Method", "Evidence first"],
              ].map(([number, label, value]) => (
                <div className="project-meta-row grid grid-cols-[2rem_1fr_auto] gap-3 border-b border-white/10 px-4 py-4 last:border-b-0 sm:px-5" key={label}>
                  <span className="text-xs text-white/25">{number}</span>
                  <span className="text-xs uppercase tracking-[0.14em] text-white/35">{label}</span>
                  <span className="text-sm text-white/80">{value}</span>
                </div>
              ))}
            </aside>
          </div>
        </header>

        <section className="glass-section border-b border-white/15 p-4 sm:p-6 lg:p-8" aria-labelledby="benchmark-gallery-title">
          <div className="reveal mb-8 grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.18em] text-white/40">Initial suite / v0.1</p>
              <h2 id="benchmark-gallery-title" className="text-5xl leading-none font-semibold sm:text-6xl">
                Test gallery
              </h2>
            </div>
            <div className="flex flex-wrap gap-2" aria-label="Filter benchmarks">
              {categories.map((category) => (
                <button
                  className={`border px-4 py-2 text-sm transition-colors ${
                    activeCategory === category
                      ? "border-white/45 bg-white text-black"
                      : "border-white/14 bg-white/[0.025] text-white/55 hover:border-white/28 hover:text-white/85"
                  }`}
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  type="button"
                  aria-pressed={activeCategory === category}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {visibleBenchmarks.map((benchmark, index) => (
              <article
                className="glass-card reveal group border border-white/15"
                id={benchmark.id}
                key={benchmark.id}
                style={{ animationDelay: `${90 + index * 65}ms` }}
              >
                <div className="relative aspect-[16/9] overflow-hidden border-b border-white/12 bg-[#111]">
                  <BenchmarkPreview type={benchmark.preview} />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(0,0,0,0.28))] opacity-50" />
                  <span className="absolute top-4 left-4 border border-black/15 bg-black/75 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-white/65 backdrop-blur-md">
                    {benchmark.category}
                  </span>
                </div>
                <div className="relative z-10 p-5 sm:p-6">
                  <div className="mb-8 flex items-start justify-between gap-5">
                    <span className="text-xs text-white/28">{benchmark.number}</span>
                    <span className="border border-white/12 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-white/38">
                      {benchmark.status}
                    </span>
                  </div>
                  <h3 className="max-w-lg text-3xl leading-none font-medium tracking-[-0.035em] text-white sm:text-4xl">
                    {benchmark.title}
                  </h3>
                  <p className="mt-5 max-w-xl text-base leading-7 text-white/52">{benchmark.description}</p>
                  <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/12 pt-5 text-xs text-white/38">
                    {benchmark.tests.map((test) => (
                      <span key={test}>{test}</span>
                    ))}
                    <span className="ml-auto flex items-center gap-2 text-white/65">
                      Spec soon <ArrowIcon />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-section border-b border-white/15 p-4 sm:p-6 lg:p-8" aria-labelledby="protocol-title">
          <div className="grid gap-10 lg:grid-cols-[0.4fr_1fr]">
            <div className="reveal">
              <p className="mb-3 text-xs uppercase tracking-[0.18em] text-white/40">Methodology</p>
              <h2 id="protocol-title" className="text-5xl leading-none font-semibold sm:text-6xl">Run protocol</h2>
            </div>
            <div className="border-t border-white/18">
              {[
                ["01", "Same task", "Every agent receives the same versioned brief, assets, seed, and execution limits."],
                ["02", "No repairs", "Failures remain part of the record. Published output is never manually corrected."],
                ["03", "Complete evidence", "Previews sit beside build checks, interactions, screenshots, transcripts, time, and cost."],
                ["04", "Repeatable runs", "Official results include multiple attempts, not a hand-picked best generation."],
              ].map(([number, title, description], index) => (
                <div className="glass-row reveal grid gap-3 border-b border-white/15 px-4 py-5 sm:grid-cols-[2.5rem_0.45fr_1fr] sm:gap-5 sm:px-5" key={title} style={{ animationDelay: `${120 + index * 60}ms` }}>
                  <span className="text-xs text-white/25">{number}</span>
                  <h3 className="text-lg text-white/80">{title}</h3>
                  <p className="text-sm leading-6 text-white/48">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="glass-section p-4 sm:p-6 lg:p-8">
          <div className="reveal grid min-h-72 items-end gap-10 border border-white/15 bg-[radial-gradient(circle_at_82%_12%,rgba(255,255,255,0.1),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.035),rgba(255,255,255,0.008))] p-6 sm:p-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.18em] text-white/40">Currently in the lab</p>
              <h2 className="max-w-4xl text-4xl leading-[0.96] font-semibold tracking-[-0.04em] sm:text-6xl">
                The first agents enter the suite soon.
              </h2>
            </div>
            <Link className="flex items-center gap-3 border border-white/20 px-5 py-3 text-sm text-white/72 transition-colors hover:border-white/40 hover:bg-white hover:text-black" href="/">
              Back to portfolio <ArrowIcon />
            </Link>
          </div>
        </section>

        <footer className="glass-section mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-white/15 p-4 text-sm text-white/45 sm:p-6 lg:p-8">
          <p>Mehdi K / Coding Benchmarks</p>
          <p>Transparent tests. Complete evidence.</p>
        </footer>
      </div>
    </main>
  );
}
