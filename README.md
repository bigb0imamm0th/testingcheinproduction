# Transportation Cost App

A Next.js application for tracking and managing transportation costs with Google Sheets integration.

## Features

- 🔐 User authentication system
- 📝 Transportation cost form submission
- 📊 Dashboard for viewing submissions
- 📈 Google Sheets integration for data persistence
- 🎨 Modern UI with Tailwind CSS and shadcn/ui components
- 🌓 Dark mode support

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Forms**: React Hook Form with Zod validation
- **Data Storage**: Google Sheets API

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Google Cloud Project with Sheets API enabled

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd transportation-cost-app
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
GOOGLE_SHEETS_CREDENTIALS=<path-to-service-account-json>
GOOGLE_SHEET_ID=<your-google-sheet-id>
```

4. Set up Google Sheets integration:
Follow the instructions in [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)

5. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
transportation-cost-app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── form/              # Form submission page
│   └── submissions/       # Submissions view page
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions
│   ├── auth.ts           # Authentication logic
│   ├── google-sheets.ts  # Google Sheets integration
│   └── utils.ts          # Helper functions
└── public/               # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

Private - All rights reserved

