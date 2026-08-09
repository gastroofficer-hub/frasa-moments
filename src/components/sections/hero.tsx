import { ArrowRight, ChefHat, Clock, Leaf, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import hero from "@/assets/hero-platters.jpg";

export function Hero() {
  return (
    <section id="top" className="relative isolate min-h-[92vh] overflow-hidden">
      <img
        src={hero}
        alt="Elegantně naaranžovaná cateringová plata s kanapkami na mramoru a břidlici"
        width={1920}
        height={1280}
        fetchPriority="high"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/85 to-background/35" />

      <div className="mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-5 pt-28 pb-20 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Ručně připravováno každý den</p>
          <h1 className="mt-5 text-[2.75rem] leading-[1.05] font-semibold text-balance sm:text-6xl lg:text-7xl">
            FRÁŠA <span className="text-gold italic">MOMENTS</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            Čerstvé kanapky, jednohubky, slané speciality a mini dezerty. Ve verzi DELUXE v černé
            krabičce se zlatým vavřínovým věncem, nebo STANDART v bílé krabičce.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="gold">
              <a href="#menu">
                Objednat <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="glass">
              <a href="#verze">DELUXE &amp; STANDART</a>
            </Button>
          </div>
          <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
            {[
              ["10+ ks", "Minimální objednávka"],
              ["30+ ks", "Rozvoz od"],
              ["60 km", "Dojezd od Svitav"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-2xl">{value}</dt>
                <dd className="text-xs tracking-widest text-muted-foreground uppercase">{label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

const features = [
  {
    icon: Leaf,
    title: "Čerstvé suroviny",
    copy: "Nakupujeme každé ráno od prověřených lokálních dodavatelů.",
  },
  {
    icon: ChefHat,
    title: "Ruční práce",
    copy: "Každé sousto skládáme ručně v den vaší akce.",
  },
  {
    icon: Clock,
    title: "Rozvoz na čas",
    copy: "Přesný rozvoz v chlazeném režimu do 60 km od Svitav.",
  },
  {
    icon: Sparkles,
    title: "Prémiové balení",
    copy: "DELUXE černá krabička se zlatým logem nebo bílý STANDART.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-beige py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Proč my</p>
          <h2 className="mt-4 text-3xl sm:text-4xl">Detail, který je cítit</h2>
          <div className="gold-rule mx-auto mt-6" />
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 90}>
              <article className="hover-lift h-full rounded-3xl bg-card p-8 shadow-soft">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-soft text-gold">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-6 text-xl">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.copy}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
