import React from 'react';
import { AlertTriangle, AlertCircle, Check, Trash2, ArrowUpDown } from 'lucide-react';
import { DRINK_CATEGORIES } from '../data/initialDrinks';

export const StockTable = ({
  items,
  onUpdateField,
  onDeleteItem,
  summary
}) => {

  const handleFocus = (e) => {
    e.target.select();
  };

  return (
    <div className="bg-bar-900 border border-bar-border rounded-xl shadow-2xl overflow-hidden mb-6">
      
      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto relative scrollbar-thin">
        <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[1050px]">
          
          {/* Table Header */}
          <thead className="bg-bar-850/95 text-slate-300 font-semibold border-b border-bar-border sticky top-0 z-20 shadow-sm backdrop-blur-sm">
            <tr>
              {/* 1. ลำดับ (No.) - Sticky left */}
              <th scope="col" className="py-3 px-2 sm:px-3 text-center w-12 sticky left-0 z-30 bg-bar-850 border-r border-bar-border/60">
                #
              </th>

              {/* 2. รายการ (Item Name) - Sticky left */}
              <th scope="col" className="py-3 px-3 sm:px-4 min-w-[170px] max-w-[220px] sticky left-12 z-30 bg-bar-850 border-r border-bar-border shadow-[4px_0_10px_rgba(0,0,0,0.5)]">
                รายการเครื่องดื่ม
              </th>

              {/* 3. (A) ยอดยกมา */}
              <th scope="col" className="py-3 px-2.5 text-center min-w-[90px] border-r border-bar-border/60 bg-bar-850/60">
                <div className="text-amber-400 font-bold">(A) ยกมา</div>
                <div className="text-[10px] text-slate-400 font-normal">Brought Fwd</div>
              </th>

              {/* 4. (B) สั่งเพิ่ม */}
              <th scope="col" className="py-3 px-2.5 text-center min-w-[90px] border-r border-bar-border/60 bg-bar-850/60">
                <div className="text-cyan-400 font-bold">(B) สั่งเพิ่ม</div>
                <div className="text-[10px] text-slate-400 font-normal">Added Stock</div>
              </th>

              {/* 5. (C) รวมร้านเปิด */}
              <th scope="col" className="py-3 px-3 text-center min-w-[210px] border-r border-bar-border/60 bg-bar-850">
                <div className="flex items-center justify-center gap-1 text-slate-100 font-bold">
                  <span>(C) รวมร้านเปิด</span>
                  <span className="text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-1 rounded font-mono">หน้า + หลัง</span>
                </div>
                <div className="grid grid-cols-3 gap-1 mt-1 text-[10px] text-slate-400 font-normal">
                  <span>หน้าร้าน</span>
                  <span>หลังร้าน</span>
                  <span className="text-amber-300 font-semibold">= รวม (C)</span>
                </div>
              </th>

              {/* 6. (D) คงเหลือร้านปิด */}
              <th scope="col" className="py-3 px-3 text-center min-w-[210px] border-r border-bar-border/60 bg-bar-850">
                <div className="flex items-center justify-center gap-1 text-slate-100 font-bold">
                  <span>(D) คงเหลือร้านปิด</span>
                  <span className="text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800/60 px-1 rounded font-mono">หน้า + หลัง</span>
                </div>
                <div className="grid grid-cols-3 gap-1 mt-1 text-[10px] text-slate-400 font-normal">
                  <span>หน้าร้าน</span>
                  <span>หลังร้าน</span>
                  <span className="text-emerald-300 font-semibold">= รวม (D)</span>
                </div>
              </th>

              {/* 7. (E) ขาย (Sold) - HIGH PRIORITY HIGHLIGHT */}
              <th scope="col" className="py-3 px-3 text-center min-w-[110px] border-r border-emerald-500/40 bg-gradient-to-b from-emerald-950/80 to-bar-850 shadow-neon-emerald">
                <div className="text-emerald-300 font-extrabold text-sm flex items-center justify-center gap-1 tracking-wide">
                  <span>⭐ (E) ขาย</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-mono font-medium">(C) - (D)</div>
              </th>

              {/* 8. หมายเหตุ */}
              <th scope="col" className="py-3 px-3 min-w-[140px] border-r border-bar-border/60">
                <div className="text-slate-200 font-medium">หมายเหตุ</div>
                <div className="text-[10px] text-slate-500 font-normal">Remark</div>
              </th>

              {/* Action column */}
              <th scope="col" className="py-3 px-2 text-center w-10">
                <span className="sr-only">ลบ</span>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-bar-border/60 font-sans">
            {items.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-12 text-center text-slate-400">
                  ไม่พบรายการเครื่องดื่มที่ตรงกับเงื่อนไขค้นหา
                </td>
              </tr>
            ) : (
              items.map((row) => {
                const categoryObj = DRINK_CATEGORIES[row.category?.toUpperCase()] || DRINK_CATEGORIES.OTHER;
                const isSold = row.sold > 0;
                const isNegative = row.sold < 0;

                return (
                  <tr 
                    key={row.id}
                    className={`transition-colors hover:bg-bar-800/70 group ${
                      row.hasWarning ? 'bg-rose-950/20' : ''
                    } ${isSold ? 'bg-emerald-950/10' : ''}`}
                  >
                    
                    {/* 1. ลำดับ (No.) - Sticky left */}
                    <td className="py-2.5 px-2 sm:px-3 text-center text-slate-400 font-mono text-xs sticky left-0 z-10 bg-bar-900 group-hover:bg-bar-800 border-r border-bar-border/60">
                      {row.no}
                    </td>

                    {/* 2. รายการ (Item Name) - Sticky left */}
                    <td className="py-2.5 px-3 sm:px-4 sticky left-12 z-10 bg-bar-900 group-hover:bg-bar-800 border-r border-bar-border shadow-[4px_0_10px_rgba(0,0,0,0.4)]">
                      <div className="font-semibold text-slate-100 flex items-center gap-1.5 flex-wrap">
                        <span>{row.name}</span>
                        {isSold && (
                          <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                            +{row.sold}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <span>{categoryObj?.icon}</span>
                        <span>{categoryObj?.label}</span>
                      </div>
                    </td>

                    {/* 3. (A) ยอดยกมา */}
                    <td className="py-2 px-2 border-r border-bar-border/60 text-center bg-bar-900/40">
                      <input
                        type="number"
                        min="0"
                        inputMode="numeric"
                        placeholder="0"
                        value={row.broughtForward}
                        onFocus={handleFocus}
                        onChange={(e) => onUpdateField(row.id, 'broughtForward', e.target.value)}
                        className="w-full max-w-[70px] mx-auto text-center font-mono font-medium text-amber-300 bg-bar-850 hover:bg-bar-800 focus:bg-bar-750 border border-bar-border/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-md py-1.5 px-1.5 transition text-sm focus:outline-none"
                      />
                    </td>

                    {/* 4. (B) สั่งเพิ่ม */}
                    <td className="py-2 px-2 border-r border-bar-border/60 text-center bg-bar-900/40">
                      <input
                        type="number"
                        min="0"
                        inputMode="numeric"
                        placeholder="0"
                        value={row.added}
                        onFocus={handleFocus}
                        onChange={(e) => onUpdateField(row.id, 'added', e.target.value)}
                        className="w-full max-w-[70px] mx-auto text-center font-mono font-medium text-cyan-300 bg-bar-850 hover:bg-bar-800 focus:bg-bar-750 border border-bar-border/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-md py-1.5 px-1.5 transition text-sm focus:outline-none"
                      />
                    </td>

                    {/* 5. (C) รวมร้านเปิด (หน้าร้าน + หลังร้าน = รวม) */}
                    <td className="py-2 px-2.5 border-r border-bar-border/60 bg-bar-900/20">
                      <div className="grid grid-cols-3 gap-1.5 items-center">
                        {/* C หน้าร้าน */}
                        <div>
                          <input
                            type="number"
                            min="0"
                            inputMode="numeric"
                            placeholder="0"
                            value={row.cFront}
                            onFocus={handleFocus}
                            onChange={(e) => onUpdateField(row.id, 'cFront', e.target.value)}
                            title="ยอดหน้าร้านตอนเปิด"
                            className="w-full text-center font-mono font-medium text-slate-100 bg-bar-850 hover:bg-bar-800 focus:bg-bar-750 border border-bar-border/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-md py-1.5 px-1 transition text-sm focus:outline-none"
                          />
                        </div>

                        {/* C หลังร้าน */}
                        <div>
                          <input
                            type="number"
                            min="0"
                            inputMode="numeric"
                            placeholder="0"
                            value={row.cBack}
                            onFocus={handleFocus}
                            onChange={(e) => onUpdateField(row.id, 'cBack', e.target.value)}
                            title="ยอดหลังร้านตอนเปิด"
                            className="w-full text-center font-mono font-medium text-slate-100 bg-bar-850 hover:bg-bar-800 focus:bg-bar-750 border border-bar-border/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-md py-1.5 px-1 transition text-sm focus:outline-none"
                          />
                        </div>

                        {/* Auto-calc (C) with DATA VALIDATION WARNING */}
                        <div className="flex items-center justify-center">
                          <div 
                            className={`w-full py-1.5 px-1 rounded-md text-center font-mono font-bold text-sm flex items-center justify-center gap-1 transition ${
                              row.hasWarning
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500 shadow-neon-rose'
                                : 'bg-bar-800 text-slate-200 border border-bar-border'
                            }`}
                            title={
                              row.hasWarning 
                                ? `⚠️ ยอดนับเปิดร้าน (${row.cTotal}) ไม่ตรงกับ ยอดยกมา+สั่งเพิ่ม (${row.expectedOpen}) ผลต่าง: ${row.mismatchDiff > 0 ? '+' : ''}${row.mismatchDiff}`
                                : `ยอดรวมเปิดร้าน = ${row.cTotal}`
                            }
                          >
                            <span>{row.cTotal}</span>
                            
                            {/* Validation Warning Icon */}
                            {row.hasWarning && (
                              <span className="relative flex items-center group/warn cursor-help">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/warn:flex flex-col items-center z-50">
                                  <span className="bg-rose-950 border border-rose-500 text-rose-200 text-[10px] rounded px-2 py-1 shadow-2xl whitespace-nowrap">
                                    ยอดเปิด {row.cTotal} ≠ {row.expectedOpen} (ต่าง {row.mismatchDiff > 0 ? '+' : ''}{row.mismatchDiff})
                                  </span>
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 6. (D) คงเหลือร้านปิด (หน้าร้าน + หลังร้าน = รวม) */}
                    <td className="py-2 px-2.5 border-r border-bar-border/60 bg-bar-900/20">
                      <div className="grid grid-cols-3 gap-1.5 items-center">
                        {/* D หน้าร้าน */}
                        <div>
                          <input
                            type="number"
                            min="0"
                            inputMode="numeric"
                            placeholder="0"
                            value={row.dFront}
                            onFocus={handleFocus}
                            onChange={(e) => onUpdateField(row.id, 'dFront', e.target.value)}
                            title="ยอดหน้าร้านตอนปิด"
                            className="w-full text-center font-mono font-medium text-slate-100 bg-bar-850 hover:bg-bar-800 focus:bg-bar-750 border border-bar-border/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-md py-1.5 px-1 transition text-sm focus:outline-none"
                          />
                        </div>

                        {/* D หลังร้าน */}
                        <div>
                          <input
                            type="number"
                            min="0"
                            inputMode="numeric"
                            placeholder="0"
                            value={row.dBack}
                            onFocus={handleFocus}
                            onChange={(e) => onUpdateField(row.id, 'dBack', e.target.value)}
                            title="ยอดหลังร้านตอนปิด"
                            className="w-full text-center font-mono font-medium text-slate-100 bg-bar-850 hover:bg-bar-800 focus:bg-bar-750 border border-bar-border/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-md py-1.5 px-1 transition text-sm focus:outline-none"
                          />
                        </div>

                        {/* Auto-calc (D) */}
                        <div className="flex items-center justify-center">
                          <div 
                            className="w-full py-1.5 px-1 rounded-md text-center font-mono font-bold text-sm bg-bar-800 text-slate-200 border border-bar-border"
                            title={`ยอดรวมคงเหลือร้านปิด = ${row.dTotal}`}
                          >
                            <span>{row.dTotal}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 7. (E) ขาย (Sold) - NEON HIGHLIGHT VISIBILITY */}
                    <td className="py-2 px-2.5 border-r border-emerald-500/30 text-center bg-gradient-to-r from-emerald-950/20 to-bar-900/40">
                      <div 
                        className={`inline-flex items-center justify-center min-w-[70px] py-1.5 px-2.5 rounded-lg font-mono font-black text-base transition-all duration-300 ${
                          isSold
                            ? 'bg-gradient-to-r from-emerald-500/30 to-emerald-400/20 text-emerald-300 border border-emerald-400/60 shadow-neon-emerald scale-105'
                            : isNegative
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-neon-rose'
                            : 'bg-bar-850/80 text-slate-500 border border-bar-border/50'
                        }`}
                        title={`ยอดขาย (E) = รวมเปิด (${row.cTotal}) - คงเหลือปิด (${row.dTotal})`}
                      >
                        {isSold && <span className="text-xs mr-0.5 text-emerald-400">🔥</span>}
                        {isNegative && <AlertCircle className="w-3.5 h-3.5 mr-1 text-rose-400" />}
                        <span>{row.sold}</span>
                      </div>
                    </td>

                    {/* 8. หมายเหตุ */}
                    <td className="py-2 px-2 border-r border-bar-border/60">
                      <input
                        type="text"
                        placeholder="หมายเหตุ..."
                        value={row.remark}
                        onChange={(e) => onUpdateField(row.id, 'remark', e.target.value)}
                        className="w-full bg-bar-850 hover:bg-bar-800 focus:bg-bar-750 text-slate-200 text-xs rounded-md py-1.5 px-2 border border-bar-border/60 focus:border-amber-400 focus:outline-none transition"
                      />
                    </td>

                    {/* 9. ลบ / Actions */}
                    <td className="py-2 px-2 text-center">
                      <button
                        onClick={() => onDeleteItem(row.id, row.name)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition opacity-30 group-hover:opacity-100"
                        title="ลบรายการนี้"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>

          {/* Table Footer - TOTAL SUMMARY */}
          {items.length > 0 && (
            <tfoot className="bg-bar-850 font-semibold border-t-2 border-bar-border text-slate-200">
              <tr>
                <td colSpan="2" className="py-3 px-4 sticky left-0 z-10 bg-bar-850 border-r border-bar-border font-bold text-amber-400 shadow-[4px_0_10px_rgba(0,0,0,0.5)]">
                  รวมทั้งสิ้น (Total)
                </td>
                
                {/* Total A */}
                <td className="py-3 px-2 text-center font-mono text-amber-300 border-r border-bar-border/60">
                  {summary.totalBroughtForward}
                </td>

                {/* Total B */}
                <td className="py-3 px-2 text-center font-mono text-cyan-300 border-r border-bar-border/60">
                  {summary.totalAdded}
                </td>

                {/* Total C */}
                <td className="py-3 px-3 text-center font-mono border-r border-bar-border/60">
                  <span className="px-2 py-1 rounded bg-bar-800 text-slate-100">
                    {summary.totalOpenStock}
                  </span>
                </td>

                {/* Total D */}
                <td className="py-3 px-3 text-center font-mono border-r border-bar-border/60">
                  <span className="px-2 py-1 rounded bg-bar-800 text-slate-100">
                    {summary.totalCloseStock}
                  </span>
                </td>

                {/* Total E Sold - HIGHLIGHT */}
                <td className="py-3 px-3 text-center font-mono border-r border-emerald-500/50 bg-emerald-950/30">
                  <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-emerald-500/30 text-emerald-300 font-extrabold text-lg border border-emerald-400 shadow-neon-emerald">
                    {summary.totalSold}
                  </div>
                </td>

                <td colSpan="2" className="py-3 px-3 text-slate-400 text-xs">
                  {summary.soldItemsCount} รายการที่ขายได้
                </td>
              </tr>
            </tfoot>
          )}

        </table>
      </div>

    </div>
  );
};
