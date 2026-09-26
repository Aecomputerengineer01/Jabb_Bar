import React from 'react';
import { Flame, AlertTriangle, TrendingUp, Package, ShieldCheck } from 'lucide-react';

export const StatCards = ({ summary, onFilterWarnings, onFilterSold }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 my-3 sm:my-5">
      
      {/* 1. HIGHLIGHT: Total Sold (E) */}
      <div 
        onClick={onFilterSold}
        className="cursor-pointer bg-gradient-to-br from-emerald-950/60 via-bar-850 to-bar-900 border border-emerald-500/40 rounded-xl p-3 sm:p-4 shadow-neon-emerald hover:border-emerald-400 transition group"
      >
        <div className="flex items-center justify-between text-xs text-emerald-400/90 font-medium mb-1">
          <span className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            ยอดขายรวมวันนี้ (E)
          </span>
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {summary.soldItemsCount} รายการ
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono tracking-tight drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
            {summary.totalSold}
          </span>
          <span className="text-xs text-emerald-500 font-medium">ขวด/หน่วย</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1 truncate">
          {summary.topSellers.length > 0 ? (
            <span>ขายดี: <strong className="text-emerald-400">{summary.topSellers[0].name} ({summary.topSellers[0].sold})</strong></span>
          ) : (
            <span>คลิกเพื่อดูรายการที่มียอดขาย</span>
          )}
        </div>
      </div>

      {/* 2. Total Open Stock (C) */}
      <div className="bg-bar-850/80 border border-bar-border rounded-xl p-3 sm:p-4 hover:border-slate-600 transition">
        <div className="flex items-center justify-between text-xs text-cyan-400/90 font-medium mb-1">
          <span className="flex items-center gap-1.5">
            <Package className="w-4 h-4 text-cyan-400" />
            รวมร้านเปิด (C)
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            ยกมา {summary.totalBroughtForward} + เพิ่ม {summary.totalAdded}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
            {summary.totalOpenStock}
          </span>
          <span className="text-xs text-slate-400 font-medium">หน่วย</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          ยอดรวมสต็อกตอนเปิดร้าน
        </div>
      </div>

      {/* 3. Total Close Stock (D) */}
      <div className="bg-bar-850/80 border border-bar-border rounded-xl p-3 sm:p-4 hover:border-slate-600 transition">
        <div className="flex items-center justify-between text-xs text-amber-400/90 font-medium mb-1">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            คงเหลือร้านปิด (D)
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            ส่งต่อไปพรุ่งนี้
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
            {summary.totalCloseStock}
          </span>
          <span className="text-xs text-slate-400 font-medium">หน่วย</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          หน้าร้าน + หลังร้านตอนปิด
        </div>
      </div>

      {/* 4. WARNINGS: Data Validation (A+B !== C) */}
      <div 
        onClick={onFilterWarnings}
        className={`cursor-pointer rounded-xl p-3 sm:p-4 transition border group ${
          summary.warningCount > 0
            ? 'bg-gradient-to-br from-rose-950/60 via-bar-850 to-bar-900 border-rose-500/50 shadow-neon-rose hover:border-rose-400'
            : 'bg-bar-850/80 border-bar-border hover:border-slate-600'
        }`}
      >
        <div className="flex items-center justify-between text-xs font-medium mb-1">
          <span className={`flex items-center gap-1.5 ${summary.warningCount > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
            <AlertTriangle className={`w-4 h-4 ${summary.warningCount > 0 ? 'text-rose-400 animate-bounce' : 'text-slate-500'}`} />
            จุดเตือนยอดไม่ตรง (A+B ≠ C)
          </span>
          {summary.warningCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
              ต้องตรวจสอบ
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${
            summary.warningCount > 0 ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'text-slate-400'
          }`}>
            {summary.warningCount}
          </span>
          <span className="text-xs text-slate-400 font-medium">รายการ</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400 truncate">
          {summary.warningCount > 0 ? (
            <span className="text-rose-300 font-medium underline">คลิกเพื่อกรองดูรายการที่มีปัญหา</span>
          ) : (
            <span className="text-emerald-400/80">✓ ยอดเปิดร้านสมดุลถูกต้องทั้งหมด</span>
          )}
        </div>
      </div>

    </div>
  );
};
