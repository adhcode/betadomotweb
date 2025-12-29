// Usage:
// API_BASE_URL=https://your-api node seed_posts.mjs
// Defaults to http://localhost:8080

const API = process.env.API_BASE_URL || "http://localhost:8080";

const posts = [
  // DIY & Home Projects
  {
    title:
      "Weekend Balcony Bench (Under ₦25k): Pallet Wood + Lagos-Friendly Finish",
    excerpt:
      "A simple, sturdy balcony bench you can build in a day using pallet wood and a finish that survives Lagos humidity.",
    content:
      "Build a slim, slatted bench that dries fast after rain and fits small balconies. Use pallet wood or low-cost pine, rubber feet to avoid wicking, and a low-VOC oil finish for easy seasonal refresh.",
    readTime: "8 min read",
    featuredImage: "/images/blog/image1.jpg",
    tags: ["DIY", "Balcony", "Furniture"],
    images: [],
    category: "DIY & Home Projects",
    featured: false,
  },
  {
    title:
      "Rental Walls, Zero Holes: Adhesive Rails, Hooks, and Shelves That Actually Hold",
    excerpt:
      "Hang storage and art in a rental without drilling—what works on textured paint and in humidity.",
    content:
      "Clean with alcohol, press longer, and spread the load. Use rails with wide adhesive bases, picture ledges with full-length mounting tape, and leaning ladder shelves for heavier items.",
    readTime: "9 min read",
    featuredImage: "/images/blog/image2.jpg",
    tags: ["DIY", "Rental", "Storage"],
    images: [],
    category: "DIY & Home Projects",
    featured: false,
  },
  {
    title:
      "Quiet the Door: Foam, Felt, and Leather Strips That Cut Corridor Noise",
    excerpt:
      "A 90‑minute fix to reduce corridor noise, diesel hum, and dust sneaking through your front door.",
    content:
      "Seal the bottom gap with a sweep, add perimeter weatherstrip, and increase mass with a slim panel or heavy curtain. Immediate drop in noise and smells.",
    readTime: "6 min read",
    featuredImage: "/images/blog/image3.jpg",
    tags: ["DIY", "Noise", "Door"],
    images: [],
    category: "DIY & Home Projects",
    featured: false,
  },
  {
    title:
      "Paint That Survives Humidity: Low‑VOC, Quick‑Dry Picks for Nigerian Walls",
    excerpt:
      "Choose finishes and prep walls so paint resists damp, fumes, and everyday cleaning.",
    content:
      "Use low‑VOC acrylics, prime stubborn spots, and pick soft‑sheen or satin for wipeable, mold‑resistant walls. Ventilate longer in rainy months.",
    readTime: "7 min read",
    featuredImage: "/images/blog/image4.jpg",
    tags: ["Paint", "Humidity", "Finishes"],
    images: [],
    category: "DIY & Home Projects",
    featured: false,
  },
  // Energy & Sustainability
  {
    title:
      "From Gen to Inverter: A Realistic 2‑Bedroom Switch Plan (Costs + Wiring)",
    excerpt:
      "A step‑by‑step plan to move essential loads to an inverter without drama or waste.",
    content:
      "Identify essentials, pick a pure sine inverter, wire an essential sub‑board, and adopt habits that stretch runtime. Costs and options for batteries and solar add‑ons.",
    readTime: "10 min read",
    featuredImage: "/images/blog/image5.jpg",
    tags: ["Energy", "Inverter", "Savings"],
    images: [],
    category: "Energy & Sustainability",
    featured: false,
  },
  {
    title: "Fans vs AC in Lagos Heat: Comfort, Cost, and When Each Makes Sense",
    excerpt:
      "Use fans daily, AC strategically. The hybrid routine that saves money and keeps comfort.",
    content:
      "Cross‑ventilate, block sun, and pre‑cool with AC then switch to fans. Seal leaks to boost AC efficiency and use LED everywhere.",
    readTime: "8 min read",
    featuredImage: "/images/blog/image2.jpg",
    tags: ["Energy", "Cooling", "Comfort"],
    images: [],
    category: "Energy & Sustainability",
    featured: false,
  },
  {
    title: "Solar for Renters: Balcony Kits, Portable Batteries, and Bill Math",
    excerpt:
      "No roof? No problem. Balcony panels and power stations that beat blackouts.",
    content:
      "Start with a portable power station or a 200–300W balcony panel feeding a small inverter. Safe mounting, realistic yields, and etiquette for rentals.",
    readTime: "9 min read",
    featuredImage: "/images/blog/image3.jpg",
    tags: ["Solar", "Renters", "Power"],
    images: [],
    category: "Energy & Sustainability",
    featured: false,
  },
  // Home Health & Safety
  {
    title:
      "Air Quality Checklist for Nigerian Homes (Harmattan to Rainy Season)",
    excerpt:
      "Dust, damp, diesel fumes—simple steps to keep your indoor air safe all year.",
    content:
      "Seal gaps, ventilate smartly, and filter what you can. Bedroom purifier first, AC filter clean weekly in harmattan, and mold patrol in rainy months.",
    readTime: "10 min read",
    featuredImage: "/images/blog/image4.jpg",
    tags: ["Health", "Air", "Harmattan"],
    images: [],
    category: "Home Health & Safety",
    featured: true,
  },
  {
    title:
      "Rainy‑Season Damp and Mold: What Actually Works in Block/Cement Homes",
    excerpt:
      "Real fixes for damp patches, musty smells, and black corners—without repainting every month.",
    content:
      "Dry first, clean with the right agent, then prime and paint. Add airflow and fix external leaks to keep mold from returning.",
    readTime: "8 min read",
    featuredImage: "/images/blog/image5.jpg",
    tags: ["Mold", "Rainy Season", "Walls"],
    images: [],
    category: "Home Health & Safety",
    featured: false,
  },
  {
    title: "Safe Fumigation at Home: Family, Pets, and Food‑Area Precautions",
    excerpt:
      "Target pests, not people. Baits and crevice treatments beat fogging the whole house.",
    content:
      "Use gel baits for roaches, ant bait stations, and limited residuals in crevices. Cover food zones and ventilate on re‑entry.",
    readTime: "7 min read",
    featuredImage: "/images/blog/image1.jpg",
    tags: ["Pest", "Safety", "Family"],
    images: [],
    category: "Home Health & Safety",
    featured: false,
  },
  // Afrocentric Living & Inspiration
  {
    title: "Calabash to Console: Styling African Pieces in Modern Apartments",
    excerpt:
      "Warm, grounded rooms—how to place African elements without visual noise.",
    content:
      "Start with one anchor piece, layer textiles (Ankara, Aso‑Oke, Adire), and repeat tones in neutral rooms for harmony.",
    readTime: "9 min read",
    featuredImage: "/images/blog/image2.jpg",
    tags: ["Style", "African", "Decor"],
    images: [],
    category: "Afrocentric Living & Inspiration",
    featured: false,
  },
  {
    title:
      "Layering Ankara, Aso‑Oke, and Adire: Textiles That Warm Small Spaces",
    excerpt:
      "Mix beloved textiles with modern neutrals—rules for color, scale, and care.",
    content:
      "Choose a base palette, let one textile be the voice, and keep care practical with removable covers and shade drying.",
    readTime: "7 min read",
    featuredImage: "/images/blog/image3.jpg",
    tags: ["Textiles", "Style", "Small Space"],
    images: [],
    category: "Afrocentric Living & Inspiration",
    featured: false,
  },
  {
    title:
      "Entryway Pride: Benches, Baskets, and Wall Art That Greet Like Home",
    excerpt:
      "A Nigerian entry that handles shoes, bags, and deliveries—while feeling proud and calm.",
    content:
      "Anchor with a slim bench, use a lidded box or basket for shoes, adhesive hooks for caps, and one textile/art note.",
    readTime: "6 min read",
    featuredImage: "/images/blog/image4.jpg",
    tags: ["Entryway", "Storage", "Style"],
    images: [],
    category: "Afrocentric Living & Inspiration",
    featured: false,
  },
  {
    title:
      "Balcony Herb Gardens with Hausa Clay Pots: Flavor, Fragrance, and Care",
    excerpt:
      "Grow scent leaf, basil, mint, and thyme in breathable clay pots—no farm experience required.",
    content:
      "Use light, draining soil; water deeply when top soil dries; and place for 4–6 hours of sun. Neem oil for pests.",
    readTime: "7 min read",
    featuredImage: "/images/blog/image5.jpg",
    tags: ["Garden", "Balcony", "Herbs"],
    images: [],
    category: "Afrocentric Living & Inspiration",
    featured: false,
  },
  // Smart Home & Tech
  {
    title: "Smart Switches That Survive Power Cuts: Starter Kit Under ₦60k",
    excerpt:
      "Pick devices with state restore, decent surge tolerance, and local fallback—then wire safely.",
    content:
      "Start with two smart switches, two smart plugs, and a surge‑protected router. Neutral/no‑neutral options and Matter vs Tuya basics.",
    readTime: "8 min read",
    featuredImage: "/images/blog/image1.jpg",
    tags: ["Smart Home", "Switches", "Power"],
    images: [],
    category: "Smart Home & Tech",
    featured: false,
  },
  {
    title:
      "DIY Security: Budget CCTV, Smart Doorbells, and Neighbour‑Friendly Alerts",
    excerpt:
      "Clear camera views, respectful alerts, and storage that works during internet downtime.",
    content:
      "Cover the door, balcony, and corridor line with a battery doorbell and one indoor cam; microSD/local hub saves cloud fees.",
    readTime: "9 min read",
    featuredImage: "/images/blog/image2.jpg",
    tags: ["Security", "CCTV", "Doorbell"],
    images: [],
    category: "Smart Home & Tech",
    featured: false,
  },
  {
    title: "Concrete Walls, Strong Wi‑Fi: Mesh vs Extenders in Nigerian Flats",
    excerpt:
      "Beat dead zones with correct placement and the right hardware—when to pick mesh vs an extender.",
    content:
      "Put nodes in line‑of‑sight doorways, wire one backhaul if you can, and fix channels to avoid yo‑yo band steering.",
    readTime: "7 min read",
    featuredImage: "/images/blog/image3.jpg",
    tags: ["Wi‑Fi", "Mesh", "Extender"],
    images: [],
    category: "Smart Home & Tech",
    featured: false,
  },
  // Kitchen & Daily Living
  {
    title: "Cook Once, Eat Well: Meal Prep That Works with NEPA Schedules",
    excerpt:
      "Batch cooking that respects power cuts, small fridges, and real weeknight fatigue.",
    content:
      "Prep stews, proteins, and parboiled starches; cool fast, store flat, and assemble 5‑minute dinners on busy nights.",
    readTime: "8 min read",
    featuredImage: "/images/blog/image4.jpg",
    tags: ["Meal Prep", "Kitchen", "NEPA"],
    images: [],
    category: "Kitchen & Daily Living",
    featured: false,
  },
  {
    title: "Small Kitchen, Big Order: Basket Systems, Wall Rails, and Labeling",
    excerpt:
      "Create zones, use baskets as drawers, and keep counters clear with a rail + lid rack combo.",
    content:
      "Prep, cook, clean, and tea zones; vertical lid rack, magnetic knife strip, and monthly 20‑minute reset.",
    readTime: "7 min read",
    featuredImage: "/images/blog/image5.jpg",
    tags: ["Kitchen", "Organization", "Storage"],
    images: [],
    category: "Kitchen & Daily Living",
    featured: false,
  },
  {
    title:
      "Water You Can Trust: Filters for Borehole, Tanker, and Sachet Realities",
    excerpt:
      "A layered filtration plan that improves taste and safety without waste.",
    content:
      "Sediment + carbon for most homes; RO for tricky dissolved solids; UV for questionable tanker sources. Simple maintenance schedule.",
    readTime: "9 min read",
    featuredImage: "/images/blog/image1.jpg",
    tags: ["Water", "Filters", "Health"],
    images: [],
    category: "Kitchen & Daily Living",
    featured: false,
  },
];

async function seed() {
  let created = 0;
  for (const p of posts) {
    try {
      const res = await fetch(`${API}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p),
      });
      if (!res.ok) {
        const t = await res.text();
        console.error("Failed:", p.title, res.status, t);
        continue;
      }
      const data = await res.json();
      console.log("Created:", p.title, "→ slug:", data.slug);
      created++;
    } catch (e) {
      console.error("Error creating:", p.title, e);
    }
  }
  console.log(`\nSeed complete. Created ${created}/${posts.length} posts.`);
}

seed();
