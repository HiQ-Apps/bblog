export type Post = {
  id: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  intro: string; // short preview for cards/SEO
  tags: string[];
  disclosure?: string;
  sections: { heading: string; content: string }[];
  supplies?: { name: string; reason?: string; affiliateUrl?: string | null }[];
  directions?: string[];
  conclusion?: string;
  sources?: {
    name: string;
    url?: string;
  }[];
};

export const POSTS: Post[] = [
  {
    id: "apothecary-diaries-1",
    title: "Apothecary Diaries #1",
    date: "09-21-2025",
    intro: `
      Many store-bought soaps labeled “antibacterial” or “deep cleaning” can hide harsh chemicals. 
      Here’s what to watch out for—and a simple castile soap recipe.
    `,
    tags: ["nontoxic", "soap", "home", "natural", "DIY"],
    disclosure: `
      This post may contain affiliate links. 
      As an Amazon Associate, I earn from qualifying purchases at no extra cost to you.
    `,
    sections: [
      {
        heading: "Why I started rethinking soap",
        content: `
          Many store-bought soaps labeled “antibacterial” or “deep cleaning” can come with hidden trade-offs. 
          They’re often loaded with synthetic fragrances, preservatives, and harsh chemicals. 
          Growing up I loved the colorful scents, but the more I read, the less comfortable I felt with what was inside.
        `,
      },
      {
        heading: "Fragrances don't always mean clean",
        content: `
          Soaps get their signature fresh or floral scents from synthetic fragrance blends. 
          Many include phthalates and other chemicals linked to allergic reactions, hormone disruption, and skin irritation. 
          “Fragrance” on an ingredient label can represent a blend with hundreds of components. 
          If you have sensitive skin, avoiding heavily scented products is a safe bet.
        `,
      },
      // … more sections here …
    ],
    supplies: [
      {
        name: "Castile Soap",
        reason: `
          I recommend Dr. Bronner’s. Choose unscented if you’ll add your own essential oils.
        `,
        affiliateUrl: "https://amzn.to/46xYDzY",
      },
      {
        name: "16oz Glass Bottle + Pump",
        reason: `
          Amber glass helps protect essential oils from light degradation if you choose to add a scent.
        `,
        affiliateUrl: "https://amzn.to/4gIlFc8",
      },
      {
        name: "Essential Oils (optional)",
        reason: `
          Amazon has a few great starter sets that comes with different fragrances, including frankincense, peppermint, eucalyptus. 
          There are so many uses for essential oils, and I will talk about them in later blog posts. 
          Some of my favorite combinations are lavender + orange and eucalyptus + peppermint.
        `,
        affiliateUrl: "https://amzn.to/4nIF1Aa",
      },
      {
        name: "Distilled Water",
        reason: `
          Using distilled water helps extend shelf life by minimizing bacteria growth.
        `,
        affiliateUrl: null,
      },
      {
        name: "Aloe Vera Gel (optional)",
        reason: `
          Mix in one tsp of aloe vera gel for extra skin hydration. However, aloe tends to separate, so make sure to gently swish before using.`,
        affiliateUrl: "https://amzn.to/3VszBx2",
      },
      // … more supplies here …
    ],
    directions: [
      "Fill your bottle ~¾ full with distilled water (water first minimizes foaming).",
      "Add ¼ cup castile soap.",
      "If scenting, add 5–10 drops essential oil.",
      "Optional: add 1 tsp aloe vera gel. Swirl gently to combine.",
      "Use as hand soap or body wash.",
    ],
    conclusion: `
      Give it a try and tweak the scent strength to your preference. 
      Store in a cool, dark place and use within 1–3 months.
      Gently shake before each use, especially if you added aloe vera gel.
      Hopefully you get a chance to try this out!
    `,
    sources: [
      {
        name: "How is the general public exposed to fragrance allergens? — European Commission",
        url: "https://ec.europa.eu/health/scientific_committees/opinions_layman/perfume-allergies/en/l-3/5-exposure-public.htm",
      },
      {
        name: "Skip the Antibacterial Soap; Use Plain Soap and Water — FDA",
        url: "https://www.fda.gov/consumers/consumer-updates/skip-antibacterial-soap-use-plain-soap-and-water",
      },
      {
        name: "Effect of soaps and detergents on epidermal barrier function — ScienceDirect",
        url: "https://www.sciencedirect.com/science/article/abs/pii/S0738081X11002252",
      },
      {
        name: "Natural soap is clinically effective and more biodegradable than synthetic detergents",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12176228/",
      },
    ],
  },
];
