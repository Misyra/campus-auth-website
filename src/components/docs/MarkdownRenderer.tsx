import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";
import { cn, slugify } from "@/lib/utils";

type PrismModule = typeof import("prismjs");

const normalize = (l: string) => {
  const v = l.toLowerCase();
  if (v === "js") return "javascript";
  if (v === "ts") return "typescript";
  if (["shell", "sh", "zsh", "terminal"].includes(v)) return "bash";
  if (v === "py") return "python";
  return v;
};

let prismPromise: Promise<PrismModule> | null = null;
const prismLang = new Map<string, Promise<unknown>>();
const loadCore = () => (prismPromise ??= import("prismjs"));
const loaders: Record<string, () => Promise<unknown>> = {
  javascript: () => import("prismjs/components/prism-javascript"),
  typescript: async () => {
    await loadLang("javascript");
    return import("prismjs/components/prism-typescript");
  },
  jsx: async () => {
    await loadLang("javascript");
    return import("prismjs/components/prism-jsx");
  },
  tsx: async () => {
    await loadLang("jsx");
    await loadLang("typescript");
    return import("prismjs/components/prism-tsx");
  },
  bash: () => import("prismjs/components/prism-bash"),
  json: () => import("prismjs/components/prism-json"),
  css: () => import("prismjs/components/prism-css"),
  sql: () => import("prismjs/components/prism-sql"),
  python: () => import("prismjs/components/prism-python"),
  yaml: () => import("prismjs/components/prism-yaml"),
  toml: () => import("prismjs/components/prism-toml"),
};
async function loadLang(lang: string) {
  await loadCore();
  const n = normalize(lang);
  const loader = loaders[n];
  if (!loader) return;
  if (!prismLang.has(n)) prismLang.set(n, loader());
  await prismLang.get(n);
}

function CodeBlock({ className, children }: { className?: string; children: string }) {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const lang = className?.replace("language-", "") ?? "text";
  useEffect(() => {
    let alive = true;
    const el = ref.current;
    if (!el) return;
    Promise.all([loadCore(), loadLang(lang)])
      .then(([Prism]) => {
        if (alive) (Prism as unknown as { highlightElement: (e: HTMLElement) => void }).highlightElement(el);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [children, lang]);
  return (
    <div className="group relative max-w-full">
      <div className="absolute right-2 top-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(children);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          }}
          className="rounded-lg border border-border/50 bg-muted/80 p-2 hover:bg-muted"
          aria-label="复制代码"
        >
          {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
        </button>
      </div>
      <div className="absolute left-3 top-2 text-[11px] uppercase tracking-wider text-muted-foreground/60">{lang}</div>
      <pre className="max-w-full overflow-x-auto rounded-xl border bg-card px-4 pb-4 pt-9 text-sm">
        <code ref={ref} className={`language-${normalize(lang)}`}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export function MarkdownRenderer({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn("prose-docs max-w-full [overflow-wrap:break-word]", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => {
            const id = slugify(String(children));
            return (
              <h1 id={id} className="mb-6 mt-8 scroll-mt-24 border-b border-border pb-4 text-3xl font-bold first:mt-0 md:text-4xl">
                {children}
              </h1>
            );
          },
          h2: ({ children }) => {
            const id = slugify(String(children));
            return <h2 id={id} className="mb-4 mt-10 scroll-mt-24 text-2xl font-semibold md:text-3xl">{children}</h2>;
          },
          h3: ({ children }) => {
            const id = slugify(String(children));
            return <h3 id={id} className="mb-3 mt-8 scroll-mt-24 text-xl font-semibold md:text-2xl">{children}</h3>;
          },
          h4: ({ children }) => {
            const id = slugify(String(children));
            return <h4 id={id} className="mb-2 mt-6 scroll-mt-24 text-lg font-semibold">{children}</h4>;
          },
          p: ({ children }) => <p className="mb-4 leading-7 text-muted-foreground [overflow-wrap:break-word]">{children}</p>,
          a: ({ href, children }) => (
            <a href={href} className="text-primary underline underline-offset-4 hover:text-primary/80" target={href?.startsWith("http") ? "_blank" : undefined} rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}>
              {children}
            </a>
          ),
          ul: ({ children }) => <ul className="mb-4 ml-5 list-disc space-y-2 text-muted-foreground sm:ml-6">{children}</ul>,
          ol: ({ children }) => <ol className="mb-4 ml-5 list-decimal space-y-2 text-muted-foreground sm:ml-6">{children}</ol>,
          li: ({ children }) => <li className="leading-7">{children}</li>,
          blockquote: ({ children }) => <blockquote className="my-4 rounded-r-lg border-l-4 border-primary/25 bg-muted/30 py-3 pl-4 pr-3 text-sm leading-7 text-muted-foreground">{children}</blockquote>,
          code: ({ className, children, ...props }) => {
            const block = className?.includes("language-");
            const str = String(children).replace(/\n$/, "");
            if (block) return <CodeBlock className={className}>{str}</CodeBlock>;
            return (
              <code className="break-words rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-primary [overflow-wrap:break-word] [word-break:break-word]" {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => <>{children}</>,
          table: ({ children }) => (
            <div className="mb-6 max-w-full overflow-x-auto rounded-xl border">
              <table className="w-full min-w-[520px] border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-muted/50">{children}</thead>,
          th: ({ children }) => <th className="border-b px-3 py-3 text-left align-top text-sm font-semibold sm:px-4">{children}</th>,
          td: ({ children }) => <td className="border-b px-3 py-3 align-top text-sm text-muted-foreground [overflow-wrap:break-word] sm:px-4">{children}</td>,
          hr: () => <hr className="my-8 border-border" />,
          img: ({ src, alt }) => <img src={src} alt={alt} className="my-6 max-w-full rounded-xl border shadow-lg" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
