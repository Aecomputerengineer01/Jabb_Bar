import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, Check, AlertTriangle, X, ArrowRight, Table } from 'lucide-react';

export const ImportExcelModal = ({
  isOpen,
  onClose,
  onImportComplete,
}) => {
  const [parsedData, setParsedData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  // Simple and robust CSV parser supporting quoted strings and Thai UTF-8
  const parseCSV = (text) => {
    // Strip UTF-8 BOM if present
    const cleanText = text.replace(/^\uFEFF/, '');
    const lines = cleanText.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) throw new Error('ไฟล์ไม่มีข้อมูล หรือมีเฉพาะหัวตาราง');

    // Parse CSV line taking quotes into account
    const parseLine = (line) => {
      const result = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
      return result;
    };

    const headers = parseLine(lines[0]);
    
    // Find column index mappings
    const findIndex = (keywords) => {
      return headers.findIndex(h => keywords.some(k => h.toLowerCase().includes(k.toLowerCase())));
    };

    const noIdx = findIndex(['ลำดับ', 'no']);
    const nameIdx = findIndex(['รายการ', 'name', 'เครื่องดื่ม']);
    const catIdx = findIndex(['หมวดหมู่', 'category']);
    const aIdx = findIndex(['(A)', 'ยกมา', 'broughtforward']);
    const bIdx = findIndex(['(B)', 'สั่งเพิ่ม', 'added']);
    
    // Check for combined (C) column or separate front/back
    const cCombinedIdx = findIndex(['รวมร้านเปิด (หน้าร้าน+หลังร้าน)', 'รวมร้านเปิด (หน้า+หลัง)', '(c) รวมร้านเปิด', 'รวมร้านเปิด']);
    const cFrontIdx = findIndex(['(C) รวมร้านเปิด [หน้าร้าน]', 'cFront', 'เปิดหน้าร้าน', 'c_front']);
    const cBackIdx = findIndex(['(C) รวมร้านเปิด [หลังร้าน]', 'cBack', 'เปิดหลังร้าน', 'c_back']);

    // Check for combined (D) column or separate front/back
    const dCombinedIdx = findIndex(['คงเหลือร้านปิด (หน้าร้าน+หลังร้าน)', 'คงเหลือร้านปิด (หน้า+หลัง)', '(d) คงเหลือร้านปิด', 'คงเหลือร้านปิด']);
    const dFrontIdx = findIndex(['(D) คงเหลือร้านปิด [หน้าร้าน]', 'dFront', 'ปิดหน้าร้าน', 'd_front']);
    const dBackIdx = findIndex(['(D) คงเหลือร้านปิด [หลังร้าน]', 'dBack', 'ปิดหลังร้าน', 'd_back']);
    const remarkIdx = findIndex(['หมายเหตุ', 'remark']);

    if (nameIdx === -1) {
      throw new Error('ไม่พบคอลัมน์ "รายการเครื่องดื่ม" หรือ "Item Name" ในไฟล์');
    }

    // Helper to parse "4+3", "4 + 3", or "7" into front and back values
    const parseFrontBack = (val) => {
      if (!val) return { front: '0', back: '0' };
      const str = val.toString().trim();
      const match = str.match(/(\d+)\s*\+\s*(\d+)/);
      if (match) {
        return { front: match[1], back: match[2] };
      }
      const num = parseInt(str, 10);
      return { front: isNaN(num) ? '0' : num.toString(), back: '0' };
    };

    const items = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseLine(lines[i]);
      if (!values || values.length <= 1) continue;
      const itemName = values[nameIdx];
      if (!itemName || itemName.includes('รวมทั้งสิ้น')) continue;

      let cFrontVal = '0';
      let cBackVal = '0';
      if (cCombinedIdx !== -1 && values[cCombinedIdx] !== undefined && values[cCombinedIdx] !== '') {
        const parsed = parseFrontBack(values[cCombinedIdx]);
        cFrontVal = parsed.front;
        cBackVal = parsed.back;
      } else {
        if (cFrontIdx !== -1 && values[cFrontIdx] !== '') cFrontVal = values[cFrontIdx];
        if (cBackIdx !== -1 && values[cBackIdx] !== '') cBackVal = values[cBackIdx];
      }

      let dFrontVal = '0';
      let dBackVal = '0';
      if (dCombinedIdx !== -1 && values[dCombinedIdx] !== undefined && values[dCombinedIdx] !== '') {
        const parsed = parseFrontBack(values[dCombinedIdx]);
        dFrontVal = parsed.front;
        dBackVal = parsed.back;
      } else {
        if (dFrontIdx !== -1 && values[dFrontIdx] !== '') dFrontVal = values[dFrontIdx];
        if (dBackIdx !== -1 && values[dBackIdx] !== '') dBackVal = values[dBackIdx];
      }

      items.push({
        no: noIdx !== -1 ? parseInt(values[noIdx], 10) || i : i,
        name: itemName,
        category: catIdx !== -1 && values[catIdx] ? values[catIdx] : 'whisky',
        broughtForward: aIdx !== -1 && values[aIdx] !== '' ? values[aIdx] : '0',
        added: bIdx !== -1 && values[bIdx] !== '' ? values[bIdx] : '0',
        cFront: cFrontVal,
        cBack: cBackVal,
        dFront: dFrontVal,
        dBack: dBackVal,
        remark: remarkIdx !== -1 ? values[remarkIdx] : '',
      });
    }

    return items;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setErrorMsg('');
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result;
        if (typeof text !== 'string') throw new Error('ไม่สามารถอ่านไฟล์ได้');
        const items = parseCSV(text);
        if (items.length === 0) throw new Error('ไม่พบข้อมูลเครื่องดื่มในไฟล์');
        setParsedData(items);
      } catch (err) {
        setErrorMsg(err.message || 'รูปแบบไฟล์ไม่ถูกต้อง กรุณาใช้ไฟล์ CSV จากระบบหรือ Excel');
        setParsedData([]);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.onerror = () => {
      setErrorMsg('เกิดข้อผิดพลาดในการอ่านไฟล์');
      setIsProcessing(false);
    };

    reader.readAsText(file, 'UTF-8');
  };

  const handleConfirmImport = async () => {
    if (parsedData.length === 0) return;
    setIsProcessing(true);
    try {
      await onImportComplete(parsedData);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'เกิดข้อผิดพลาดในการนำเข้าข้อมูล');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="bg-bar-900 border border-bar-border w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-bar-border flex items-center justify-between bg-bar-850">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-neon-emerald">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">นำเข้าข้อมูลสต็อกผ่านไฟล์ Excel (CSV)</h2>
              <p className="text-xs text-slate-400">อัปเดตสต็อกหรือเพิ่มสินค้าจากไฟล์ Excel ที่เคยส่งออกหรือสร้างใหม่</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-bar-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          
          {/* File Upload Box */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-bar-border hover:border-emerald-400/70 bg-bar-850/50 hover:bg-bar-850 rounded-2xl p-6 text-center cursor-pointer transition group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv,text/csv"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <div className="font-semibold text-slate-100 text-sm mb-1">
              {fileName ? fileName : 'คลิกเพื่อเลือกไฟล์ Excel (CSV) หรือลากไฟล์มาวางที่นี่'}
            </div>
            <p className="text-slate-400 text-xs">
              รองรับไฟล์ `.csv` ที่ส่งออกจากระบบจ๊าบบาร์ หรือไฟล์ Excel ภาษาไทย (UTF-8)
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-rose-950/40 border border-rose-500/60 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-200">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedData.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold flex items-center gap-1.5">
                  <Table className="w-4 h-4 text-emerald-400" />
                  <span>ตัวอย่างข้อมูลที่ตรวจพบ ({parsedData.length} รายการ):</span>
                </span>
                <span className="text-[11px] text-emerald-400 font-mono">
                  พร้อมนำเข้าและอัปเดตระบบ
                </span>
              </div>

              <div className="max-h-56 overflow-y-auto border border-bar-border rounded-xl bg-bar-950 scrollbar-thin">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-bar-850 text-slate-300 sticky top-0 z-10 border-b border-bar-border">
                    <tr>
                      <th className="p-2 text-center w-10">#</th>
                      <th className="p-2">รายการ</th>
                      <th className="p-2 text-center text-amber-300">ยกมา (A)</th>
                      <th className="p-2 text-center text-cyan-300">สั่งเพิ่ม (B)</th>
                      <th className="p-2 text-center text-slate-300">เปิดหน้า/หลัง</th>
                      <th className="p-2 text-center text-slate-300">ปิดหน้า/หลัง</th>
                      <th className="p-2">หมายเหตุ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bar-border/50 text-slate-200">
                    {parsedData.slice(0, 15).map((row, idx) => (
                      <tr key={idx} className="hover:bg-bar-850/60">
                        <td className="p-2 text-center font-mono text-slate-400">{row.no}</td>
                        <td className="p-2 font-medium">{row.name}</td>
                        <td className="p-2 text-center font-mono text-amber-300">{row.broughtForward}</td>
                        <td className="p-2 text-center font-mono text-cyan-300">{row.added}</td>
                        <td className="p-2 text-center font-mono text-slate-300">
                          {row.cFront} + {row.cBack} = {parseInt(row.cFront || 0) + parseInt(row.cBack || 0)}
                        </td>
                        <td className="p-2 text-center font-mono text-slate-300">
                          {row.dFront} + {row.dBack} = {parseInt(row.dFront || 0) + parseInt(row.dBack || 0)}
                        </td>
                        <td className="p-2 text-slate-400 truncate max-w-[120px]">{row.remark || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedData.length > 15 && (
                <div className="text-[11px] text-slate-500 text-center">
                  ... และอีก {parsedData.length - 15} รายการ
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-bar-border bg-bar-850 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-bar-800 hover:bg-bar-750 text-slate-300 text-xs sm:text-sm font-medium transition"
          >
            ยกเลิก
          </button>
          
          <button
            disabled={parsedData.length === 0 || isProcessing}
            onClick={handleConfirmImport}
            className={`px-5 py-2 rounded-lg font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
              parsedData.length > 0 && !isProcessing
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black shadow-neon-emerald active:scale-95'
                : 'bg-bar-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{isProcessing ? 'กำลังนำเข้าข้อมูล...' : `ยืนยันนำเข้า ${parsedData.length} รายการ`}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
