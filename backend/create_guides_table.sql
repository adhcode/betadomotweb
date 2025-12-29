-- Create guides table for Supabase (PostgreSQL)
CREATE TABLE IF NOT EXISTS guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb, -- JSON array of tags
    featured_image TEXT,
    read_time TEXT DEFAULT '5 min read',
    views INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_guides_category ON guides(category);
CREATE INDEX IF NOT EXISTS idx_guides_slug ON guides(slug);
CREATE INDEX IF NOT EXISTS idx_guides_featured ON guides(featured);
CREATE INDEX IF NOT EXISTS idx_guides_published_at ON guides(published_at);

-- Enable Row Level Security (RLS)
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON guides
    FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users full access" ON guides
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample guides for each category
INSERT INTO guides (slug, title, description, content, category, tags, featured_image, read_time, featured) VALUES
-- Cleaning guides
('complete-home-cleaning-schedule', 'The Complete Home Cleaning Schedule', 'A room-by-room guide to keeping your home spotless', 
'# The Complete Home Cleaning Schedule

Keeping your home clean doesn''t have to be overwhelming. With the right schedule and approach, you can maintain a spotless home without spending all your free time cleaning.

## Daily Tasks (15-20 minutes)
- Make beds
- Wipe down kitchen counters
- Load/unload dishwasher
- Quick bathroom wipe-down
- 10-minute pickup

## Weekly Tasks
### Monday - Kitchen Deep Clean
- Clean appliances inside and out
- Scrub sink and faucet
- Mop floors
- Clean out refrigerator

### Tuesday - Bathrooms
- Scrub toilets, tubs, and showers
- Clean mirrors and fixtures
- Mop floors
- Replace towels

### Wednesday - Bedrooms
- Change bed linens
- Dust furniture
- Vacuum floors
- Organize closets

### Thursday - Living Areas
- Dust all surfaces
- Vacuum furniture
- Clean windows
- Organize entertainment center

### Friday - Floors and Baseboards
- Vacuum all carpets
- Mop hard floors
- Clean baseboards
- Spot clean walls

## Monthly Deep Cleaning
- Clean inside of oven
- Wash windows inside and out
- Deep clean carpets
- Organize storage areas
- Clean light fixtures

## Seasonal Tasks
- Clean out gutters
- Wash exterior of house
- Deep clean garage
- Organize seasonal items

## Tips for Success
1. Set a timer for each task
2. Play upbeat music
3. Get the whole family involved
4. Reward yourself after completing tasks
5. Don''t try to do everything in one day

Remember, consistency is key. It''s better to do a little bit each day than to let everything pile up and feel overwhelmed.', 
'cleaning', '["schedule", "routine", "organization", "home maintenance"]'::jsonb, 
'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop', '8 min read', TRUE),

('natural-cleaning-solutions', 'Natural Cleaning Solutions', 'Safe, effective cleaning with everyday ingredients', 
'# Natural Cleaning Solutions

Clean your home safely and effectively using ingredients you probably already have in your kitchen. These natural solutions are better for your family, pets, and the environment.

## All-Purpose Cleaner
**Ingredients:**
- 1 cup white vinegar
- 1 cup water
- 10-15 drops essential oil (optional)

Mix in a spray bottle. Perfect for counters, sinks, and most surfaces.

## Glass Cleaner
**Ingredients:**
- 2 cups water
- 1/2 cup white vinegar
- 1/4 cup rubbing alcohol
- 1-2 drops dish soap

Spray and wipe with newspaper for streak-free shine.

## Bathroom Scrub
**Ingredients:**
- 1/2 cup baking soda
- 1/4 cup dish soap
- 1 tablespoon hydrogen peroxide

Mix into a paste. Great for tubs, tiles, and toilets.

## Floor Cleaner
**Ingredients:**
- 1/2 cup white vinegar
- 1 gallon warm water
- 2-3 drops dish soap

Perfect for hardwood, tile, and laminate floors.

## Carpet Deodorizer
**Ingredients:**
- 1 cup baking soda
- 10-15 drops essential oil

Mix and sprinkle on carpet. Let sit 15 minutes, then vacuum.

## Drain Cleaner
**Ingredients:**
- 1/2 cup baking soda
- 1 cup white vinegar
- Hot water

Pour baking soda down drain, follow with vinegar, wait 15 minutes, flush with hot water.

## Safety Tips
- Never mix different cleaning products
- Test on small area first
- Store in labeled containers
- Keep away from children and pets
- Ventilate area when cleaning

## Benefits of Natural Cleaning
- Safer for family and pets
- Better for the environment
- Cost-effective
- Reduces chemical exposure
- Often just as effective as commercial cleaners

Start with one or two recipes and gradually replace your commercial cleaners with these natural alternatives.', 
'cleaning', '["natural", "DIY", "safe", "eco-friendly", "homemade"]'::jsonb, 
'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&h=600&fit=crop', '6 min read', TRUE),

-- Organization guides
('decluttering-whole-home', 'Decluttering Your Whole Home', 'Room-by-room decluttering strategies', 
'# Decluttering Your Whole Home

Transform your living space with this comprehensive room-by-room decluttering guide. Learn proven strategies to create a more organized, peaceful home.

## The Decluttering Mindset
Before you begin, adopt these principles:
- Keep only what you use and love
- Everything should have a designated place
- Quality over quantity
- One in, one out rule

## Room-by-Room Strategy

### Kitchen
**Focus Areas:**
- Expired food and spices
- Duplicate utensils and gadgets
- Broken or unused appliances
- Excess dishes and cookware

**Keep:** Daily essentials, quality tools, frequently used items
**Donate:** Duplicate items, rarely used gadgets
**Toss:** Expired food, broken items, worn-out tools

### Living Room
**Focus Areas:**
- Books and magazines
- Electronics and cords
- Decorative items
- Furniture arrangement

**Questions to Ask:**
- Do I actually read/watch this?
- Does this item bring me joy?
- Is this the best use of this space?

### Bedrooms
**Focus Areas:**
- Clothing and accessories
- Bedside table items
- Under-bed storage
- Closet organization

**The 80/20 Rule:** You probably wear 20% of your clothes 80% of the time.

### Bathrooms
**Focus Areas:**
- Expired medications and cosmetics
- Duplicate products
- Old towels and linens
- Cleaning supplies

**Safety First:** Properly dispose of medications and chemicals.

### Home Office
**Focus Areas:**
- Paper documents
- Office supplies
- Electronics
- Reference materials

**Go Digital:** Scan important documents to reduce paper clutter.

## The Four-Box Method
For each room, use four boxes labeled:
1. **Keep** - Items that belong in this room
2. **Relocate** - Items that belong elsewhere
3. **Donate** - Items in good condition you don''t need
4. **Trash** - Broken or unusable items

## Maintenance Tips
- Spend 10 minutes daily tidying
- Do a monthly mini-declutter
- Seasonal deep decluttering
- Implement the "one-touch rule"

## Common Mistakes to Avoid
- Trying to declutter everything at once
- Not having a plan for donations
- Keeping items "just in case"
- Not involving family members
- Perfectionism paralysis

## Getting Started
1. Choose one small area (like a drawer)
2. Set a timer for 15 minutes
3. Use the four-box method
4. Celebrate your progress
5. Move to the next area

Remember: Decluttering is a process, not a one-time event. Be patient with yourself and focus on progress, not perfection.', 
'organization', '["decluttering", "minimalism", "organization", "home improvement"]'::jsonb, 
'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop', '10 min read', TRUE),

-- Decorating guides
('color-scheme-selection', 'Color Scheme Selection', 'Choose perfect colors for every room', 
'# Color Scheme Selection Guide

Choosing the right colors for your home can transform your space and create the perfect atmosphere. This comprehensive guide will help you select colors that reflect your style and enhance your daily life.

## Understanding Color Theory

### Primary Colors
- Red, Blue, Yellow
- Cannot be created by mixing other colors
- Form the basis of all other colors

### Secondary Colors
- Orange, Green, Purple
- Created by mixing two primary colors

### Tertiary Colors
- Created by mixing primary and secondary colors
- Provide subtle variations and depth

## Color Temperature

### Warm Colors
- Reds, oranges, yellows
- Create cozy, intimate feelings
- Perfect for living rooms and bedrooms
- Make spaces feel smaller and more inviting

### Cool Colors
- Blues, greens, purples
- Create calm, refreshing feelings
- Great for bathrooms and offices
- Make spaces feel larger and more open

### Neutral Colors
- Whites, grays, beiges, browns
- Provide balance and sophistication
- Work well as base colors
- Allow accent colors to shine

## Popular Color Schemes

### Monochromatic
- Different shades of the same color
- Creates harmony and sophistication
- Easy to implement
- Add interest with textures and patterns

### Complementary
- Colors opposite on the color wheel
- Creates vibrant, energetic spaces
- Use one as dominant, other as accent
- Examples: Blue and orange, red and green

### Analogous
- Colors next to each other on color wheel
- Creates peaceful, comfortable spaces
- Natural and pleasing to the eye
- Examples: Blue, blue-green, green

### Triadic
- Three colors equally spaced on color wheel
- Vibrant but balanced
- Use one as dominant color
- Examples: Red, yellow, blue

## Room-by-Room Color Guide

### Living Room
- Warm neutrals for comfort
- Add personality with accent colors
- Consider natural light exposure
- Think about furniture and artwork

### Kitchen
- Light colors make space feel larger
- Consider cabinet and countertop colors
- Warm colors stimulate appetite
- Easy-to-clean surfaces are important

### Bedroom
- Soft, calming colors promote rest
- Avoid overly stimulating colors
- Consider morning and evening light
- Personal preference is key

### Bathroom
- Light colors make space feel clean
- Consider humidity and lighting
- Cool colors feel fresh and clean
- Don''t forget about fixtures

### Home Office
- Colors that promote focus and creativity
- Avoid overly stimulating colors
- Consider computer screen glare
- Green can reduce eye strain

## Factors to Consider

### Natural Light
- North-facing rooms: Warm colors to counteract cool light
- South-facing rooms: Can handle cool colors
- East-facing rooms: Warm morning light, cool afternoon
- West-facing rooms: Cool morning light, warm afternoon

### Room Size
- Light colors make rooms feel larger
- Dark colors make rooms feel smaller and cozier
- Use color to highlight architectural features
- Consider ceiling height

### Existing Elements
- Flooring and fixed elements
- Furniture you plan to keep
- Architectural features
- Artwork and accessories

## Testing Colors

### Sample Process
1. Get large paint samples (at least 12"x12")
2. View in different lighting conditions
3. Look at colors at different times of day
4. Consider how colors look with your furnishings
5. Live with samples for at least a week

### Digital Tools
- Use color visualization apps
- Upload photos of your space
- Try virtual paint tools
- Create mood boards

## Common Mistakes to Avoid
- Choosing colors in poor lighting
- Not considering existing elements
- Following trends over personal preference
- Using too many colors in one space
- Not testing colors first

## Creating Flow Between Rooms
- Use a consistent color temperature throughout
- Repeat accent colors in different rooms
- Use varying shades of the same color family
- Consider sight lines between spaces

Remember: The best color scheme is one that makes you feel happy and comfortable in your space. Trust your instincts and don''t be afraid to be bold!', 
'decorating', '["color", "design", "interior", "paint", "decoration"]'::jsonb, 
'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', '12 min read', TRUE),

-- Energy Savings guides
('solar-power-homes', 'Solar Power for Homes', 'Complete guide to home solar systems', 
'# Solar Power for Homes: Complete Guide

Harness the power of the sun to reduce your electricity bills and environmental impact. This comprehensive guide covers everything you need to know about residential solar power systems.

## Understanding Solar Power

### How Solar Panels Work
1. **Photovoltaic Effect**: Solar cells convert sunlight into electricity
2. **DC to AC Conversion**: Inverters convert DC power to usable AC power
3. **Grid Connection**: Excess power can be fed back to the grid
4. **Net Metering**: Get credit for excess power you generate

### Types of Solar Systems

#### Grid-Tied Systems
- Connected to utility grid
- No battery backup
- Most cost-effective option
- Eligible for net metering

#### Grid-Tied with Battery Backup
- Connected to grid with battery storage
- Power during outages
- Higher initial cost
- Energy independence

#### Off-Grid Systems
- Completely independent from utility grid
- Requires battery storage
- Most expensive option
- Complete energy independence

## Assessing Your Home''s Solar Potential

### Roof Evaluation
- **Direction**: South-facing roofs are ideal
- **Angle**: 30-45 degree tilt is optimal
- **Shading**: Minimal shade throughout the day
- **Condition**: Roof should be in good condition
- **Age**: Consider roof replacement timeline

### Energy Usage Analysis
- Review 12 months of electricity bills
- Identify peak usage times
- Consider future energy needs
- Factor in electric vehicle charging
- Account for home additions or changes

### Local Factors
- **Climate**: More sunny days = more solar production
- **Utility Rates**: Higher rates = better solar savings
- **Net Metering Policies**: Varies by utility company
- **Local Incentives**: Research available programs

## System Components

### Solar Panels
- **Monocrystalline**: Most efficient, higher cost
- **Polycrystalline**: Good efficiency, moderate cost
- **Thin-Film**: Lower efficiency, lowest cost
- **Warranty**: Look for 20-25 year warranties

### Inverters
- **String Inverters**: Cost-effective for simple installations
- **Power Optimizers**: Better performance with partial shading
- **Microinverters**: Best performance, highest cost
- **Monitoring**: Track system performance

### Mounting Systems
- **Roof-mounted**: Most common, least expensive
- **Ground-mounted**: Better positioning, higher cost
- **Tracking Systems**: Follow sun movement, premium option

### Battery Storage (Optional)
- **Lithium-ion**: Most popular, longest lifespan
- **Lead-acid**: Lower cost, shorter lifespan
- **Capacity**: Measured in kilowatt-hours (kWh)
- **Depth of Discharge**: How much battery can be used

## Financial Considerations

### Initial Costs
- System cost: $15,000-$30,000 before incentives
- Installation: Usually included in system price
- Permits and inspections: $500-$2,000
- Electrical upgrades: $1,000-$3,000 if needed

### Incentives and Rebates
- **Federal Tax Credit**: 30% through 2032
- **State Incentives**: Varies by location
- **Utility Rebates**: Check with local utility
- **PACE Financing**: Property-assessed financing

### Financing Options
- **Cash Purchase**: Best long-term savings
- **Solar Loans**: Spread cost over time
- **Solar Leases**: Lower upfront cost, less savings
- **Power Purchase Agreements (PPAs)**: Pay for power, not system

### Return on Investment
- Typical payback period: 6-10 years
- 25-year savings: $20,000-$50,000
- Increased home value: 3-4% average
- Electricity bill reduction: 70-100%

## Installation Process

### 1. Site Assessment
- Professional evaluation of your property
- Shading analysis
- Electrical system inspection
- Structural assessment

### 2. System Design
- Custom system layout
- Component selection
- Performance projections
- Permit applications

### 3. Permits and Approvals
- Building permits
- Electrical permits
- Utility interconnection agreement
- HOA approval if required

### 4. Installation
- Typically takes 1-3 days
- Roof mounting and panel installation
- Electrical connections
- Inverter and monitoring setup

### 5. Inspection and Activation
- Local building inspection
- Utility inspection
- System commissioning
- Monitoring setup

## Maintenance and Monitoring

### Regular Maintenance
- Visual inspections quarterly
- Professional cleaning annually
- Inverter checks
- Performance monitoring
- Tree trimming if needed

### Performance Monitoring
- Daily production tracking
- Monthly performance analysis
- Seasonal variations
- Identifying issues early
- Warranty claim documentation

### Common Issues
- Shading from tree growth
- Inverter failures
- Panel degradation
- Wiring problems
- Weather damage

## Maximizing Solar Benefits

### Energy Efficiency First
- Improve insulation
- Upgrade to LED lighting
- Use energy-efficient appliances
- Seal air leaks
- Install programmable thermostats

### Usage Optimization
- Run appliances during peak sun hours
- Time pool pumps and water heaters
- Charge electric vehicles during day
- Use smart home automation
- Consider time-of-use electricity rates

### Future Considerations
- Electric vehicle adoption
- Home battery storage
- Smart home integration
- Grid modernization
- Technology improvements

## Choosing a Solar Installer

### Research and Vetting
- Check licenses and certifications
- Read customer reviews
- Get multiple quotes
- Verify insurance coverage
- Check Better Business Bureau ratings

### Questions to Ask
- How long have you been in business?
- What warranties do you offer?
- Who will perform the installation?
- What happens if there are problems?
- Can you provide local references?

### Red Flags to Avoid
- Door-to-door sales pressure
- Prices that seem too good to be true
- Requests for full payment upfront
- No local office or presence
- Unlicensed contractors

Solar power is a significant investment that can provide decades of clean energy and savings. Take time to research your options and choose a reputable installer to ensure the best results for your home.', 
'energy-savings', '["solar", "renewable energy", "sustainability", "cost savings", "environment"]'::jsonb, 
'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop', '15 min read', TRUE)
ON CONFLICT (slug) DO NOTHING;