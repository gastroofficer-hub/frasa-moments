import canapes from "@/assets/cat-canapes.jpg";
import fingerFood from "@/assets/cat-fingerfood.jpg";
import savory from "@/assets/cat-savory.jpg";
import desserts from "@/assets/cat-desserts.jpg";
import sweet from "@/assets/cat-sweet.jpg";
import platters from "@/assets/cat-platters.jpg";
import wedding from "@/assets/event-wedding.jpg";
import corporate from "@/assets/event-corporate.jpg";
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

export type Category = {
  id: string;
  name: string;
  blurb: string;
  image: string;
  gallery: { src: string; caption: string }[];
};

export const categories: Category[] = [
  {
    id: "canapes",
    name: "Canapés",
    blurb: "Single-bite compositions on marble and slate.",
    image: canapes,
    gallery: [
      { src: canapes, caption: "Smoked salmon & caviar tartlets" },
      { src: gallery1, caption: "Hand-plated seasonal bites" },
      { src: gallery2, caption: "Chilled prawn verrines" },
    ],
  },
  {
    id: "finger-food",
    name: "Finger Food",
    blurb: "Effortless bites designed for standing receptions.",
    image: fingerFood,
    gallery: [
      { src: fingerFood, caption: "Caprese skewers & bruschetta" },
      { src: platters, caption: "Wrap & roll selection" },
      { src: corporate, caption: "Reception service in situ" },
    ],
  },
  {
    id: "savory",
    name: "Savory Selection",
    blurb: "Artisan cheeses, cured meats and warm bites.",
    image: savory,
    gallery: [
      { src: savory, caption: "Aged cheese & charcuterie board" },
      { src: platters, caption: "Grazing platter, 20 guests" },
      { src: gallery2, caption: "Seafood bar" },
    ],
  },
  {
    id: "mini-desserts",
    name: "Mini Desserts",
    blurb: "Patisserie in miniature — tartlets, macarons, truffles.",
    image: desserts,
    gallery: [
      { src: desserts, caption: "Tiered petit four stand" },
      { src: gallery3, caption: "Macarons & truffle box" },
      { src: sweet, caption: "Berry verrines" },
    ],
  },
  {
    id: "sweet-catering",
    name: "Sweet Catering",
    blurb: "Full dessert tables styled to your event palette.",
    image: sweet,
    gallery: [
      { src: sweet, caption: "White & gold dessert table" },
      { src: gallery3, caption: "Chocolate selection" },
      { src: wedding, caption: "Wedding sweet corner" },
    ],
  },
  {
    id: "party-platters",
    name: "Party Platters",
    blurb: "Generous shareable boards, ready to serve.",
    image: platters,
    gallery: [
      { src: platters, caption: "Signature mixed platter" },
      { src: savory, caption: "Savory board" },
      { src: fingerFood, caption: "Finger food tray" },
    ],
  },
];

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

export const products: Product[] = [
  {
    id: "p1",
    name: "Salmon & Caviar Tartlet",
    description: "Butter pastry, dill crème fraîche, cured salmon, caviar pearls.",
    price: 3.9,
    category: "canapes",
    image: canapes,
  },
  {
    id: "p2",
    name: "Beef Tataki Crostini",
    description: "Seared beef, horseradish cream, crisp sourdough, micro herbs.",
    price: 4.4,
    category: "canapes",
    image: images.gallery1,
  },
  {
    id: "p3",
    name: "Caprese Skewer Trio",
    description: "Buffalo mozzarella, confit tomato, basil, aged balsamic.",
    price: 2.8,
    category: "finger-food",
    image: fingerFood,
  },
  {
    id: "p4",
    name: "Grand Charcuterie Board",
    description: "Six artisan cheeses, cured meats, olives, house crackers.",
    price: 89.0,
    category: "savory",
    image: savory,
  },
  {
    id: "p5",
    name: "Prawn Cocktail Verrine",
    description: "Chilled tiger prawns, citrus marie rose, fennel.",
    price: 5.2,
    category: "savory",
    image: images.gallery2,
  },
  {
    id: "p6",
    name: "Petit Four Selection",
    description: "Twelve mini tartlets, macarons and chocolate bites.",
    price: 34.0,
    category: "mini-desserts",
    image: desserts,
  },
  {
    id: "p7",
    name: "Macaron & Truffle Box",
    description: "Hand-piped macarons with single-origin chocolate truffles.",
    price: 28.0,
    category: "mini-desserts",
    image: images.gallery3,
  },
  {
    id: "p8",
    name: "Signature Party Platter",
    description: "48 mixed bites, styled on a walnut board for 12 guests.",
    price: 129.0,
    category: "party-platters",
    image: platters,
  },
  {
    id: "p9",
    name: "Berry Verrine Set",
    description: "Vanilla cream, seasonal berries, almond crumble. Set of 6.",
    price: 24.0,
    category: "sweet-catering",
    image: sweet,
  },
];

export const events = [
  {
    name: "Weddings",
    copy: "Reception canapés and styled dessert tables for up to 400 guests.",
    image: wedding,
  },
  {
    name: "Corporate Events",
    copy: "Punctual, discreet service for launches, offsites and client days.",
    image: corporate,
  },
  {
    name: "Birthdays",
    copy: "Shareable platters and sweets tailored to your celebration.",
    image: platters,
  },
  {
    name: "Family Celebrations",
    copy: "Warm, generous menus for christenings and anniversaries.",
    image: savory,
  },
  {
    name: "Conferences",
    copy: "Timed coffee breaks and lunch bites that keep agendas on schedule.",
    image: fingerFood,
  },
  {
    name: "Private Parties",
    copy: "VIP menus with dedicated chefs and on-site plating.",
    image: images.gallery2,
  },
];

export const galleryImages = [
  { src: images.gallery1, alt: "Chef plating a canapé with tweezers", span: "tall" },
  { src: canapes, alt: "Salmon canapés on a marble board", span: "normal" },
  { src: images.gallery2, alt: "Prawn cocktail verrines on a marble bar", span: "wide" },
  { src: desserts, alt: "Mini desserts on a tiered marble stand", span: "normal" },
  { src: wedding, alt: "Wedding reception catering table", span: "normal" },
  { src: images.gallery3, alt: "Macarons and truffles in a linen-lined box", span: "tall" },
  { src: platters, alt: "Large party platter of mixed bites", span: "normal" },
  { src: savory, alt: "Artisan cheese and charcuterie board", span: "normal" },
  { src: sweet, alt: "Styled dessert table with tiered stands", span: "wide" },
];

export const reviews = [
  {
    name: "Elena Vasquez",
    role: "Bride, Villa Serena Wedding",
    rating: 5,
    quote:
      "Every single canapé looked like jewellery and tasted even better. Our guests are still talking about the dessert table.",
    initials: "EV",
  },
  {
    name: "Marcus Feld",
    role: "Head of Events, Northline Group",
    rating: 5,
    quote:
      "Three hundred guests, flawless timing, zero stress. LUXE is now our default partner for every client evening.",
    initials: "MF",
  },
  {
    name: "Sophia Lindqvist",
    role: "Private client",
    rating: 5,
    quote:
      "The team styled the whole table to our colour palette. Elegant, generous and genuinely delicious.",
    initials: "SL",
  },
  {
    name: "Daniel Okonkwo",
    role: "Conference Director",
    rating: 5,
    quote:
      "Breaks ran to the minute and the food quality never dipped across three days. Exceptional presentation.",
    initials: "DO",
  },
];

export const processSteps = [
  { title: "Choose Products", copy: "Browse the menu and build your selection." },
  { title: "Send Inquiry", copy: "Share your date, guest count and preferences." },
  { title: "Confirmation", copy: "We confirm the menu, timing and final quote." },
  { title: "Preparation", copy: "Everything is handmade fresh on the day." },
  { title: "Delivery", copy: "Delivered, styled and ready to serve on time." },
];

export const faqs = [
  {
    q: "What is the minimum order?",
    a: "Our minimum order is €150 for delivery and 20 guests for full-service catering. Smaller platter orders can be collected from our atelier.",
  },
  {
    q: "Which areas do you deliver to?",
    a: "We deliver across the city and within 60 km. Delivery within 15 km is complimentary on orders above €400; beyond that a distance fee applies.",
  },
  {
    q: "Can you handle allergens and dietary needs?",
    a: "Yes. Every item is labelled and we offer vegetarian, vegan, gluten-free and nut-free menus. Full allergen sheets are provided with each confirmed order.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "Bank transfer, all major cards and invoicing for corporate clients. A 30% deposit secures your date; the balance is due 48 hours before the event.",
  },
  {
    q: "Do you create custom catering menus?",
    a: "Always. Share your theme, palette and budget and our chefs will design a bespoke menu, including tastings for larger events.",
  },
];
