import type { Metadata } from "next";
import Onboarding from "./onboarding";
import styles from "./ugc.module.css";

export const metadata: Metadata = {
  title: "1,700 UGC Videos | Mehdi Khoudali",
  description: "Get the free list of 1,700 UGC videos.",
  alternates: { canonical: "/ugc-library" },
  openGraph: {
    title: "1,700 UGC Videos",
    description: "Get the free list of 1,700 UGC videos.",
    url: "/ugc-library",
  },
  twitter: {
    title: "1,700 UGC Videos",
    description: "Get the free list of 1,700 UGC videos.",
  },
};

export default function UgcLibraryPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <Onboarding />
      </div>
    </main>
  );
}
