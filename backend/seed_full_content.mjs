// Run with:
// API_BASE_URL=https://betadomotweb-production.up.railway.app node backend/seed_full_content.mjs
// Or for local:
// API_BASE_URL=http://localhost:8080 node backend/seed_full_content.mjs

const API = process.env.API_BASE_URL || "http://localhost:8080";

// Simple slugify to match backend slug generation closely
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Helper to build a rich paragraph block
function p(strings) {
  return strings.join(" ").replace(/\s+/g, " ").trim();
}

// Map title -> { excerpt, content, readTime }
const updates = [
  {
    title:
      "Weekend Balcony Bench (Under ₦25k): Pallet Wood + Lagos-Friendly Finish",
    excerpt:
      "Build a slim, slatted balcony bench that dries fast after rain and fits small Lagos balconies—pallet wood, rubber feet, and a durable low‑VOC oil finish.",
    content: [
      p`If you’ve wanted a spot to sip zobo outside or catch a breeze at night, a simple balcony bench beats plastic chairs. This build is designed for small Lagos balconies: it’s slim, quick to dry after rain, and friendly to rental walls (no drilling).`,
      p`Materials: pallet or low‑cost pine boards, exterior screws, wood glue, four rubber feet, 120/220 grit sandpaper, and a low‑VOC oil finish. Tools: hand saw or jigsaw, drill/driver, square, and clamp if you have one.`,
      p`Cut two 900 mm side rails, three 300 mm supports, and slats at 900 mm. Assemble a simple rectangle, then add the three supports: one at each end and one centered. Screw down the slats with a 5–7 mm gap for airflow. The gaps are important; they help the bench dry quickly after a shower and reduce mold.`,
      p`Add rubber feet so wood never sits in pooled water. Round the front edges with sandpaper for comfort, smooth everything to 220 grit, then wipe dust with a slightly damp cloth. Apply a thin coat of low‑VOC oil (Danish or tung). In Lagos humidity, wipe off excess and let it cure longer than the can suggests. Re‑oil lightly every six months.`,
      p`Styling: one outdoor cushion, not four. Use a small basket under for flip‑flops, hang a simple rail on the wall for cups or herbs, and add a pot with scent leaf or mint. This little setup becomes the easiest place to catch your breath after a long day—no clutter, no fuss, and built in a weekend.`,
    ].join("\n\n"),
    readTime: "8 min read",
  },
  {
    title:
      "Rental Walls, Zero Holes: Adhesive Rails, Hooks, and Shelves That Actually Hold",
    excerpt:
      "Hang storage and art in rentals without drilling—what sticks on textured paint in humidity, and how to avoid damage at move‑out.",
    content: [
      p`In Nigerian rentals, you can add real storage without drilling. The keys are surface prep, weight distribution, and choosing hardware that tolerates humidity.`,
      p`Prep: clean surfaces with isopropyl alcohol, not detergent. Let it dry fully. Warm the adhesive with your hand, press for 30–60 seconds, and leave it overnight before loading.`,
      p`What works: full‑length adhesive picture ledges (weight is spread along the wall), rail systems with wide bases, and heavy‑duty utility hooks for bags. For kitchens, use a stainless rail with S‑hooks for ladles and a lid rack mounted with adhesive strips rated for bathrooms.`,
      p`What to avoid: small pads carrying big weight, sticking over dust or damp paint, and hanging near steam without ventilation. In humid months, check monthly and re‑press failing corners.`,
      p`Move‑out: peel slowly at 45 degrees after warming with a hairdryer. Any residue cleans with citrus adhesive remover and gentle rubbing—your deposit stays safe, your walls intact.`,
    ].join("\n\n"),
    readTime: "9 min read",
  },
  {
    title:
      "Quiet the Door: Foam, Felt, and Leather Strips That Cut Corridor Noise",
    excerpt:
      "A 90‑minute fix for corridor noise, diesel hum, and dust—seal the door sweep, add perimeter strips, and increase mass with a subtle curtain.",
    content: [
      p`Most noise sneaks through gaps, not just the door panel. Close those gaps and you’ll feel the calm.`,
      p`Start with the bottom: a quality door sweep seals the largest opening and blocks dust. Next, add adhesive weatherstrip around the jamb—compressible foam for uneven frames, felt or leather where you want a cleaner look.`,
      p`If diesel hum still gets in, add mass: a slim MDF panel on the inner face or a heavy curtain on a ceiling track. Keep airflow with a 5–10 mm gap to the floor.`,
      p`Result: fewer smells, quieter evenings, and less dust on the console. It’s the cheapest “renovation” you can do in under two hours.`,
    ].join("\n\n"),
    readTime: "6 min read",
  },
  {
    title:
      "Paint That Survives Humidity: Low‑VOC, Quick‑Dry Picks for Nigerian Walls",
    excerpt:
      "Pick low‑VOC acrylics, prime problem patches, and use soft‑sheen in busy rooms—wipeable, mold‑resistant, and kinder to indoor air.",
    content: [
      p`Humidity, diesel soot, and frequent cleaning punish walls. Choose products and prep that last through rainy season.`,
      p`Use low‑VOC acrylics for bedrooms and living areas. In kitchens and corridors, soft‑sheen or satin gives you wipeability without gloss glare. Prime stubborn damp patches with stain‑blocking primer after drying them properly.`,
      p`Technique: cut in first, roll in a W pattern, and keep a wet edge. Ventilate well and extend drying times during rainy months.`,
      p`Finishing touches: swap to warm LEDs, clean switch plates, and run a microfiber over walls monthly—small habits keep paint fresh for years.`,
    ].join("\n\n"),
    readTime: "7 min read",
  },
  {
    title:
      "From Gen to Inverter: A Realistic 2‑Bedroom Switch Plan (Costs + Wiring)",
    excerpt:
      "Move essential loads to an inverter without drama: sub‑board, battery sizing, and habits that stretch runtime—plus realistic costs.",
    content: [
      p`Start by listing essentials: router, lights, TV, a fan per room, phone/laptop charging, and maybe a small fridge. That load guides inverter size and battery capacity.`,
      p`Pick a pure sine inverter (1–2 kVA for essentials), then ask your electrician to create an “essentials” sub‑board. Label clearly so heavy appliances stay on the generator/public supply line.`,
      p`Batteries: two 12 V 200 Ah GELs are a common start. If budget allows, go lithium for lighter weight and deeper cycles. Wire safely with proper fusing.`,
      p`Habits: switch fans to low at night, pre‑cool with AC on public power, and avoid kettles or irons on the inverter. Add solar later (300–600 W) to top up daily, even in Lagos weather.`,
      p`Costs vary by brand and cable runs, but do the math once and you’ll cut fuel and noise immediately—while keeping the home running.`,
    ].join("\n\n"),
    readTime: "10 min read",
  },
  {
    title: "Fans vs AC in Lagos Heat: Comfort, Cost, and When Each Makes Sense",
    excerpt:
      "Use fans daily, AC strategically. Block sun, cross‑ventilate, and pre‑cool—save money while staying comfortable.",
    content: [
      p`Comfort isn’t only about cold air—it’s airflow, shade, and timing. Use fans for daily comfort and run AC in short, targeted bursts.`,
      p`Morning: keep windows shaded, run fans, and block east sun with curtains. Evening: pre‑cool rooms with AC for 20–30 minutes, then switch to fans.`,
      p`Maintenance: clean fan blades monthly, wash AC filters (weekly in harmattan), and seal window/door leaks that waste cool air.`,
      p`Result: a cooler flat without painful bills—and far better sleep.`,
    ].join("\n\n"),
    readTime: "8 min read",
  },
  {
    title: "Solar for Renters: Balcony Kits, Portable Batteries, and Bill Math",
    excerpt:
      "No roof? Try a 200–300 W balcony panel and a small inverter—or a portable power station—for practical backup on a budget.",
    content: [
      p`Renters can still taste solar freedom. A balcony panel feeding a charge controller and small inverter can run lights, router, fans, and charge devices.`,
      p`Mount safely on rails with proper clamps, run tidy cables, and use a lock. If your balcony is shaded, a portable power station charged at work or when public power is on may be smarter.`,
      p`Track usage and do the bill math; many households cut generator hours noticeably with this setup.`,
    ].join("\n\n"),
    readTime: "9 min read",
  },
  {
    title:
      "Air Quality Checklist for Nigerian Homes (Harmattan to Rainy Season)",
    excerpt:
      "Dust, damp, diesel fumes—seal, ventilate, and filter what you can. Bedroom purifier first; clean AC filters weekly in harmattan.",
    content: [
      p`Harmattan brings fine dust; rainy months bring damp and mold risk. Keep indoor air healthy with a simple seasonal routine.`,
      p`Seal door gaps, ventilate daily in short bursts, and run a HEPA purifier in bedrooms if budget allows. Clean AC filters weekly in dusty months.`,
      p`For damp: fix leaks, improve airflow, and use a small dehumidifier or “fan + dry packs” in wardrobes.`,
      p`This isn’t perfection—just a steady plan that protects breathing and sleep.`,
    ].join("\n\n"),
    readTime: "10 min read",
  },
  {
    title:
      "Rainy‑Season Damp and Mold: What Actually Works in Block/Cement Homes",
    excerpt:
      "Dry first, clean properly, then prime and paint. Add airflow and fix external leaks so mold doesn’t return.",
    content: [
      p`Mold needs moisture and still air. Remove both and you win.`,
      p`Dry the area with fans and sunlight where possible. Clean with the right agent (diluted bleach for tiles, specialized mold remover for paint), rinse, and let it dry again.`,
      p`Prime stained patches and repaint with a quality acrylic. Add cross‑ventilation or a small dehumidifier in problem rooms.`,
    ].join("\n\n"),
    readTime: "8 min read",
  },
  {
    title: "Safe Fumigation at Home: Family, Pets, and Food‑Area Precautions",
    excerpt:
      "Target pests, not people. Use baits and crevice treatments over fogging the whole house; ventilate before re‑entry.",
    content: [
      p`Roaches and ants respond best to baits placed where they travel. For occasional spiders or mosquitoes, use targeted sprays in corners and under sinks, not clouds in living spaces.`,
      p`Cover food areas, move pet bowls, and ventilate thoroughly after treatment. Rinse kitchen surfaces before cooking again.`,
    ].join("\n\n"),
    readTime: "7 min read",
  },
  {
    title: "Calabash to Console: Styling African Pieces in Modern Apartments",
    excerpt:
      "Ground your rooms with one anchor piece, then layer textiles and repeat tones for harmony—zero clutter, full warmth.",
    content: [
      p`Afrocentric doesn’t have to mean busy. Pick one statement—calabash, carved stool, woven basket—then repeat its tone in cushions or art.`,
      p`Use neutral backdrops, natural textures, and warm light. The space stays calm; the culture feels present.`,
    ].join("\n\n"),
    readTime: "9 min read",
  },
  {
    title:
      "Layering Ankara, Aso‑Oke, and Adire: Textiles That Warm Small Spaces",
    excerpt:
      "Choose a base palette, let one textile lead, and keep care practical with removable covers and shade drying.",
    content: [
      p`Pick 2–3 colors across textiles so the eye rests. In small rooms, let one fabric lead and keep others quieter.`,
      p`Care: shade‑dry, gentle wash cycles, and removable cushion covers so textiles last.`,
    ].join("\n\n"),
    readTime: "7 min read",
  },
  {
    title:
      "Entryway Pride: Benches, Baskets, and Wall Art That Greet Like Home",
    excerpt:
      "A Nigerian entry that handles shoes, bags, and deliveries—while feeling calm and welcoming.",
    content: [
      p`Give every item a home: a slim bench, a lidded shoe basket, adhesive hooks for caps and masks, and one piece of art or textile to greet you.`,
      p`Keep mop/broom behind the door, add a tray for keys, and you’ll stop tripping over “arrival chaos.”`,
    ].join("\n\n"),
    readTime: "6 min read",
  },
  {
    title:
      "Balcony Herb Gardens with Hausa Clay Pots: Flavor, Fragrance, and Care",
    excerpt:
      "Grow scent leaf, basil, mint, and thyme in breathable clay pots. Light soil, deep watering, and neem oil keep them happy.",
    content: [
      p`Clay pots breathe and keep roots cooler. Use a light, draining mix; water deeply when the top inch is dry. 4–6 hours of sun is perfect for most herbs.`,
      p`Feed lightly every two weeks, pinch often to keep herbs bushy, and treat pests with neem oil in the evening.`,
    ].join("\n\n"),
    readTime: "7 min read",
  },
  {
    title: "Smart Switches That Survive Power Cuts: Starter Kit Under ₦60k",
    excerpt:
      "Start with two smart switches and two smart plugs; pick devices with state restore and surge protection, and wire safely.",
    content: [
      p`Power cuts are normal—your devices should remember their last state. Look for “state restore” and decent surge tolerance in the spec sheet.`,
      p`Begin with living‑room lights and a bedroom fan. Use a surge‑protected router and consider platforms with local control so automations still run when the internet doesn’t.`,
    ].join("\n\n"),
    readTime: "8 min read",
  },
  {
    title:
      "DIY Security: Budget CCTV, Smart Doorbells, and Neighbour‑Friendly Alerts",
    excerpt:
      "Cover the door and corridor line with a battery doorbell and one indoor cam. Store locally and set respectful motion zones.",
    content: [
      p`Start where it matters: the front door. A smart doorbell covers visitors and packages; a single indoor cam looks down the corridor.`,
      p`Use local microSD or a hub to avoid monthly fees. Set motion zones so neighbours aren’t constantly pinged.`,
    ].join("\n\n"),
    readTime: "9 min read",
  },
  {
    title: "Concrete Walls, Strong Wi‑Fi: Mesh vs Extenders in Nigerian Flats",
    excerpt:
      "Beat dead zones by placing nodes along doorways, wiring one backhaul if you can, and fixing channels to avoid yo‑yo band steering.",
    content: [
      p`Concrete swallows Wi‑Fi. Mesh systems win in most flats if you place nodes correctly—roughly along the path from router to dead room, near doorways.`,
      p`If you can wire one Ethernet backhaul between nodes, do it. Fix channels to reduce interference, and name SSIDs the same only if the system handles roaming well.`,
    ].join("\n\n"),
    readTime: "7 min read",
  },
  {
    title: "Cook Once, Eat Well: Meal Prep That Works with NEPA Schedules",
    excerpt:
      "Batch cook stews and proteins, cool fast, store flat, and assemble 5‑minute dinners on busy nights—even with outages.",
    content: [
      p`Real life: light goes, you’re tired, and the fridge is small. Cook base stews and proteins on weekends, cool quickly in shallow trays, and store flat in labeled pouches.`,
      p`On weeknights, assemble: warm sauce, add protein, boil starch, and finish with fresh veg. Less stress, less waste.`,
    ].join("\n\n"),
    readTime: "8 min read",
  },
  {
    title: "Small Kitchen, Big Order: Basket Systems, Wall Rails, and Labeling",
    excerpt:
      "Create prep, cook, clean, and tea zones. Use baskets as drawers, a rail for everyday tools, and a monthly 20‑minute reset.",
    content: [
      p`Zones stop traffic jams in cramped kitchens. Put tools where you use them: knives near prep, spices by the cooker, and mugs above the kettle.`,
      p`Use baskets as pull‑out drawers on open shelves. A wall rail with S‑hooks clears counters and keeps tools visible. End each month with a 20‑minute reset to toss duplicates and expired goods.`,
    ].join("\n\n"),
    readTime: "7 min read",
  },
  {
    title:
      "Water You Can Trust: Filters for Borehole, Tanker, and Sachet Realities",
    excerpt:
      "A layered plan that improves taste and safety: sediment + carbon for most homes; RO for tough dissolved solids; UV for questionable tanker sources.",
    content: [
      p`Water sources vary wildly across Nigerian cities. Start with a basic test and build layers: sediment to remove rust/sand, carbon to improve taste and reduce chlorine and odors.`,
      p`Where dissolved solids are high, add RO at the kitchen tap; keep RO for drinking/cooking only to reduce waste. For questionable tanker deliveries, add UV after carbon.`,
      p`Maintain cartridges on schedule and sanitize tanks annually. Better taste, safer cups of tea, fewer plastic bottles.`,
    ].join("\n\n"),
    readTime: "9 min read",
  },
];

async function updateOne({ title, excerpt, content, readTime }) {
  const slug = slugify(title);
  const url = `${API}/admin/posts/${slug}`;
  const body = {
    title,
    excerpt,
    content,
    readTime,
    featuredImage: "",
    tags: [],
    images: [],
    category: undefined,
    featured: undefined,
  };
  const user = process.env.ADMIN_USERNAME || "admin";
  const pass = process.env.ADMIN_PASSWORD || "password";
  const auth = "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");
  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: auth },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const t = await res.text();
      console.error("Update failed:", slug, res.status, t);
      return false;
    }
    console.log("Updated:", slug);
    return true;
  } catch (e) {
    console.error("Error updating:", slug, e);
    return false;
  }
}

(async function run() {
  let ok = 0;
  for (const u of updates) {
    const res = await updateOne(u);
    if (res) ok++;
  }
  console.log(`\nDone. Updated ${ok}/${updates.length} posts.`);
})();
