# Finzen

Finzen is a local-first personal finance manager designed for privacy and data ownership. The application runs entirely in the browser, ensuring that sensitive financial information remains on the user's device.

**Live Application:** [https://finzenapp.net/](https://finzenapp.net/)

## Key Features

- **Local-First Architecture:** Data is stored in IndexedDB; no external servers or cloud providers are involved.
- **File System Access API:** Optional automated backup synchronization to a local JSON file (supported in Chromium browsers).
- **Privacy-Centric:** No tracking, no analytics, and no third-party data collection.

## Tech Stack

- **Core:** TanStack Start + React + TypeScript
- **Styling:** TailwindCSS + DaisyUI
- **Storage & logic:** Dexie.js (IndexedDB) + Formisch + Valibot
- **Auth**: Better Auth

## License

This project is licensed under the GPL v3.0 License - see the LICENSE file for details.
