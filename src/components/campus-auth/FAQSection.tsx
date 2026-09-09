import { useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeader } from "./SectionHeader";
import { FAQS } from "@/data/site";
import { Link } from "react-router-dom";

export function FAQSection() {
  // FAQPage 结构化数据：让搜索引擎在结果页直接展示问答片段
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <section className="section-y bg-background">
      <div className="container max-w-[820px]">
        <SectionHeader title="常见问题" />
        <Accordion type="single" collapsible className="space-y-2.5">
          {FAQS.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`} className="px-6 data-[state=open]:bg-accent/40">
              <AccordionTrigger className="text-left text-[15px] font-semibold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed">
                <p>{f.a}</p>
                {f.href && f.linkLabel && (
                  <Link to={f.href} className="mt-2 inline-flex text-xs font-medium text-primary underline decoration-dotted underline-offset-4 hover:text-primary/80">
                    {f.linkLabel} →
                  </Link>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
