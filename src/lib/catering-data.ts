import wedding from "@/assets/event-wedding.jpg";
import corporate from "@/assets/event-corporate.jpg";
import platters from "@/assets/cat-platters.jpg";
import savory from "@/assets/cat-savory.jpg";
import fingerFood from "@/assets/cat-fingerfood.jpg";
import canapes from "@/assets/cat-canapes.jpg";
import desserts from "@/assets/cat-desserts.jpg";
import sweet from "@/assets/cat-sweet.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";

export const images = {
  canapes,
  fingerFood,
  savory,
  desserts,
  sweet,
  platters,
  wedding,
  corporate,
  gallery1,
  gallery2,
  gallery3,
};

export const events = [
  {
    name: "Svatby",
    copy: "Kanapky na recepci a stylované sladké stoly až pro 400 hostů.",
    image: wedding,
  },
  {
    name: "Firemní akce",
    copy: "Přesný a decentní servis pro launche, offsity a klientské dny.",
    image: corporate,
  },
  {
    name: "Narozeniny",
    copy: "Sdílené platy a sladkosti na míru vaší oslavě.",
    image: platters,
  },
  {
    name: "Rodinné oslavy",
    copy: "Štědré menu pro křtiny, výročí a nedělní sešlosti.",
    image: savory,
  },
  {
    name: "Konference",
    copy: "Načasované coffee breaky a obědová sousta, která drží program.",
    image: fingerFood,
  },
  {
    name: "Soukromé party",
    copy: "VIP menu s vlastním šéfkuchařem a plátováním na místě.",
    image: gallery2,
  },
];

export const galleryImages = [
  { src: gallery1, alt: "Šéfkuchař dokončuje kanapku pinzetou", span: "tall" },
  { src: canapes, alt: "Kanapky s lososem na mramorovém prkénku", span: "normal" },
  { src: gallery2, alt: "Krevetová verrine na mramorovém baru", span: "wide" },
  { src: desserts, alt: "Mini dezerty na patrovém stojanu", span: "normal" },
  { src: wedding, alt: "Svatební cateringový stůl", span: "normal" },
  { src: gallery3, alt: "Makronky a truffles v krabici", span: "tall" },
  { src: platters, alt: "Velké party plato smíšených soust", span: "normal" },
  { src: savory, alt: "Prkénko se zrajícími sýry a uzeninami", span: "normal" },
  { src: sweet, alt: "Stylovaný sladký stůl", span: "wide" },
];

export const reviews = [
  {
    name: "Eliška Vaňková",
    role: "Nevěsta, svatba Svitavy",
    rating: 5,
    quote:
      "Každá jednohubka vypadala jako šperk a chutnala ještě líp. Hosté na sladký stůl vzpomínají dodnes.",
    initials: "EV",
  },
  {
    name: "Marek Felkl",
    role: "Head of Events, Northline Group",
    rating: 5,
    quote:
      "Tři sta hostů, načasování na minutu, nulový stres. FRÁŠA MOMENTS je náš stálý partner.",
    initials: "MF",
  },
  {
    name: "Sofie Lindová",
    role: "Soukromá klientka",
    rating: 5,
    quote:
      "Celý stůl vyladili do našich barev. Elegantní, štědré a opravdu vynikající.",
    initials: "SL",
  },
  {
    name: "Daniel Okoun",
    role: "Ředitel konference",
    rating: 5,
    quote:
      "Přestávky běžely na minutu a kvalita nespadla ani třetí den. Výjimečná prezentace.",
    initials: "DO",
  },
];

export const processSteps = [
  { title: "Vyberte produkty", copy: "Projděte nabídku a poskládejte si výběr (od 10 kusů)." },
  { title: "Odešlete poptávku", copy: "Napište termín, počet hostů a preference." },
  { title: "Potvrzení", copy: "Potvrdíme menu, časy a finální cenu." },
  { title: "Příprava", copy: "Vše připravujeme ručně čerstvé v den akce." },
  { title: "Rozvoz", copy: "Doručíme, nastylujeme a předáme připravené k servírování." },
];

export const faqs = [
  {
    q: "Jaké je minimální množství objednávky?",
    a: "Produkty se prodávají samostatně, minimálně však po 10 kusech od jednoho produktu. Rozvoz zajišťujeme od 30 kusů celkem.",
  },
  {
    q: "Kam rozvážíte?",
    a: "Rozvážíme do vzdálenosti 60 km od Svitav v Pardubickém kraji. Cena rozvozu do 60 km je 100 Kč, nad 60 km dle domluvy. Při objednávce 100+ kusů je možný rozvoz i na vzdálenější místa.",
  },
  {
    q: "Jaký je rozdíl mezi DELUXE a STANDART?",
    a: "DELUXE je servírované v černé krabičce se zlatým logem obehnaným zlatým vavřínovým věncem. STANDART je v běžné bílé krabičce s černým logem.",
  },
  {
    q: "Řešíte alergeny a speciální stravování?",
    a: "Ano. Vše je označené a nabízíme vegetariánské, veganské, bezlepkové i bezořechové varianty. Ke každé potvrzené objednávce dodáváme alergenní list.",
  },
  {
    q: "Objednáváte i dorty?",
    a: "Slané i sladké dorty děláme na míru. Cena je vždy dle domluvy a je nutné objednat je dopředu.",
  },
];
