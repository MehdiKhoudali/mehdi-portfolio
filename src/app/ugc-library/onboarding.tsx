"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import styles from "./ugc.module.css";

const choices = {
  role: ["Founder / business owner", "UGC creator", "Marketer", "Agency / freelancer", "Just exploring"],
  industry: ["E-commerce", "SaaS / tech", "Beauty / wellness", "Food / lifestyle", "Education", "Other"],
  teamSize: ["Just me", "2-5", "6-20", "21+"],
  goal: ["Create better content", "Find ad inspiration", "Grow my brand", "Improve client work"],
};
const socialFields = [
  { key: "instagram", label: "Instagram", placeholder: "instagram.com/yourname", hosts: ["instagram.com"] },
  { key: "tiktok", label: "TikTok", placeholder: "tiktok.com/@yourname", hosts: ["tiktok.com"] },
  { key: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/yourname", hosts: ["linkedin.com"] },
  { key: "x", label: "X / Twitter", placeholder: "x.com/yourname", hosts: ["x.com", "twitter.com"] },
] as const;
const titles = ["Your details", "Your work", "Your social links", "Your goals"];
const initialData = {
  name: "", email: "", role: "", projectName: "", projectDescription: "", industry: "", teamSize: "", website: "",
  socialLinks: { instagram: "", tiktok: "", linkedin: "", x: "" }, goal: "", challenge: "",
};

function validateLink(input: HTMLInputElement, hosts?: readonly string[]) {
  input.setCustomValidity("");
  if (!input.value.trim()) return true;
  try {
    const value = input.value.trim();
    const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`);
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || url.port || !url.hostname.includes(".") || (hosts && !hosts.some((host) => url.hostname === host || url.hostname === `www.${host}`))) throw new Error();
    if (url.toString().length > 500) throw new Error();
    return true;
  } catch {
    input.setCustomValidity(hosts ? "Enter a profile URL for this platform, or leave it blank." : "Enter a valid website URL, or leave it blank.");
    return false;
  }
}

export default function Onboarding() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);
  const [data, setData] = useState(initialData);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ libraryUrl: string | null } | null>(null);
  const token = useRef<string | null>(null);
  const websiteTrap = useRef<HTMLInputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const attribution = useRef<Record<string, string> | null>(null);

  useEffect(() => {
    if (started) heading.current?.focus();
  }, [started, step, result]);

  function update(field: keyof typeof initialData, value: string) {
    setData((previous) => ({ ...previous, [field]: value }));
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    for (const input of Array.from(form.querySelectorAll<HTMLInputElement>("input[data-url]"))) {
      const social = socialFields.find((field) => field.key === input.name);
      if (!validateLink(input, social?.hosts)) { input.reportValidity(); return; }
    }
    const empty = Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input[required], textarea[required]")).find((input) => !input.value.trim());
    if (empty) { empty.setCustomValidity("Please fill in this field."); empty.reportValidity(); return; }
    setError("");
    setBusy(true);
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
      if (!url || !key) throw new Error("The form is not connected yet. Please try again later.");
      token.current ??= crypto.randomUUID();
      if (!attribution.current) {
        const params = new URLSearchParams(window.location.search);
        attribution.current = {};
        for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
          const value = params.get(key);
          if (value) attribution.current[key] = value.slice(0, 200);
        }
        if (document.referrer) {
          try { attribution.current.referrer = new URL(document.referrer).origin; } catch { /* Ignore malformed browser metadata. */ }
        }
      }
      const response = await fetch(`${url}/functions/v1/capture-ugc-lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: key },
        body: JSON.stringify({ step, sessionToken: token.current, websiteTrap: websiteTrap.current?.value ?? "", data, attribution: attribution.current, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }),
        signal: AbortSignal.timeout(20_000),
      });
      if (response.status === 429) throw new Error("Too many requests. Please try again later.");
      const saved = await response.json();
      if (!response.ok || saved.ok !== true) throw new Error(response.status === 400 ? saved.error : "Couldn't save your answers. Please try again.");
      if (step === 4) {
        if (saved.completed !== true) throw new Error("Your request isn't complete yet. Please try again.");
        let libraryUrl: string | null = null;
        if (typeof saved.libraryUrl === "string") {
          const parsed = new URL(saved.libraryUrl);
          if (["http:", "https:"].includes(parsed.protocol)) libraryUrl = parsed.href;
        }
        setResult({ libraryUrl });
        token.current = null;
      } else setStep((current) => current + 1);
    } catch (failure) {
      setError(failure instanceof Error && failure.name !== "TypeError" && failure.name !== "TimeoutError" ? failure.message : "Connection interrupted. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  function select(field: keyof typeof choices, label: string) {
    return <label className={styles.field} htmlFor={`lead-${field}`}><span id={`label-${field}`} style={{ color: "inherit", fontSize: "inherit" }}>{label}</span><select id={`lead-${field}`} aria-labelledby={`label-${field}`} name={field} required value={data[field]} onChange={(event) => update(field, event.target.value)}><option value="">Select</option>{choices[field].map((value) => <option key={value}>{value}</option>)}</select></label>;
  }

  if (!started) return (
    <section className={styles.hero}>
      <h1>1,700 UGC videos.<span className="portfolio-serif">All in one list.</span></h1>
      <button className={styles.button} onClick={() => setStarted(true)}>Grab your list now</button>
    </section>
  );

  return (
    <section className={styles.formSection} data-private>
      {result ? (
        <div className={styles.success} role="status">
          <h1 ref={heading} tabIndex={-1}>{result.libraryUrl ? "Your list is ready." : "Request received."}</h1>
          {result.libraryUrl ? <a className={styles.button} href={result.libraryUrl} target="_blank" rel="noopener noreferrer">Open your list</a> : <p>Your details are saved. The list link isn&apos;t available yet.</p>}
          {!result.libraryUrl && <Link href="/" className={styles.button}>Back to website</Link>}
        </div>
      ) : (
        <form onSubmit={submit} className="ph-no-capture" data-ph-no-capture="true">
          <div className={styles.formHeading}>
            <div className={styles.stepStatus}><span>Step {step} of 4</span><span>{step === 1 ? "Details" : step === 2 ? "Work" : step === 3 ? "Socials" : "Goals"}</span></div>
            <div className={styles.progress} role="progressbar" aria-label="Onboarding progress" aria-valuemin={0} aria-valuemax={4} aria-valuenow={step - 1} aria-valuetext={`Step ${step} of 4`}><span style={{ width: `${(step - 1) * 25}%` }} /></div>
            <h1 ref={heading} tabIndex={-1}>{titles[step - 1]}</h1>
            <p>{step === 3 ? "Share any profiles you like, or skip this step." : "All fields required unless marked optional."}</p>
          </div>
          <div className={styles.honeypot} aria-hidden="true"><label htmlFor="website-trap">Leave empty</label><input ref={websiteTrap} id="website-trap" name="websiteTrap" tabIndex={-1} autoComplete="off" /></div>
          <fieldset disabled={busy} className={styles.fields}>
            <legend className={styles.srOnly}>{titles[step - 1]}</legend>
            {step === 1 && <>
              <label className={styles.field} htmlFor="lead-name">Name<input id="lead-name" name="name" autoComplete="name" required maxLength={100} value={data.name} onChange={(event) => { event.target.setCustomValidity(""); update("name", event.target.value); }} /></label>
              <label className={styles.field} htmlFor="lead-email">Email<input id="lead-email" name="email" type="email" autoComplete="email" required maxLength={254} value={data.email} onChange={(event) => update("email", event.target.value)} /></label>
            </>}
            {step === 2 && <>
              {select("role", "Your role")}
              <label className={styles.field} htmlFor="lead-project">Brand or project<input id="lead-project" name="projectName" required maxLength={150} value={data.projectName} onChange={(event) => { event.target.setCustomValidity(""); update("projectName", event.target.value); }} /></label>
              <label className={styles.field} htmlFor="lead-description">What are you working on?<textarea id="lead-description" aria-label="What are you working on?" name="projectDescription" required rows={3} maxLength={1500} value={data.projectDescription} onChange={(event) => { event.target.setCustomValidity(""); update("projectDescription", event.target.value); }} /></label>
              <div className={styles.fieldRow}>{select("industry", "Industry")}{select("teamSize", "Team size")}</div>
              <label className={styles.field} htmlFor="lead-website">Website <span>Optional</span><input id="lead-website" name="website" data-url inputMode="url" autoComplete="url" placeholder="yourbrand.com" maxLength={500} value={data.website} onBlur={(event) => validateLink(event.target)} onChange={(event) => { event.target.setCustomValidity(""); update("website", event.target.value); }} /></label>
            </>}
            {step === 3 && socialFields.map((social) => <label className={styles.field} key={social.key} htmlFor={`lead-${social.key}`}>{social.label} <span>Optional</span><input id={`lead-${social.key}`} name={social.key} data-url inputMode="url" autoCapitalize="none" spellCheck={false} placeholder={social.placeholder} maxLength={500} value={data.socialLinks[social.key]} onBlur={(event) => validateLink(event.target, social.hosts)} onChange={(event) => { event.target.setCustomValidity(""); setData((previous) => ({ ...previous, socialLinks: { ...previous.socialLinks, [social.key]: event.target.value } })); setError(""); }} /></label>)}
            {step === 4 && <>
              {select("goal", "Your main goal")}
              <label className={styles.field} htmlFor="lead-challenge">Your biggest content challenge<textarea id="lead-challenge" aria-label="Your biggest content challenge" name="challenge" required rows={3} maxLength={1500} value={data.challenge} onChange={(event) => { event.target.setCustomValidity(""); update("challenge", event.target.value); }} /></label>
            </>}
          </fieldset>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <div className={styles.actions}><button type="submit" className={styles.button} disabled={busy}>{busy ? "Saving..." : step === 4 ? "Get my list" : step === 3 && Object.values(data.socialLinks).every((value) => !value.trim()) ? "Skip this step" : "Continue"}</button></div>
        </form>
      )}
    </section>
  );
}
