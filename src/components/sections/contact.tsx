import { useState } from "react";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "@/components/reveal";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Zadejte prosím své jméno").max(100),
  email: z.string().trim().email("Zadejte platný e-mail").max(255),
  phone: z.string().trim().max(40).optional(),
  message: z.string().trim().min(10, "Napište nám pár slov o vaší akci").max(1000),
});

const details = [
  { icon: Phone, label: "Telefon", value: "+420 777 123 456", href: "tel:+420777123456" },
  { icon: Mail, label: "E-mail", value: "info@frasamoments.cz", href: "mailto:info@frasamoments.cz" },
  {
    icon: MapPin,
    label: "Kde nás najdete",
    value: "Svitavy, Pardubický kraj",
    href: "https://maps.google.com/?q=Svitavy",
  },
];

const socials = [
  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
  { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
];

type FieldErrors = { name?: string; email?: string; phone?: string; message?: string };

export function Contact() {
  const [errors, setErrors] = useState<FieldErrors>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = contactSchema.safeParse({
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      message: form.get("message"),
    });

    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) next[issue.path[0] as keyof FieldErrors] = issue.message;
      setErrors(next);
      return;
    }

    setErrors({});
    e.currentTarget.reset();
    toast.success("Poptávka odeslána", {
      description: "Děkujeme — ozveme se vám do 24 hodin.",
    });
  };

  return (
    <section id="contact" className="bg-beige py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Kontakt</p>
          <h2 className="mt-4 text-3xl sm:text-4xl">Naplánujme vaši akci</h2>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <Reveal>
            <form onSubmit={onSubmit} noValidate className="rounded-3xl bg-card p-8 shadow-soft">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <Label htmlFor="name">Jméno</Label>
                  <Input id="name" name="name" maxLength={100} className="mt-2" aria-invalid={!!errors.name} />
                  {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                </div>
                <div className="sm:col-span-1">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    maxLength={255}
                    className="mt-2"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="phone">Telefon (nepovinné)</Label>
                  <Input id="phone" name="phone" maxLength={40} className="mt-2" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="message">Detaily akce</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    maxLength={1000}
                    className="mt-2"
                    placeholder="Termín, počet hostů, příležitost, verze DELUXE/STANDART a případné alergie."
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
                </div>
              </div>
              <Button type="submit" variant="gold" size="lg" className="mt-6 w-full sm:w-auto">
                Odeslat poptávku
              </Button>
            </form>
          </Reveal>

          <Reveal delay={100} className="flex flex-col gap-6">
            <div className="rounded-3xl bg-card p-8 shadow-soft">
              <ul className="space-y-5">
                {details.map((d) => (
                  <li key={d.label} className="flex items-start gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-soft text-gold">
                      <d.icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs tracking-widest text-muted-foreground uppercase">
                        {d.label}
                      </span>
                      <a href={d.href} className="text-sm transition-colors hover:text-gold">
                        {d.value}
                      </a>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="grid h-10 w-10 place-items-center rounded-full border border-border transition-colors hover:border-gold hover:text-gold"
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="min-h-64 flex-1 overflow-hidden rounded-3xl shadow-soft">
              <iframe
                title="FRÁŠA MOMENTS — Svitavy na mapě"
                src="https://maps.google.com/maps?q=Svitavy&t=&z=12&ie=UTF8&iwloc=&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-64 w-full border-0"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-xl tracking-[0.22em] text-gold uppercase">Fráša Moments</p>
            <p className="mt-4 text-sm text-muted-foreground">
              Ručně dělané kanapky, jednohubky a mini dezerty pro svatby, firemní akce a soukromé
              oslavy. Svitavy a okolí.
            </p>
          </div>

          <nav aria-label="Patička">
            <h3 className="text-sm tracking-widest text-gold uppercase">Navigace</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {[
                ["#categories", "Kategorie"],
                ["#menu", "Nabídka"],
                ["#dorty", "Dorty"],
                ["#rozvoz", "Rozvoz"],
                ["#gallery", "Galerie"],
                ["#contact", "Kontakt"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="transition-colors hover:text-gold">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-sm tracking-widest text-gold uppercase">Objednávky</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Produkty od 10 kusů</li>
              <li>Rozvoz od 30 kusů</li>
              <li>Do 60 km od Svitav · 100 Kč</li>
              <li>Nad 60 km · dle domluvy</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm tracking-widest text-gold uppercase">Kontakt</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Svitavy, Pardubický kraj</li>
              <li>+420 777 123 456</li>
              <li>info@frasamoments.cz</li>
              <li>
                <a href="/admin" className="transition-colors hover:text-gold">
                  Administrace
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} FRÁŠA MOMENTS. Všechna práva vyhrazena.</p>
          <div className="flex gap-6">
            <a id="privacy" href="#privacy" className="transition-colors hover:text-gold">
              Ochrana osobních údajů
            </a>
            <a id="terms" href="#terms" className="transition-colors hover:text-gold">
              Obchodní podmínky
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
