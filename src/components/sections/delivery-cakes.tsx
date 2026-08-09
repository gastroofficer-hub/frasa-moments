import { useQuery } from "@tanstack/react-query";
import { CakeSlice, MapPin, PackageCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { cakesQuery } from "@/lib/catalog";
import {
  DELIVERY_FEE,
  DELIVERY_RADIUS_KM,
  FAR_DELIVERY_QTY,
  MIN_DELIVERY_QTY,
  formatPrice,
} from "@/components/shop-store";

export function Delivery() {
  const cards = [
    {
      icon: PackageCheck,
      title: `Objednávka od 10 kusů`,
      copy: "Produkty prodáváme samostatně, minimálně po 10 kusech od jedné položky.",
    },
    {
      icon: Truck,
      title: `Rozvoz od ${MIN_DELIVERY_QTY} kusů`,
      copy: `Rozvážíme do ${DELIVERY_RADIUS_KM} km od Svitav v Pardubickém kraji.`,
    },
    {
      icon: MapPin,
      title: "Cena rozvozu",
      copy: `Do ${DELIVERY_RADIUS_KM} km ${formatPrice(DELIVERY_FEE)}, nad ${DELIVERY_RADIUS_KM} km dle domluvy.`,
    },
  ];

  return (
    <section id="rozvoz" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Rozvoz</p>
          <h2 className="mt-4 text-3xl sm:text-4xl">Doručíme až k vám</h2>
          <p className="mt-4 text-muted-foreground">
            Svitavy a okolí do {DELIVERY_RADIUS_KM} km — chlazeně a na čas.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <article className="hover-lift h-full rounded-3xl bg-card p-8 shadow-soft">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-soft text-gold">
                  <c.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-6 text-xl">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.copy}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="mt-8">
          <p className="glass-panel rounded-3xl px-6 py-5 text-center text-sm text-muted-foreground">
            <span className="text-gold">Poznámka:</span> při nákupu {FAR_DELIVERY_QTY}+ kusů je možný
            rozvoz i na vzdálenější místa — cena dle domluvy.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function Cakes() {
  const { data: cakes = [] } = useQuery(cakesQuery);
  const active = cakes.filter((c) => c.is_active);

  return (
    <section id="dorty" className="bg-beige py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Na objednávku</p>
          <h2 className="mt-4 text-3xl sm:text-4xl">Slané a sladké dorty</h2>
          <p className="mt-4 text-muted-foreground">
            Cena dortu je vždy dle domluvy a je nutné jej objednat dopředu.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {active.map((c, i) => (
            <Reveal key={c.id} delay={(i % 3) * 80}>
              <article className="hover-lift flex h-full flex-col overflow-hidden rounded-3xl bg-card shadow-soft">
                <img
                  src={c.image_url}
                  alt={c.name}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="h-56 w-full object-cover"
                />
                <div className="flex flex-1 flex-col p-6">
                  <p className="eyebrow flex items-center gap-2">
                    <CakeSlice className="h-3.5 w-3.5" />
                    {c.kind === "savory" ? "Slaný dort" : "Sladký dort"}
                  </p>
                  <h3 className="mt-3 text-xl">{c.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {c.description}
                  </p>
                  <p className="mt-4 text-sm text-gold">Cena dle domluvy · nutná objednávka předem</p>
                  <Button asChild variant="gold" className="mt-4 w-full">
                    <a href="#contact">Objednat dort</a>
                  </Button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
