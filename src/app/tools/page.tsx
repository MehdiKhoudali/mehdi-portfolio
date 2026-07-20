import type { Metadata } from "next";
import { CodingBenchmarks } from "@/components/coding-benchmarks";

export const metadata: Metadata = {
  title: "Coding Models on Real Software Tasks - Mehdi Khoudali",
  description:
    "See how coding models build real interfaces, dashboards, visualizations, and games from the same briefs.",
};

export default function ToolsPage() {
  return <CodingBenchmarks />;
}
