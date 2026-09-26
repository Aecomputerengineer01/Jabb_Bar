import React, { useState } from 'react';
import { History, X, ChevronDown, ChevronRight, RotateCcw, Trash2, Calendar, FileText } from 'lucide-react';
import { formatThaiDate } from '../utils/storage';

export const HistoryModal = ({
  isOpen,
  onClose,
  history,
  onRestoreShift,
  onClearHistory
}) => {
  const [expandedId, setExpandedId] = useState(null);

  if (!isOpen) return null;

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-bar-900 border border-bar-border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-bar-border flex items-center justify-between bg-bar-850">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shadow-neon-cyan">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">ประวัติการปิดยอดที่ผ่านมา</h2>
              <p className="text-xs text-slate-400">บันทึกประวัติการปิดรอบสต็อกร้านจ๊าบบาร์</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-bar-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Shifts */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
          {history.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              ยังไม่มีประวัติการปิดยอดในระบบ (ประวัติจะถูกบันทึกเมื่อกด "ปิดยอดประจำวัน")
            </div>
          ) : (
            history.map((record) => {
              const isExpanded = expandedId === record.id;
              const soldItems = record.items?.filter(item => item.sold > 0) || [];

              return (
                <div 
                  key={record.id}
                  className="bg-bar-850 border border-bar-border rounded-xl overflow-hidden transition"
                >
                  {/* Shift Item summary header */}
                  <div 
                    onClick={() => toggleExpand(record.id)}
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-bar-800/60 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                      <div>
                        <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <span>รอบวันที่: {formatThaiDate(record.date)}</span>
                          <span className="text-xs text-slate-500 font-normal">({record.date})</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          ปิดยอดเวลา {record.time} • รวมคงเหลือยกไป {record.totalCloseStock || 0} หน่วย
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400">ขายได้รวม</div>
                        <div className="text-base font-extrabold text-emerald-400 font-mono">
                          +{record.totalSold || 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="p-3.5 bg-bar-900 border-t border-bar-border/60 space-y-3 text-xs">
                      <div className="flex justify-between items-center text-slate-400 border-b border-bar-border/40 pb-2">
                        <span className="font-semibold text-slate-300">
                          รายการเครื่องดื่มที่มียอดขาย ({soldItems.length} รายการ):
                        </span>
                        
                        {/* Restore button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`ต้องการกู้คืนข้อมูลรอบวันที่ ${record.date} กลับมาแก้ไขหรือไม่?`)) {
                              onRestoreShift(record);
                              onClose();
                            }
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition active:scale-95"
                          title="นำข้อมูลรอบนี้กลับมาในตารางหลัก"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>กู้คืนข้อมูลรอบนี้</span>
                        </button>
                      </div>

                      {soldItems.length === 0 ? (
                        <p className="text-slate-500 py-2">ไม่มีการบันทึกยอดขายในรอบนี้</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                          {soldItems.map((item, idx) => (
                            <div 
                              key={idx}
                              className="flex justify-between items-center bg-bar-850 px-2.5 py-1.5 rounded border border-bar-border"
                            >
                              <span className="text-slate-200 truncate">{item.name}</span>
                              <span className="font-mono text-emerald-400 font-bold">
                                {item.sold} ขวด
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-bar-border bg-bar-850 flex items-center justify-between">
          {history.length > 0 ? (
            <button
              onClick={() => {
                if (window.confirm('คุณต้องการลบประวัติการปิดยอดทั้งหมดหรือไม่?')) {
                  onClearHistory();
                }
              }}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ล้างประวัติทั้งหมด</span>
            </button>
          ) : <div />}

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-bar-800 hover:bg-bar-750 text-slate-300 text-xs sm:text-sm font-medium transition"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
