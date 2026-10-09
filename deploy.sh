#!/bin/bash
# ========================================================
# ร้านจ๊าบบาร์ (JABB BAR) — Script ติดตั้งและรันบน VPS / Linux
# ========================================================

set -e

echo "🚀 [1/3] กำลังเตรียมการ Deploy JABB BAR..."

if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
    echo "📋 สร้างไฟล์ .env จาก .env.example สำเร็จ"
  fi
fi

echo "🐳 [2/3] กำลัง Build และสั่งรัน Container ด้วย Docker Compose..."
if command -v docker &> /dev/null && docker compose version &> /dev/null; then
  docker compose up -d --build
elif command -v docker-compose &> /dev/null; then
  docker-compose up -d --build
else
  echo "❌ ไม่พบ docker compose หรือ docker-compose กรุณาติดตั้ง Docker ก่อน"
  exit 1
fi

echo "✨ [3/3] ติดตั้งและรันระบบสำเร็จเรียบร้อยแล้ว!"
echo "--------------------------------------------------------"
echo "🌐 Frontend (Web Application): http://localhost หรือ http://<SERVER-IP>"
echo "🔌 Backend API:              http://localhost:5000/api/drinks"
echo "🐘 PostgreSQL Database:      localhost:5432 (User: jabb_user)"
echo "--------------------------------------------------------"
echo "คำสั่งดูสถานะการทำงาน: docker compose ps"
echo "คำสั่งดู Log:          docker compose logs -f"
