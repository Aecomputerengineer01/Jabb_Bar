/**
 * Parse string or number to integer, defaulting to 0 for calculations
 */
export const parseNum = (val) => {
  if (val === '' || val === null || val === undefined) return 0;
  const num = parseFloat(val);
  return isNaN(num) ? 0 : num;
};

/**
 * Check if field has an entered value (not empty string)
 */
export const hasValue = (val) => {
  return val !== '' && val !== null && val !== undefined;
};

/**
 * Calculate all stock numbers for a row
 */
export const calculateRow = (row) => {
  const a = parseNum(row.broughtForward);
  const b = parseNum(row.added);
  const cFront = parseNum(row.cFront);
  const cBack = parseNum(row.cBack);
  const dFront = parseNum(row.dFront);
  const dBack = parseNum(row.dBack);

  // (C) รวมร้านเปิด = หน้าร้าน + หลังร้าน
  const cTotal = cFront + cBack;

  // (D) คงเหลือร้านปิด = หน้าร้าน + หลังร้าน
  const dTotal = dFront + dBack;

  // (E) ขาย = (C) - (D)
  const sold = cTotal - dTotal;

  // ยอดเปิดร้านที่ควรจะเป็นตามทฤษฎี = (A) ยอดยกมา + (B) สั่งเพิ่ม
  const expectedOpen = a + b;

  // Check if any open inputs have been touched
  const isInputted = hasValue(row.broughtForward) || hasValue(row.added) || hasValue(row.cFront) || hasValue(row.cBack);
  
  // Data Validation: หากค่า (A) + (B) ไม่เท่ากับ (C)
  // ให้แจ้งเตือนเมื่อมีการกรอกข้อมูลแล้ว และยอดรวมเปิดร้าน (C) ไม่ตรงกับ ยอดยกมา + สั่งเพิ่ม
  const isMismatch = isInputted && cTotal !== expectedOpen;
  const mismatchDiff = cTotal - expectedOpen;

  // Check if close inputs have been touched
  const hasCloseInput = hasValue(row.dFront) || hasValue(row.dBack);

  return {
    ...row,
    a,
    b,
    cFront,
    cBack,
    cTotal,
    dFront,
    dBack,
    dTotal,
    sold,
    expectedOpen,
    hasWarning: isMismatch,
    mismatchDiff,
    isInputted,
    hasCloseInput,
  };
};

/**
 * Calculate overall summary stats across all items
 */
export const calculateSummary = (items = []) => {
  const calculated = items.map(calculateRow);

  const totalSold = calculated.reduce((acc, item) => acc + (item.sold > 0 ? item.sold : 0), 0);
  const soldItemsCount = calculated.filter(item => item.sold > 0).length;
  const warningCount = calculated.filter(item => item.hasWarning).length;
  const totalBroughtForward = calculated.reduce((acc, item) => acc + item.a, 0);
  const totalAdded = calculated.reduce((acc, item) => acc + item.b, 0);
  const totalOpenStock = calculated.reduce((acc, item) => acc + item.cTotal, 0);
  const totalCloseStock = calculated.reduce((acc, item) => acc + item.dTotal, 0);

  // Top selling drinks
  const topSellers = [...calculated]
    .filter(item => item.sold > 0)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  return {
    totalSold,
    soldItemsCount,
    warningCount,
    totalBroughtForward,
    totalAdded,
    totalOpenStock,
    totalCloseStock,
    topSellers,
    calculatedRows: calculated,
  };
};
