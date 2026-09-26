'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  loadStoredItems, 
  saveStoredItems, 
  loadShiftHistory, 
  saveShiftHistory, 
  loadCurrentShiftDate, 
  saveCurrentShiftDate,
  formatThaiTime,
  formatThaiDate 
} from '../utils/storage';
import { calculateSummary, calculateRow, parseNum } from '../utils/stockCalculations';
import { createInitialStockData } from '../data/initialDrinks';

import { Header } from '../components/Header';
import { StatCards } from '../components/StatCards';
import { FilterBar } from '../components/FilterBar';
import { StockTable } from '../components/StockTable';
import { MobileCardView } from '../components/MobileCardView';
import { CloseShiftModal } from '../components/CloseShiftModal';
import { HistoryModal } from '../components/HistoryModal';
import { ExportShareModal } from '../components/ExportShareModal';
import { AddItemModal } from '../components/AddItemModal';

import { CheckCircle2, Dices } from 'lucide-react';

export default function HomePage() {
  // Main State
  const [items, setItems] = useState(() => createInitialStockData());
  const [shiftDate, setShiftDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [shiftHistory, setShiftHistory] = useState([]);
  const [lastSavedTime, setLastSavedTime] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [isClientLoaded, setIsClientLoaded] = useState(false);

  // Filters & View Mode
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'sold' | 'warning' | 'unclosed'
  const [viewMode, setViewMode] = useState('table');

  // Modals
  const [isCloseShiftOpen, setIsCloseShiftOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);

  // Hydrate from localStorage once on client
  useEffect(() => {
    const storedItems = loadStoredItems();
    const storedDate = loadCurrentShiftDate();
    const storedHistory = loadShiftHistory();
    setItems(storedItems);
    setShiftDate(storedDate);
    setShiftHistory(storedHistory);
    setLastSavedTime(formatThaiTime());
    if (window.innerWidth < 768) {
      setViewMode('cards');
    }
    setIsClientLoaded(true);
  }, []);

  // Show toast notification
  const showToast = useCallback((msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Auto-save to Local Storage whenever items change (only after client has hydrated)
  useEffect(() => {
    if (!isClientLoaded) return;
    saveStoredItems(items);
    setLastSavedTime(formatThaiTime());
  }, [items, isClientLoaded]);

  // Save shift date changes
  useEffect(() => {
    if (!isClientLoaded) return;
    saveCurrentShiftDate(shiftDate);
  }, [shiftDate, isClientLoaded]);

  // Save history changes
  useEffect(() => {
    if (!isClientLoaded) return;
    saveShiftHistory(shiftHistory);
  }, [shiftHistory, isClientLoaded]);

  // Real-time calculations across all items
  const summary = useMemo(() => {
    return calculateSummary(items);
  }, [items]);

  // Update a single field in a row (e.g. broughtForward, added, cFront, cBack, dFront, dBack, remark)
  const handleUpdateField = useCallback((id, field, value) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            [field]: value,
          };
        }
        return item;
      })
    );
  }, []);

  // Delete an item
  const handleDeleteItem = useCallback((id, name) => {
    if (window.confirm(`ต้องการลบรายการ "${name}" ออกจากระบบสต็อกหรือไม่?`)) {
      setItems((prev) => {
        const filtered = prev.filter((i) => i.id !== id);
        return filtered.map((item, idx) => ({ ...item, no: idx + 1 }));
      });
      showToast(`ลบ "${name}" เรียบร้อยแล้ว`, 'info');
    }
  }, [showToast]);

  // Add new item
  const handleAddItem = useCallback((newItemData) => {
    setItems((prev) => {
      const nextNo = prev.length + 1;
      const newItem = {
        id: `custom-item-${Date.now()}`,
        no: nextNo,
        name: newItemData.name,
        category: newItemData.category,
        broughtForward: newItemData.broughtForward || '',
        added: '',
        cFront: '',
        cBack: '',
        dFront: '',
        dBack: '',
        remark: '',
      };
      return [...prev, newItem];
    });
    showToast(`เพิ่มเครื่องดื่ม "${newItemData.name}" เรียบร้อยแล้ว`);
  }, [showToast]);

  // Reset to initial default items
  const handleResetData = useCallback(() => {
    const initial = createInitialStockData();
    setItems(initial);
    showToast('รีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้นแล้ว', 'info');
  }, [showToast]);

  // Load realistic Demo Data for quick testing & demonstration
  const handleLoadDemoData = useCallback(() => {
    setItems((prev) => {
      return prev.map((item, index) => {
        if (index === 0) { // แบล็ค
          return { ...item, broughtForward: '5', added: '2', cFront: '4', cBack: '3', dFront: '2', dBack: '2', remark: 'เปิดขวด VIP' };
        }
        if (index === 1) { // เรด
          return { ...item, broughtForward: '8', added: '0', cFront: '5', cBack: '3', dFront: '3', dBack: '3', remark: '' };
        }
        if (index === 2) { // รีเจนซี่ แบน
          return { ...item, broughtForward: '12', added: '12', cFront: '14', cBack: '10', dFront: '6', dBack: '8', remark: 'ขายดีมาก' };
        }
        if (index === 3) { // รีเจนซี่ กลม
          // Purposeful mismatch to demo the warning validation! (A+B = 10, C = 11 -> warn!)
          return { ...item, broughtForward: '6', added: '4', cFront: '6', cBack: '5', dFront: '4', dBack: '3', remark: '⚠️ ยอดนับเปิดร้านเกิน 1 ขวด' };
        }
        if (index === 15) { // สิงห์
          return { ...item, broughtForward: '24', added: '24', cFront: '24', cBack: '24', dFront: '10', dBack: '12', remark: 'สั่งเพิ่ม 1 ลัง' };
        }
        if (index === 17) { // ลีโอ
          return { ...item, broughtForward: '36', added: '48', cFront: '36', cBack: '48', dFront: '18', dBack: '20', remark: 'ขายดี' };
        }
        if (index === 19) { // โค้ก
          return { ...item, broughtForward: '30', added: '24', cFront: '20', cBack: '34', dFront: '8', dBack: '15', remark: '' };
        }
        if (index === 21) { // โซดา
          return { ...item, broughtForward: '48', added: '48', cFront: '40', cBack: '56', dFront: '12', dBack: '22', remark: '' };
        }
        if (index === 25) { // โซจูพีช
          return { ...item, broughtForward: '10', added: '5', cFront: '7', cBack: '8', dFront: '3', dBack: '4', remark: '' };
        }
        return {
          ...item,
          broughtForward: item.broughtForward || '4',
          added: '',
          cFront: '',
          cBack: '',
          dFront: '',
          dBack: '',
        };
      });
    });
    showToast('โหลดข้อมูลจำลองเพื่อการทดสอบเรียบร้อยแล้ว!');
  }, [showToast]);

  // CORE FEATURE 3: Next Day Shift (ปุ่มปิดยอดประจำวัน)
  // Logic: นำตัวเลขจากช่อง (D) คงเหลือร้านปิด ไปใส่แทนที่ในช่อง (A) ยอดยกมา
  // ส่วนช่องอื่นๆ ให้ล้างค่า (Clear) เป็นค่าว่าง เพื่อเริ่มนับสต็อกของวันใหม่
  const handleConfirmCloseShift = useCallback(({ saveToHistory = true } = {}) => {
    if (saveToHistory) {
      const historySnapshot = {
        id: `shift-${Date.now()}`,
        date: shiftDate,
        time: formatThaiTime(),
        totalSold: summary.totalSold,
        totalOpenStock: summary.totalOpenStock,
        totalCloseStock: summary.totalCloseStock,
        warningCount: summary.warningCount,
        items: summary.calculatedRows.map((r) => ({
          id: r.id,
          name: r.name,
          category: r.category,
          broughtForward: r.broughtForward,
          added: r.added,
          cTotal: r.cTotal,
          dTotal: r.dTotal,
          sold: r.sold,
          remark: r.remark,
        })),
      };

      setShiftHistory((prev) => [historySnapshot, ...prev]);
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        const rowCalc = calculateRow(item);
        const newBroughtForward = rowCalc.hasCloseInput
          ? rowCalc.dTotal.toString()
          : item.broughtForward;

        return {
          ...item,
          broughtForward: newBroughtForward,
          added: '',
          cFront: '',
          cBack: '',
          dFront: '',
          dBack: '',
          remark: '',
        };
      })
    );

    try {
      const currentDate = new Date(shiftDate);
      currentDate.setDate(currentDate.getDate() + 1);
      const nextDateStr = currentDate.toISOString().split('T')[0];
      setShiftDate(nextDateStr);
    } catch {
      // ignore
    }

    showToast('🎉 ปิดยอดประจำวันสำเร็จ! ยกยอดคงเหลือ (D) ไปเป็นยอดยกมา (A) เรียบร้อยแล้ว');
  }, [shiftDate, summary, showToast]);

  // Restore past shift from history
  const handleRestoreShift = useCallback((record) => {
    if (!record || !record.items) return;
    setItems(record.items);
    setShiftDate(record.date);
    showToast(`กู้คืนข้อมูลรอบวันที่ ${record.date} สำเร็จ`);
  }, [showToast]);

  // Clear all history
  const handleClearHistory = useCallback(() => {
    setShiftHistory([]);
    showToast('ล้างประวัติการปิดยอดทั้งหมดแล้ว', 'info');
  }, [showToast]);

  // Filter items based on search term, category, and status filters
  const filteredCalculatedItems = useMemo(() => {
    return summary.calculatedRows.filter((item) => {
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesRemark = (item.remark || '').toLowerCase().includes(query);
        if (!matchesName && !matchesRemark) return false;
      }

      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      if (statusFilter === 'sold' && item.sold <= 0) {
        return false;
      }
      if (statusFilter === 'warning' && !item.hasWarning) {
        return false;
      }
      if (statusFilter === 'unclosed' && item.hasCloseInput) {
        return false;
      }

      return true;
    });
  }, [summary.calculatedRows, searchTerm, selectedCategory, statusFilter]);

  return (
    <div className="min-h-screen bg-bar-950 text-slate-100 flex flex-col font-sans">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-bounce">
          <div className={`px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold border ${
            toastMessage.type === 'info'
              ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200'
              : 'bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-neon-emerald'
          }`}>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* 1. Header */}
      <Header
        shiftDate={shiftDate}
        onDateChange={setShiftDate}
        lastSavedTime={lastSavedTime}
        onOpenCloseShift={() => setIsCloseShiftOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenAddItem={() => setIsAddItemOpen(true)}
        onResetData={handleResetData}
        viewMode={viewMode}
        setViewMode={setViewMode}
        warningCount={summary.warningCount}
        totalSold={summary.totalSold}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4">
        
        {/* Quick Demo Data / Bar Helper Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 bg-bar-900/60 border border-bar-border/80 px-3.5 py-2 rounded-xl text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium">Next.js App Router — โหมดค่ำคืน (Dark Bar Mode)</span>
            <span className="hidden sm:inline text-slate-500">• พร้อมรองรับการสัมผัสบนมือถือและแท็บเล็ต</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadDemoData}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition text-xs font-medium"
              title="ใส่ตัวเลขตัวอย่างเพื่อทดสอบสูตรคำนวณและการแจ้งเตือน"
            >
              <Dices className="w-3.5 h-3.5 text-amber-400" />
              <span>โหลดตัวเลขตัวอย่าง (Demo Data)</span>
            </button>
          </div>
        </div>

        {/* 2. Stat Summary Cards */}
        <StatCards
          summary={summary}
          onFilterWarnings={() => setStatusFilter('warning')}
          onFilterSold={() => setStatusFilter('sold')}
        />

        {/* 3. Filter & Search Bar */}
        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          warningCount={summary.warningCount}
          soldItemsCount={summary.soldItemsCount}
          totalItemsCount={items.length}
          filteredCount={filteredCalculatedItems.length}
        />

        {/* 4. Main Data View (Table or Mobile Cards) */}
        {viewMode === 'table' ? (
          <StockTable
            items={filteredCalculatedItems}
            onUpdateField={handleUpdateField}
            onDeleteItem={handleDeleteItem}
            summary={summary}
          />
        ) : (
          <MobileCardView
            items={filteredCalculatedItems}
            onUpdateField={handleUpdateField}
            onDeleteItem={handleDeleteItem}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-bar-border/80 bg-bar-900/40 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            ร้านจ๊าบบาร์ (JABB BAR) — ระบบนับสต็อกสินค้าเครื่องดื่ม Next.js Dark Mode
          </div>
          <div className="text-[11px] text-slate-600 flex items-center gap-2">
            <span>สมการ: (C) = หน้า + หลัง | (D) = หน้า + หลัง | (E) = (C) - (D)</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <CloseShiftModal
        isOpen={isCloseShiftOpen}
        onClose={() => setIsCloseShiftOpen(false)}
        onConfirmCloseShift={handleConfirmCloseShift}
        shiftDate={shiftDate}
        summary={summary}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={shiftHistory}
        onRestoreShift={handleRestoreShift}
        onClearHistory={handleClearHistory}
      />

      <ExportShareModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        items={items}
        summary={summary}
        shiftDate={shiftDate}
      />

      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        onAddItem={handleAddItem}
      />

    </div>
  );
}
