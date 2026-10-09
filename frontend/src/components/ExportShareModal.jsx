import React, { useState } from 'react';
import { Share2, Copy, Check, Download, Printer, X, MessageSquare } from 'lucide-react';
import { formatThaiDate, formatThaiTime } from '../utils/storage';

export const ExportShareModal = ({
  isOpen,
  onClose,
  items,
  summary,
  shiftDate
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate LINE message text
  const generateLineText = () => {
    const soldItems = summary.calculatedRows.filter(i => i.sold > 0);
    const warnings = summary.calculatedRows.filter(i => i.hasWarning);

    let text = `📊 รายงานสรุปสต็อกเครื่องดื่ม ร้านจ๊าบบาร์ (JABB BAR)\n`;
    text += `📅 ประจำวันที่: ${formatThaiDate(shiftDate)} (${shiftDate})\n`;
    text += `⏰ เวลาที่สรุป: ${formatThaiTime()}\n`;
    text += `--------------------------------\n`;
    text += `🔥 ยอดขายรวมทั้งหมด: ${summary.totalSold} ขวด/หน่วย\n`;
    text += `📦 สต็อกเปิดร้านรวม: ${summary.totalOpenStock} หน่วย\n`;
    text += `🔒 คงเหลือร้านปิดรวม: ${summary.totalCloseStock} หน่วย\n`;
    text += `--------------------------------\n`;
    text += `🏆 รายการที่มียอดขาย (${soldItems.length} รายการ):\n`;

    if (soldItems.length === 0) {
      text += `(ยังไม่มียอดขายที่บันทึก)\n`;
    } else {
      soldItems.forEach((item, idx) => {
        text += `${idx + 1}. ${item.name}: ${item.sold} ขวด\n`;
      });
    }

    if (warnings.length > 0) {
      text += `--------------------------------\n`;
      text += `⚠️ แจ้งเตือนยอดเปิดร้านไม่ตรง (${warnings.length} รายการ):\n`;
      warnings.forEach((item) => {
        text += `- ${item.name}: นับเปิด ${item.cTotal} ≠ ยกมา+สั่ง (${item.expectedOpen})\n`;
      });
    }

    text += `--------------------------------\n`;
    text += `บันทึกโดย: ระบบสต็อกจ๊าบบาร์ โหมดกลางคืน 🍸`;
    return text;
  };

  const lineReportText = generateLineText();

  const handleCopyLine = () => {
    navigator.clipboard.writeText(lineReportText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // Export to CSV with UTF-8 BOM so Excel on Windows displays Thai correctly!
  const handleExportCSV = () => {
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

    const rows = summary.calculatedRows.map(r => [
      r.no,
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.category}"`,
      r.broughtForward || '0',
      r.added || '0',
      `"${(r.cFront || '0')}+${(r.cBack || '0')}"`,
      `"${(r.dFront || '0')}+${(r.dBack || '0')}"`,
      r.sold,
      `"${(r.remark || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [
      headers.join(','),
      ...rows.map(row => row.join(',')),
      '',
      `"รวมทั้งสิ้น",,,,,${summary.totalOpenStock},${summary.totalCloseStock},${summary.totalSold},`
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `jabb_bar_stock_${shiftDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-bar-900 border border-bar-border w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-bar-border flex items-center justify-between bg-bar-850">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-neon-emerald">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">แชร์และส่งออกรายงานสต็อก</h2>
              <p className="text-xs text-slate-400">ส่งเข้ากลุ่ม LINE ร้าน หรือส่งออกไฟล์ Excel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-bar-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          
          {/* Quick Action Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Copy for LINE Button */}
            <button
              onClick={handleCopyLine}
              className={`p-3.5 rounded-xl border flex items-center gap-3 transition active:scale-95 text-left ${
                copied
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                  : 'bg-emerald-950/40 hover:bg-emerald-950/70 border-emerald-500/40 text-white'
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500 text-black flex items-center justify-center font-bold shrink-0">
                {copied ? <Check className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
              </div>
              <div>
                <div className="font-bold text-emerald-300">
                  {copied ? '✓ คัดลอกสำเร็จแล้ว!' : 'คัดลอกสรุปส่ง LINE'}
                </div>
                <div className="text-[11px] text-slate-400">
                  แตะเพื่อคัดลอกข้อความไปวางใน LINE
                </div>
              </div>
            </button>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="p-3.5 rounded-xl bg-bar-850 hover:bg-bar-800 border border-bar-border hover:border-slate-500 text-white flex items-center gap-3 transition active:scale-95 text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-bold shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-cyan-300">ดาวน์โหลด Excel (CSV)</div>
                <div className="text-[11px] text-slate-400">
                  รองรับภาษาไทยเปิดใน Excel ได้ทันที
                </div>
              </div>
            </button>
          </div>

          {/* Text Preview Box for LINE */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>ตัวอย่างข้อความสรุปสำหรับส่ง LINE:</span>
              <button
                onClick={handleCopyLine}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
              </button>
            </div>
            <textarea
              readOnly
              rows={8}
              value={lineReportText}
              className="w-full bg-bar-950 border border-bar-border rounded-xl p-3 text-xs font-mono text-slate-300 focus:outline-none select-all"
            />
          </div>

          {/* Print Report Option */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handlePrint}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bar-850 border border-bar-border transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์รายงานสต็อกหน้านี้ (Print / PDF)</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-bar-border bg-bar-850 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-bar-800 hover:bg-bar-750 text-slate-300 text-xs sm:text-sm font-medium transition"
          >
            ปิด
          </button>
        </div>

      </div>
    </div>
  );
};
