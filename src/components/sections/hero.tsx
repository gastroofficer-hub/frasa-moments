import { ArrowRight, ChefHat, Clock, Leaf, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import hero from "@/assets/hero-platters.jpg";

export function Hero() {
  return (
    <section id="top" className="relative isolate min-h-[92vh] overflow-hidden">
      <img
        src={hero}
        alt="Elegantly arranged catering platters with canapés on marble and slate boards"
        width={1920}
        height={1280}
        fetchPriority="high"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background/95 via-background/80 to-background/25" />

      <div className="mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-5 pt-28 pb-20 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Since 2011 · Handcrafted daily</p>
          <h1 className="mt-5 text-[2.75rem] leading-[1.05] font-semibold text-balance sm:text-6xl lg:text-7xl">
            Premium Catering for <span className="text-gold italic">Every Occasion</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            Fresh canapés, finger food, savory specialties, and handcrafted mini desserts delivered
            with elegance.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="gold">
              <a href="#contact">
                Order Now <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="glass">
              <a href="#menu">View Menu</a>
            </Button>
          </div>
          <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
            {[
              ["1,200+", "Events catered"],
              ["4.9/5", "Client rating"],
              ["60 km", "Delivery radius"],
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
    title: "Fresh Ingredients",
    copy: "Sourced each morning from trusted local growers and fishmongers.",
  },
  {
    icon: ChefHat,
    title: "Handmade Daily",
    copy: "Every bite is assembled by hand in our atelier on the day of your event.",
  },
  {
    icon: Clock,
    title: "Fast Delivery",
    copy: "Punctual, temperature-controlled delivery with 48-hour lead time.",
  },
  {
    icon: Sparkles,
    title: "Premium Presentation",
    copy: "Styled on marble, slate and walnut — ready to serve, straight from the box.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-beige py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Why choose us</p>
          <h2 className="mt-4 text-3xl sm:text-4xl">Detail you can taste</h2>
          <div className="gold-rule mx-auto mt-6" />
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 90}>
              <article className="hover-lift h-full rounded-3xl bg-card p-8 shadow-soft">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-soft text-gold-foreground">
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
