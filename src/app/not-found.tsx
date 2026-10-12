import Link from "next/link";

export default function NotFound() {
  return (
    <main className="detail-page">
      <header className="detail-intro">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p className="detail-summary">This page may have moved or no longer exists.</p>
        <Link className="quiet-link visit-link" href="/" prefetch={false}>Back to homepage</Link>
      </header>
    </main>
  );
}
