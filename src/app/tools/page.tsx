import type { Metadata } from "next";
import { CodingBenchmarks } from "@/components/coding-benchmarks";

export const metadata: Metadata = {
  title: "Coding Benchmarks - Mehdi Khoudali",
  description:
    "A transparent gallery comparing how AI coding agents build interactive software from the same briefs.",
};

export default function ToolsPage() {
  return <CodingBenchmarks />;
}
