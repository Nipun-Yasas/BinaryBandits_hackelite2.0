# BinaryBandits HackElite 2.0

Interactive career exploration, quizzes, personalized reports, and community discussion platform built with Next.js (App Router), TypeScript, Material UI, and modern tooling.

## 🚀 Quick Start (Easiest)
just visit the live site, create a account and login

https://binary-bandits-hackelite2-0.vercel.app/
---

## 🧩 Features
- Career quiz & personalized reports
- Career explorer modules
- PDF export/download support
- Subject stream recommendations
- Discussion forum (threads, likes, bookmarks, replies)
- Modern responsive UI (MUI + Framer Motion)

---

## 🛠 Tech Stack
- Framework: Next.js 14+ (App Router)
- Language: TypeScript
- UI: Material UI (MUI v5), Framer Motion
- State/Data: React hooks + service layer
- Styling: MUI Theme + CSS-in-JS
- Icons: @mui/icons-material
- Tooling: ESLint, (optionally) Prettier
- Package Manager: npm (or yarn/pnpm)

---

## 📦 Core Dependencies
Install automatically via `npm install`.
- next
- react / react-dom
- @mui/material @mui/icons-material @emotion/react @emotion/styled
- framer-motion
- axios (if used in service layer)
- typescript / @types/node / @types/react (dev)

Check `package.json` for the exact versions.

---

## ✅ Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+ (or yarn/pnpm)

Check versions:
```
node -v
npm -v
```


## 🔐 Environment Variables
Create a `.env` file at the project root (Next.js auto-loads it).

Create the file and copy text inside the env file inside the drive folder

---

## 🔧 Installation
```
npm install
```
(or `yarn install` / `pnpm install`)

---

## ▶️ Running (Development)
```
npm run dev
```
Open: http://localhost:3000

---

## 🏗 Production Build
```
npm run build
npm start
```

---

## 🧪 (Optional) Testing
If you add Jest / Vitest later:
```
npm test
```
(Current repo may not include test setup yet.)

---

## 🧹 Lint
```
npm run lint
```

## 🛠 Common Issues
| Issue | Fix |
|-------|-----|
| ENV changes not applied | Stop & restart `npm run dev` |
| 404 on API calls | Verify `NEXT_PUBLIC_API_BASE_URL` |
| Styles flashing | Ensure MUI theme + proper SSR setup |
| Typescript errors | Run `npx tsc --noEmit` to inspect |
