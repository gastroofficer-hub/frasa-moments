import { useState } from "react";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "@/components/reveal";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().max(40).optional(),
  message: z.string().trim().min(10, "Tell us a little about your event").max(1000),
});

const details = [
  { icon: Phone, label: "Phone", value: "+353 1 555 0142", href: "tel:+35315550142" },
  { icon: Mail, label: "Email", value: "hello@luxecatering.com", href: "mailto:hello@luxecatering.com" },
  {
    icon: MapPin,
    label: "Atelier",
    value: "18 Harcourt Street, Dublin 2, Ireland",
    href: "https://maps.google.com/?q=18+Harcourt+Street+Dublin",
  },
];

const socials = [
  { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
  { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
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
    toast.success("Inquiry sent", {
      description: "Thank you — our events team will reply within 24 hours.",
    });
  };

  return (
    <section id="contact" className="bg-beige py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Get in touch</p>
          <h2 className="mt-4 text-3xl sm:text-4xl">Plan your event with us</h2>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <Reveal>
            <form onSubmit={onSubmit} noValidate className="rounded-3xl bg-card p-8 shadow-soft">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" maxLength={100} className="mt-2" aria-invalid={!!errors.name} />
                  {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                </div>
                <div className="sm:col-span-1">
                  <Label htmlFor="email">Email</Label>
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
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input id="phone" name="phone" maxLength={40} className="mt-2" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="message">Event details</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    maxLength={1000}
                    className="mt-2"
                    placeholder="Date, guest count, occasion and any dietary requirements."
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
                </div>
              </div>
              <Button type="submit" variant="gold" size="lg" className="mt-6 w-full sm:w-auto">
                Send inquiry
              </Button>
            </form>
          </Reveal>

          <Reveal delay={100} className="flex flex-col gap-6">
            <div className="rounded-3xl bg-card p-8 shadow-soft">
              <ul className="space-y-5">
                {details.map((d) => (
                  <li key={d.label} className="flex items-start gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-soft text-gold-foreground">
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
                title="LUXE Catering atelier location on Google Maps"
                src="https://maps.google.com/maps?q=18%20Harcourt%20Street%20Dublin&t=&z=15&ie=UTF8&iwloc=&output=embed"
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
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-xl tracking-[0.22em] uppercase">Luxe</p>
            <p className="mt-4 text-sm text-primary-foreground/70">
              Handcrafted canapés, finger food and patisserie for weddings, corporate events and
              private celebrations.
            </p>
          </div>

          <nav aria-label="Footer">
            <h3 className="text-sm tracking-widest text-gold uppercase">Navigation</h3>
            <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
              {[
                ["#categories", "Categories"],
                ["#menu", "Menu"],
                ["#events", "Events"],
                ["#gallery", "Gallery"],
                ["#faq", "FAQ"],
                ["#contact", "Contact"],
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
            <h3 className="text-sm tracking-widest text-gold uppercase">Business</h3>
            <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
              <li>LUXE Catering Ltd.</li>
              <li>18 Harcourt Street, Dublin 2</li>
              <li>VAT IE 4827193K</li>
              <li>+353 1 555 0142</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm tracking-widest text-gold uppercase">Opening hours</h3>
            <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
              <li>Mon – Fri · 08:00 – 19:00</li>
              <li>Saturday · 09:00 – 17:00</li>
              <li>Sunday · By appointment</li>
              <li>Event delivery · 7 days</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} LUXE Catering Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <a id="privacy" href="#privacy" className="transition-colors hover:text-gold">
              Privacy Policy
            </a>
            <a id="terms" href="#terms" className="transition-colors hover:text-gold">
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
