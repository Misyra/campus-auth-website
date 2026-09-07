import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeader } from "./SectionHeader";
import { FAQS } from "@/data/site";
import { Link } from "react-router-dom";

export function FAQSection() {
  return (
    <section className="section-y bg-background">
      <div className="container max-w-[820px]">
        <SectionHeader title="常见问题" subtitle="先看这里，多数疑问一分钟内可对照解决；解决不了再进文档细查。" />
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
