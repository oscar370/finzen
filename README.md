# Finzen

Finzen is a local-first personal finance manager designed for privacy and data ownership. The application runs entirely in the browser, ensuring that sensitive financial information remains on the user's device.

**Live Application:** [https://finzenapp.net/](https://finzenapp.net/)

## Key Features

- **Local-First Architecture:** Data is stored in IndexedDB; no external servers or cloud providers are involved.
- **File System Access API:** Optional automated backup synchronization to a local JSON file (supported in Chromium browsers).
- **PWA Support:** Installable on desktop and mobile for offline use.
- **Privacy-Centric:** No tracking, no analytics, and no third-party data collection.

## Tech Stack

- **Core:** React + TypeScript + Vite
- **Styling:** TailwindCSS
- **Storage & logic:** Dexie.js (IndexedDB) + React Hook Form + Zod
- **PWA:** Vite PWA Plugin
- **Routing:** React Router DOM

## Development

### Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/oscar370/finzen.git
cd finzen

```

2. Install dependencies:

```bash
pnpm install

```

3. Start the development server:

```bash
pnpm dev

```

4. Build for production:

```bash
pnpm build

```

## Documentation

For detailed information regarding application logic, browser compatibility, and backup management, please refer to the [Project Wiki](https://github.com/oscar370/finzen/wiki).

## License

This project is licensed under the GPL v3.0 License - see the LICENSE file for details.
