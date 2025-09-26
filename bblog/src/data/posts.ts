export type MerchantType = "Amazon" | "Awin";

export type Post = {
  id: string;
  title: string;
  // m-d-y
  date: string;
  thumbnailUrl?: string;
  intro: string;
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
  {
    id: "healthy-kitchen-swaps",
    title: "5 Healthy Kitchen Swaps You Can Start Today",
    date: "09-24-2025",
    thumbnailUrl: "/posts/healthy-kitchen-swaps/cover.png",
    disclosure:
      "This post may contain affiliate links. Please read my entire disclaimer here.",
    intro:
      "Growing up at my grandparents’ house, they spent hours in the kitchen creating meals and memories for me. I remember them fondly. To save money, they used anything they could get their hands on, which often turned out to be cheap and plastic.  The tools we use to create nourishing meals should be safe for us and our loved ones. From cookware, to cleaning, most items today are designed to be plastic heavy, disposable, and to be replaced often.\n\nBy slowly replacing a few everyday products with some more sustainable alternatives, you’ll reduce waste, avoid hidden toxins, and save money over time. In this post, I’ll share some of the no brainer changes I’ve made in my own kitchen, and guide you to upgrade yours today. Most of these alternatives are affordable and easy to find at your local store or Amazon.",
    tags: ["kitchen", "health", "eco-friendly", "non-toxic", "sustainability"],
    sections: [
      {
        heading: "Plastic Food Containers",
        content:
          "As tempting and convenient as it is to reuse plastic take out containers and food containers, Bisphenol-A (BPAs) and other microplastics can leach into our food, especially when they’re exposed to heat and acidic compounds [1]. Growing up in an immigrant household, my parents collected out plastic takeout containers, washed, reused, and hoarded them as if there were no tomorrow.\nConsider switching to glass containers, which can withstand heat, don’t warp, and are easy to wash. Best of all, they don’t retain odor and stains. You can safely reheat food in glass containers as they don’t release chemicals.\nhttps://amzn.to/46jT7lF\nRubbermaid glass containers\nhttps://amzn.to/46sEawc\nCaraway also makes some lovely looking sets of glass containers. I personally use them to store items such as flour and sugar. They’ve held up nicely over a few years and stack neatly to save space.",
      },
      {
        heading: "Plastic Cutting Boards",
        content:
          "At one point in my life, I was working as a bartender. We would be required to cut fresh fruits for garnishes daily, and the owners bought the bar a thick plastic cutting board.. After just a few months of use, you could see the black cut marks where the knife scraped off the plastic. Within 3 years, the board, now littered with slash marks, had to be replaced.  Plastic cutting boards wear quickly and release microscopic plastic shavings into your food. Overtime, these microplastics end up in your meals and inside your body.[2]\n\nAn alternative to plastic, cutting boards made with wood or bamboo are more durable. Natural materials are also naturally antimicrobial and safer for us.  Studies show that bacteria survive longer on plastic cutting boards, while wood naturally reduces contamination. After 12 hours, bacteria on wood were almost completely gone. [3] Don’t assume that natural materials are fragile - many of them are dishwasher safe as well.\n\nhttps://amzn.to/4ni2rfL",
      },
      {
        heading: "Teflon coated pans",
        content:
          "Did you know?\nTeflon was accidentally discovered in the 30s when Dr. Roy Plunkett realized polytetrafluoroethylene (PTFE), allowed things to slide off of very easily. That’s why food doesn’t stick to Teflon pans, and why many industries use it to coat surfaces that need to resist sticking or buildup. [4] Teflon’s “slipperiness” is what makes it so famous in cookware, but these same properties also mean it doesn’t break down easily in the environment. This incredible durability raises concerns about microplastics and forever chemicals (PFAS) allowed into our homes and our food.\n\nScratched or overheated PTFE-coated pans release toxic fumes, which have been linked to environmental pollution and health risks, including Polymer Fumer Fever (a flu-like illness)[5]. PTFE fragments may also contaminate food as they degrade over time.“The researchers used metal and wooden utensils with both old and new nonstick cookware … they all caused tiny abrasions to the coating, which released PTFE particles.” [6] Experts now recommend stainless steel, cast iron, or ceramic as safer alternatives to nonstick.\n\nStainless steel pans are a strong alternative to nonstick. They’re virtually indestructible and dont release particles into our food. I did suffer a steep learning curve while using them (especially around heat control), but your body - and your kitchen environment - will thank you. Stainless steel is generally considered safe and stable under normal cooking conditions [7].\n\nAlso consider cast iron skillets and ceramic cookware to cook.\nCast iron that is prepared and properly seasoned is free of PTFE and phthalates. Many home cooks say it ages very well.\nCeramic-coated cookware is also a great PFAS free alternative. It doesn't rely on fluoropolymers like Teflon, so it avoids the particle concerns associated with PTFE. [8]\n\n\nhttps://amzn.to/46B5xVe\nCuisinart is a great beginner’s stainless steel pan. I like this one because it doesn’t break the bank, and the cooler handle helps me avoid burns.\nhttps://amzn.to/3VwIh5C\nI use these small cast iron skillets to make my delicious shakshouka brunch every few weeks. (recipe coming soon!)",
      },
      {
        heading: "Bleached parchment paper",
        content:
          "I love baking banana bread. It’s decadent, moist, and makes the kitchen smell wonderful for hours. But the cheap, bleached parchment paper at the store? Skip that. Chlorine-bleached parchment can release small amounts of chemicals when it’s heated, and worst of all, it’s a single use product. A better option would be reusable silicone baking mats that can be reused hundreds of times.[9]. Another great alternative would be to use unbleached parchment paper made from sustainably sourced fibers, such as hemp, bamboo, wood pulp, or recycled paper fibers.\nhttps://amzn.to/3VwIh5C\nAmazon Basics Silicone Baking Mat\n\nOr unbleached parchment paper such as those made by If You Care.\nhttps://amzn.to/3VwIh5C",
      },
      {
        heading: "Dish Soap",
        content:
          "Dawn produced some commercials in the 90s where the wildlife rescue workers cleaned wildlife stained with oil using their dish soap. This marketing campaign convinced me it was gentle enough to wash my pets with. Reality is, mainstream soaps such as Dawn contain synthetic fragrances, dyes, and surfactants. Surfactants are great for degreasing, but are so harsh on our skin, pipes, and waterways. Recent studies also show that common detergent chemicals can damage the gut barrier, which raises concerns about long-term health effects. [11].\n\nDon’t sacrifice cheap for safety. Eco-friendly soaps use biodegradable and plant-based ingredients and many of them come in refillable options. The Environmental Working Group (EWG) verifies all these ingredients for safety. Their website has a wealth of information and a great database of products with chemicals listed.\n\nhttps://amzn.to/4nIOW8y\nAspenClean dishwashing pods (EWG certified)\nhttps://amzn.to/3KBZt7h\nBranch Basics Dishwasher Tablets  (EWG certified)\nhttps://amzn.to/47WH0w7\nAspenclean Dish soap and refill.(EWG certified)\n\nAll this information can get overwhelming - I’ve been there.  I believe that many of us continue to use harmful products because we’re just unaware of the truth, or we believe that healthy options are just too expensive. Start with just one or two swaps - maybe a stainless steel pan to fry your eggs or by switching to a EWG verified cleaner, and build from there. Over time, these changes will add up to a healthier home and a smaller eco-footprint.\n\nLiving in the 21st century, we’re uniquely blessed to have so much information at our fingertips. The research is constantly evolving - we can stay responsible for ourselves and our families when we choose better options for everyday life.",
      },
    ],
    sources: [
      {
        name: "[1]https://pmc.ncbi.nlm.nih.gov/articles/PMC9552567/",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9552567/",
      },
      {
        name: "[2]https://pubmed.ncbi.nlm.nih.gov/37220346/",
        url: "https://pubmed.ncbi.nlm.nih.gov/37220346/",
      },
      {
        name: "[3]https://pubmed.ncbi.nlm.nih.gov/31113021/",
        url: "https://pubmed.ncbi.nlm.nih.gov/31113021/",
      },
      {
        name: "[4]https://www.teflon.com/en/news-events/history",
        url: "https://www.teflon.com/en/news-events/history",
      },
      {
        name: "[5]https://www.ewg.org/research/canaries-kitchen",
        url: "https://www.ewg.org/research/canaries-kitchen",
      },
      {
        name: "[6]https://www.medicalnewstoday.com/articles/are-nonstick-pans-toxic",
        url: "https://www.medicalnewstoday.com/articles/are-nonstick-pans-toxic",
      },
      {
        name: "[7]https://nutritionfacts.org/blog/is-stainless-steel-or-cast-iron-cookware-best-is-teflon-safe/",
        url: "https://nutritionfacts.org/blog/is-stainless-steel-or-cast-iron-cookware-best-is-teflon-safe/",
      },
      {
        name: "[8]https://www.foodandwine.com/lifestyle/kitchen/best-non-toxic-cookware",
        url: "https://www.foodandwine.com/lifestyle/kitchen/best-non-toxic-cookware",
      },
      {
        name: "[9]https://www.sciencedirect.com/science/article/pii/S0048969724027232",
        url: "https://www.sciencedirect.com/science/article/pii/S0048969724027232",
      },
      {
        name: "[10]https://www.jacionline.org/article/S0091-6749%2822%2901477-4/fulltext",
        url: "https://www.jacionline.org/article/S0091-6749%2822%2901477-4/fulltext",
      },
      {
        name: "[11]https://pubmed.ncbi.nlm.nih.gov/14728695/",
        url: "https://pubmed.ncbi.nlm.nih.gov/14728695/",
      },
    ],
  },
];

// Empty placeholder post
// {
//   id: "",
//   title: "",
//   date: "",
//   intro: "",
//   tags: [],
//   sections: [],
// }
