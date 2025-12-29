# Beautiful Icon Examples

## Current Icons (Lucide)

You're already using Lucide icons - they're beautiful and FREE! Here are some alternatives you can swap in:

### Cleaning Category
```tsx
import { Sparkles, Droplets, Wind, Spray } from 'lucide-react';

// Current: Sparkles ✨
// Alternatives:
icon: Droplets,  // Water droplet
icon: Wind,      // Fresh air
icon: Spray,     // Cleaning spray
```

### Organization Category
```tsx
import { Home, LayoutGrid, FolderOpen, Package, Archive } from 'lucide-react';

// Current: Home 🏠
// Alternatives:
icon: LayoutGrid,  // Grid layout
icon: FolderOpen,  // Organized folders
icon: Package,     // Storage box
icon: Archive,     // Archive box
```

### Life Category
```tsx
import { Heart, Coffee, Sun, Smile, Flower } from 'lucide-react';

// Current: Heart ❤️
// Alternatives:
icon: Coffee,  // Cozy lifestyle
icon: Sun,     // Bright living
icon: Smile,   // Happy home
icon: Flower,  // Natural living
```

### Decorating Category
```tsx
import { Sparkles, Palette, Paintbrush, Frame, Lamp } from 'lucide-react';

// Current: Sparkles ✨
// Alternatives:
icon: Palette,     // Color palette
icon: Paintbrush,  // Painting
icon: Frame,       // Picture frame
icon: Lamp,        // Lighting
```

### Energy Savings Category
```tsx
import { Leaf, Zap, Sun, Battery, Lightbulb } from 'lucide-react';

// Current: Leaf 🍃
// Alternatives:
icon: Zap,        // Energy bolt
icon: Sun,        // Solar power
icon: Battery,    // Power storage
icon: Lightbulb,  // LED lights
```

### Security & Safety Category
```tsx
import { Shield, Lock, Eye, Camera, AlertTriangle } from 'lucide-react';

// Current: Shield 🛡️
// Alternatives:
icon: Lock,           // Secure lock
icon: Eye,            // Surveillance
icon: Camera,         // Security camera
icon: AlertTriangle,  // Safety alert
```

### Smart & Tech Category
```tsx
import { Zap, Wifi, Smartphone, Radio, Cpu } from 'lucide-react';

// Current: Zap ⚡
// Alternatives:
icon: Wifi,        // Connected home
icon: Smartphone,  // Smart control
icon: Radio,       // IoT devices
icon: Cpu,         // Smart processor
```

### Home Projects Category
```tsx
import { Wrench, Hammer, Drill, Ruler, PaintBucket } from 'lucide-react';

// Current: Wrench 🔧
// Alternatives:
icon: Hammer,      // Building
icon: Drill,       // Power tools
icon: Ruler,       // Measuring
icon: PaintBucket, // Painting
```

## How to Browse All Icons

### Online Browser
Visit: https://lucide.dev/icons

1. Search for keywords (e.g., "home", "clean", "energy")
2. Click any icon to see the name
3. Copy the import name
4. Use in your code!

### In Your Code
```tsx
// 1. Import the icon
import { IconName } from 'lucide-react';

// 2. Use it in CATEGORY_CONFIG
'cleaning': {
    name: 'Cleaning',
    icon: IconName,  // <-- Change here
    // ... rest of config
}
```

## Icon Styling Examples

### Size Variations
```tsx
<Sparkles className="w-4 h-4" />   // 16px - Small
<Sparkles className="w-6 h-6" />   // 24px - Medium
<Sparkles className="w-8 h-8" />   // 32px - Large
<Sparkles className="w-12 h-12" /> // 48px - Extra Large
<Sparkles className="w-16 h-16" /> // 64px - Huge
```

### Color Variations
```tsx
// Using Tailwind classes
<Sparkles className="text-blue-500" />
<Sparkles className="text-pink-600" />
<Sparkles className="text-green-500" />

// Using inline styles
<Sparkles style={{ color: '#4F46E5' }} />
<Sparkles style={{ color: '#EC4899' }} />
```

### Stroke Width
```tsx
<Sparkles strokeWidth={1} />   // Thin
<Sparkles strokeWidth={1.5} /> // Default
<Sparkles strokeWidth={2} />   // Medium
<Sparkles strokeWidth={2.5} /> // Bold
<Sparkles strokeWidth={3} />   // Extra Bold
```

### Combined Styling
```tsx
<Sparkles 
    className="w-12 h-12 text-indigo-500" 
    strokeWidth={1.5}
/>
```

## Popular Icon Combinations

### Cleaning Theme
```tsx
import { Sparkles, Droplets, Wind } from 'lucide-react';

<div className="flex gap-4">
    <Sparkles className="w-8 h-8 text-indigo-500" />
    <Droplets className="w-8 h-8 text-blue-500" />
    <Wind className="w-8 h-8 text-cyan-500" />
</div>
```

### Home Theme
```tsx
import { Home, Heart, Key } from 'lucide-react';

<div className="flex gap-4">
    <Home className="w-8 h-8 text-pink-500" />
    <Heart className="w-8 h-8 text-rose-500" />
    <Key className="w-8 h-8 text-red-500" />
</div>
```

### Tech Theme
```tsx
import { Zap, Wifi, Smartphone } from 'lucide-react';

<div className="flex gap-4">
    <Zap className="w-8 h-8 text-violet-500" />
    <Wifi className="w-8 h-8 text-purple-500" />
    <Smartphone className="w-8 h-8 text-indigo-500" />
</div>
```

## Animated Icons

Add simple animations:

```tsx
// Spin animation
<Zap className="w-8 h-8 animate-spin" />

// Pulse animation
<Heart className="w-8 h-8 animate-pulse" />

// Bounce animation
<Sparkles className="w-8 h-8 animate-bounce" />

// Custom hover effect
<Sparkles className="w-8 h-8 hover:scale-110 transition-transform" />
```

## Icon with Background

```tsx
// Circular background
<div className="bg-indigo-100 p-4 rounded-full">
    <Sparkles className="w-8 h-8 text-indigo-600" />
</div>

// Square background
<div className="bg-pink-100 p-4 rounded-lg">
    <Home className="w-8 h-8 text-pink-600" />
</div>

// With shadow
<div className="bg-white p-4 rounded-xl shadow-lg">
    <Leaf className="w-8 h-8 text-green-600" />
</div>
```

## Quick Reference

| Category | Current Icon | Color | Hex Code |
|----------|-------------|-------|----------|
| Cleaning | Sparkles | Indigo | #4F46E5 |
| Organization | Home | Pink | #EC4899 |
| Life | Heart | Emerald | #10B981 |
| Decorating | Sparkles | Amber | #F59E0B |
| Energy | Leaf | Teal | #14B8A6 |
| Security | Shield | Red | #EF4444 |
| Smart Tech | Zap | Violet | #8B5CF6 |
| Projects | Wrench | Orange | #F97316 |

## Need More Icons?

### Other Great FREE Libraries

1. **Heroicons** - https://heroicons.com
   - Install: `npm install @heroicons/react`
   - Usage: `import { SparklesIcon } from '@heroicons/react/24/outline'`

2. **Phosphor Icons** - https://phosphoricons.com
   - Install: `npm install phosphor-react`
   - Usage: `import { Sparkle } from 'phosphor-react'`

3. **Feather Icons** - https://feathericons.com
   - Install: `npm install react-feather`
   - Usage: `import { Star } from 'react-feather'`

But honestly, **Lucide is perfect** for your needs! It has everything and looks amazing. 🎨
