# 🍸 ร้านจ๊าบบาร์ (JABB BAR) — ระบบจัดการสต็อกเครื่องดื่ม Full-Stack Docker

> **ระบบจัดการสต็อกเครื่องดื่ม ร้านจ๊าบบาร์ (Dark Mode & Mobile-First)**
> พัฒนาด้วยสถาปัตยกรรม Full-Stack แยก Frontend, Backend, Database และรันทุก Service ผ่าน **Docker Compose**

---

## 🏛️ สถาปัตยกรรมระบบ (Architecture)

```text
┌─────────────────────────────────────────────────────────────┐
│                       DOCKER COMPOSE                        │
│                                                             │
│   ┌─────────────────────┐       ┌───────────────────────┐   │
│   │  Frontend (Client)  │ HTTP  │   Backend (Server)    │   │
│   │   React 19 + Vite   │──────>│   Node.js + Express   │   │
│   │   Tailwind CSS      │       │      Prisma ORM       │   │
│   │    (Port: 5173/80)  │       │     (Port: 5000)      │   │
│   └─────────────────────┘       └───────────┬───────────┘   │
│                                             │ SQL           │
│                                             ▼               │
│                                 ┌───────────────────────┐   │
│                                 │  PostgreSQL Database  │   │
│                                 │     Postgres 16       │   │
│                                 │    (Port: 5432)       │   │
│                                 └───────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

1. **Frontend:** React 19 + Vite + Tailwind CSS (ดีไซน์ Dark Mode, รองรับ Mobile/Tablet, ตารางตรึง Sticky Column)
2. **Backend:** Node.js + Express.js API (CORS, RESTful endpoints, Prisma Client)
3. **Database:** PostgreSQL 16 (จัดการผ่าน Prisma ORM, มี Transaction ป้องกันข้อมูลสูญหาย)
4. **Containerization:** Docker & Docker Compose สำหรับรันทั้งโปรเจกต์ด้วยคำสั่งเดียว

---

## 🚀 วิธีการรันทั้งโปรเจกต์ด้วย Docker (Quick Start)

### 1. รันระบบทั้งหมดด้วยคำสั่งเดียว:
```bash
docker compose up --build -d
```

### 2. เข้าใช้งานระบบ:
- 🌐 **Frontend (Web Application):** [http://localhost:5173](http://localhost:5173) หรือ [http://localhost](http://localhost)
- 🔌 **Backend API:** [http://localhost:5000/api/drinks](http://localhost:5000/api/drinks)
- 🐘 **PostgreSQL:** `localhost:5432` (User: `jabb_user`, DB: `jabb_bar_db`)

### 3. คำสั่ง Docker ที่เป็นประโยชน์:
```bash
# ดู Log การทำงานของทุก Container แบบเรียลไทม์
docker compose logs -f

# สั่ง Seed ข้อมูลเครื่องดื่ม Mockup 41 รายการใน Container Backend
docker compose exec backend node prisma/seed.js

# หยุดการทำงานของทุก Service
docker compose down
```

---

## 📦 ข้อมูล Mockup ตั้งต้น 41 รายการ (Seeded in PostgreSQL)
1. **วิสกี้ / บรั่นดี / เหล้าไทย:** แบล็ค, เรด, รีเจนซี่ แบน, รีเจนซี่ กลม, GRANDE, เมอริเดียน กลม, เมอริเดียน แบน, แสงโสม กลม, แสงโสม แบน, หงษ์ทอง กลม, Kimton, Mountain King, Silver แบน
2. **เบียร์ / คราฟต์เบียร์:** Schneider, สิงห์, สิงห์Resere, ลีโอ, Snowy, ไฮเนเกน 0%
3. **มิกเซอร์ / น้ำอัดลม:** สไปรท์, โค้ก, น้ำเปล่า, โซดา, Oishi, สิงห์เลมอนโซดา, PINKเลมอนโซดา, Fanta Graye, Root beer
4. **โซจู:** โซจูพีช, โชจูสตรอว์เบอรี่, โซจูเจลลี่, โซจูโยเกิร์ต, โซจูมีเฮ Red Sherbet, โซจูSoRA
5. **ไวน์ / ค็อกเทล:** ไวน์Charles Strong, ไวน์Laughing Bird, ไวน์RUMOURS DRY, ไวน์HAUT LAPON, ไวน์Moton Cadet, Honney Conti, Cocktallซัมเมอร์เบอร์รี่

---

## ⚡ สมการคำนวณและฟีเจอร์หลัก (Core Features)

1. **Auto-Calculation:**
   - $(C) = หน้าร้าน + หลังร้าน$ (รวมร้านเปิด)
   - $(D) = หน้าร้าน + หลังร้าน$ (คงเหลือร้านปิด)
   - $(E) = (C) - (D)$ (ยอดขาย เรืองแสงสีเขียวนีออน)
2. **Data Validation:** ไอคอนแจ้งเตือน ⚠️ กะพริบอัตโนมัติหาก $(C) \neq (A) + (B)$
3. **Next Day Shift:** ปุ่มสีทอง "ปิดยอดประจำวัน" ดำเนินการผ่าน **PostgreSQL Transaction** โดยนำยอด (D) ยกไปเป็น (A) ของวันใหม่
4. **Dual View Mode:** สลับระหว่าง **โหมดตาราง (Table View)** และ **โหมดการ์ดนับเร็วบนมือถือ (Mobile Cards)**
5. **LINE Report & Excel Export:** คัดลอกสรุปส่งไลน์กลุ่มร้าน หรือส่งออกไฟล์ CSV สำหรับ Excel

---

## 💻 การรันสำหรับ Local Development (โดยไม่ใช้ Docker)

### รัน Backend:
```bash
cd backend
npm install
npx prisma generate
npm run dev
```

### รัน Frontend:
```bash
cd frontend
npm install
npm run dev
```
