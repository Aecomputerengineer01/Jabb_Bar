import React, { useState } from 'react';
import { 
  Wine, 
  Calendar, 
  CheckCircle2, 
  RotateCcw, 
  History, 
  Share2, 
  PlusCircle, 
  LayoutList, 
  LayoutGrid,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { formatThaiDate } from '../utils/storage';

export const Header = ({
  shiftDate,
  onDateChange,
  lastSavedTime,
  onOpenCloseShift,
  onOpenHistory,
  onOpenExport,
  onOpenAddItem,
  onResetData,
  viewMode,
  setViewMode,
  warningCount,
  totalSold
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <header className="bg-bar-900/90 backdrop-blur-md border-b border-bar-border sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3">
        {/* Top bar with Brand, Save status & Quick stats */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center shadow-neon-amber">
                <Wine className="w-6 h-6 text-black" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-400 bg-clip-text text-transparent">
                    ร้านจ๊าบบาร์
                  </span>
                  <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    JABB BAR
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>ระบบนับสต็อกสินค้าเครื่องดื่ม</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  บันทึกอัตโนมัติ {lastSavedTime || 'เรียบร้อย'}
                </span>
              </p>
            </div>
          </div>

          {/* Date Picker & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* Shift Date Display / Input */}
            <div className="flex items-center gap-2 bg-bar-850 px-3 py-1.5 rounded-lg border border-bar-border text-sm text-slate-200">
              <Calendar className="w-4 h-4 text-amber-400" />
              <input
                type="date"
                value={shiftDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="bg-transparent text-slate-200 text-xs sm:text-sm font-medium focus:outline-none cursor-pointer"
              />
              <span className="text-[11px] text-amber-400/90 hidden lg:inline font-mono">
                ({formatThaiDate(shiftDate)})
              </span>
            </div>

            {/* View Mode Toggle (Mobile / Tablet friendly) */}
            <div className="flex items-center bg-bar-850 p-0.5 rounded-lg border border-bar-border">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'table'
                    ? 'bg-amber-500 text-black font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="โหมดตาราง (Table View)"
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ตาราง</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'cards'
                    ? 'bg-amber-500 text-black font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="โหมดการ์ดนับเร็วบนมือถือ (Mobile Cards)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">การ์ดนับ</span>
              </button>
            </div>

            {/* Share / LINE Report Button */}
            <button
              onClick={onOpenExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bar-800 hover:bg-bar-750 text-slate-200 border border-bar-border text-xs sm:text-sm font-medium transition hover:border-slate-500 active:scale-95"
              title="สรุปส่ง LINE / ส่งออกรายงาน"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">ส่งสรุป LINE</span>
            </button>

            {/* Shift History Button */}
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bar-800 hover:bg-bar-750 text-slate-200 border border-bar-border text-xs sm:text-sm font-medium transition hover:border-slate-500 active:scale-95"
              title="ดูประวัติการปิดยอดที่ผ่านมา"
            >
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline">ประวัติ</span>
            </button>

            {/* Add Drink Button */}
            <button
              onClick={onOpenAddItem}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bar-800 hover:bg-bar-750 text-slate-200 border border-bar-border text-xs sm:text-sm font-medium transition hover:border-slate-500 active:scale-95"
              title="เพิ่มรายการเครื่องดื่มใหม่"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">เพิ่มสินค้า</span>
            </button>

            {/* PRIMARY ACTION: Next Day Shift (ปุ่มปิดยอดประจำวัน) */}
            <button
              onClick={onOpenCloseShift}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-semibold text-xs sm:text-sm shadow-neon-amber transition duration-200 active:scale-95"
              title="กดปิดยอดประจำวัน นำคงเหลือร้านปิด (D) ไปเป็นยอดยกมา (A) ของวันใหม่"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>ปิดยอดประจำวัน</span>
            </button>

            {/* Reset / Clear Data */}
            <div className="relative">
              {showResetConfirm ? (
                <div className="absolute right-0 top-10 z-50 bg-bar-850 border border-rose-500/50 p-3 rounded-xl shadow-2xl text-xs w-60">
                  <p className="text-rose-300 font-semibold mb-2">ต้องการรีเซ็ตข้อมูลเริ่มต้น?</p>
                  <p className="text-slate-400 mb-3 text-[11px]">ข้อมูลตัวเลขที่กรอกไว้ทั้งหมดจะถูกล้างกลับเป็นค่าเริ่มต้น</p>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-2.5 py-1 rounded bg-bar-800 text-slate-300 text-xs"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={() => {
                        setShowResetConfirm(false);
                        onResetData();
                      }}
                      className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs"
                    >
                      ยืนยันรีเซ็ต
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="p-1.5 rounded-lg bg-bar-850 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-bar-border hover:border-rose-500/40 text-xs transition"
                  title="รีเซ็ตตารางเป็นค่าเริ่มต้น"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
