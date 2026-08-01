"use client";

import Image from "next/image";
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
  preview: "landing" | "dashboard" | "visualization" | "game" | "creative";
  href?: string;
  cta?: string;
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
    status: "12 runs published",
    preview: "landing",
    href: "/tools/saas-landing-page",
  },
  {
    id: "award-winning-creative-site",
    number: "02",
    title: "Award-winning creative site",
    shortTitle: "Creative site",
    category: "Visual",
    description:
      "An expressive cultural site testing original art direction, editorial typography, motion, transitions, and responsive creative development.",
    tests: ["Art direction", "Motion design", "Responsive craft"],
    status: "12 runs published",
    preview: "creative",
    href: "/tools/award-winning-creative-site",
    cta: "View 12 runs",
  },
  {
    id: "pocket-reef-life-simulation",
    number: "03",
    title: "Pocket Reef life simulation",
    shortTitle: "Life simulation",
    category: "Interaction",
    description:
      "A living miniature ecosystem testing deterministic simulation, emergent behavior, interactive controls, data storytelling, and animated world-building.",
    tests: ["Emergent behavior", "Simulation state", "Visual storytelling"],
    status: "12 runs published",
    preview: "game",
    href: "/tools/pocket-reef-life-simulation",
    cta: "View 12 runs",
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
      <Image
        alt=""
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        src="/tools/thumbnails/saas-landing-page.webp"
      />
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

  if (type === "creative") {
    return (
      <Image
        alt=""
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        src="/tools/thumbnails/award-winning-creative-site.webp"
      />
    );
  }

  return (
    <Image
      alt=""
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
      fill
      sizes="(min-width: 768px) 50vw, 100vw"
      src="/tools/thumbnails/pocket-reef-life-simulation.webp"
    />
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

          <div className="flex justify-center py-14 text-center sm:py-20 lg:py-24">
            <div className="reveal reveal-delay-1 flex max-w-3xl flex-col items-center">
              <p className="mb-6 text-xs uppercase tracking-[0.18em] text-white/40">
                Frontier model field tests
              </p>
              <h1 className="text-[2.7rem] leading-[0.96] font-semibold tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
                FRONTIER MODELS.<br />REAL TASKS.
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
                We test frontier coding models on the same real software tasks,
                then publish the working builds and complete evidence—not benchmark scores.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <Link
                  className="flex items-center gap-3 bg-[#efefea] px-5 py-4 text-sm text-[#101010] transition-colors hover:bg-white"
                  href="#benchmark-gallery-title"
                >
                  Explore the tasks <ArrowIcon />
                </Link>
                <Link
                  className="flex items-center gap-3 px-2 py-3 text-sm text-white/68 transition-colors hover:text-white"
                  href="#protocol-title"
                >
                  Read the method <ArrowIcon />
                </Link>
              </div>
            </div>

          </div>
        </header>

        <section className="glass-section border-b border-white/15 p-4 sm:p-6 lg:p-8" aria-labelledby="benchmark-gallery-title">
          <div className="reveal mb-10 flex flex-col items-center gap-7 text-center">
            <div className="flex flex-col items-center">
              <p className="mb-3 text-xs uppercase tracking-[0.18em] text-white/40">Initial task set / v0.1</p>
              <h2 id="benchmark-gallery-title" className="text-5xl leading-none font-semibold sm:text-6xl">
                Task gallery
              </h2>
            </div>
            <div className="flex flex-wrap justify-center gap-2" aria-label="Filter tasks">
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
            {visibleBenchmarks.map((benchmark, index) => {
              const cardContent = (
                <>
                <div className="relative aspect-[16/9] overflow-hidden border-b border-white/12 bg-[#111]">
                  <BenchmarkPreview type={benchmark.preview} />
                  <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/0" />
                  <span className="absolute top-4 left-4 border border-black/15 bg-black/75 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-white/65 backdrop-blur-md">
                    {benchmark.category}
                  </span>
                  <p className="absolute inset-0 flex items-center justify-center px-8 text-center text-2xl font-medium tracking-[-0.035em] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.65)] sm:text-3xl">
                    {benchmark.shortTitle}
                  </p>
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
                      {benchmark.href ? (benchmark.cta ?? "View 12 runs") : "Spec soon"} <ArrowIcon />
                    </span>
                  </div>
                </div>
                </>
              );
              const className = "glass-card reveal group block border border-white/15 transition-colors hover:border-white/30";
              const style = { animationDelay: `${90 + index * 65}ms` };

              return benchmark.href ? (
                <Link className={className} href={benchmark.href} id={benchmark.id} key={benchmark.id} style={style}>
                  {cardContent}
                </Link>
              ) : (
                <article className={className} id={benchmark.id} key={benchmark.id} style={style}>
                  {cardContent}
                </article>
              );
            })}
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
                ["01", "Versioned input", "Every model receives the same immutable task version: the exact Markdown brief, starter repository, supplied assets, dependency lockfile, and acceptance commands. The task hash changes whenever any of those inputs change."],
                ["02", "Controlled environment", "Runs start from a fresh isolated copy with network access disabled, protected benchmark files locked, and identical execution limits. Models can edit the application source, but cannot change the rules used to judge it."],
                ["03", "Reasoning levels", "Each model is tested independently at low, medium, and high reasoning effort. Model identity and reasoning effort are recorded with the run so visual quality, reliability, time, and token usage can be compared without mixing configurations."],
                ["04", "Automated verification", "A model response is not considered a pass by itself. The generated project must compile, produce the expected artifacts, preserve protected files, contain meaningful source changes, and pass any task-specific functional checks."],
                ["05", "Failures and reruns", "Failed output remains part of the evidence and is never manually repaired. A rerun receives a new attempt number and a clean workspace, allowing a successful retry to be published without rewriting the original failure."],
                ["06", "Published evidence", "Every result records its task and prompt hashes, model configuration, duration, token usage, changed files, build outcome, and final source snapshot. Passing builds are published as interactive previews beside that evidence."],
              ].map(([number, title, description], index) => (
                <div className="glass-row reveal grid gap-3 border-b border-white/15 px-4 py-6 sm:grid-cols-[2.5rem_0.42fr_1fr] sm:gap-5 sm:px-5" key={title} style={{ animationDelay: `${120 + index * 60}ms` }}>
                  <span className="text-xs text-white/25">{number}</span>
                  <h3 className="text-lg text-white/80">{title}</h3>
                  <p className="max-w-3xl text-sm leading-6 text-white/48">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="glass-section mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-white/15 p-4 text-sm text-white/45 sm:p-6 lg:p-8">
          <p>Mehdi K / Coding model field tests</p>
          <p>Transparent tests. Complete evidence.</p>
        </footer>
      </div>
    </main>
  );
}
