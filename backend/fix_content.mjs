// Quick script to update blog posts with full content using actual slugs
const API = process.env.API_BASE_URL || "http://localhost:8080";

const updates = [
  {
    slug: "weekend-balcony-bench-under-n25k-pallet-wood-lagos-friendly-finish-1",
    title:
      "Weekend Balcony Bench (Under ₦25k): Pallet Wood + Lagos-Friendly Finish",
    content:
      "If you've wanted a spot to sip zobo outside or catch a breeze at night, a simple balcony bench beats plastic chairs. This build is designed for small Lagos balconies: it's slim, quick to dry after rain, and friendly to rental walls (no drilling).\n\nMaterials: pallet or low‑cost pine boards, exterior screws, wood glue, four rubber feet, 120/220 grit sandpaper, and a low‑VOC oil finish. Tools: hand saw or jigsaw, drill/driver, square, and clamp if you have one.\n\nCut two 900 mm side rails, three 300 mm supports, and slats at 900 mm. Assemble a simple rectangle, then add the three supports: one at each end and one centered. Screw down the slats with a 5–7 mm gap for airflow. The gaps are important; they help the bench dry quickly after a shower and reduce mold.\n\nAdd rubber feet so wood never sits in pooled water. Round the front edges with sandpaper for comfort, smooth everything to 220 grit, then wipe dust with a slightly damp cloth. Apply a thin coat of low‑VOC oil (Danish or tung). In Lagos humidity, wipe off excess and let it cure longer than the can suggests. Re‑oil lightly every six months.\n\nStyling: one outdoor cushion, not four. Use a small basket under for flip‑flops, hang a simple rail on the wall for cups or herbs, and add a pot with scent leaf or mint. This little setup becomes the easiest place to catch your breath after a long day—no clutter, no fuss, and built in a weekend.",
  },
  {
    slug: "rental-walls-zero-holes-adhesive-rails-hooks-and-shelves-that-actually-hold-1",
    title:
      "Rental Walls, Zero Holes: Adhesive Rails, Hooks, and Shelves That Actually Hold",
    content:
      "In Nigerian rentals, you can add real storage without drilling. The keys are surface prep, weight distribution, and choosing hardware that tolerates humidity.\n\nPrep: clean surfaces with isopropyl alcohol, not detergent. Let it dry fully. Warm the adhesive with your hand, press for 30–60 seconds, and leave it overnight before loading.\n\nWhat works: full‑length adhesive picture ledges (weight is spread along the wall), rail systems with wide bases, and heavy‑duty utility hooks for bags. For kitchens, use a stainless rail with S‑hooks for ladles and a lid rack mounted with adhesive strips rated for bathrooms.\n\nWhat to avoid: small pads carrying big weight, sticking over dust or damp paint, and hanging near steam without ventilation. In humid months, check monthly and re‑press failing corners.\n\nMove‑out: peel slowly at 45 degrees after warming with a hairdryer. Any residue cleans with citrus adhesive remover and gentle rubbing—your deposit stays safe, your walls intact.",
  },
  {
    slug: "cook-once-eat-well-meal-prep-that-works-with-nepa-schedules-1",
    title: "Cook Once, Eat Well: Meal Prep That Works with NEPA Schedules",
    content:
      "Batch cooking that respects power cuts, small fridges, and real weeknight fatigue. Cook smart, not hard.\n\nSunday prep: make one big stew (pepper stew, tomato base, or palm nut), cook proteins in bulk (chicken, fish, beans), and parboil starches (yam, plantain, rice). Cool everything fast, store flat in containers, and label with dates.\n\nWeeknight assembly: reheat one protein + starch + stew in under 10 minutes. Add fresh vegetables (cucumber, lettuce, tomato) or quick sautéed greens. No elaborate cooking when you're tired.\n\nFridge strategy: store in single‑serving containers so you grab and go. Use freezer for overflow. Keep emergency tin tomatoes, seasoning cubes, and oil for when fresh supplies run low.\n\nPower‑cut backup: have one gas burner ready, keep drinking water stored, and know which meals work cold (salads, wraps, fruits). Simple systems beat complex plans when NEPA strikes.",
  },
];

async function updatePost(update) {
  try {
    const url = `${API}/admin/posts/${update.slug}`;
    const auth = "Basic " + Buffer.from("admin:password").toString("base64");

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
      body: JSON.stringify({
        title: update.title,
        content: update.content,
        excerpt: update.excerpt || "A practical guide for Nigerian homes.",
        readTime: "7 min read",
      }),
    });

    if (res.ok) {
      console.log(`✅ Updated: ${update.slug}`);
      return true;
    } else {
      const error = await res.text();
      console.error(`❌ Failed: ${update.slug} - ${error}`);
      return false;
    }
  } catch (e) {
    console.error(`❌ Error: ${update.slug} - ${e.message}`);
    return false;
  }
}

async function main() {
  let success = 0;
  for (const update of updates) {
    if (await updatePost(update)) {
      success++;
    }
  }
  console.log(`\n🎉 Updated ${success}/${updates.length} posts successfully!`);
}

main();
