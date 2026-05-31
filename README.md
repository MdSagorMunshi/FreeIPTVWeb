<div align="center">
  <img src="public/icon.png" alt="FreeIPTV Web Logo" width="120" />
  <h1>FreeIPTV Web</h1>
  <p><strong>A modern, lightning-fast, ad-free Live TV streaming application for the web.</strong></p>

  <p align="center">
    <a href="https://github.com/MdSagorMunshi/FreeIPTVWeb/blob/master/LICENSE">
      <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT" />
    </a>
    <img src="https://img.shields.io/badge/Next.js-16.2.6-black?logo=next.js" alt="Next.js Version" />
    <img src="https://img.shields.io/badge/React-19.2.4-blue?logo=react" alt="React Version" />
    <img src="https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css" alt="Tailwind Version" />
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" />
  </p>
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

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

First, clone the repository and install the dependencies:

```bash
git clone https://github.com/MdSagorMunshi/FreeIPTVWeb.git
cd FreeIPTVWeb
npm install
# or yarn install / pnpm install
```

### Development

Run the local development server:

```bash
npm run dev
# or yarn dev / pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## 📦 Build for Production

To create an optimized production build of the application:

```bash
npm run build
```

This will compile the application into the `.next` directory. Once the build finishes, you can start the production server:

```bash
npm run start
```

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/)
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
