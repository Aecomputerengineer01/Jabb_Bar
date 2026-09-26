import React from 'react';
import { AlertTriangle, Plus, Minus, Flame, AlertCircle } from 'lucide-react';
import { DRINK_CATEGORIES } from '../data/initialDrinks';

export const MobileCardView = ({
  items,
  onUpdateField,
  onDeleteItem
}) => {

  const handleStep = (id, field, currentVal, delta) => {
    const num = currentVal === '' ? 0 : parseInt(currentVal, 10) || 0;
    const nextVal = Math.max(0, num + delta);
    onUpdateField(id, field, nextVal === 0 ? '' : nextVal.toString());
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  return (
    <div className="space-y-3 mb-6">
      {items.length === 0 ? (
        <div className="bg-bar-900 border border-bar-border rounded-xl p-8 text-center text-slate-400">
          ไม่พบรายการเครื่องดื่มที่ตรงกับเงื่อนไขค้นหา
        </div>
      ) : (
        items.map((row) => {
          const categoryObj = DRINK_CATEGORIES[row.category?.toUpperCase()] || DRINK_CATEGORIES.OTHER;
          const isSold = row.sold > 0;
          const isNegative = row.sold < 0;

          return (
            <div 
              key={row.id}
              className={`bg-bar-900 border rounded-xl p-3.5 transition-all shadow-lg ${
                row.hasWarning 
                  ? 'border-rose-500/70 bg-rose-950/15' 
                  : isSold 
                  ? 'border-emerald-500/40 bg-emerald-950/10' 
                  : 'border-bar-border hover:border-slate-700'
              }`}
            >
              
              {/* Card Header: No., Name, Category & SOLD BADGE */}
              <div className="flex items-start justify-between gap-2 border-b border-bar-border/60 pb-2.5 mb-3">
                <div className="flex items-start gap-2.5">
                  <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-bar-850 text-slate-400 border border-bar-border">
                    #{row.no}
                  </span>
                  <div>
                    <h3 className="font-bold text-base text-slate-100 flex items-center gap-1.5">
                      <span>{row.name}</span>
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                      <span>{categoryObj?.icon} {categoryObj?.label}</span>
                    </div>
                  </div>
                </div>

                {/* (E) SOLD HIGHLIGHT BADGE */}
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">
                    (E) ขายได้
                  </div>
                  <div 
                    className={`inline-flex items-center px-3 py-1 rounded-lg font-mono font-black text-lg transition-all ${
                      isSold
                        ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/60 shadow-neon-emerald'
                        : isNegative
                        ? 'bg-rose-500/25 text-rose-300 border border-rose-500 shadow-neon-rose'
                        : 'bg-bar-850 text-slate-500 border border-bar-border'
                    }`}
                  >
                    {isSold && <span className="mr-1 text-sm">🔥</span>}
                    {isNegative && <AlertCircle className="w-4 h-4 mr-1 text-rose-400" />}
                    <span>{row.sold}</span>
                  </div>
                </div>
              </div>

              {/* Warning Banner if (A+B) !== C */}
              {row.hasWarning && (
                <div className="mb-3 px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/50 flex items-center justify-between text-xs text-rose-200">
                  <div className="flex items-center gap-1.5 font-medium">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>ยอดเปิดร้าน ({row.cTotal}) ≠ ยกมา+สั่งเพิ่ม ({row.expectedOpen})</span>
                  </div>
                  <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-rose-600/40 text-rose-100">
                    ต่าง {row.mismatchDiff > 0 ? '+' : ''}{row.mismatchDiff}
                  </span>
                </div>
              )}

              {/* Grid of Inputs: (A) ยกมา, (B) สั่งเพิ่ม */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {/* (A) ยอดยกมา */}
                <div className="bg-bar-850/80 p-2 rounded-lg border border-bar-border">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-amber-400 font-semibold">(A) ยอดยกมา</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    placeholder="0"
                    value={row.broughtForward}
                    onFocus={handleFocus}
                    onChange={(e) => onUpdateField(row.id, 'broughtForward', e.target.value)}
                    className="w-full text-center font-mono font-bold text-amber-300 bg-bar-900 border border-bar-border rounded py-1.5 text-base focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* (B) สั่งเพิ่ม */}
                <div className="bg-bar-850/80 p-2 rounded-lg border border-bar-border">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-cyan-400 font-semibold">(B) สั่งเพิ่ม</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    placeholder="0"
                    value={row.added}
                    onFocus={handleFocus}
                    onChange={(e) => onUpdateField(row.id, 'added', e.target.value)}
                    className="w-full text-center font-mono font-bold text-cyan-300 bg-bar-900 border border-bar-border rounded py-1.5 text-base focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* (C) รวมร้านเปิด (หน้าร้าน + หลังร้าน) */}
              <div className="bg-bar-850/60 p-2.5 rounded-lg border border-bar-border mb-2.5">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-200">
                    (C) รวมร้านเปิด
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-bar-800 text-slate-100 border border-bar-border">
                    รวม = {row.cTotal}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {/* C หน้าร้าน with Quick Stepper */}
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">หน้าร้าน</label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => handleStep(row.id, 'cFront', row.cFront, -1)}
                        className="px-2 py-1.5 bg-bar-800 hover:bg-bar-750 text-slate-300 rounded-l border border-r-0 border-bar-border active:scale-95"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        inputMode="numeric"
                        placeholder="0"
                        value={row.cFront}
                        onFocus={handleFocus}
                        onChange={(e) => onUpdateField(row.id, 'cFront', e.target.value)}
                        className="w-full text-center font-mono font-semibold bg-bar-900 border-y border-bar-border py-1.5 text-sm focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => handleStep(row.id, 'cFront', row.cFront, 1)}
                        className="px-2 py-1.5 bg-bar-800 hover:bg-bar-750 text-slate-300 rounded-r border border-l-0 border-bar-border active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* C หลังร้าน with Quick Stepper */}
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">หลังร้าน</label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => handleStep(row.id, 'cBack', row.cBack, -1)}
                        className="px-2 py-1.5 bg-bar-800 hover:bg-bar-750 text-slate-300 rounded-l border border-r-0 border-bar-border active:scale-95"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        inputMode="numeric"
                        placeholder="0"
                        value={row.cBack}
                        onFocus={handleFocus}
                        onChange={(e) => onUpdateField(row.id, 'cBack', e.target.value)}
                        className="w-full text-center font-mono font-semibold bg-bar-900 border-y border-bar-border py-1.5 text-sm focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => handleStep(row.id, 'cBack', row.cBack, 1)}
                        className="px-2 py-1.5 bg-bar-800 hover:bg-bar-750 text-slate-300 rounded-r border border-l-0 border-bar-border active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* (D) คงเหลือร้านปิด (หน้าร้าน + หลังร้าน) */}
              <div className="bg-bar-850/60 p-2.5 rounded-lg border border-bar-border mb-3">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-200">
                    (D) คงเหลือร้านปิด
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-bar-800 text-slate-100 border border-bar-border">
                    รวม = {row.dTotal}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {/* D หน้าร้าน with Quick Stepper */}
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">หน้าร้าน</label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => handleStep(row.id, 'dFront', row.dFront, -1)}
                        className="px-2 py-1.5 bg-bar-800 hover:bg-bar-750 text-slate-300 rounded-l border border-r-0 border-bar-border active:scale-95"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        inputMode="numeric"
                        placeholder="0"
                        value={row.dFront}
                        onFocus={handleFocus}
                        onChange={(e) => onUpdateField(row.id, 'dFront', e.target.value)}
                        className="w-full text-center font-mono font-semibold bg-bar-900 border-y border-bar-border py-1.5 text-sm focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => handleStep(row.id, 'dFront', row.dFront, 1)}
                        className="px-2 py-1.5 bg-bar-800 hover:bg-bar-750 text-slate-300 rounded-r border border-l-0 border-bar-border active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* D หลังร้าน with Quick Stepper */}
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">หลังร้าน</label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => handleStep(row.id, 'dBack', row.dBack, -1)}
                        className="px-2 py-1.5 bg-bar-800 hover:bg-bar-750 text-slate-300 rounded-l border border-r-0 border-bar-border active:scale-95"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        inputMode="numeric"
                        placeholder="0"
                        value={row.dBack}
                        onFocus={handleFocus}
                        onChange={(e) => onUpdateField(row.id, 'dBack', e.target.value)}
                        className="w-full text-center font-mono font-semibold bg-bar-900 border-y border-bar-border py-1.5 text-sm focus:outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => handleStep(row.id, 'dBack', row.dBack, 1)}
                        className="px-2 py-1.5 bg-bar-800 hover:bg-bar-750 text-slate-300 rounded-r border border-l-0 border-bar-border active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remark */}
              <div>
                <input
                  type="text"
                  placeholder="หมายเหตุเพิ่มเติม..."
                  value={row.remark}
                  onChange={(e) => onUpdateField(row.id, 'remark', e.target.value)}
                  className="w-full bg-bar-850 border border-bar-border text-xs rounded-lg py-1.5 px-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

            </div>
          );
        })
      )}
    </div>
  );
};
