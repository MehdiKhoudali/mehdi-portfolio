import Image from "next/image";
import styles from "./author-intro.module.css";

export function AuthorIntro() {
  return (
    <section className={styles.about} aria-labelledby="about-title">
      <div className={styles.portrait}>
        <Image
          src="/mehdi-portrait.jpg"
          alt="Mehdi Khoudali"
          fill
          sizes="(max-width: 639px) 80px, 300px"
          className={styles.portraitImage}
        />
      </div>
      <div className={styles.aboutCopy}>
        <div className={styles.aboutHeading}>
          <p className={styles.sectionLabel}>About me</p>
          <h2 id="about-title" className="portfolio-serif">Hi, I&apos;m Mehdi.</h2>
        </div>
        <p>I&apos;m a <strong>software engineer</strong> based in Casablanca. I build and ship web products, staying close to both the product and the people using it.</p>
        <p>I&apos;ve founded products and scaled FeedbackLoop to 700 users. That experience keeps me focused on building software that is clear, useful, and reliable.</p>
        <a href="https://mehdikhoudali.substack.com/" target="_blank" rel="noopener noreferrer" className={`${styles.button} ${styles.aboutLink}`}>Join my newsletter</a>
      </div>
    </section>
  );
}
