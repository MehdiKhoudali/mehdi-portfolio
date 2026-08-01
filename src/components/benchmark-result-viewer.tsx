"use client";

import { useMemo, useState } from "react";
import type { BenchmarkEffort, BenchmarkModel, PublishedBenchmarkResult } from "@/lib/benchmark-results";

type ViewMode = "single" | "compare";

const reasoningOrder: BenchmarkEffort[] = ["Low", "Medium", "High"];

function formatDuration(durationMs: number) {
  const seconds = Math.round(durationMs / 1000);
  return `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, "0")}s`;
}

function formatTokens(tokens: number) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(tokens);
}

function ResultFrame({ result, taskTitle, compact = false }: { result: PublishedBenchmarkResult; taskTitle: string; compact?: boolean }) {
  const passed = result.status === "Passed";

  return (
    <article className="flex min-w-0 flex-col overflow-hidden border border-white/15 bg-[#0a0a0a]">
      <div className="flex min-h-14 flex-wrap items-center gap-x-3 gap-y-2 border-b border-white/12 px-3 py-3 sm:px-4">
        <span className={`size-2 rounded-full ${passed ? "bg-[#9ee4b3] shadow-[0_0_14px_rgba(158,228,179,0.45)]" : "bg-[#f39b86] shadow-[0_0_14px_rgba(243,155,134,0.35)]"}`} />
        <strong className="text-sm font-medium text-white/88">{result.label}</strong>
        <span className="text-xs text-white/35">{result.model}</span>
        <span className="border border-white/12 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-white/42">
          {result.effort === "Default" ? "Default profile" : `${result.effort} reasoning`}
        </span>
        <span className={`ml-auto border px-2 py-1 text-[10px] uppercase tracking-[0.14em] ${passed ? "border-[#9ee4b3]/20 bg-[#9ee4b3]/8 text-[#b5ecc5]" : "border-[#f39b86]/25 bg-[#f39b86]/8 text-[#ffc0b1]"}`}>
          {result.status}
        </span>
        {result.previewUrl && (
          <a
            className="border border-white/14 px-3 py-1.5 text-[11px] text-white/62 transition-colors hover:border-white/35 hover:bg-white hover:text-black"
            href={result.previewUrl}
            target="_blank"
            rel="noreferrer"
          >
            Open build
          </a>
        )}
      </div>
      {result.previewUrl ? (
        <iframe
          className={`w-full border-0 bg-white ${compact ? "h-[34rem]" : "h-[68vh] min-h-[34rem] max-h-[54rem]"}`}
          src={result.previewUrl}
          title={`${result.label} ${result.effort.toLowerCase()} reasoning result for the ${taskTitle} task`}
          sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        />
      ) : (
        <div className={`flex w-full items-center justify-center bg-[#0d0b0b] p-8 ${compact ? "h-[34rem]" : "h-[68vh] min-h-[34rem] max-h-[54rem]"}`}>
          <div className="max-w-xl border border-[#f39b86]/20 bg-[#f39b86]/[0.035] p-6 sm:p-8">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#f39b86]/70">Build did not pass</p>
            <h3 className="mt-4 text-2xl font-medium tracking-[-0.025em] text-white/88">No preview was published.</h3>
            <p className="mt-4 text-sm leading-6 text-white/48">{result.failureReason ?? "The generated implementation failed the production acceptance checks."}</p>
          </div>
        </div>
      )}
    </article>
  );
}

export function BenchmarkResultViewer({ results, taskTitle = "benchmark" }: { results: PublishedBenchmarkResult[]; taskTitle?: string }) {
  const initial =
    results.find((result) => result.effort === "Default" && result.status === "Passed") ??
    results.find((result) => result.effort === "Medium" && result.status === "Passed") ??
    results[0];
  const [selectedModel, setSelectedModel] = useState<BenchmarkModel>(initial.modelKey);
  const [selectedEffort, setSelectedEffort] = useState<BenchmarkEffort>("Medium");
  const [viewMode, setViewMode] = useState<ViewMode>("single");
  const models = useMemo(
    () => results.filter((result, index) => results.findIndex((candidate) => candidate.modelKey === result.modelKey) === index),
    [results],
  );
  const selectedModelResult = models.find((result) => result.modelKey === selectedModel) ?? models[0];
  const selectedUsesReasoning = selectedModelResult.effort !== "Default";
  const selected =
    results.find(
      (result) =>
        result.modelKey === selectedModel &&
        result.effort === (selectedUsesReasoning ? selectedEffort : "Default"),
    ) ?? selectedModelResult;
  const comparisonResults = models.map((model) => {
    const effort = model.effort === "Default" ? "Default" : selectedEffort;
    return results.find((result) => result.modelKey === model.modelKey && result.effort === effort) ?? model;
  });

  return (
    <div>
      <div className="border-y border-white/15 bg-black/20 p-3 sm:p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div
            className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Model results"
          >
            {models.map((result, index) => (
              <button
                className={`min-w-40 border px-4 py-3 text-left transition-colors ${
                  selectedModel === result.modelKey && viewMode === "single"
                    ? "border-white/45 bg-white text-black"
                    : "border-white/14 bg-white/[0.025] text-white/60 hover:border-white/30 hover:text-white"
                }`}
                key={result.modelKey}
                onClick={() => {
                  setSelectedModel(result.modelKey);
                  setViewMode("single");
                }}
                role="tab"
                aria-selected={selectedModel === result.modelKey}
                type="button"
              >
                <span className="block text-[10px] uppercase tracking-[0.16em] opacity-55">0{index + 1} / {result.provider ?? "GPT-5.6"}</span>
                <span className="mt-1 block text-sm font-medium">{result.label}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            {selectedUsesReasoning && (
              <div>
                <span className="mb-2 block text-[9px] uppercase tracking-[0.16em] text-white/30">Reasoning</span>
                <div className="flex border border-white/14 p-1 text-xs" aria-label="Reasoning level">
                  {reasoningOrder.map((effort) => (
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
            )}
            <div className="grid w-full shrink-0 grid-cols-2 border border-white/14 p-1 text-xs sm:w-60">
              <button
                className={`whitespace-nowrap px-4 py-2 transition-colors ${viewMode === "single" ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
                onClick={() => setViewMode("single")}
                type="button"
                aria-pressed={viewMode === "single"}
              >
                Focus
              </button>
              <button
                className={`whitespace-nowrap px-4 py-2 transition-colors ${viewMode === "compare" ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
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
            <ResultFrame result={selected} taskTitle={taskTitle} />
            <section className="mt-3 grid border border-white/15 bg-white/[0.018] lg:grid-cols-[1fr_1.35fr]" aria-label={`${selected.label} ${selected.effort} run evidence`}>
              <div className="grid grid-cols-2 border-b border-white/12 sm:grid-cols-3 lg:border-r lg:border-b-0">
                {[
                  ["Duration", formatDuration(selected.durationMs)],
                  ["Output", formatTokens(selected.outputTokens)],
                  ["Reasoning", formatTokens(selected.reasoningTokens)],
                  ["Total input", formatTokens(selected.inputTokens)],
                  ["Cached input", formatTokens(selected.cachedInputTokens)],
                  ["Uncached input", formatTokens(Math.max(0, selected.inputTokens - selected.cachedInputTokens))],
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
                  <span className="border border-white/12 px-2 py-1">{selected.effort === "Default" ? "Default profile" : `${selected.effort} effort`}</span>
                  <span className="border border-white/12 px-2 py-1">{selected.changedFiles ?? 2} files changed</span>
                </div>
                <p className="mt-5 max-w-3xl text-sm leading-6 text-white/55">{selected.summary}</p>
              </div>
            </section>
          </>
        ) : (
          <div className="grid gap-3 xl:grid-cols-3">
            {comparisonResults.map((result) => <ResultFrame compact key={result.id} result={result} taskTitle={taskTitle} />)}
          </div>
        )}
      </div>
    </div>
  );
}
