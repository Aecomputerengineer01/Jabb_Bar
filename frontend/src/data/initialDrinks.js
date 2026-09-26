export const DRINK_CATEGORIES = {
  ALL: { id: 'all', label: 'ทั้งหมด', icon: '🍷' },
  WHISKY: { id: 'whisky', label: 'วิสกี้ / สปิริต', icon: '🥃' },
  BRANDY: { id: 'brandy', label: 'บรั่นดี', icon: '🏺' },
  THAI: { id: 'thai_spirit', label: 'เหล้าไทย / รัม', icon: '🍶' },
  BEER: { id: 'beer', label: 'เบียร์', icon: '🍺' },
  SOJU: { id: 'soju', label: 'โซจู', icon: '🍾' },
  WINE: { id: 'wine', label: 'ไวน์', icon: '🍷' },
  MIXER: { id: 'mixer', label: 'มิกเซอร์ / น้ำอัดลม', icon: '🥤' },
  OTHER: { id: 'other', label: 'ค็อกเทล / อื่นๆ', icon: '🍹' },
};

export const INITIAL_DRINKS_LIST = [
  { name: 'แบล็ค', category: 'whisky' },
  { name: 'เรด', category: 'whisky' },
  { name: 'รีเจนซี่ แบน', category: 'brandy' },
  { name: 'รีเจนซี่ กลม', category: 'brandy' },
  { name: 'GRANDE', category: 'brandy' },
  { name: 'เมอริเดียน กลม', category: 'brandy' },
  { name: 'เมอริเดียน แบน', category: 'brandy' },
  { name: 'แสงโสม กลม', category: 'thai_spirit' },
  { name: 'แสงโสม แบน', category: 'thai_spirit' },
  { name: 'หงษ์ทอง กลม', category: 'thai_spirit' },
  { name: 'Kimton', category: 'whisky' },
  { name: 'Mountain King', category: 'whisky' },
  { name: 'Silver แบน', category: 'thai_spirit' },
  { name: 'Honney Conti', category: 'wine' },
  { name: 'Schneider', category: 'beer' },
  { name: 'สิงห์', category: 'beer' },
  { name: 'สิงห์Resere', category: 'beer' },
  { name: 'ลีโอ', category: 'beer' },
  { name: 'สไปรท์', category: 'mixer' },
  { name: 'โค้ก', category: 'mixer' },
  { name: 'น้ำเปล่า', category: 'mixer' },
  { name: 'โซดา', category: 'mixer' },
  { name: 'Oishi', category: 'mixer' },
  { name: 'สิงห์เลมอนโซดา', category: 'mixer' },
  { name: 'PINKเลมอนโซดา', category: 'mixer' },
  { name: 'โซจูพีช', category: 'soju' },
  { name: 'โชจูสตรอว์เบอรี่', category: 'soju' },
  { name: 'โซจูเจลลี่', category: 'soju' },
  { name: 'โซจูโยเกิร์ต', category: 'soju' },
  { name: 'ไวน์Charles Strong', category: 'wine' },
  { name: 'ไวน์Laughing Bird', category: 'wine' },
  { name: 'ไวน์RUMOURS DRY', category: 'wine' },
  { name: 'ไวน์HAUT LAPON', category: 'wine' },
  { name: 'ไวน์Moton Cadet', category: 'wine' },
  { name: 'โซจูมีเฮ Red Sherbet', category: 'soju' },
  { name: 'โซจูSoRA', category: 'soju' },
  { name: 'Snowy', category: 'beer' },
  { name: 'ไฮเนเกน 0%', category: 'beer' },
  { name: 'Cocktallซัมเมอร์เบอร์รี่', category: 'other' },
  { name: 'Fanta Graye', category: 'mixer' },
  { name: 'Root beer', category: 'mixer' },
];

export const createInitialStockData = () => {
  return INITIAL_DRINKS_LIST.map((item, index) => ({
    id: `item-${index + 1}`,
    no: index + 1,
    name: item.name,
    category: item.category,
    broughtForward: '', // (A) ยอดยกมา
    added: '',          // (B) สั่งเพิ่ม
    cFront: '',         // (C) รวมร้านเปิด - หน้าร้าน
    cBack: '',          // (C) รวมร้านเปิด - หลังร้าน
    dFront: '',         // (D) คงเหลือร้านปิด - หน้าร้าน
    dBack: '',          // (D) คงเหลือร้านปิด - หลังร้าน
    remark: '',         // หมายเหตุ
  }));
};
