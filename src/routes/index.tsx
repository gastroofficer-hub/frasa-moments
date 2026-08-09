import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { ShopProvider } from "@/components/shop-store";
import { CookieConsent } from "@/components/cookie-consent";
import { Hero, WhyChooseUs } from "@/components/sections/hero";
import { Categories, Events, FeaturedProducts, VersionsShowcase } from "@/components/sections/showcase";
import { Cakes, Delivery } from "@/components/sections/delivery-cakes";
import { Faq, Gallery, Process, Reviews } from "@/components/sections/experience";
import { Contact, SiteFooter } from "@/components/sections/contact";

const title = "FRÁŠA MOMENTS — Kanapky, jednohubky a mini dezerty | Svitavy";
const description =
  "Ručně dělané kanapky, jednohubky, slané speciality a mini dezerty ve verzi DELUXE a STANDART. Slané i sladké dorty na objednávku. Rozvoz do 60 km od Svitav.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FoodEstablishment",
          name: "FRÁŠA MOMENTS",
          description,
          servesCuisine: "Catering, kanapky, jednohubky, dezerty, dorty",
          telephone: "+420 777 123 456",
          email: "info@frasamoments.cz",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Svitavy",
            addressRegion: "Pardubický kraj",
            addressCountry: "CZ",
          },
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
        <VersionsShowcase />
        <Categories />
        <FeaturedProducts />
        <Delivery />
        <Cakes />
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
