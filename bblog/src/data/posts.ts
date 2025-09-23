export type MerchantType = "Amazon" | "Awin";

export type Post = {
  id: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  thumbnailUrl?: string;
  intro: string; // short preview for cards/SEO
  tags: string[];
  disclosure?: string;
  sections: { heading: string; content: string }[];
  supplies?: {
    name: string;
    images: string[];
    reason?: string;
    affiliateUrl?: string | null;
    merchant: MerchantType;
  }[];
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
    thumbnailUrl: "/posts/apothecary-diaries-1/cover.png",
    intro: `Many store bought soaps labeled ”antibacterial” or “deep cleaning” can come with hidden trade offs. They’re loaded with synthetic fragrances, preservatives, and harsh chemicals that aren’t as healthy as we think. The more I read about them, the scarier they seemed. Growing up, it was normal to have brightly covered soaps and different scents. As a broke teenager,  I frequently shopped at places like Bath & Body Works, where they always had so many scents at unbeatable prices. `,
    tags: ["nontoxic", "soap", "home", "natural", "DIY"],
    disclosure: `This post may contain affiliate links. As an Amazon Associate, I earn from qualifying purchases at no extra cost to you.`,
    sections: [
      {
        heading: "Fragrances don't always mean clean",
        content: `Soaps get their signature fresh or floral scents from synthetic fragrance blends. Many of these blends contain phthalates and other chemicals that are linked to allergic reactions, hormone disruption, and even skin irritation. The American Lung Association warns about fragrance exposure indoors. “Fragrance” is a generic term on ingredient lists, but some fragrances can have up to 200 components. There’s no way to accurately decode what is in each one. Fragrance is the number one cause of contact allergy for cosmetics. According to the European Commission, people with sensitive skin should avoid heavily scented items[1].`,
      },
      {
        heading: "Antibacterial doesn’t always mean better.",
        content: `The FDA says that over-the-counter antibacterial soaps with chemicals such as triclosan are no more effective than plain soap and water[2]. Overuse can even lead to antibiotic resistance. The conclusion was drawn because manufacturers usually don’t provide enough data necessary to show that these ingredients are safe enough for daily or long term use.`,
      },
      {
        heading: "Skin Barrier",
        content: `Soaps and detergents can be harsh and can strip your skin’s natural oils, leaving it more dry and itchy. Some studies of detergents have been shown to reduce lipid synthesis and damage the skin barrier’s function[3]. 3 Plant based soaps such as castile soap cleanses just as well without affecting your skin’s microbiome.`,
      },
      {
        heading: "Environmental Impact",
        content: `Most brightly colored or heavily fragranced soaps are made with petroleum-based ingredients, synthetic surfactants, and dyes — many of which contribute to water pollution and even microplastic contamination. This NIH study discusses how natural soap compounds are considered readily biodegradable and unlikely to produce hazardous waste, while artificial detergents are comprised mainly of synthetic surfactants, binders, plasticizers, and additives[4].
        \n Today I will teach you how to mix your own castile soap blend. By doing this, you can skip unnecessary additives and get a cleaner product that is safe for your body and your home. It’s customizable with essential oils, easy to refill, and sustainable for the long term.
        `,
      },
    ],
    supplies: [
      {
        name: "Castile Soap",
        reason: `I recommend Dr. Bronner’s regular castile soap. They have several naturally scented variations, but since we're adding our own scents, they have an unscented baby soap.
        `,
        images: ["/posts/apothecary-diaries-1/castile_soap.png"],
        affiliateUrl: "https://amzn.to/46xYDzY",
        merchant: "Amazon",
      },
      {
        name: "16oz Glass Bottle + Pump",
        reason: `You can find 16oz glass bottles on amazon. If you decide to use essential oils for scent, I recommend an amber colored one, as light rays break down essential oils. 
        `,
        images: ["/posts/apothecary-diaries-1/amber_glass_pump_bottles.png"],
        affiliateUrl: "https://amzn.to/4gIlFc8",
        merchant: "Amazon",
      },
      {
        name: "Essential Oils (optional)",
        reason: `Amazon  has a few great starter sets that comes with different fragrances, including frankincense, peppermint, eucalyptus. There are so many uses for essential oils, and I will talk about them in later blog posts. Some of my favorite combinations are lavender + orange and eucalyptus + peppermint.
        `,
        images: ["/posts/apothecary-diaries-1/essential_oils.png"],
        affiliateUrl: "https://amzn.to/4nIF1Aa",
        merchant: "Amazon",
      },
      {
        name: "Distilled Water",
        reason: `
          Using distilled water helps extend shelf life by minimizing bacteria growth.
        `,
        images: ["/posts/apothecary-diaries-1/water.jpg"],
        affiliateUrl: null,
        merchant: "Amazon",
      },
      {
        name: "Aloe Vera Gel (optional)",
        reason: `
          Mix in one tsp of aloe vera gel for extra skin hydration. However, aloe tends to separate, so make sure to gently swish before using.`,
        images: ["/posts/apothecary-diaries-1/cold_pressed_aloe.png"],
        affiliateUrl: "https://amzn.to/3VszBx2",
        merchant: "Amazon",
      },
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
        name: "[1] How is the general public exposed to fragrance allergens? — European Commission",
        url: "https://ec.europa.eu/health/scientific_committees/opinions_layman/perfume-allergies/en/l-3/5-exposure-public.htm",
      },
      {
        name: "[2] Skip the Antibacterial Soap; Use Plain Soap and Water — FDA",
        url: "https://www.fda.gov/consumers/consumer-updates/skip-antibacterial-soap-use-plain-soap-and-water",
      },
      {
        name: "[3] Effect of soaps and detergents on epidermal barrier function — ScienceDirect",
        url: "https://www.sciencedirect.com/science/article/abs/pii/S0738081X11002252",
      },
      {
        name: "[4] Natural soap is clinically effective and more biodegradable than synthetic detergents - NIH Study",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12176228/",
      },
    ],
  },
];
