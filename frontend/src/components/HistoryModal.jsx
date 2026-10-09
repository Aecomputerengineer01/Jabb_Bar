import React, { useState } from 'react';
import { 
  History, 
  X, 
  ChevronDown, 
  ChevronRight, 
  RotateCcw, 
  Trash2, 
  Calendar, 
  Eye, 
  Download, 
  CheckCircle2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { formatThaiDate } from '../utils/storage';

export const HistoryModal = ({
  isOpen,
  onClose,
  history,
  onRestoreShift,
  onViewHistoricalShift,
  onClearHistory
}) => {
  const [expandedId, setExpandedId] = useState(null);
  const [viewDetailTab, setViewDetailTab] = useState({}); // { [shiftId]: 'sold' | 'all' }

  if (!isOpen) return null;

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const handleExportShiftCSV = (record) => {
    if (!record || !record.items) return;

    const headers = [
      'ลำดับ',
      'รายการเครื่องดื่ม',
      'หมวดหมู่',
      '(A) ยอดยกมา',
      '(B) สั่งเพิ่ม',
      '(C) รวมร้านเปิด (หน้าร้าน+หลังร้าน)',
      '(D) คงเหลือร้านปิด (หน้าร้าน+หลังร้าน)',
      '(E) ขาย (Sold)',
      'หมายเหตุ',
    ];

    const rows = record.items.map((r, idx) => [
      idx + 1,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.category || ''}"`,
      r.broughtForward || '0',
      r.added || '0',
      `"${(r.cFront || '0')}+${(r.cBack || '0')}"`,
      `"${(r.dFront || '0')}+${(r.dBack || '0')}"`,
      r.sold || 0,
      `"${(r.remark || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [
      headers.join(','),
      ...rows.map(row => row.join(',')),
      '',
      `"รวมทั้งสิ้น",,,,,${record.totalOpenStock || 0},${record.totalCloseStock || 0},${record.totalSold || 0},`
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `jabb-bar-shift-${record.date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="bg-bar-900 border border-bar-border w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-bar-border flex items-center justify-between bg-bar-850">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shadow-neon-cyan">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">ประวัติการปิดยอดที่ผ่านมา</h2>
              <p className="text-xs text-slate-400">ดูยอดคงเหลือร้านเปิด/ปิดหน้า+หลัง และกู้คืนข้อมูลรอบก่อนหน้า</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-bar-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Shifts */}
        <div className="p-3 sm:p-5 overflow-y-auto space-y-3">
          {history.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="font-medium text-slate-300">ยังไม่มีประวัติการปิดยอดในระบบ</p>
              <p className="text-xs text-slate-500 mt-1">
                เมื่อกด "ปิดยอดประจำวัน" ข้อมูลสต็อก (รวมเปิด/ปิด หน้า+หลัง) จะถูกบันทึกไว้ที่นี่ตลอดเวลา
              </p>
            </div>
          ) : (
            history.map((record) => {
              const isExpanded = expandedId === record.id;
              const soldItems = record.items?.filter(item => (parseInt(item.sold) || 0) > 0) || [];
              const allItems = record.items || [];
              const currentTab = viewDetailTab[record.id] || 'all';

              return (
                <div 
                  key={record.id}
                  className="bg-bar-850 border border-bar-border rounded-xl overflow-hidden transition shadow-sm"
                >
                  {/* Shift Item summary header */}
                  <div 
                    onClick={() => toggleExpand(record.id)}
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-bar-800/60 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-cyan-400 shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <div>
                        <div className="font-bold text-sm text-slate-100 flex items-center gap-2 flex-wrap">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <span>รอบวันที่: {formatThaiDate(record.date)}</span>
                          <span className="text-xs text-slate-400 font-mono">({record.date})</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                          <span>ปิดยอดเวลา {record.time}</span>
                          <span className="text-slate-600">•</span>
                          <span>รวมเปิด {record.totalOpenStock || 0}</span>
                          <span className="text-slate-600">•</span>
                          <span>คงเหลือปิด {record.totalCloseStock || 0} หน่วย</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400">ยอดขายรวม</div>
                        <div className="text-base font-extrabold text-emerald-400 font-mono">
                          +{record.totalSold || 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="p-3.5 bg-bar-900 border-t border-bar-border/60 space-y-3 text-xs">
                      
                      {/* Top Action Ribbon for this shift */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-bar-border/40">
                        {/* Tab toggle */}
                        <div className="flex items-center bg-bar-850 p-0.5 rounded-lg border border-bar-border">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewDetailTab(prev => ({ ...prev, [record.id]: 'all' }));
                            }}
                            className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                              currentTab === 'all'
                                ? 'bg-cyan-500 text-black font-semibold'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            สินค้าทั้งหมด ({allItems.length})
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewDetailTab(prev => ({ ...prev, [record.id]: 'sold' }));
                            }}
                            className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                              currentTab === 'sold'
                                ? 'bg-emerald-500 text-black font-semibold'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            ที่มียอดขาย ({soldItems.length})
                          </button>
                        </div>

                        {/* Actions: View in Table, Restore, CSV */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* Export CSV */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExportShiftCSV(record);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 rounded bg-bar-800 hover:bg-bar-750 text-slate-300 border border-bar-border transition text-xs"
                            title="ดาวน์โหลดไฟล์ Excel (CSV) ของรอบนี้"
                          >
                            <Download className="w-3 h-3 text-emerald-400" />
                            <span>โหลด CSV</span>
                          </button>

                          {/* View in Table Mode */}
                          {onViewHistoricalShift && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewHistoricalShift(record);
                                onClose();
                              }}
                              className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition text-xs font-medium active:scale-95"
                              title="เปิดดูข้อมูลรอบนี้ในตารางหลักแบบละเอียด"
                            >
                              <Eye className="w-3 h-3" />
                              <span>ดูในตาราง</span>
                            </button>
                          )}

                          {/* Restore Shift */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`ต้องการกู้คืนข้อมูลรอบวันที่ ${record.date} กลับมาเป็นกะปัจจุบันหรือไม่?`)) {
                                onRestoreShift(record);
                                onClose();
                              }
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition text-xs font-medium active:scale-95"
                            title="นำข้อมูลรอบนี้กลับมาแก้ไขเป็นกะปัจจุบัน"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>กู้คืนเป็นกะปัจจุบัน</span>
                          </button>
                        </div>
                      </div>

                      {/* Items Table showing Front + Back breakdown */}
                      <div className="overflow-x-auto max-h-64 overflow-y-auto rounded-lg border border-bar-border">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-bar-850 text-slate-400 font-semibold sticky top-0 border-b border-bar-border">
                            <tr>
                              <th className="py-2 px-2.5">รายการ</th>
                              <th className="py-2 px-1 text-center">(A) ยกมา</th>
                              <th className="py-2 px-1 text-center">(B) สั่งเพิ่ม</th>
                              <th className="py-2 px-1.5 text-center text-amber-300 bg-amber-950/20">
                                (C) รวมเปิด (หน้า+หลัง)
                              </th>
                              <th className="py-2 px-1.5 text-center text-cyan-300 bg-cyan-950/20">
                                (D) คงเหลือปิด (หน้า+หลัง)
                              </th>
                              <th className="py-2 px-2 text-center text-emerald-300 bg-emerald-950/20">
                                (E) ขายได้
                              </th>
                              <th className="py-2 px-2">หมายเหตุ</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-bar-border/40 text-slate-300 font-mono">
                            {(currentTab === 'sold' ? soldItems : allItems).map((item, idx) => {
                              const cF = item.cFront !== undefined && item.cFront !== '' ? item.cFront : '-';
                              const cB = item.cBack !== undefined && item.cBack !== '' ? item.cBack : '-';
                              const cT = item.cTotal !== undefined ? item.cTotal : (parseInt(cF || 0) + parseInt(cB || 0));

                              const dF = item.dFront !== undefined && item.dFront !== '' ? item.dFront : '-';
                              const dB = item.dBack !== undefined && item.dBack !== '' ? item.dBack : '-';
                              const dT = item.dTotal !== undefined ? item.dTotal : (parseInt(dF || 0) + parseInt(dB || 0));

                              const soldNum = parseInt(item.sold) || 0;

                              return (
                                <tr key={idx} className="hover:bg-bar-850/50 transition">
                                  <td className="py-1.5 px-2.5 font-sans font-medium text-slate-200">
                                    {item.name}
                                  </td>
                                  <td className="py-1.5 px-1 text-center text-slate-400">
                                    {item.broughtForward || '0'}
                                  </td>
                                  <td className="py-1.5 px-1 text-center text-slate-400">
                                    {item.added || '0'}
                                  </td>
                                  <td className="py-1.5 px-1.5 text-center bg-amber-950/10">
                                    <span className="text-amber-400 font-bold">{cT}</span>
                                    <span className="text-[10px] text-slate-400 block font-normal">
                                      ({cF} + {cB})
                                    </span>
                                  </td>
                                  <td className="py-1.5 px-1.5 text-center bg-cyan-950/10">
                                    <span className="text-cyan-400 font-bold">{dT}</span>
                                    <span className="text-[10px] text-slate-400 block font-normal">
                                      ({dF} + {dB})
                                    </span>
                                  </td>
                                  <td className="py-1.5 px-2 text-center bg-emerald-950/10 font-bold text-emerald-400">
                                    {soldNum > 0 ? `+${soldNum}` : '0'}
                                  </td>
                                  <td className="py-1.5 px-2 text-slate-400 font-sans text-[11px] truncate max-w-[120px]">
                                    {item.remark || '-'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

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

