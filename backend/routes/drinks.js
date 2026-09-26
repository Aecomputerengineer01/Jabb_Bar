import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/drinks - ดึงรายการเครื่องดื่ม 41 รายการ พร้อมคำนวณ (C), (D), (E)
router.get('/', async (req, res) => {
  try {
    const drinks = await prisma.drinkItem.findMany({
      orderBy: { no: 'asc' },
    });

    const calculated = drinks.map((d) => {
      const cTotal = d.cFront + d.cBack;
      const dTotal = d.dFront + d.dBack;
      const sold = cTotal - dTotal;
      const expectedOpen = d.broughtForward + d.added;
      const hasWarning = (d.broughtForward > 0 || d.added > 0 || cTotal > 0) && cTotal !== expectedOpen;

      return {
        ...d,
        cTotal,
        dTotal,
        sold,
        expectedOpen,
        hasWarning,
        mismatchDiff: cTotal - expectedOpen,
      };
    });

    res.json({ success: true, data: calculated });
  } catch (err) {
    console.error('Error fetching drinks from PostgreSQL:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/drinks - เพิ่มรายการเครื่องดื่มใหม่
router.post('/', async (req, res) => {
  try {
    const body = req.body;
    const count = await prisma.drinkItem.count();

    const newDrink = await prisma.drinkItem.create({
      data: {
        no: count + 1,
        name: body.name,
        category: body.category || 'other',
        unit: body.unit || 'ขวด',
        broughtForward: parseInt(body.broughtForward, 10) || 0,
        added: parseInt(body.added, 10) || 0,
        cFront: parseInt(body.cFront, 10) || 0,
        cBack: parseInt(body.cBack, 10) || 0,
        dFront: parseInt(body.dFront, 10) || 0,
        dBack: parseInt(body.dBack, 10) || 0,
        remark: body.remark || null,
      },
    });

    res.status(201).json({ success: true, data: newDrink });
  } catch (err) {
    console.error('Error creating drink:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/drinks/:id - แก้ไขตัวเลขสต็อก
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { field, value } = req.body;

    if (!field) {
      return res.status(400).json({ success: false, error: 'Field is required' });
    }

    const updateData = {};
    if (['broughtForward', 'added', 'cFront', 'cBack', 'dFront', 'dBack'].includes(field)) {
      updateData[field] = value === '' ? 0 : parseInt(value, 10) || 0;
    } else {
      updateData[field] = value;
    }

    const updated = await prisma.drinkItem.update({
      where: { id },
      data: updateData,
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Error updating drink:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/drinks/:id - ลบรายการเครื่องดื่ม
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.drinkItem.delete({
      where: { id },
    });
    res.json({ success: true, message: 'Drink deleted successfully' });
  } catch (err) {
    console.error('Error deleting drink:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
