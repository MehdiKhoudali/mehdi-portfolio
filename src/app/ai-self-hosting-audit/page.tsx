import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Free AI & Self-Hosting Audit | Mehdi Khoudali",
  description: "A free audit call to find practical AI opportunities, reduce software costs, and identify infrastructure your business can own.",
};
const auditUrl = "https://calendly.com/mehdikhoudali/process-audit";
const deliverables = [
  { title: "Cost review", copy: "We identify the tools, cloud services, and manual processes that cost your business the most." },
  { title: "AI opportunities", copy: "You get a shortlist of business tasks that are practical to automate with AI now." },
  { title: "Self-hosting options", copy: "We decide which services could be self-hosted, what they could save, and whether the maintenance is worth it." },
  { title: "Action plan", copy: "You leave with the next steps ordered by impact, cost, and implementation effort." },
];

export default function AiSelfHostingAuditPage() {
  return (
    <main>
      <section className="audit-hero" aria-labelledby="audit-title">
        <p className="eyebrow">AI &amp; self-hosting audit</p>
        <h1 id="audit-title">Lower your business costs.<br />Use AI and self-hosting.</h1>
        <p>A free call to understand where AI and self-hosting can lower your business costs.</p>
        <a className="raised-button" href={auditUrl}>Book the free audit</a>
        <p className="audit-note">No pitch. No preparation. Clear next steps.</p>
      </section>
      <section className="detail-section" aria-labelledby="testimonial-title">
        <h2 id="testimonial-title">Client result / Kitt Medical</h2>
        <blockquote className="prose">
          They helped us execute major platform migrations and develop the core systems behind training, certification, medication readiness and multi-venue operations. What stands out is their ability to combine deep engineering capability with strong product judgment, turning complex requirements into new functionality.
        </blockquote>
        <div className="testimonial">
          <Image src="/simon-hanassab.png" alt="Dr. Simon Hanassab" width={48} height={48} />
          <div><p>Dr. Simon Hanassab</p><p>CTO, Kitt Medical</p></div>
        </div>
        <dl className="audit-results">
          <div><dt><strong>1000s</strong></dt><dd>Venues across the UK</dd></div>
          <div><dt><strong>50K+</strong></dt><dd>Platform users</dd></div>
        </dl>
      </section>
      <section className="detail-section" aria-labelledby="deliverables-title">
        <h2 id="deliverables-title">Four useful outputs from one call</h2>
        <ul className="plain-list">{deliverables.map((item) => <li key={item.title}><strong>{item.title}.</strong> {item.copy}</li>)}</ul>
      </section>
      <section className="detail-section" aria-labelledby="about-title">
        <h2 id="about-title">I build and operate software products</h2>
        <div className="prose">
          <p>I&apos;m Mehdi Khoudali, a software engineer and startup founder based in Casablanca, Morocco.</p>
          <p>I work on product engineering, automation, and the infrastructure behind software businesses. I use that experience to assess what should be automated, what can be self-hosted, and what should stay as it is.</p>
        </div>
      </section>
      <section className="detail-section" aria-labelledby="booking-title">
        <h2 id="booking-title">A clear action plan</h2>
        <p className="prose">We will identify the most practical ways to reduce costs and improve how your business operates.</p>
        <p className="audit-note" style={{ marginTop: 20 }}>Free 30-minute audit. <a href={auditUrl} className="quiet-link">Book your call</a></p>
      </section>
    </main>
  );
}
