"use client";

import { useState } from "react";
import type { BenchmarkEffort, BenchmarkModel, PublishedBenchmarkResult } from "@/lib/benchmark-results";

type ViewMode = "single" | "compare";

const efforts: BenchmarkEffort[] = ["Low", "Medium", "High"];

function formatDuration(durationMs: number) {
  const seconds = Math.round(durationMs / 1000);
  return `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, "0")}s`;
}

function formatTokens(tokens: number) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(tokens);
}

function ResultFrame({ result, compact = false }: { result: PublishedBenchmarkResult; compact?: boolean }) {
  return (
    <article className="flex min-w-0 flex-col overflow-hidden border border-white/15 bg-[#0a0a0a]">
      <div className="flex min-h-14 flex-wrap items-center gap-x-3 gap-y-2 border-b border-white/12 px-3 py-3 sm:px-4">
        <span className="size-2 rounded-full bg-[#9ee4b3] shadow-[0_0_14px_rgba(158,228,179,0.45)]" />
        <strong className="text-sm font-medium text-white/88">{result.label}</strong>
        <span className="text-xs text-white/35">{result.model}</span>
        <span className="border border-white/12 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-white/42">
          {result.effort} reasoning
        </span>
        <span className="ml-auto border border-[#9ee4b3]/20 bg-[#9ee4b3]/8 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[#b5ecc5]">
          {result.status}
        </span>
        <a
          className="border border-white/14 px-3 py-1.5 text-[11px] text-white/62 transition-colors hover:border-white/35 hover:bg-white hover:text-black"
          href={result.previewUrl}
          target="_blank"
          rel="noreferrer"
        >
          Open build
        </a>
      </div>
      <iframe
        className={`w-full border-0 bg-white ${compact ? "h-[34rem]" : "h-[68vh] min-h-[34rem] max-h-[54rem]"}`}
        src={result.previewUrl}
        title={`${result.label} ${result.effort.toLowerCase()} reasoning result for the SaaS landing page task`}
        sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
      />
    </article>
  );
}

export function BenchmarkResultViewer({ results }: { results: PublishedBenchmarkResult[] }) {
  const initial = results.find((result) => result.effort === "Medium") ?? results[0];
  const [selectedModel, setSelectedModel] = useState<BenchmarkModel>(initial.modelKey);
  const [selectedEffort, setSelectedEffort] = useState<BenchmarkEffort>(initial.effort);
  const [viewMode, setViewMode] = useState<ViewMode>("single");
  const effortResults = results.filter((result) => result.effort === selectedEffort);
  const selected = effortResults.find((result) => result.modelKey === selectedModel) ?? effortResults[0];

  return (
    <div>
      <div className="border-y border-white/15 bg-black/20 p-3 sm:p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div
            className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Model results"
          >
            {effortResults.map((result, index) => (
              <button
                className={`min-w-40 border px-4 py-3 text-left transition-colors ${
                  selectedModel === result.modelKey && viewMode === "single"
                    ? "border-white/45 bg-white text-black"
                    : "border-white/14 bg-white/[0.025] text-white/60 hover:border-white/30 hover:text-white"
                }`}
                key={result.id}
                onClick={() => {
                  setSelectedModel(result.modelKey);
                  setViewMode("single");
                }}
                role="tab"
                aria-selected={selectedModel === result.modelKey}
                type="button"
              >
                <span className="block text-[10px] uppercase tracking-[0.16em] opacity-55">0{index + 1} / GPT-5.6</span>
                <span className="mt-1 block text-sm font-medium">{result.label}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div>
              <span className="mb-2 block text-[9px] uppercase tracking-[0.16em] text-white/30">Reasoning effort</span>
              <div className="flex border border-white/14 p-1 text-xs" aria-label="Reasoning effort">
                {efforts.map((effort) => (
                  <button
                    className={`flex-1 px-4 py-2 transition-colors ${selectedEffort === effort ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
                    key={effort}
                    onClick={() => setSelectedEffort(effort)}
                    type="button"
                    aria-pressed={selectedEffort === effort}
                  >
                    {effort}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 border border-white/14 p-1 text-xs">
              <button
                className={`flex-1 px-4 py-2 transition-colors ${viewMode === "single" ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
                onClick={() => setViewMode("single")}
                type="button"
                aria-pressed={viewMode === "single"}
              >
                Focus
              </button>
              <button
                className={`flex-1 px-4 py-2 transition-colors ${viewMode === "compare" ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
                onClick={() => setViewMode("compare")}
                type="button"
                aria-pressed={viewMode === "compare"}
              >
                Compare all
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 lg:p-6">
        {viewMode === "single" ? (
          <>
            <ResultFrame result={selected} />
            <section className="mt-3 grid border border-white/15 bg-white/[0.018] lg:grid-cols-[1fr_1.35fr]" aria-label={`${selected.label} ${selected.effort} run evidence`}>
              <div className="grid grid-cols-2 border-b border-white/12 sm:grid-cols-3 lg:border-r lg:border-b-0">
                {[
                  ["Duration", formatDuration(selected.durationMs)],
                  ["Output", formatTokens(selected.outputTokens)],
                  ["Reasoning", formatTokens(selected.reasoningTokens)],
                  ["Total input", formatTokens(selected.inputTokens)],
                  ["Cached input", formatTokens(selected.cachedInputTokens)],
                  ["Uncached input", formatTokens(selected.inputTokens - selected.cachedInputTokens)],
                ].map(([label, value]) => (
                  <div className="border-r border-b border-white/10 p-4" key={label}>
                    <span className="text-[10px] uppercase tracking-[0.16em] text-white/30">{label}</span>
                    <strong className="mt-2 block text-xl font-medium text-white/82">{value}</strong>
                  </div>
                ))}
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.14em] text-white/42">
                  <span className="border border-white/12 px-2 py-1">Attempt {selected.attempt}</span>
                  <span className="border border-white/12 px-2 py-1">{selected.effort} effort</span>
                  <span className="border border-white/12 px-2 py-1">2 files changed</span>
                </div>
                <p className="mt-5 max-w-3xl text-sm leading-6 text-white/55">{selected.summary}</p>
              </div>
            </section>
          </>
        ) : (
          <div className="grid gap-3 xl:grid-cols-3">
            {effortResults.map((result) => <ResultFrame compact key={result.id} result={result} />)}
          </div>
        )}
      </div>
    </div>
  );
}
