import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/shift/close - ปิดยอดประจำวันด้วย PostgreSQL Transaction
router.post('/close', async (req, res) => {
  try {
    const { shiftDate, notes } = req.body || {};
    const dateStr = shiftDate || new Date().toISOString().split('T')[0];

    const currentDrinks = await prisma.drinkItem.findMany();

    const totalOpen = currentDrinks.reduce((acc, d) => acc + (d.cFront + d.cBack), 0);
    const totalClose = currentDrinks.reduce((acc, d) => acc + (d.dFront + d.dBack), 0);
    const totalSold = totalOpen - totalClose;
    const warningCount = currentDrinks.filter(d => (d.cFront + d.cBack) !== (d.broughtForward + d.added)).length;

    // PostgreSQL Transaction with Prisma
    const shift = await prisma.$transaction(async (tx) => {
      // 1. สร้าง Record บันทึกกะ
      const newShift = await tx.dailyShift.create({
        data: {
          shiftDate: dateStr,
          totalSold,
          totalOpenStock: totalOpen,
          totalCloseStock: totalClose,
          warningCount,
          notes: notes || 'ปิดยอดประจำวันผ่าน Node.js Express Backend',
        },
      });

      // 2. บันทึก Snapshot รายขวด
      for (const drink of currentDrinks) {
        const cTotal = drink.cFront + drink.cBack;
        const dTotal = drink.dFront + drink.dBack;
        const sold = cTotal - dTotal;

        await tx.shiftRecord.create({
          data: {
            shiftId: newShift.id,
            drinkId: drink.id,
            drinkName: drink.name,
            category: drink.category,
            broughtForward: drink.broughtForward,
            added: drink.added,
            cFront: drink.cFront,
            cBack: drink.cBack,
            cTotal,
            dFront: drink.dFront,
            dBack: drink.dBack,
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

      return newShift;
    });

    res.json({
      success: true,
      message: 'ปิดยอดประจำวันและยกยอดสต็อกไปวันใหม่เรียบร้อยแล้ว (PostgreSQL Transaction)',
      data: shift,
    });
  } catch (err) {
    console.error('Error closing shift in PostgreSQL:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/shifts - ดึงประวัติการปิดยอดที่ผ่านมาทั้งหมด
router.get('/', async (req, res) => {
  try {
    const shifts = await prisma.dailyShift.findMany({
      orderBy: { closedAt: 'desc' },
      include: { records: true },
    });
    res.json({ success: true, data: shifts });
  } catch (err) {
    console.error('Error fetching shift history:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/shifts/date/:date - ดึงประวัติกะตามวันที่ระบุ
router.get('/date/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const shift = await prisma.dailyShift.findFirst({
      where: { shiftDate: date },
      orderBy: { closedAt: 'desc' },
      include: { records: true },
    });
    if (!shift) {
      return res.status(404).json({ success: false, message: 'Shift not found for this date' });
    }
    res.json({ success: true, data: shift });
  } catch (err) {
    console.error('Error fetching shift by date:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
