import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { INITIAL_DRINKS_LIST } from '@/data/initialDrinks';

export async function POST() {
  try {
    // ล้างข้อมูลเดิม
    await prisma.shiftRecord.deleteMany();
    await prisma.dailyShift.deleteMany();
    await prisma.drinkItem.deleteMany();

    // บันทึกข้อมูลตั้งต้น 41 รายการ
    for (let i = 0; i < INITIAL_DRINKS_LIST.length; i++) {
      const item = INITIAL_DRINKS_LIST[i];
      await prisma.drinkItem.create({
        data: {
          no: i + 1,
          name: item.name,
          category: item.category,
          broughtForward: 5,
          added: i % 3 === 0 ? 6 : 0,
          cFront: 3,
          cBack: 3,
          dFront: 2,
          dBack: 2,
          remark: i === 0 ? 'เปิดโต๊ะ VIP' : null,
        },
      });
    }

    const count = await prisma.drinkItem.count();

    return NextResponse.json({
      success: true,
      message: `รีเซ็ตและ Seed Mockup Data สำเร็จเรียบร้อย (${count} รายการ)`,
      count,
    });
  } catch (error) {
    console.error('Error seeding via API:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
