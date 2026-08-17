import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free AI & Self-Hosting Audit | Mehdi Khoudali",
  description:
    "A free audit call to find practical AI opportunities, reduce software costs, and identify infrastructure your business can own.",
};

const auditEmail =
  "mailto:mehdikhoudalpro@gmail.com?subject=AI%20%26%20Self-Hosting%20Audit&body=Hi%20Mehdi%2C%0A%0AI%27d%20like%20to%20book%20a%20free%20AI%20%26%20self-hosting%20audit.%0A%0ACompany%3A%0ABiggest%20current%20cost%20or%20bottleneck%3A%0A";

const deliverables = [
  {
    number: "01",
    title: "Cost review",
    copy: "We identify the tools, cloud services, and manual processes that cost your business the most.",
  },
  {
    number: "02",
    title: "AI opportunities",
    copy: "You get a shortlist of business tasks that are practical to automate with AI now.",
  },
  {
    number: "03",
    title: "Self-hosting options",
    copy: "We decide which services could be self-hosted, what they could save, and whether the maintenance is worth it.",
  },
  {
    number: "04",
    title: "Action plan",
    copy: "You leave with the next steps ordered by impact, cost, and implementation effort.",
  },
];

function ArrowUpRight() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        d="M4 12 12 4M5 4h7v7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function AiSelfHostingAuditPage() {
  return (
    <main className="grain min-h-screen bg-[#080808] text-[#efefea]">
      <div className="mx-auto w-full max-w-[1440px] border-x border-white/12">
        <header className="reveal flex h-20 items-center justify-between border-b border-white/12 px-5 sm:px-8 lg:px-12">
          <Link
            className="text-sm font-medium transition-colors hover:text-white/65"
            href="/"
          >
            Mehdi Khoudali
          </Link>
          <p className="text-xs uppercase text-white/38">Free business audit</p>
        </header>

        <section className="relative flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center overflow-hidden px-5 py-16 text-center sm:px-8 sm:py-20 lg:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-[8%] left-[8%] right-[8%] hidden border-x border-white/[0.07] sm:block"
          >
            <div className="absolute top-0 left-0 h-7 w-7 border-t border-l border-[#b7ff5a]/65" />
            <div className="absolute right-0 bottom-0 h-7 w-7 border-r border-b border-[#b7ff5a]/65" />
            <div className="absolute top-1/2 left-0 h-px w-7 bg-white/15" />
            <div className="absolute top-1/2 right-0 h-px w-7 bg-white/15" />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[8%] top-[20%] hidden border-t border-white/[0.05] sm:block"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[8%] bottom-[20%] hidden border-t border-white/[0.05] sm:block"
          />

          <p className="absolute top-[13%] left-[10%] hidden text-left text-[10px] leading-5 uppercase text-white/25 lg:block">
            Input / Current stack
            <br />
            Costs / Manual work
          </p>
          <p className="absolute right-[10%] bottom-[13%] hidden text-right text-[10px] leading-5 uppercase text-white/25 lg:block">
            Output / Clear priorities
            <br />
            Savings / Ownership
          </p>

          <div className="relative z-10 flex max-w-6xl flex-col items-center">
            <div className="reveal reveal-delay-1 flex items-center gap-3 text-xs uppercase text-white/45">
              <span className="h-2 w-2 rounded-full bg-[#b7ff5a] shadow-[0_0_18px_rgba(183,255,90,0.45)]" />
              AI &amp; self-hosting audit
            </div>

            <div className="py-11 sm:py-14">
              <h1 className="reveal reveal-delay-2 text-4xl leading-[0.96] font-semibold tracking-[-0.045em] sm:[font-size:clamp(3.5rem,5vw,5.2rem)]">
                <span className="block text-white/60 sm:whitespace-nowrap">
                  Lower your business costs.
                </span>
                <span className="mt-1 block text-white sm:whitespace-nowrap">
                  Use AI and self-hosting.
                </span>
              </h1>
              <div className="reveal reveal-delay-3 mt-8 flex flex-col items-center gap-7 sm:mt-10">
                <p className="max-w-xl text-base leading-7 text-white/56 sm:text-lg sm:leading-8">
                  A free call to understand where AI and self-hosting can lower
                  your business costs.
                </p>
                <a
                  className="inline-flex items-center gap-5 bg-[#efefea] px-5 py-3 text-xs font-medium uppercase tracking-[0.1em] text-[#080808] transition-colors hover:bg-[#b7ff5a]"
                  href={auditEmail}
                >
                  Book the free audit
                  <ArrowUpRight />
                </a>
              </div>
            </div>

            <div className="reveal reveal-delay-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] uppercase tracking-[0.12em] text-white/28 sm:gap-x-6">
              <span>No pitch</span>
              <span className="h-px w-5 bg-[#b7ff5a]/55" />
              <span>No preparation</span>
              <span className="h-px w-5 bg-[#b7ff5a]/55" />
              <span>Clear next steps</span>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="testimonial-title"
          className="border-t border-white/12 px-5 py-20 sm:px-8 sm:py-24 lg:px-12"
        >
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.32fr_1fr] lg:gap-16">
            <div className="reveal">
              <p
                className="text-xs uppercase text-white/38"
                id="testimonial-title"
              >
                Client result / Kitt Medical
              </p>
              <div className="mt-7 flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/15 grayscale-[0.2]">
                  <Image
                    alt="Dr. Simon Hanassab, CTO at Kitt Medical"
                    className="object-cover saturate-75"
                    fill
                    sizes="48px"
                    src="/simon-hanassab.png"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/90">
                    Dr. Simon Hanassab
                  </p>
                  <p className="mt-0.5 text-xs text-white/40">CTO, Kitt Medical</p>
                </div>
              </div>
              <div className="mt-5 flex gap-1 text-[#b7ff5a]" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, index) => (
                  <svg
                    aria-hidden="true"
                    className="h-3.5 w-3.5 fill-current"
                    key={index}
                    viewBox="0 0 20 20"
                  >
                    <path d="m10 1.5 2.63 5.33 5.88.86-4.25 4.14 1 5.85L10 14.92l-5.26 2.76 1-5.85L1.5 7.69l5.88-.86L10 1.5Z" />
                  </svg>
                ))}
              </div>
            </div>

            <div className="reveal reveal-delay-1">
              <div className="mb-7 h-px w-10 bg-[#b7ff5a]/70" />
              <blockquote className="max-w-3xl text-lg leading-[1.6] tracking-[-0.015em] text-white/62 sm:text-xl">
                They helped us execute{" "}
                <span className="text-[#b7ff5a]">
                  major platform migrations
                </span>{" "}
                and develop the{" "}
                <span className="text-[#b7ff5a]">core systems</span>{" "}
                behind training, certification, medication readiness and
                multi-venue operations. What stands out is their ability to
                combine deep engineering capability with strong{" "}
                <span className="text-[#b7ff5a]">product judgment</span>, turning
                complex requirements into new functionality.
              </blockquote>
              <p className="mt-5 text-[10px] uppercase tracking-[0.12em] text-white/30">
                Kitt Medical
              </p>

              <dl className="mt-10 grid max-w-lg grid-cols-2 border-y border-white/14">
                <div className="py-5">
                  <dt className="text-2xl font-semibold tracking-[-0.035em] text-white">
                  1000s
                  </dt>
                  <dd className="mt-1 text-[10px] uppercase text-white/35">
                    Venues across the UK
                  </dd>
                </div>
                <div className="border-l border-white/14 py-5 pl-5">
                  <dt className="text-2xl font-semibold tracking-[-0.035em] text-white">
                  50K+
                  </dt>
                  <dd className="mt-1 text-[10px] uppercase text-white/35">
                    Platform users
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="deliverables-title"
          className="border-t border-white/12 px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36"
        >
          <div className="reveal mb-14 grid gap-7 lg:grid-cols-[1fr_0.75fr] lg:items-end lg:gap-16">
            <div>
              <p className="mb-5 text-xs uppercase text-white/38">
                What you get
              </p>
              <h2
                className="max-w-3xl text-4xl leading-[1.02] font-semibold tracking-[-0.035em] sm:text-6xl"
                id="deliverables-title"
              >
                Four useful outputs from one call.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-white/50 sm:text-lg sm:leading-8 lg:justify-self-end">
              We review your current setup together. You leave with specific
              opportunities, clear tradeoffs, and a prioritized plan.
            </p>
          </div>

          <div className="grid border-t border-l border-white/14 md:grid-cols-2">
            {deliverables.map((item, index) => (
              <article
                className="reveal flex min-h-64 flex-col justify-between border-r border-b border-white/14 p-6 transition-colors hover:bg-white/[0.025] sm:p-8"
                key={item.number}
                style={{ animationDelay: `${100 + index * 70}ms` }}
              >
                <div className="flex items-center justify-between text-xs uppercase">
                  <span className="text-[#b7ff5a]">{item.number}</span>
                  <span className="text-white/25">Call deliverable</span>
                </div>
                <div className="mt-16 max-w-md">
                  <h3 className="text-2xl font-medium text-white/90 sm:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-white/48">
                    {item.copy}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="about-title"
          className="border-t border-white/12"
        >
          <div className="grid lg:grid-cols-[1fr_0.82fr]">
            <div className="reveal flex flex-col justify-between px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-20">
              <div>
                <p className="mb-5 text-xs uppercase text-white/38">About me</p>
                <h2
                  className="max-w-2xl text-4xl leading-[1.02] font-semibold tracking-[-0.035em] sm:text-6xl"
                  id="about-title"
                >
                  I build and operate software products.
                </h2>
                <div className="mt-8 max-w-2xl space-y-5 text-base leading-7 text-white/52 sm:text-lg sm:leading-8">
                  <p>
                    I&apos;m <span className="text-[#b7ff5a]">Mehdi Khoudali</span>,
                    a <span className="text-[#b7ff5a]">software engineer</span>{" "}
                    and <span className="text-[#b7ff5a]">startup founder</span>{" "}
                    based in Casablanca, Morocco.
                  </p>
                  <p>
                    I work on <span className="text-[#b7ff5a]">product engineering</span>,{" "}
                    <span className="text-[#b7ff5a]">automation</span>, and the
                    <span className="text-[#b7ff5a]"> infrastructure</span> behind
                    software businesses. I use that experience to assess what
                    should be automated, what can be self-hosted, and what
                    should stay as it is.
                  </p>
                </div>
              </div>

              <dl className="mt-16 grid border-t border-white/14 sm:grid-cols-3">
                <div className="border-b border-white/14 py-5 sm:border-r">
                  <dt className="text-[10px] uppercase text-white/28">Role</dt>
                  <dd className="mt-2 text-sm text-white/75">
                    Software engineer
                  </dd>
                </div>
                <div className="border-b border-white/14 py-5 sm:border-r sm:px-5">
                  <dt className="text-[10px] uppercase text-white/28">Work</dt>
                  <dd className="mt-2 text-sm text-white/75">Startup founder</dd>
                </div>
                <div className="border-b border-white/14 py-5 sm:pl-5">
                  <dt className="text-[10px] uppercase text-white/28">Based in</dt>
                  <dd className="mt-2 text-sm text-white/75">
                    Casablanca, Morocco
                  </dd>
                </div>
              </dl>
            </div>

            <div className="reveal relative min-h-[580px] overflow-hidden border-t border-white/12 bg-[#11110f] lg:min-h-[720px] lg:border-t-0 lg:border-l">
              <Image
                alt="Mehdi Khoudali"
                className="object-cover object-[center_68%] contrast-105 saturate-75"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                src="/mehdi-hero.jpeg"
              />
              <div className="absolute inset-0 border-[14px] border-[#080808]/20 sm:border-[22px]" />
              <p className="absolute right-8 bottom-8 bg-[#080808] px-4 py-3 text-[10px] uppercase tracking-[0.12em] text-white/55">
                Mehdi Khoudali / Casablanca
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-white/12 px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="reveal mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.7fr] lg:items-end lg:gap-20">
            <div>
              <p className="mb-5 text-xs uppercase text-white/38">
                Free 30-minute audit
              </p>
              <h2 className="max-w-2xl text-4xl leading-[1] font-semibold tracking-[-0.04em] sm:text-5xl">
                Book a call.
                <br />
                Get a clear action plan.
              </h2>
            </div>

            <div className="flex flex-col items-start gap-6 lg:items-end">
              <p className="max-w-sm text-sm leading-6 text-white/45 lg:text-right">
                We will identify the most practical ways to reduce costs and
                improve how your business operates.
              </p>
              <a
                className="inline-flex items-center gap-8 bg-[#b7ff5a] px-6 py-4 text-sm font-medium text-[#080808] transition-colors hover:bg-[#efefea]"
                href={auditEmail}
              >
                Book the free audit
                <ArrowUpRight />
              </a>
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-3 border-t border-white/12 px-5 py-7 text-xs text-white/38 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p>Mehdi Khoudali / Software engineer</p>
          <a
            className="transition-colors hover:text-white/75"
            href="mailto:mehdikhoudalpro@gmail.com"
          >
            mehdikhoudalpro@gmail.com
          </a>
        </footer>
      </div>
    </main>
  );
}
