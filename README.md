# Legal Nest React (Vite)
- React + Vite
- Lightweight i18n (TH/EN/ZH/JA/KO) via Context
- Color palette and layout match provided style
- Fully responsive; works on desktop and mobile
- Split HTML (index.html) and CSS (`src/styles/*.css`)
- Contact form with Netlify Functions & Email

## Run Development
```bash
npm i
npm run dev
```

## Test with Netlify Functions (Recommended)
เพื่อทดสอบการส่งอีเมลใน localhost ให้ใช้ Netlify CLI:
```bash
# ติดตั้ง Netlify CLI (ถ้ายังไม่มี)
npm install -g netlify-cli

# รัน dev server พร้อม functions
netlify dev
```

## Build
```bash
npm run build
npm run preview
```

## Contact Form
- ใน localhost ปกติ (npm run dev): ข้อมูลจะแสดงใน console และแจ้งเตือนว่าอยู่ในโหมดทดสอบ
- ใน netlify dev: ฟังก์ชันส่งอีเมลจะทำงานจริง
- บน Netlify (production): ฟังก์ชันส่งอีเมลจะทำงานเต็มรูปแบบ

## Environment Variables
สร้างไฟล์ `.env` จาก `.env.example` และใส่ข้อมูล SMTP:
```bash
cp .env.example .env
```

Replace `/src/assets/hero.jpg` with your hero image.