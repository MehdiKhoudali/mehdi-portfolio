import Image from "next/image";

export function NewsletterButton({ className = "" }: { className?: string }) {
  return (
    <a className={`raised-button ${className}`} href="https://mehdikhoudali.substack.com/" target="_blank" rel="noopener noreferrer">
      <Image src="/substack.svg" alt="" aria-hidden="true" width={22} height={22} />
      <span>Join my newsletter</span>
    </a>
  );
}
