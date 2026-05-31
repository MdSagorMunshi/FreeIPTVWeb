<div align="center">
  <img src="public/favicon.png" alt="FreeIPTV Web Logo" width="120" />
  <h1>FreeIPTV Web</h1>
  <p><strong>A modern, lightning-fast, ad-free Live TV streaming application for the web.</strong></p>
</div>

<br />

**FreeIPTV Web** is a beautifully designed, lag-free media player that lets you stream over 18,000+ international live TV channels, manage your custom M3U playlists locally, and customize your viewing experience—all entirely in your browser without any backend tracking or ads.

## ✨ Features

- 🌍 **18,000+ Global Channels**: Explore and stream a massive directory of live TV channels from around the world.
- 📁 **Custom M3U Support**: Upload and organize your own custom `.m3u` playlists. Playlists are parsed instantly and securely saved offline to your browser's local IndexedDB cache.
- 🗣️ **Global Multi-Language**: Fully localized in English, Bengali, Spanish, Russian, Arabic, Hindi, Japanese, and Chinese with dynamic client-side language switching.
- ⚡ **Lightning Fast & Ad-Free**: Built with Next.js and optimized for performance. No popups, no ads, no trackers.
- 🎨 **Stunning UI/UX**: Features a premium design system with Dark, Light, and OLED themes, fluid animations powered by Framer Motion, and a glassmorphism aesthetic.
- ❤️ **Favorites System**: Instantly "heart" and curate your most-watched channels into a dedicated Favorites library.
- ⚙️ **Persistent Settings**: Your preferences (Volume, Mute State, Theme, Language, Video Engine) are saved locally and persist perfectly across reloads.
- 🎥 **Multi-Engine Video Player**: Switch between `HLS.js`, `Video.js`, and `ReactPlayer` on the fly if a specific stream protocol fails to load.

## 🚀 Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## 🛠️ Technology Stack

- **Framework**: [Next.js 15 (React 19)](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Storage**: IndexedDB (via `idb-keyval`)
- **Video Engines**: `hls.js`, `video.js`, `react-player`

## ⚖️ Legal Disclaimer

**No Content Hosting**: FreeIPTV Web is strictly a local media player interface. We do not host, broadcast, or distribute any video streams, movies, or copyrighted content on our servers.
**User Responsibility**: Any M3U playlists or stream links loaded into this application are the sole responsibility of the user. We are not responsible for the contents of user-uploaded playlists.
**Local Data**: We do not collect or transmit your personal data or playlist contents to remote servers. All data is stored locally in your browser's offline cache.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
