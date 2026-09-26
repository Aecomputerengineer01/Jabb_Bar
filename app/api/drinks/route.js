import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/drinks - ดึงรายการเครื่องดื่มทั้งหมดจากฐานข้อมูล Prisma
export async function GET() {
  try {
    const drinks = await prisma.drinkItem.findMany({
      orderBy: { no: 'asc' },
    });

    // แนบสมการคำนวณอัตโนมัติ (C, D, E) และสถานะ Warning ให้แต่ละแถว
    const calculatedDrinks = drinks.map((d) => {
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

    return NextResponse.json({ success: true, data: calculatedDrinks });
  } catch (error) {
    console.error('Error fetching drinks from Prisma:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/drinks - เพิ่มรายการเครื่องดื่มใหม่เข้าฐานข้อมูล
export async function POST(request) {
  try {
    const body = await request.json();
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

    return NextResponse.json({ success: true, data: newDrink }, { status: 201 });
  } catch (error) {
    console.error('Error creating drink in Prisma:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/drinks - ปรับปรุงตัวเลขสต็อกเครื่องดื่ม
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, field, value } = body;

    if (!id || !field) {
      return NextResponse.json({ success: false, error: 'Missing id or field' }, { status: 400 });
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

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating drink in Prisma:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
