import React, { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { DRINK_CATEGORIES } from '../data/initialDrinks';

export const AddItemModal = ({ isOpen, onClose, onAddItem }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('whisky');
  const [broughtForward, setBroughtForward] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddItem({
      name: name.trim(),
      category,
      broughtForward: broughtForward || '',
    });

    setName('');
    setCategory('whisky');
    setBroughtForward('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-bar-900 border border-bar-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-bar-border flex items-center justify-between bg-bar-850">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-neon-amber">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">เพิ่มรายการเครื่องดื่มใหม่</h2>
              <p className="text-xs text-slate-400">เพิ่มสินค้าลงในตารางสต็อกร้านจ๊าบบาร์</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-bar-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
          
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              ชื่อเครื่องดื่ม <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="เช่น บัลเลนไทน์ 12 ปี, ไฮเนเกนขวดใหญ่"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-bar-850 border border-bar-border rounded-lg p-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              หมวดหมู่เครื่องดื่ม
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-bar-850 border border-bar-border rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            >
              {Object.values(DRINK_CATEGORIES)
                .filter(cat => cat.id !== 'all')
                .map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-bar-900 text-slate-200">
                    {cat.icon} {cat.label}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">
              (A) ยอดยกมาเริ่มต้น (ถ้ามี)
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={broughtForward}
              onChange={(e) => setBroughtForward(e.target.value)}
              className="w-full bg-bar-850 border border-bar-border rounded-lg p-2.5 font-mono text-amber-300 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-bar-800 hover:bg-bar-750 text-slate-300 transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-bold shadow-neon-amber transition active:scale-95"
            >
              บันทึกสินค้า
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
