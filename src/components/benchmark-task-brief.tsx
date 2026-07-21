import type { ReactNode } from "react";

function renderInline(text: string) {
  return text
    .split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong className="font-medium text-white/82" key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
      }

      if (part.startsWith("`") && part.endsWith("`")) {
        return <code className="border border-white/12 bg-white/[0.045] px-1.5 py-0.5 text-[0.9em] text-white/72" key={`${part}-${index}`}>{part.slice(1, -1)}</code>;
      }

      return part;
    });
}

function renderMarkdown(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line) {
      index += 1;
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const className = level === 1
        ? "pt-3 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl"
        : level === 2
          ? "pt-5 text-2xl font-medium tracking-[-0.025em] text-white/88 sm:text-3xl"
          : "pt-4 text-lg font-medium text-white/82 sm:text-xl";
      blocks.push(<h3 className={className} key={`heading-${index}`}>{renderInline(heading[2])}</h3>);
      index += 1;
      continue;
    }

    if (/^\s*-\s+/.test(lines[index])) {
      const items: string[] = [];
      while (index < lines.length && /^\s*-\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*-\s+/, "").trim());
        index += 1;
      }
      blocks.push(
        <ul className="grid gap-2.5 border-l border-white/14 pl-5 text-sm leading-6 text-white/55 sm:text-base sm:leading-7" key={`list-${index}`}>
          {items.map((item, itemIndex) => <li className="relative before:absolute before:-left-[1.34rem] before:top-[0.72rem] before:size-1 before:bg-white/35" key={`${item}-${itemIndex}`}>{renderInline(item)}</li>)}
        </ul>,
      );
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      blocks.push(
        <ol className="grid gap-2.5 text-sm leading-6 text-white/55 sm:text-base sm:leading-7" key={`ordered-${index}`}>
          {items.map((item, itemIndex) => (
            <li className="grid grid-cols-[2rem_1fr] gap-3" key={`${item}-${itemIndex}`}>
              <span className="text-white/28">{String(itemIndex + 1).padStart(2, "0")}</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    const paragraph: string[] = [];
    while (
      index < lines.length
      && lines[index].trim()
      && !/^(#{1,3})\s+/.test(lines[index].trim())
      && !/^\s*-\s+/.test(lines[index])
      && !/^\d+\.\s+/.test(lines[index].trim())
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push(<p className="text-sm leading-6 text-white/55 sm:text-base sm:leading-7" key={`paragraph-${index}`}>{renderInline(paragraph.join(" "))}</p>);
  }

  return blocks;
}

export function BenchmarkTaskBrief({ markdown, downloadUrl }: { markdown: string; downloadUrl: string }) {
  return (
    <section className="glass-section border-b border-white/15 p-5 sm:p-7 lg:p-10" aria-labelledby="task-instructions-title">
      <div className="grid gap-8 lg:grid-cols-[0.55fr_1fr] lg:gap-10">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-white/35">Canonical input</p>
          <h2 id="task-instructions-title" className="mt-4 text-4xl leading-none font-semibold tracking-[-0.035em] sm:text-5xl">Task instructions</h2>
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/45">The exact versioned Markdown brief given to every model in this comparison.</p>
          <a className="mt-7 inline-flex items-center gap-3 border border-white/18 px-4 py-3 text-sm text-white/68 transition-colors hover:border-white/40 hover:bg-white hover:text-black" download href={downloadUrl}>
            Download task.md
            <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 20 20">
              <path d="M10 3v10m0 0 4-4m-4 4L6 9M4 16h12" stroke="currentColor" strokeWidth="1.35" />
            </svg>
          </a>
        </div>
        <article className="grid gap-5 border-t border-white/18 pt-6">
          {renderMarkdown(markdown)}
        </article>
      </div>
    </section>
  );
}
