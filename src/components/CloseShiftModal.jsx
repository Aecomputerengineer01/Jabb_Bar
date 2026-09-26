import React, { useState } from 'react';
import { Sparkles, AlertTriangle, CheckCircle2, X, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatThaiDate } from '../utils/storage';

export const CloseShiftModal = ({
  isOpen,
  onClose,
  onConfirmCloseShift,
  shiftDate,
  summary
}) => {
  const [saveToHistory, setSaveToHistory] = useState(true);

  if (!isOpen) return null;

  const handleConfirm = () => {
    // Trigger celebratory confetti effect
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    onConfirmCloseShift({ saveToHistory });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-bar-900 border border-bar-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-bar-border flex items-center justify-between bg-bar-850">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-neon-amber">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">ปิดยอดประจำวัน (Next Day Shift)</h2>
              <p className="text-xs text-slate-400">สรุปและยกยอดสต็อกไปวันถัดไป</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-bar-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          
          {/* Shift Date banner */}
          <div className="bg-bar-850 p-3 rounded-xl border border-bar-border flex items-center justify-between text-sm">
            <span className="text-slate-400">ปิดยอดรอบวันที่:</span>
            <span className="font-bold text-amber-300 font-mono">
              {formatThaiDate(shiftDate)} ({shiftDate})
            </span>
          </div>

          {/* Core Logic Explanation Box */}
          <div className="bg-gradient-to-r from-amber-950/40 to-bar-850 border border-amber-500/30 rounded-xl p-3.5 text-xs text-slate-300 space-y-2">
            <div className="font-semibold text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              การทำงานของระบบเมื่อกดปิดยอด:
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                (D) คงเหลือร้านปิด
              </span>
              <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="px-2 py-0.5 rounded bg-amber-500 text-black font-mono font-bold">
                (A) ยอดยกมาของวันใหม่
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              • ช่อง สั่งเพิ่ม (B), หน้าร้าน-หลังร้าน (C, D) และหมายเหตุ จะถูกล้างเป็นค่าว่างเพื่อพร้อมนับรอบวันใหม่
            </p>
          </div>

          {/* Shift Recap Metrics */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-bar-850 p-3 rounded-xl border border-emerald-500/30">
              <div className="text-xs text-emerald-400 font-medium mb-1">ยอดขายรวมที่ทำได้ (E)</div>
              <div className="text-2xl font-extrabold text-emerald-300 font-mono">
                {summary.totalSold}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {summary.soldItemsCount} รายการเครื่องดื่ม
              </div>
            </div>

            <div className="bg-bar-850 p-3 rounded-xl border border-bar-border">
              <div className="text-xs text-amber-400 font-medium mb-1">ยอดคงเหลือยกไปวันใหม่</div>
              <div className="text-2xl font-extrabold text-slate-100 font-mono">
                {summary.totalCloseStock}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">หน่วยขวด/กระป๋อง</div>
            </div>
          </div>

          {/* Warnings notice if any */}
          {summary.warningCount > 0 && (
            <div className="bg-rose-950/40 border border-rose-500/60 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-200">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-rose-300">
                  มีรายการที่ยอดเปิดร้านไม่ตรง {summary.warningCount} รายการ!
                </strong>
                <p className="text-[11px] text-rose-300/80 mt-0.5">
                  ท่านยังสามารถปิดยอดได้ตามปกติ ยอดคงเหลือ (D) จะถูกนำไปยกมาในวันใหม่
                </p>
              </div>
            </div>
          )}

          {/* Top Sellers mini list */}
          {summary.topSellers.length > 0 && (
            <div className="bg-bar-850/60 p-3 rounded-xl border border-bar-border text-xs">
              <div className="text-slate-400 font-semibold mb-2 flex items-center justify-between">
                <span>🏆 5 อันดับเครื่องดื่มขายดีรอบนี้</span>
              </div>
              <div className="space-y-1.5 font-mono">
                {summary.topSellers.map((item, idx) => (
                  <div key={item.id} className="flex justify-between items-center text-slate-200">
                    <span className="truncate">{idx + 1}. {item.name}</span>
                    <span className="text-emerald-400 font-bold">+{item.sold} ขวด</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save to History Checkbox */}
          <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={saveToHistory}
              onChange={(e) => setSaveToHistory(e.target.checked)}
              className="rounded bg-bar-800 border-bar-border text-amber-500 focus:ring-amber-500 w-4 h-4 cursor-pointer"
            />
            <span>บันทึกประวัติการปิดยอดรอบนี้ไว้ในระบบ (ดูย้อนหลังหรือกู้คืนได้)</span>
          </label>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-bar-border bg-bar-850 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-bar-800 hover:bg-bar-750 text-slate-300 text-sm font-medium transition"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black text-sm font-bold shadow-neon-amber transition duration-200 active:scale-95 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-black" />
            <span>ยืนยันปิดยอดและยกยอดไปวันใหม่</span>
          </button>
        </div>

      </div>
    </div>
  );
};
