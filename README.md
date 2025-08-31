# 🎵 YouTube Downloader (Next.js + TypeScript)

A modern, open-source YouTube **video & audio downloader** built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**.  
It allows you to fetch **video/audio in maximum quality**, preview details, and download with a clean UI.  

---

## ✨ Features

- 🚀 Built on **Next.js 15 (App Router + Turbopack)**
- 🎬 Download **video with audio** (highest resolution available)
- 🎵 Download **audio-only formats** (MP4/WebM)
- 📸 Auto-fetch **title & thumbnail**
- ⚡ Fast & lightweight (serverless API using `@distube/ytdl-core`)
- 🎨 Sleek UI with **Tailwind CSS**
<img width="1919" height="951" alt="image" src="https://github.com/user-attachments/assets/46234f2d-8afb-4885-befa-112426d73d60" />

---
## url  based downloader and player support 
<img width="1916" height="902" alt="image" src="https://github.com/user-attachments/assets/a3365b2d-9366-4d68-81e3-2534f66d52cb" />
## mobile responsive 
<img width="599" height="872" alt="image" src="https://github.com/user-attachments/assets/5d9ded41-15ab-477b-aaae-f15d9b7ad7ab" />
<img width="474" height="890" alt="image" src="https://github.com/user-attachments/assets/e336c758-5d28-41a3-a170-be072c3a3064" />


## 📂 Project Structure

.
├── app/
│ ├── api/
│ │ └── info/route.ts # API route to fetch YouTube video info
│ ├── page.tsx # UI page with fetch & download logic
│ ├── layout.tsx # Root layout with fonts + favicon
│
├── public/
│ └── favicon.ico # Custom favicon
│
├── styles/
│ └── globals.css # Global Tailwind styles
│
├── package.json
├── tsconfig.json
└── README.md
