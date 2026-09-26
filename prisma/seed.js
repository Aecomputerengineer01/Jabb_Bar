import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MOCKUP_DRINKS = [
  { no: 1, name: 'แบล็ค', category: 'whisky', broughtForward: 6, added: 2, cFront: 4, cBack: 4, dFront: 2, dBack: 2, remark: 'เปิดโต๊ะ VIP' },
  { no: 2, name: 'เรด', category: 'whisky', broughtForward: 8, added: 0, cFront: 5, cBack: 3, dFront: 3, dBack: 3, remark: '' },
  { no: 3, name: 'รีเจนซี่ แบน', category: 'brandy', broughtForward: 12, added: 12, cFront: 14, cBack: 10, dFront: 6, dBack: 8, remark: 'ขายดีมาก' },
  { no: 4, name: 'รีเจนซี่ กลม', category: 'brandy', broughtForward: 6, added: 4, cFront: 6, cBack: 5, dFront: 4, dBack: 3, remark: 'ยอดนับเปิดร้านเกิน 1' },
  { no: 5, name: 'GRANDE', category: 'brandy', broughtForward: 4, added: 0, cFront: 2, cBack: 2, dFront: 2, dBack: 1, remark: '' },
  { no: 6, name: 'เมอริเดียน กลม', category: 'brandy', broughtForward: 5, added: 2, cFront: 4, cBack: 3, dFront: 2, dBack: 2, remark: '' },
  { no: 7, name: 'เมอริเดียน แบน', category: 'brandy', broughtForward: 6, added: 0, cFront: 3, cBack: 3, dFront: 2, dBack: 2, remark: '' },
  { no: 8, name: 'แสงโสม กลม', category: 'thai_spirit', broughtForward: 10, added: 6, cFront: 8, cBack: 8, dFront: 4, dBack: 5, remark: 'ประจำโต๊ะ 5' },
  { no: 9, name: 'แสงโสม แบน', category: 'thai_spirit', broughtForward: 8, added: 0, cFront: 4, cBack: 4, dFront: 3, dBack: 3, remark: '' },
  { no: 10, name: 'หงษ์ทอง กลม', category: 'thai_spirit', broughtForward: 8, added: 4, cFront: 6, cBack: 6, dFront: 3, dBack: 4, remark: '' },
  { no: 11, name: 'Kimton', category: 'whisky', broughtForward: 4, added: 0, cFront: 2, cBack: 2, dFront: 2, dBack: 1, remark: '' },
  { no: 12, name: 'Mountain King', category: 'whisky', broughtForward: 3, added: 0, cFront: 2, cBack: 1, dFront: 1, dBack: 1, remark: '' },
  { no: 13, name: 'Silver แบน', category: 'thai_spirit', broughtForward: 4, added: 0, cFront: 2, cBack: 2, dFront: 2, dBack: 1, remark: '' },
  { no: 14, name: 'Honney Conti', category: 'wine', broughtForward: 5, added: 2, cFront: 4, cBack: 3, dFront: 2, dBack: 2, remark: '' },
  { no: 15, name: 'Schneider', category: 'beer', broughtForward: 12, added: 6, cFront: 10, cBack: 8, dFront: 4, dBack: 5, remark: 'คราฟต์เบียร์' },
  { no: 16, name: 'สิงห์', category: 'beer', broughtForward: 24, added: 24, cFront: 24, cBack: 24, dFront: 10, dBack: 12, remark: 'สั่งเพิ่ม 1 ลัง' },
  { no: 17, name: 'สิงห์Resere', category: 'beer', broughtForward: 12, added: 12, cFront: 12, cBack: 12, dFront: 5, dBack: 6, remark: '' },
  { no: 18, name: 'ลีโอ', category: 'beer', broughtForward: 36, added: 48, cFront: 36, cBack: 48, dFront: 18, dBack: 20, remark: 'ขายดีอันดับ 1' },
  { no: 19, name: 'สไปรท์', category: 'mixer', broughtForward: 24, added: 12, cFront: 16, cBack: 20, dFront: 8, dBack: 10, remark: '' },
  { no: 20, name: 'โค้ก', category: 'mixer', broughtForward: 30, added: 24, cFront: 20, cBack: 34, dFront: 8, dBack: 15, remark: '' },
  { no: 21, name: 'น้ำเปล่า', category: 'mixer', broughtForward: 48, added: 24, cFront: 30, cBack: 42, dFront: 12, dBack: 20, remark: '' },
  { no: 22, name: 'โซดา', category: 'mixer', broughtForward: 48, added: 48, cFront: 40, cBack: 56, dFront: 12, dBack: 22, remark: 'มิกเซอร์ยอดนิยม' },
  { no: 23, name: 'Oishi', category: 'mixer', broughtForward: 15, added: 0, cFront: 8, cBack: 7, dFront: 4, dBack: 5, remark: '' },
  { no: 24, name: 'สิงห์เลมอนโซดา', category: 'mixer', broughtForward: 18, added: 12, cFront: 15, cBack: 15, dFront: 6, dBack: 8, remark: '' },
  { no: 25, name: 'PINKเลมอนโซดา', category: 'mixer', broughtForward: 18, added: 0, cFront: 10, cBack: 8, dFront: 5, dBack: 6, remark: '' },
  { no: 26, name: 'โซจูพีช', category: 'soju', broughtForward: 10, added: 5, cFront: 7, cBack: 8, dFront: 3, dBack: 4, remark: '' },
  { no: 27, name: 'โชจูสตรอว์เบอรี่', category: 'soju', broughtForward: 10, added: 0, cFront: 5, cBack: 5, dFront: 2, dBack: 3, remark: '' },
  { no: 28, name: 'โซจูเจลลี่', category: 'soju', broughtForward: 8, added: 0, cFront: 4, cBack: 4, dFront: 2, dBack: 3, remark: '' },
  { no: 29, name: 'โซจูโยเกิร์ต', category: 'soju', broughtForward: 8, added: 4, cFront: 6, cBack: 6, dFront: 2, dBack: 3, remark: '' },
  { no: 30, name: 'ไวน์Charles Strong', category: 'wine', broughtForward: 4, added: 0, cFront: 2, cBack: 2, dFront: 1, dBack: 2, remark: '' },
  { no: 31, name: 'ไวน์Laughing Bird', category: 'wine', broughtForward: 4, added: 0, cFront: 2, cBack: 2, dFront: 2, dBack: 1, remark: '' },
  { no: 32, name: 'ไวน์RUMOURS DRY', category: 'wine', broughtForward: 3, added: 0, cFront: 2, cBack: 1, dFront: 1, dBack: 1, remark: '' },
  { no: 33, name: 'ไวน์HAUT LAPON', category: 'wine', broughtForward: 3, added: 0, cFront: 2, cBack: 1, dFront: 1, dBack: 1, remark: '' },
  { no: 34, name: 'ไวน์Moton Cadet', category: 'wine', broughtForward: 3, added: 0, cFront: 2, cBack: 1, dFront: 1, dBack: 1, remark: '' },
  { no: 35, name: 'โซจูมีเฮ Red Sherbet', category: 'soju', broughtForward: 6, added: 0, cFront: 3, cBack: 3, dFront: 1, dBack: 2, remark: '' },
  { no: 36, name: 'โซจูSoRA', category: 'soju', broughtForward: 6, added: 0, cFront: 3, cBack: 3, dFront: 2, dBack: 2, remark: '' },
  { no: 37, name: 'Snowy', category: 'beer', broughtForward: 12, added: 6, cFront: 10, cBack: 8, dFront: 3, dBack: 4, remark: '' },
  { no: 38, name: 'ไฮเนเกน 0%', category: 'beer', broughtForward: 8, added: 0, cFront: 4, cBack: 4, dFront: 3, dBack: 3, remark: 'เครื่องดื่ม 0%' },
  { no: 39, name: 'Cocktallซัมเมอร์เบอร์รี่', category: 'other', broughtForward: 10, added: 5, cFront: 8, cBack: 7, dFront: 3, dBack: 4, remark: '' },
  { no: 40, name: 'Fanta Graye', category: 'mixer', broughtForward: 15, added: 0, cFront: 8, cBack: 7, dFront: 3, dBack: 5, remark: '' },
  { no: 41, name: 'Root beer', category: 'mixer', broughtForward: 12, added: 0, cFront: 6, cBack: 6, dFront: 2, dBack: 4, remark: '' },
];

async function main() {
  console.log('🔄 เริ่มต้นล้างข้อมูลเก่าและ Seed Mockup Data ร้านจ๊าบบาร์ ด้วย Prisma...');

  // Clear existing records
  await prisma.shiftRecord.deleteMany();
  await prisma.dailyShift.deleteMany();
  await prisma.drinkItem.deleteMany();

  console.log(`📦 กำลังบันทึกรายการเครื่องดื่มทั้งหมด ${MOCKUP_DRINKS.length} รายการลง Database...`);

  for (const item of MOCKUP_DRINKS) {
    await prisma.drinkItem.create({
      data: item,
    });
  }

  // Calculate totals for sample shift
  const totalOpen = MOCKUP_DRINKS.reduce((acc, i) => acc + (i.cFront + i.cBack), 0);
  const totalClose = MOCKUP_DRINKS.reduce((acc, i) => acc + (i.dFront + i.dBack), 0);
  const totalSold = totalOpen - totalClose;

  // Create an initial sample shift record
  const sampleShift = await prisma.dailyShift.create({
    data: {
      shiftDate: new Date().toISOString().split('T')[0],
      totalSold,
      totalOpenStock: totalOpen,
      totalCloseStock: totalClose,
      warningCount: 1, // item #4 has mismatch demo
      notes: 'กะตัวอย่างเริ่มต้นระบบ จ๊าบบาร์ Dark Mode',
    },
  });

  console.log(`✅ Seed Mockup Data สำเร็จเรียบร้อย!`);
  console.log(`   - จำนวนเครื่องดื่ม: ${MOCKUP_DRINKS.length} รายการ`);
  console.log(`   - ตัวอย่างยอดขายรวม: ${totalSold} หน่วย`);
  console.log(`   - ตัวอย่างสต็อกเปิดร้าน: ${totalOpen} หน่วย`);
  console.log(`   - ตัวอย่างคงเหลือปิดร้าน: ${totalClose} หน่วย`);
}

main()
  .catch((e) => {
    console.error('❌ เกิดข้อผิดพลาดในการ Seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
