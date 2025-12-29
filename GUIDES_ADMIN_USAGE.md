# Guides Admin - Usage Guide

## 🎉 New Feature: Guides Management

You can now create and manage guides directly from the admin dashboard!

## How to Access

1. Go to http://localhost:3000/admin/login
2. Login with your admin credentials
3. Click **"Guides"** in the sidebar (💡 Lightbulb icon)

## Features

### ✅ Create New Guides
- Click the **"New Guide"** button
- Fill in the form:
  - **Title** (required)
  - **Description** (required) - Short summary
  - **Content** (required) - Full guide content in Markdown
  - **Category** - Select from predefined categories
  - **Read Time** - e.g., "5 min read"
  - **Featured Image URL** - Link to cover image
  - **Tags** - Comma-separated tags
  - **Featured** - Show in featured sections
  - **Featured Hero** - Display as homepage hero

### ✅ View All Guides
- See all your guides in a clean list
- View count, publish date, and category
- Visual indicators for featured and hero guides

### ✅ Set Featured Hero
- Click the ⭐ **star icon** next to any guide
- That guide will become the homepage hero
- Only one guide or post can be featured hero at a time
- Yellow background indicates current hero

### ✅ Search Guides
- Use the search bar to filter by title or description
- Real-time filtering as you type

## Guide Categories

Pre-configured categories:
- Getting Started
- Best Practices
- Tutorials
- Tips & Tricks
- Advanced
- Troubleshooting

## Content Format

Guides support **Markdown** formatting:

```markdown
# Main Heading

## Section Heading

### Subsection

**Bold text**
*Italic text*

- Bullet point 1
- Bullet point 2

1. Numbered item 1
2. Numbered item 2

[Link text](https://example.com)

![Image alt text](https://image-url.com/image.jpg)

`inline code`

\`\`\`
code block
\`\`\`
```

## Example Guide

Here's a sample guide you can create:

**Title:** Getting Started with Home Organization

**Description:** Learn the basics of organizing your home effectively with simple, practical steps.

**Content:**
```markdown
# Getting Started with Home Organization

Welcome to your journey towards a more organized home!

## Why Organization Matters

An organized home leads to:
- Less stress
- More productivity
- Better use of space
- Easier cleaning

## Step 1: Declutter

Start by removing items you don't need:

1. Go room by room
2. Sort items into keep, donate, and discard
3. Be honest about what you actually use

## Step 2: Create Zones

Assign specific purposes to different areas:

- **Entry zone**: Keys, shoes, bags
- **Work zone**: Office supplies, documents
- **Relaxation zone**: Books, entertainment

## Step 3: Maintain

Set up simple routines:

- 10-minute daily tidy
- Weekly deep clean of one area
- Monthly declutter session

## Next Steps

Ready to dive deeper? Check out our advanced organization guides!
```

**Category:** Getting Started

**Read Time:** 5 min read

**Tags:** organization, declutter, home, beginner

**Featured:** ✅ Yes

**Featured Hero:** ✅ Yes (if you want it on homepage)

## Tips

1. **Write clear titles** - Make them descriptive and searchable
2. **Use good descriptions** - This shows in search results and previews
3. **Structure your content** - Use headings to organize information
4. **Add images** - Visual guides are more engaging
5. **Keep it practical** - Focus on actionable advice
6. **Update regularly** - Keep guides current and relevant

## Featured Hero Behavior

When you set a guide as **Featured Hero**:
- ✅ It displays prominently on the homepage
- ✅ Full-width image (21:9 aspect ratio)
- ✅ Soft, elegant design
- ✅ Automatically unsets any previous featured content (posts or guides)
- ✅ Visitors see it first when they land on your site

## API Endpoints (for reference)

The guides admin uses these endpoints:
- `GET /guides` - List all guides
- `POST /guides` - Create new guide
- `GET /guides/{slug}` - Get specific guide
- `POST /admin/guides/{slug}/featured-hero` - Set as hero
- `DELETE /admin/guides/{slug}/featured-hero` - Remove hero status

## Troubleshooting

### Can't see the Guides menu?
- Make sure you're logged in as admin
- Check that you're on the dashboard page
- Try refreshing the page

### Guide not showing on homepage?
- Make sure it's set as "Featured Hero"
- Only one item can be hero at a time
- Check that the guide has a featured image

### Content not formatting correctly?
- Ensure you're using valid Markdown syntax
- Check for unclosed code blocks or quotes
- Preview the guide on the frontend

## Next Steps

1. ✅ Create your first guide
2. ✅ Set it as featured hero
3. ✅ Visit the homepage to see it live
4. ✅ Create more guides to build your library
5. ✅ Organize guides by category
6. ✅ Monitor views and engagement

---

**Need help?** Check the main documentation or reach out for support!
