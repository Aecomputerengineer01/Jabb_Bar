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
} from './utils/storage';
import { calculateSummary, calculateRow, parseNum } from './utils/stockCalculations';
import { createInitialStockData } from './data/initialDrinks';
import { apiClient } from './api/client';

import { Header } from './components/Header';
import { StatCards } from './components/StatCards';
import { FilterBar } from './components/FilterBar';
import { StockTable } from './components/StockTable';
import { MobileCardView } from './components/MobileCardView';
import { CloseShiftModal } from './components/CloseShiftModal';
import { HistoryModal } from './components/HistoryModal';
import { ExportShareModal } from './components/ExportShareModal';
import { AddItemModal } from './components/AddItemModal';
import { ImportExcelModal } from './components/ImportExcelModal';

import { AlertCircle, CheckCircle2, Sparkles, RefreshCw, Dices, Database, Calendar, Eye, ArrowLeft } from 'lucide-react';

export function App() {
  // Main State
  const [items, setItems] = useState(() => loadStoredItems());
  const [shiftDate, setShiftDate] = useState(() => loadCurrentShiftDate());
  const [activeShiftDate, setActiveShiftDate] = useState(() => loadCurrentShiftDate());
  const [shiftHistory, setShiftHistory] = useState(() => loadShiftHistory());
  const [lastSavedTime, setLastSavedTime] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Historical Shift Viewing Mode
  const [isHistoryMode, setIsHistoryMode] = useState(false);
  const [activeShiftItems, setActiveShiftItems] = useState(null);
  const [historicalShiftRecord, setHistoricalShiftRecord] = useState(null);

  // Filters & View Mode
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'sold' | 'warning' | 'unclosed'
  const [viewMode, setViewMode] = useState(() => {
    return typeof window !== 'undefined' && window.innerWidth < 768 ? 'cards' : 'table';
  });

  // Modals
  const [isCloseShiftOpen, setIsCloseShiftOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);

  // Show toast notification
  const showToast = useCallback((msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Try to connect to Express backend + Postgres on initial mount
  useEffect(() => {
    async function initFromBackend() {
      const response = await apiClient.getDrinks();
      if (response && response.success && Array.isArray(response.data) && response.data.length > 0) {
        setIsBackendConnected(true);
        const mapped = response.data.map(d => ({
          id: d.id,
          no: d.no,
          name: d.name,
          category: d.category,
          broughtForward: d.broughtForward !== undefined ? d.broughtForward.toString() : '',
          added: d.added !== undefined ? d.added.toString() : '',
          cFront: d.cFront !== undefined ? d.cFront.toString() : '',
          cBack: d.cBack !== undefined ? d.cBack.toString() : '',
          dFront: d.dFront !== undefined ? d.dFront.toString() : '',
          dBack: d.dBack !== undefined ? d.dBack.toString() : '',
          remark: d.remark || '',
        }));
        setItems(mapped);
        showToast('🟢 เชื่อมต่อ Backend (Express + Postgres) สำเร็จ!');
      }
    }
    initFromBackend();
  }, [showToast]);

  // Real-time Collaborative Sync: Polling from Backend every 2.5 seconds (Multi-user sync)
  useEffect(() => {
    if (isHistoryMode) return; // Don't overwrite when user is inspecting past shift

    const intervalId = setInterval(async () => {
      const activeEl = document.activeElement;
      const isTyping = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');

      try {
        const response = await apiClient.getDrinks();
        if (response && response.success && Array.isArray(response.data) && response.data.length > 0) {
          setIsBackendConnected(true);

          setItems((prevItems) => {
            let hasChanges = false;
            const updated = prevItems.map((curr) => {
              const backendDrink = response.data.find((d) => d.id === curr.id || d.name === curr.name);
              if (!backendDrink) return curr;

              // If user is currently typing in this item's input, keep user input intact
              if (isTyping && (activeEl.dataset?.itemId === curr.id || activeEl.name === curr.id)) {
                return curr;
              }

              const newBF = backendDrink.broughtForward !== undefined ? backendDrink.broughtForward.toString() : curr.broughtForward;
              const newAdded = backendDrink.added !== undefined ? backendDrink.added.toString() : curr.added;
              const newCF = backendDrink.cFront !== undefined ? backendDrink.cFront.toString() : curr.cFront;
              const newCB = backendDrink.cBack !== undefined ? backendDrink.cBack.toString() : curr.cBack;
              const newDF = backendDrink.dFront !== undefined ? backendDrink.dFront.toString() : curr.dFront;
              const newDB = backendDrink.dBack !== undefined ? backendDrink.dBack.toString() : curr.dBack;
              const newRemark = backendDrink.remark !== null && backendDrink.remark !== undefined ? backendDrink.remark : (curr.remark || '');

              if (
                curr.broughtForward !== newBF ||
                curr.added !== newAdded ||
                curr.cFront !== newCF ||
                curr.cBack !== newCB ||
                curr.dFront !== newDF ||
                curr.dBack !== newDB ||
                curr.remark !== newRemark
              ) {
                hasChanges = true;
                return {
                  ...curr,
                  broughtForward: newBF,
                  added: newAdded,
                  cFront: newCF,
                  cBack: newCB,
                  dFront: newDF,
                  dBack: newDB,
                  remark: newRemark,
                };
              }
              return curr;
            });

            return hasChanges ? updated : prevItems;
          });
        }
      } catch (err) {
        // Backend offline or temporary network issue
      }
    }, 2500);

    return () => clearInterval(intervalId);
  }, [isHistoryMode]);

  // Auto-save to Local Storage whenever items change (Only for active shift, not historical view)
  useEffect(() => {
    if (!isHistoryMode) {
      saveStoredItems(items);
      setLastSavedTime(formatThaiTime());
    }
  }, [items, isHistoryMode]);

  // Save shift date changes
  useEffect(() => {
    if (!isHistoryMode) {
      saveCurrentShiftDate(shiftDate);
      setActiveShiftDate(shiftDate);
    }
  }, [shiftDate, isHistoryMode]);

  // Save history changes
  useEffect(() => {
    saveShiftHistory(shiftHistory);
  }, [shiftHistory]);

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

    // Sync to Express backend if connected and in active shift mode
    if (!isHistoryMode) {
      apiClient.updateDrink(id, field, value);
    }
  }, [isHistoryMode]);

  // Delete an item
  const handleDeleteItem = useCallback(async (id, name) => {
    if (window.confirm(`ต้องการลบรายการ "${name}" ออกจากระบบสต็อกหรือไม่?`)) {
      setItems((prev) => {
        const filtered = prev.filter((i) => i.id !== id);
        return filtered.map((item, idx) => ({ ...item, no: idx + 1 }));
      });
      if (!isHistoryMode) {
        await apiClient.deleteDrink(id);
      }
      showToast(`ลบ "${name}" เรียบร้อยแล้ว`, 'info');
    }
  }, [isHistoryMode, showToast]);

  // Add new item
  const handleAddItem = useCallback(async (newItemData) => {
    const nextNo = items.length + 1;
    const newItem = {
      id: `item-${Date.now()}`,
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
    setItems((prev) => [...prev, newItem]);

    // Send to backend
    if (!isHistoryMode) {
      const res = await apiClient.createDrink(newItemData);
      if (res && res.data) {
        setItems((prev) => prev.map(item => item.id === newItem.id ? { ...item, id: res.data.id } : item));
      }
    }
    showToast(`เพิ่มเครื่องดื่ม "${newItemData.name}" เรียบร้อยแล้ว`);
  }, [items.length, isHistoryMode, showToast]);

  // Reset to initial default items
  const handleResetData = useCallback(() => {
    const initial = createInitialStockData();
    setItems(initial);
    showToast('รีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้นแล้ว', 'info');
  }, [showToast]);

  // Seed / Sync Mockup Data from Postgres Prisma
  const handleSyncPrismaMockup = useCallback(async () => {
    const seedRes = await apiClient.seedDatabase();
    if (seedRes && seedRes.success) {
      const drinksRes = await apiClient.getDrinks();
      if (drinksRes && drinksRes.data) {
        const mapped = drinksRes.data.map(d => ({
          id: d.id,
          no: d.no,
          name: d.name,
          category: d.category,
          broughtForward: d.broughtForward !== undefined ? d.broughtForward.toString() : '',
          added: d.added !== undefined ? d.added.toString() : '',
          cFront: d.cFront !== undefined ? d.cFront.toString() : '',
          cBack: d.cBack !== undefined ? d.cBack.toString() : '',
          dFront: d.dFront !== undefined ? d.dFront.toString() : '',
          dBack: d.dBack !== undefined ? d.dBack.toString() : '',
          remark: d.remark || '',
        }));
        setItems(mapped);
        setIsBackendConnected(true);
        showToast('⚡ ซิงค์ Mockup Data จาก PostgreSQL (41 รายการ) สำเร็จ!');
        return;
      }
    }

    // Fallback to local demo numbers
    handleLoadDemoData();
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
  // Logic: บันทึกข้อมูลรวมเปิด (C) หน้าร้าน+หลังร้าน และคงเหลือปิด (D) หน้าร้าน+หลังร้าน ไว้ตลอด
  // แล้วนำตัวเลขจากช่อง (D) คงเหลือร้านปิด ไปใส่แทนที่ในช่อง (A) ยอดยกมา ของวันใหม่
  const handleConfirmCloseShift = useCallback(async ({ saveToHistory = true } = {}) => {
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
          broughtForward: r.broughtForward || '0',
          added: r.added || '0',
          cFront: r.cFront || '0',
          cBack: r.cBack || '0',
          cTotal: r.cTotal,
          dFront: r.dFront || '0',
          dBack: r.dBack || '0',
          dTotal: r.dTotal,
          sold: r.sold,
          remark: r.remark || '',
        })),
      };

      setShiftHistory((prev) => [historySnapshot, ...prev]);
    }

    // Call Postgres Express backend transaction
    await apiClient.closeShift({ shiftDate });

    // Client transform: (A) = (D), clear (B), (C), (D)
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

    // Increment shift date
    try {
      const currentDate = new Date(shiftDate);
      currentDate.setDate(currentDate.getDate() + 1);
      const nextDateStr = currentDate.toISOString().split('T')[0];
      setShiftDate(nextDateStr);
      setActiveShiftDate(nextDateStr);
    } catch {
      // ignore
    }

    showToast('🎉 ปิดยอดประจำวันสำเร็จ! บันทึกประวัติและยกยอดคงเหลือ (D) ไปเป็นยอดยกมา (A) เรียบร้อยแล้ว');
  }, [shiftDate, summary, showToast]);

  // Historical Shift Viewing Handlers:
  // 1. Open a past closed shift in the main table
  const handleViewHistoricalShift = useCallback((record) => {
    if (!record || !record.items) return;
    if (!isHistoryMode) {
      setActiveShiftItems(items);
    }
    setIsHistoryMode(true);
    setHistoricalShiftRecord(record);
    setShiftDate(record.date);

    const mapped = record.items.map((r, idx) => ({
      id: r.id || `hist-${idx}`,
      no: r.no || idx + 1,
      name: r.name,
      category: r.category || 'whisky',
      broughtForward: r.broughtForward !== undefined ? r.broughtForward.toString() : '0',
      added: r.added !== undefined ? r.added.toString() : '0',
      cFront: r.cFront !== undefined ? r.cFront.toString() : '0',
      cBack: r.cBack !== undefined ? r.cBack.toString() : '0',
      dFront: r.dFront !== undefined ? r.dFront.toString() : '0',
      dBack: r.dBack !== undefined ? r.dBack.toString() : '0',
      remark: r.remark || '',
    }));
    setItems(mapped);
    showToast(`📅 กำลังแสดงข้อมูลย้อนหลังรอบวันที่ ${formatThaiDate(record.date)}`, 'info');
  }, [isHistoryMode, items, showToast]);

  // 2. Exit historical view mode and return to active shift
  const handleExitHistoryMode = useCallback(() => {
    if (activeShiftItems) {
      setItems(activeShiftItems);
    } else {
      setItems(loadStoredItems());
    }
    setIsHistoryMode(false);
    setHistoricalShiftRecord(null);
    setShiftDate(activeShiftDate);
    showToast(`🔄 กลับสู่กะปัจจุบัน (${activeShiftDate}) เรียบร้อยแล้ว`);
  }, [activeShiftItems, activeShiftDate, showToast]);

  // 3. Restore past shift as active shift
  const handleRestoreShift = useCallback((record) => {
    if (!record || !record.items) return;
    const restored = record.items.map((r, idx) => ({
      id: r.id || `restored-${idx}`,
      no: r.no || idx + 1,
      name: r.name,
      category: r.category || 'whisky',
      broughtForward: r.broughtForward !== undefined ? r.broughtForward.toString() : '0',
      added: r.added !== undefined ? r.added.toString() : '0',
      cFront: r.cFront !== undefined ? r.cFront.toString() : '0',
      cBack: r.cBack !== undefined ? r.cBack.toString() : '0',
      dFront: r.dFront !== undefined ? r.dFront.toString() : '0',
      dBack: r.dBack !== undefined ? r.dBack.toString() : '0',
      remark: r.remark || '',
    }));
    setItems(restored);
    setShiftDate(record.date);
    setActiveShiftDate(record.date);
    setIsHistoryMode(false);
    setHistoricalShiftRecord(null);
    showToast(`กู้คืนข้อมูลรอบวันที่ ${record.date} มาเป็นกะปัจจุบันแล้ว`);
  }, [showToast]);

  // Clear all history
  const handleClearHistory = useCallback(() => {
    setShiftHistory([]);
    showToast('ล้างประวัติการปิดยอดทั้งหมดแล้ว', 'info');
  }, [showToast]);

  // Excel (CSV) Batch Import Handler
  const handleImportComplete = useCallback(async (importedItems) => {
    if (!importedItems || importedItems.length === 0) return;

    // Merge or replace items based on drink name
    setItems((prevItems) => {
      const merged = [...prevItems];
      importedItems.forEach((imp) => {
        const existingIdx = merged.findIndex(
          (m) => m.name.trim().toLowerCase() === imp.name.trim().toLowerCase()
        );
        if (existingIdx !== -1) {
          merged[existingIdx] = {
            ...merged[existingIdx],
            broughtForward: imp.broughtForward?.toString() ?? merged[existingIdx].broughtForward,
            added: imp.added?.toString() ?? merged[existingIdx].added,
            cFront: imp.cFront?.toString() ?? merged[existingIdx].cFront,
            cBack: imp.cBack?.toString() ?? merged[existingIdx].cBack,
            dFront: imp.dFront?.toString() ?? merged[existingIdx].dFront,
            dBack: imp.dBack?.toString() ?? merged[existingIdx].dBack,
            remark: imp.remark !== undefined ? imp.remark : merged[existingIdx].remark,
          };
        } else {
          merged.push({
            id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            no: merged.length + 1,
            name: imp.name,
            category: imp.category || 'other',
            broughtForward: imp.broughtForward?.toString() || '0',
            added: imp.added?.toString() || '0',
            cFront: imp.cFront?.toString() || '0',
            cBack: imp.cBack?.toString() || '0',
            dFront: imp.dFront?.toString() || '0',
            dBack: imp.dBack?.toString() || '0',
            remark: imp.remark || '',
          });
        }
      });
      return merged;
    });

    // Send batch import to PostgreSQL backend
    setIsSyncing(true);
    const res = await apiClient.batchImportDrinks(importedItems);
    setIsSyncing(false);

    if (res && res.success) {
      showToast(`✅ นำเข้าข้อมูล ${importedItems.length} รายการจากไฟล์ Excel และบันทึกลงฐานข้อมูลสำเร็จ!`);
    } else {
      showToast(`✅ อัปเดตข้อมูล ${importedItems.length} รายการจากไฟล์ Excel เรียบร้อยแล้ว`);
    }
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

      {/* 1. Header with Excel import & Live Sync */}
      <Header
        shiftDate={shiftDate}
        onDateChange={setShiftDate}
        lastSavedTime={lastSavedTime}
        onOpenCloseShift={() => setIsCloseShiftOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenImport={() => setIsImportOpen(true)}
        onOpenAddItem={() => setIsAddItemOpen(true)}
        onResetData={handleResetData}
        viewMode={viewMode}
        setViewMode={setViewMode}
        warningCount={summary.warningCount}
        totalSold={summary.totalSold}
        isHistoryMode={isHistoryMode}
        activeShiftDate={activeShiftDate}
        onExitHistoryMode={handleExitHistoryMode}
        isSyncing={isSyncing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4">
        
        {/* Quick Demo Data / Bar Helper Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 bg-bar-900/60 border border-bar-border/80 px-3.5 py-2 rounded-xl text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="text-slate-300 font-medium">
              {isBackendConnected ? 'PostgreSQL + Express Connected' : 'React + Vite Dark Mode'}
            </span>
            <span className="hidden sm:inline text-slate-500">• บันทึกข้อมูลและซิงค์เรียลไทม์</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSyncPrismaMockup}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 transition text-xs font-medium"
              title="ซิงค์ Mockup Data จาก PostgreSQL ผ่าน Prisma ORM"
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>ซิงค์ Mockup จาก Postgres (41 รายการ)</span>
            </button>
            <button
              onClick={handleLoadDemoData}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition text-xs font-medium"
              title="ใส่ตัวเลขตัวอย่างเพื่อทดสอบสูตรคำนวณและการแจ้งเตือน"
            >
              <Dices className="w-3.5 h-3.5 text-amber-400" />
              <span>ตัวเลขตัวอย่าง</span>
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
            ร้านจ๊าบบาร์ (JABB BAR) — React + Vite + Tailwind (Docker: Postgres + Express)
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
        onViewHistoricalShift={handleViewHistoricalShift}
        onClearHistory={handleClearHistory}
      />

      <ExportShareModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        items={items}
        summary={summary}
        shiftDate={shiftDate}
      />

      <ImportExcelModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportComplete={handleImportComplete}
      />

      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        onAddItem={handleAddItem}
      />

    </div>
  );
}

export default App;

