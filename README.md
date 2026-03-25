# ⚡ CSFloat Sniper

Real-time CS2 skin deals dashboard powered by the [CSFloat](https://csfloat.com/) API. Find the best discounts, track sticker values, and snipe deals before anyone else.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

## ✨ Features

- **Live Market Monitoring** — Auto-refreshes every 5 minutes with manual refresh option
- **Smart Discount Detection** — Calculates discount % from CSFloat reference prices
- **Sticker Value Tracking** — Displays total sticker value per listing
- **Advanced Filters**
  - Min/Max price
  - Min discount %
  - Min sticker value
  - Skin name & weapon search
  - Item type (Normal / StatTrak™ / Souvenir)
  - Float range
  - Show/hide non-profitable skins
- **Smart Filter Logic** — Skins with high sticker value bypass the minimum discount filter
- **Up to 200 listings** — Fetches multiple pages & sort types for maximum coverage
- **Dark Mode UI** — Sleek glassmorphism design with rarity-colored cards

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- A [CSFloat API key](https://csfloat.com/api)

### Installation

```bash
# Clone the repo
git clone https://github.com/ryzuud/csfloat-sniper.git
cd csfloat-sniper

# Install dependencies
npm install
```

### Configuration

Create a `.env.local` file at the root of the project:

```env
CSFLOAT_API_KEY=your_api_key_here
```

> ⚠️ Never commit your API key. The `.env.local` file is already in `.gitignore`.

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework with App Router & API routes |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first styling |
| **CSFloat API** | Real-time CS2 market data |

## 📁 Project Structure

```
src/
├── app/
│   ├── api/listings/route.ts   # Server-side API proxy with pagination
│   ├── globals.css             # Design system & component styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main dashboard page
├── components/
│   ├── FilterBar.tsx           # Advanced filter controls
│   ├── SkinCard.tsx            # Listing card with discount/overpriced badges
│   └── SkeletonCard.tsx        # Loading skeleton
└── types.ts                    # TypeScript interfaces
```

## 📄 License

MIT
