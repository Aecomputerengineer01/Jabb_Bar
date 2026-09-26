# 🍸 ร้านจ๊าบบาร์ (JABB BAR) — ระบบนับสต็อกสินค้าเครื่องดื่ม (Dark Mode)

> **Web Application สำหรับระบบจัดการสต็อกเครื่องดื่ม ร้านจ๊าบบาร์**
> ออกแบบด้วย UI สไตล์ Dark Mode รองรับการใช้งานผ่านมือถือ แท็บเล็ต และคอมพิวเตอร์อย่างสมบูรณ์แบบ เหมาะกับการใช้งานในบาร์ที่มีแสงน้อย

---

## 🚀 ลิงก์เข้าใช้งานระบบ (Live Demo)
👉 **เปิดใช้งานผ่าน GitHub Pages:** [https://aecomputerengineer01.github.io/Jabb_Bar/](https://aecomputerengineer01.github.io/Jabb_Bar/)
📦 **GitHub Repository:** [https://github.com/Aecomputerengineer01/Jabb_Bar](https://github.com/Aecomputerengineer01/Jabb_Bar)

---

## ✨ คุณสมบัติเด่นของระบบ (Key Features)

### 1. ⚡ Auto-Calculation (คำนวณอัตโนมัติ Real-Time)
- เมื่อพิมพ์ตัวเลขในช่องนับ **หน้าร้าน** หรือ **หลังร้าน** ระบบจะคำนวณผลลัพธ์ทันที:
  - **(C) รวมร้านเปิด** = หน้าร้าน + หลังร้าน
  - **(D) คงเหลือร้านปิด** = หน้าร้าน + หลังร้าน
  - **(E) ขาย (Sold)** = $(C) - (D)$
- ไฮไลท์ช่อง **(E) ขาย** ด้วยสีเขียวนีออนเรืองแสง (Neon Emerald) โดดเด่น มองเห็นยอดขายได้ชัดเจนที่สุดจากระยะไกล

### 2. ⚠️ Data Validation (แจ้งเตือนยอดเปิดร้านไม่ตรง)
- หากยอดนับจริง $(C) \neq (A) + (B)$ ระบบจะแสดงไอคอนแจ้งเตือน **⚠️ (Warning)** แถวยอด (C) ทันที
- ชี้หรือแตะที่ไอคอนเพื่อดูรายละเอียดผลต่าง (เช่น ขาด 2 หรือ เกิน 1)
- มีปุ่ม Filter "ยอดไม่ตรงเตือน" ที่แถบด้านบน เพื่อกรองดูเฉพาะแถวที่มีปัญหาได้ทันที

### 3. 🌙 Dark Bar UI & Mobile/Tablet Responsive
- โทนสี Obsidian Black (`#07090e`), Slate Navy (`#121723`) และนีออน Amber/Emerald
- **Sticky Columns:** คอลัมน์ **# (ลำดับ)** และ **รายการเครื่องดื่ม** ตรึงอยู่กับที่เมื่อเลื่อนตารางแนวนอนบนหน้าจอมือถือ
- **Dual View Mode:**
  - **โหมดตาราง (Table View):** ครบถ้วน เหมาะสำหรับแท็บเล็ต iPad แคชเชียร์
  - **โหมดการ์ดนับเร็วบนมือถือ (Mobile Cards View):** การ์ดแยกแต่ละขวด พร้อมปุ่ม `+` / `-` ขนาดใหญ่สำหรับถือมือถือนับขวดในบาร์

### 4. 🌅 Next Day Shift (ปุ่มปิดยอดประจำวัน)
- เมื่อกด **"ปิดยอดประจำวัน"**:
  1. ระบบจะนำตัวเลขจากช่อง **(D) คงเหลือร้านปิด** ไปใส่แทนที่ในช่อง **(A) ยอดยกมา** ของวันใหม่
  2. ล้างค่าช่อง (B), (C), (D) และหมายเหตุ เป็นค่าว่างเพื่อเริ่มนับรอบใหม่
  3. เลื่อนวันที่กะทำงานไปวันถัดไปโดยอัตโนมัติ
  4. บันทึกสำเนาประวัติกะ (Shift History) และจุดพลุฉลองยอดขาย 🎉

### 5. 💾 Local Storage (บันทึกข้อมูลอัตโนมัติ 100%)
- ข้อมูลการกรอกทั้งหมดจะถูกบันทึกลง Local Storage อัตโนมัติ ป้องกันข้อมูลสูญหายเมื่อรีเฟรชหน้าจอ

### 6. 🛠️ ฟังก์ชันเสริมสำหรับร้านบาร์
- 📲 **คัดลอกสรุปยอดส่ง LINE (LINE Report):** สรุปยอดขายแยกรายขวด พร้อมส่งเข้ากลุ่มไลน์ผู้จัดการร้าน/เจ้าของร้านได้ในคลิกเดียว
- 📊 **ส่งออก Excel (CSV):** ไฟล์ UTF-8 BOM เปิดภาษาไทยใน Microsoft Excel ได้ถูกต้อง
- ➕ **เพิ่ม/ลบรายการสินค้า (Add/Delete Item):** รองรับเหล้าหรือเครื่องดื่มตัวใหม่

---

## 📦 รายการสินค้าตั้งต้น 41 รายการ (Initial Drinks List)
- **วิสกี้ / บรั่นดี / เหล้าไทย:** แบล็ค, เรด, รีเจนซี่ แบน, รีเจนซี่ กลม, GRANDE, เมอริเดียน กลม, เมอริเดียน แบน, แสงโสม กลม, แสงโสม แบน, หงษ์ทอง กลม, Kimton, Mountain King, Silver แบน
- **เบียร์ / คราฟต์เบียร์:** Schneider, สิงห์, สิงห์Resere, ลีโอ, Snowy, ไฮเนเกน 0%
- **มิกเซอร์ / น้ำอัดลม:** สไปรท์, โค้ก, น้ำเปล่า, โซดา, Oishi, สิงห์เลมอนโซดา, PINKเลมอนโซดา, Fanta Graye, Root beer
- **โซจู:** โซจูพีช, โชจูสตรอว์เบอรี่, โซจูเจลลี่, โซจูโยเกิร์ต, โซจูมีเฮ Red Sherbet, โซจูSoRA
- **ไวน์ / ค็อกเทล:** ไวน์Charles Strong, ไวน์Laughing Bird, ไวน์RUMOURS DRY, ไวน์HAUT LAPON, ไวน์Moton Cadet, Honney Conti, Cocktallซัมเมอร์เบอร์รี่

---

## 💻 Tech Stack
- **Framework:** Next.js 15 (App Router) + React 19
- **Styling:** Tailwind CSS 3.4
- **Icons:** Lucide React
- **Effects:** Canvas Confetti
- **ORM & Database:** Prisma ORM 6.4 + SQLite (`prisma/dev.db`)
- **Deployment:** GitHub Pages & Next.js Server

---

## 🗄️ โครงสร้างฐานข้อมูลและการจัดการ Mockup Data ด้วย Prisma

ระบบเชื่อมต่อกับ **Prisma ORM** โดยใช้ SQLite (`prisma/dev.db`) จัดการข้อมูลเครื่องดื่มและประวัติกะทำงาน

### โครงสร้างโมเดลใน `prisma/schema.prisma`:
- **`DrinkItem`**: เก็บข้อมูลเครื่องดื่ม 41 รายการ, สต็อกยกมา (A), สั่งเพิ่ม (B), หน้าร้าน-หลังร้าน (C, D)
- **`DailyShift`**: บันทึกประวัติการปิดยอดประจำวัน (วันที่, ยอดขายรวม, สต็อกเปิด, สต็อกปิด)
- **`ShiftRecord`**: สแนปช็อตบันทึกยอดขายรายขวดในแต่ละกะที่ปิดยอด

### คำสั่ง Prisma ที่พร้อมใช้งาน:

```bash
# 1. ซิงค์ Prisma Schema ไปยังฐานข้อมูล SQLite
npm run db:push

# 2. Seed Mockup Data เครื่องดื่ม 41 รายการเข้าฐานข้อมูล
npm run db:seed

# 3. เปิดดูและแก้ไขข้อมูลในฐานข้อมูลผ่าน GUI (Prisma Studio)
npm run db:studio
```

---

## 🔌 Next.js API Routes (Prisma Backend Handlers)

- **`GET /api/drinks/`**: ดึงข้อมูลเครื่องดื่ม 41 รายการ พร้อมผลลัพธ์คำนวณอัตโนมัติ (C, D, E) และสถานะ Warning
- **`POST /api/drinks/`**: เพิ่มเครื่องดื่มรายการใหม่เข้า Database
- **`PUT /api/drinks/`**: ปรับปรุงตัวเลขสต็อกเครื่องดื่ม
- **`POST /api/shift/close/`**: ปิดยอดประจำวันแบบ **Prisma Transaction** (บันทึกกะ, สแนปช็อต และยกยอด D ไป A)
- **`POST /api/seed/`**: รัน Seed Mockup Data 41 รายการผ่าน HTTP API

---

## 🛠️ การติดตั้งและรันในเครื่อง (Local Setup)

```bash
# ติดตั้งแพ็กเกจ
npm install

# ซิงค์และ Seed ข้อมูลตัวอย่างลง Prisma
npm run db:push
npm run db:seed

# รัน Development Server (Next.js)
npm run dev

# บิลด์สำหรับ Production Server
npm run build
```
