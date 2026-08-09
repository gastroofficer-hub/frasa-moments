import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { faqs, galleryImages, processSteps, reviews } from "@/lib/catering-data";
import { cn } from "@/lib/utils";

export function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => ((i ?? 0) + 1) % galleryImages.length);
      if (e.key === "ArrowLeft")
        setLightbox((i) => ((i ?? 0) - 1 + galleryImages.length) % galleryImages.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const current = lightbox === null ? null : galleryImages[lightbox];

  return (
    <section id="gallery" className="bg-beige py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Portfolio</p>
          <h2 className="mt-4 text-3xl sm:text-4xl">Galerie</h2>
        </Reveal>

        <div className="mt-14 grid auto-rows-[180px] grid-flow-dense grid-cols-2 gap-4 md:grid-cols-4">
          {galleryImages.map((img, i) => (
            <button
              key={img.src + i}
              type="button"
              onClick={() => setLightbox(i)}
              aria-label={`Otevřít obrázek: ${img.alt}`}
              className={cn(
                "group relative overflow-hidden rounded-2xl shadow-soft",
                img.span === "tall" && "row-span-2",
                img.span === "wide" && "col-span-2",
              )}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-110"
              />
              <span className="absolute inset-0 bg-background/0 transition-colors duration-500 group-hover:bg-background/50" />
              <span className="absolute inset-x-0 bottom-0 translate-y-3 p-4 text-left text-xs text-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                {img.alt}
              </span>
            </button>
          ))}
        </div>
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-60 flex items-center justify-center bg-background/95 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            aria-label="Zavřít galerii"
            className="absolute top-5 right-5 text-foreground"
            onClick={() => setLightbox(null)}
          >
            <X className="h-7 w-7" />
          </button>
          <button
            type="button"
            aria-label="Předchozí obrázek"
            className="absolute left-3 text-foreground sm:left-8"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => ((i ?? 0) - 1 + galleryImages.length) % galleryImages.length);
            }}
          >
            <ChevronLeft className="h-9 w-9" />
          </button>
          <figure onClick={(e) => e.stopPropagation()} className="max-h-[85vh] max-w-4xl">
            <img
              src={current.src}
              alt={current.alt}
              className="max-h-[78vh] w-full rounded-2xl object-contain"
            />
            <figcaption className="mt-3 text-center text-sm text-muted-foreground">
              {current.alt}
            </figcaption>
          </figure>
          <button
            type="button"
            aria-label="Další obrázek"
            className="absolute right-3 text-foreground sm:right-8"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => ((i ?? 0) + 1) % galleryImages.length);
            }}
          >
            <ChevronRight className="h-9 w-9" />
          </button>
        </div>
      )}
    </section>
  );
}

export function Reviews() {
  const [index, setIndex] = useState(0);
  const review = reviews[index]!;

  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
        <Reveal>
          <p className="eyebrow">Reference</p>
          <h2 className="mt-4 text-3xl sm:text-4xl">Co říkají klienti</h2>
        </Reveal>

        <Reveal delay={100} className="mt-12">
          <div className="rounded-3xl bg-beige p-8 shadow-soft sm:p-12">
            <div className="flex justify-center gap-1" aria-label={`${review.rating} z 5 hvězdiček`}>
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-gold text-gold" />
              ))}
            </div>
            <blockquote className="font-display mt-6 text-xl leading-relaxed text-balance italic sm:text-2xl">
              “{review.quote}”
            </blockquote>
            <div className="mt-8 flex items-center justify-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-gold-soft text-sm font-medium text-gold-foreground">
                {review.initials}
              </span>
              <div className="text-left">
                <p className="text-sm font-medium">{review.name}</p>
                <p className="text-xs text-muted-foreground">{review.role}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              aria-label="Předchozí hodnocení"
              onClick={() => setIndex((i) => (i - 1 + reviews.length) % reviews.length)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              {reviews.map((r, i) => (
                <button
                  key={r.name}
                  type="button"
                  aria-label={`Zobrazit hodnocení od ${r.name}`}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    i === index ? "w-8 bg-gold" : "w-3 bg-border",
                  )}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              aria-label="Další hodnocení"
              onClick={() => setIndex((i) => (i + 1) % reviews.length)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section className="bg-beige py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Jak to probíhá</p>
          <h2 className="mt-4 text-3xl sm:text-4xl">Průběh objednávky</h2>
        </Reveal>

        <ol className="relative mt-14 space-y-8 border-l border-border pl-8 sm:pl-12">
          {processSteps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 80} className="relative">
              <span className="absolute top-1 -left-[3.05rem] grid h-9 w-9 place-items-center rounded-full bg-gold text-sm font-medium text-gold-foreground shadow-gold sm:-left-[4.05rem]">
                {i + 1}
              </span>
              <h3 className="text-xl">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.copy}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <Reveal className="text-center">
          <p className="eyebrow">Dobré vědět</p>
          <h2 className="mt-4 text-3xl sm:text-4xl">Časté dotazy</h2>
        </Reveal>
        <Reveal delay={80} className="mt-12">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left font-display text-lg">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
