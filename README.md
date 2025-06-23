# 🎵 Tinbob's Tunes

A sleek, minimalist Android music player app built using **Vite + React**, and packaged for Android with **Capacitor**. This app plays original music by [NewRinaldi], available on all major streaming platforms.

## 🚀 Features

- 🎧 Play original tracks by NewRinaldi directly from your device
- 📱 Optimized for Android via Capacitor
- ⚡ Fast and modern front-end powered by Vite + React
- 🎵 Custom playlist & track browsing
- 🔁 Basic controls: play, pause, skip, loop

## 📦 Tech Stack

- [Vite](https://vitejs.dev/) - Fast build tool
- [React](https://reactjs.org/) - UI framework
- [Capacitor](https://capacitorjs.com/) - Cross-platform native runtime
- [TypeScript](https://www.typescriptlang.org/)  - for type safety and modern JS features
- [Howler.js](https://howlerjs.com/) - for robust audio handling

## 📱 Getting Started

### Prerequisites

- Node.js >= 16
- Android Studio
- Capacitor CLI
- Git

### Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/your-username/tinbobs-tunes.git
cd tinbobs-tunes

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev

# 4. Build the app
npm run build

# 5. Initialize Capacitor (only the first time)
npx cap init tinbobs.tunes com.tinbobs.tunes

# 6. Add Android platform
npx cap add android

# 7. Copy web assets to Android
npx cap copy

# 8. Open in Android Studio
npx cap open android
