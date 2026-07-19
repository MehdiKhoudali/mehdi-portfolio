import type { Metadata } from "next";
import Link from "next/link";
import { BenchmarkResultViewer } from "@/components/benchmark-result-viewer";
import { saasLandingResults, saasLandingTask } from "@/lib/benchmark-results";

export const metadata: Metadata = {
  title: "SaaS Landing Page — Coding Model Field Test",
  description: "Compare how GPT-5.6 Luna, Terra, and Sol built the same SaaS landing page task.",
};

export default function SaasLandingPageBenchmark() {
  return (
    <main className="grain min-h-screen bg-[#070707] text-[#efefea]">
      <div className="glass-shell flex min-h-screen w-full flex-col border-white/15">
        <header className="glass-section border-b border-white/15 px-4 sm:px-6 lg:px-8">
          <nav aria-label="Benchmark navigation" className="flex items-center justify-between border-b border-white/15 py-5 text-sm text-white/55 sm:py-6">
            <Link className="transition-colors hover:text-white/85" href="/tools">Back to tasks</Link>
            <Link className="transition-colors hover:text-white/85" href="/">Mehdi.K</Link>
          </nav>
          <div className="grid gap-10 py-10 sm:py-14 lg:grid-cols-[1.25fr_0.75fr] lg:items-end lg:py-16">
            <div>
              <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.17em] text-white/38">
                <span>Real task / {saasLandingTask.version}</span>
                <span className="h-px w-8 bg-white/20" />
                <span>Attempt 01</span>
              </div>
              <h1 className="mt-6 max-w-4xl text-5xl leading-[0.92] font-semibold tracking-[-0.045em] text-white sm:text-7xl lg:text-[5.25rem]">
                {saasLandingTask.title}
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-white/52 sm:text-lg sm:leading-8">{saasLandingTask.description}</p>
            </div>
            <div className="grid grid-cols-3 border border-white/15 bg-white/[0.02]">
              <div className="border-r border-white/12 p-4 sm:p-5"><span className="text-[10px] uppercase tracking-[0.14em] text-white/30">Models</span><strong className="mt-2 block text-2xl text-white/80">03</strong></div>
              <div className="border-r border-white/12 p-4 sm:p-5"><span className="text-[10px] uppercase tracking-[0.14em] text-white/30">Passed</span><strong className="mt-2 block text-2xl text-[#b5ecc5]">03</strong></div>
              <div className="p-4 sm:p-5"><span className="text-[10px] uppercase tracking-[0.14em] text-white/30">Effort</span><strong className="mt-2 block text-base text-white/80">Medium</strong></div>
            </div>
          </div>
        </header>

        <section className="glass-section border-b border-white/15" aria-label="Published model results">
          <BenchmarkResultViewer results={saasLandingResults} />
        </section>

        <section className="glass-section grid gap-10 border-b border-white/15 p-5 sm:p-7 lg:grid-cols-[0.55fr_1fr] lg:p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/35">The shared brief</p>
            <h2 className="mt-4 text-4xl leading-none font-semibold tracking-[-0.035em] sm:text-5xl">Same input.<br />Different decisions.</h2>
          </div>
          <div className="border-t border-white/15">
            {saasLandingTask.requirements.map((requirement, index) => (
              <div className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-white/12 py-4 text-sm" key={requirement}>
                <span className="text-white/25">0{index + 1}</span>
                <span className="text-white/58">{requirement}</span>
              </div>
            ))}
          </div>
        </section>

        <footer className="glass-section mt-auto flex flex-wrap items-center justify-between gap-4 p-5 text-sm text-white/40 sm:p-7 lg:p-8">
          <p>Mehdi K / Coding model field tests</p>
          <Link className="text-white/65 transition-colors hover:text-white" href="/tools">Explore all tasks</Link>
        </footer>
      </div>
    </main>
  );
}
