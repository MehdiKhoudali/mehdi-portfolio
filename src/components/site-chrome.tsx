import Image from "next/image";
import Link from "next/link";
import styles from "@/app/home.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Link prefetch={false} className={styles.identity} href="/" aria-label="Mehdi Khoudali — home">
        <div className={styles.portraitFrame}>
          <Image className={styles.portrait} src="/mehdi-portrait.jpg" alt="" width={400} height={400} sizes="(max-width: 600px) 140px, 190px" priority />
        </div>
        <div>
          <p className={styles.name}>Mehdi Khoudali</p>
          <p className={styles.role}>Software engineer &amp; founder</p>
        </div>
      </Link>
      <p className={styles.location}>Casablanca</p>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link prefetch={false} href="/">Mehdi Khoudali</Link>
      <div>
        <a href="mailto:mehdikhoudalpro@gmail.com">Say hello</a>
        <a href="https://x.com/mehdi_khoudali" target="_blank" rel="noopener noreferrer">X</a>
        <a href="https://www.instagram.com/mehdi_khoudali/" target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
    </footer>
  );
}
