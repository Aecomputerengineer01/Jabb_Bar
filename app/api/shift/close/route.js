import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST /api/shift/close - ปิดยอดประจำวันด้วย Prisma Transaction
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const shiftDate = body.shiftDate || new Date().toISOString().split('T')[0];

    // ดึงรายการเครื่องดื่มปัจจุบันทั้งหมด
    const currentDrinks = await prisma.drinkItem.findMany();

    const totalOpen = currentDrinks.reduce((acc, d) => acc + (d.cFront + d.cBack), 0);
    const totalClose = currentDrinks.reduce((acc, d) => acc + (d.dFront + d.dBack), 0);
    const totalSold = totalOpen - totalClose;
    const warningCount = currentDrinks.filter(d => (d.cFront + d.cBack) !== (d.broughtForward + d.added)).length;

    // ทำงานเป็น Database Transaction รับประกันความถูกต้อง 100%
    const result = await prisma.$transaction(async (tx) => {
      // 1. บันทึก Snapshot กะประจำวัน
      const shift = await tx.dailyShift.create({
        data: {
          shiftDate,
          totalSold,
          totalOpenStock: totalOpen,
          totalCloseStock: totalClose,
          warningCount,
          notes: body.notes || 'ปิดยอดประจำวันผ่านระบบ Prisma API',
        },
      });

      // 2. บันทึกประวัติรายขวด
      for (const drink of currentDrinks) {
        const cTotal = drink.cFront + drink.cBack;
        const dTotal = drink.dFront + drink.dBack;
        const sold = cTotal - dTotal;

        await tx.shiftRecord.create({
          data: {
            shiftId: shift.id,
            drinkId: drink.id,
            drinkName: drink.name,
            category: drink.category,
            broughtForward: drink.broughtForward,
            added: drink.added,
            cTotal,
            dTotal,
            sold,
            remark: drink.remark,
          },
        });

        // 3. ยกยอดคงเหลือร้านปิด (D) ไปเป็นยอดยกมา (A) ของวันใหม่ และล้างค่าช่องอื่น
        await tx.drinkItem.update({
          where: { id: drink.id },
          data: {
            broughtForward: dTotal, // (A) = (D)
            added: 0,
            cFront: 0,
            cBack: 0,
            dFront: 0,
            dBack: 0,
            remark: null,
          },
        });
      }

      return shift;
    });

    return NextResponse.json({
      success: true,
      message: 'ปิดยอดประจำวันและยกยอดสต็อกไปวันใหม่เรียบร้อยแล้ว (Prisma Transaction)',
      data: result,
    });
  } catch (error) {
    console.error('Error closing shift with Prisma:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
