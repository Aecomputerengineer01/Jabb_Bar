const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const apiClient = {
  // 1. ดึงรายการเครื่องดื่มทั้งหมดจาก Express + Postgres
  async getDrinks() {
    try {
      const res = await fetch(`${API_BASE}/drinks`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Backend not available, using offline mode:', err.message);
      return null;
    }
  },

  // 2. บันทึก/อัปเดตสต็อกขวดเดียว
  async updateDrink(id, field, value) {
    try {
      const res = await fetch(`${API_BASE}/drinks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, value }),
      });
      return await res.json();
    } catch (err) {
      console.warn('Update failed on backend:', err.message);
      return null;
    }
  },

  // 3. เพิ่มรายการเครื่องดื่มใหม่
  async createDrink(drinkData) {
    try {
      const res = await fetch(`${API_BASE}/drinks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(drinkData),
      });
      return await res.json();
    } catch (err) {
      console.warn('Create drink failed on backend:', err.message);
      return null;
    }
  },

  // 4. ลบรายการเครื่องดื่ม
  async deleteDrink(id) {
    try {
      const res = await fetch(`${API_BASE}/drinks/${id}`, {
        method: 'DELETE',
      });
      return await res.json();
    } catch (err) {
      console.warn('Delete drink failed on backend:', err.message);
      return null;
    }
  },

  // 5. ปิดยอดประจำวัน (Next Day Shift)
  async closeShift(payload) {
    try {
      const res = await fetch(`${API_BASE}/shift/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return await res.json();
    } catch (err) {
      console.warn('Close shift failed on backend:', err.message);
      return null;
    }
  },

  // 6. Seed Mockup Data 41 รายการ
  async seedDatabase() {
    try {
      const res = await fetch(`${API_BASE}/seed`, {
        method: 'POST',
      });
      return await res.json();
    } catch (err) {
      console.warn('Seed database failed on backend:', err.message);
      return null;
    }
  },

  // 7. ดึงประวัติการปิดกะทั้งหมด
  async getShiftHistory() {
    try {
      const res = await fetch(`${API_BASE}/shifts`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // 8. ดึงประวัติกะตามวันที่ระบุ
  async getShiftByDate(date) {
    try {
      const res = await fetch(`${API_BASE}/shifts/date/${date}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  // 9. นำเข้าข้อมูลจำนวนมากจากไฟล์ Excel (CSV)
  async batchImportDrinks(items) {
    try {
      const res = await fetch(`${API_BASE}/drinks/batch-import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      return await res.json();
    } catch (err) {
      console.warn('Batch import failed on backend:', err.message);
      return null;
    }
  },
};
