# 🌐 LingoBridge

> **AI-powered language translation with context awareness, voice input, and pronunciation guides — built with React + Gemini AI.**

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?style=flat-square&logo=tailwindcss)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?style=flat-square&logo=google)
![License](https://img.shields.io/badge/License-Apache%202.0-green?style=flat-square)

---

## ✨ Features

- **🤖 AI-Powered Translation** — Backed by Google Gemini AI for nuanced, context-aware translations that understand idioms and cultural references.
- **🗣️ Voice Input** — Speak directly into the app using the Web Speech API. Translations trigger automatically after a short pause.
- **🔍 Auto Language Detection** — Set the source to "Detect Language" and let Gemini identify it for you.
- **🔤 Pronunciation Guide** — Phonetic transcriptions are shown for complex scripts and languages.
- **💡 Grammar & Cultural Notes** — Gemini provides contextual notes about grammatical nuances or cultural meaning when relevant.
- **🔄 Instant Swap** — Flip source and target languages (and their text) in one click.
- **📋 Copy to Clipboard** — Copy translated text instantly with a visual confirmation.
- **🕐 Translation History** — Your last 20 translations are saved in `localStorage` and displayed in a collapsible sidebar.
- **🗑️ Clear History** — Wipe your history anytime from the sidebar.
- **📱 Responsive Design** — Fully responsive layout, from mobile to widescreen.

---

## 🌍 Supported Languages

LingoBridge supports the following languages out of the box (plus any language Gemini can handle):

| Region | Languages |
|---|---|
| **Global** | English, Spanish, French, German, Italian, Portuguese, Russian |
| **East Asia** | Chinese, Japanese, Korean |
| **Middle East** | Arabic |
| **South Asia** | Hindi, Tamil, Telugu, Malayalam, Kannada |

Auto-detect works for all of the above and many more.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 19 |
| Language | TypeScript 5.8 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 4 |
| Animations | Motion (Framer Motion) |
| Icons | Lucide React |
| AI Backend | Google Gemini (`gemini-3-flash-preview`) |
| Utility | clsx + tailwind-merge |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- A **Google Gemini API key** — get one at [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/LingoBridge.git
cd LingoBridge

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
```

### Configuration

Open `.env` and add your Gemini API key:

```env
GEMINI_API_KEY="your_gemini_api_key_here"
APP_URL="http://localhost:3000"
```

### Run the Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:3000**.

---

## 📦 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Type-check with TypeScript (`tsc --noEmit`) |
| `npm run clean` | Remove the `dist/` folder |

---

## 📁 Project Structure

```
LingoBridge/
├── src/
│   ├── App.tsx               # Main UI component — all translation logic & state
│   ├── main.tsx              # React entry point
│   ├── index.css             # Global styles (Tailwind base)
│   └── services/
│       └── geminiService.ts  # Gemini AI API integration & TranslationResult type
├── index.html                # HTML shell
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── package.json
├── .env.example              # Environment variable template
└── metadata.json             # App metadata & microphone permission declaration
```

---

## 🔑 API Integration

Translation is handled via `src/services/geminiService.ts`. Each call uses Gemini's structured JSON output mode with the following response schema:

```typescript
interface TranslationResult {
  translatedText: string;       // Required — the translated output
  detectedLanguage?: string;    // Optional — ISO code of detected source language
  pronunciation?: string;       // Optional — phonetic guide for the translation
  notes?: string;               // Optional — grammar or cultural context notes
}
```

Gemini is prompted with the source text, source language, and target language. The model returns a validated JSON object — no fragile regex parsing required.

---

## 🎤 Voice Input

LingoBridge uses the browser's native **Web Speech API** for microphone input.

- Click the **mic icon** to start listening.
- The icon turns red and pulses while recording.
- Speech is transcribed in real time and translation is triggered automatically 1 second after you stop speaking.
- Click the mic icon again (or the mic-off icon) to stop.
- Voice input follows the selected source language when not set to auto-detect.

> **Note:** Voice input requires a Chromium-based browser (Chrome, Edge, Brave) or Safari. Firefox does not support the Web Speech API.

---

## 🔒 Privacy & Data

- Translation history is stored **locally** in your browser's `localStorage`. Nothing is sent to any server other than the Gemini API for translation.
- No user accounts, no tracking, no analytics.
- Clear your history at any time from the History sidebar.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **Apache 2.0 License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [Google Gemini AI](https://deepmind.google/technologies/gemini/) for the translation intelligence
- [Lucide React](https://lucide.dev/) for the clean icon set
- [Motion](https://motion.dev/) for fluid animations
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first styling system

---

<p align="center">Built with ❤️ and powered by Gemini AI</p>
