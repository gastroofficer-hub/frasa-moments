import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { ShopProvider } from "@/components/shop-store";
import { CookieConsent } from "@/components/cookie-consent";
import { Hero, WhyChooseUs } from "@/components/sections/hero";
import { Categories, Events, FeaturedProducts } from "@/components/sections/showcase";
import { Faq, Gallery, Process, Reviews } from "@/components/sections/experience";
import { Contact, SiteFooter } from "@/components/sections/contact";

const title = "LUXE Catering — Premium Canapés & Finger Food for Every Occasion";
const description =
  "Fresh canapés, finger food, savory specialties and handcrafted mini desserts for weddings, corporate events, conferences and private parties. Delivered with elegance.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FoodEstablishment",
          name: "LUXE Catering",
          description,
          servesCuisine: "Catering, Canapés, Finger Food, Patisserie",
          telephone: "+353 1 555 0142",
          email: "hello@luxecatering.com",
          address: {
            "@type": "PostalAddress",
            streetAddress: "18 Harcourt Street",
            addressLocality: "Dublin",
            postalCode: "D02",
            addressCountry: "IE",
          },
          openingHours: ["Mo-Fr 08:00-19:00", "Sa 09:00-17:00"],
          aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "218" },
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <ShopProvider>
      <SiteHeader />
      <main>
        <Hero />
        <WhyChooseUs />
        <Categories />
        <FeaturedProducts />
        <Events />
        <Gallery />
        <Reviews />
        <Process />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
      <CookieConsent />
    </ShopProvider>
  );
}
