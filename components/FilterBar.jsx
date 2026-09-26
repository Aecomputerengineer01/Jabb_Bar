import React from 'react';
import { Search, X, Filter, AlertTriangle, Flame, HelpCircle } from 'lucide-react';
import { DRINK_CATEGORIES } from '../data/initialDrinks';

export const FilterBar = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  statusFilter,
  setStatusFilter,
  warningCount,
  soldItemsCount,
  totalItemsCount,
  filteredCount
}) => {
  return (
    <div className="bg-bar-900 border border-bar-border rounded-xl p-3 sm:p-4 mb-4 space-y-3">
      
      {/* Search Input & Status Quick Filter */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อเครื่องดื่ม... (เช่น แบล็ค, รีเจนซี่, ลีโอ)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bar-850 border border-bar-border text-slate-100 placeholder-slate-500 text-sm rounded-lg pl-9 pr-9 py-2 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
              statusFilter === 'all'
                ? 'bg-slate-200 text-black shadow-sm'
                : 'bg-bar-850 text-slate-300 hover:bg-bar-800 border border-bar-border'
            }`}
          >
            ทั้งหมด ({totalItemsCount})
          </button>

          <button
            onClick={() => setStatusFilter('sold')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
              statusFilter === 'sold'
                ? 'bg-emerald-500 text-black font-semibold shadow-neon-emerald'
                : 'bg-bar-850 text-emerald-400 hover:bg-bar-800 border border-emerald-500/30'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            มียอดขาย ({soldItemsCount})
          </button>

          <button
            onClick={() => setStatusFilter('warning')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
              statusFilter === 'warning'
                ? 'bg-rose-500 text-white font-semibold shadow-neon-rose'
                : 'bg-bar-850 text-rose-400 hover:bg-bar-800 border border-rose-500/30'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            ยอดไม่ตรงเตือน ({warningCount})
          </button>

          <button
            onClick={() => setStatusFilter('unclosed')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
              statusFilter === 'unclosed'
                ? 'bg-amber-500 text-black font-semibold shadow-neon-amber'
                : 'bg-bar-850 text-amber-400 hover:bg-bar-800 border border-amber-500/30'
            }`}
          >
            ยังไม่ได้นับปิด
          </button>
        </div>

      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-t border-bar-border/60 pt-2.5 scrollbar-thin">
        {Object.values(DRINK_CATEGORIES).map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md whitespace-nowrap transition ${
                isActive
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-bar-850'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}

        {/* Showing count indicator */}
        <div className="ml-auto text-[11px] text-slate-500 whitespace-nowrap pl-2 hidden sm:block">
          แสดง {filteredCount} จาก {totalItemsCount} รายการ
        </div>
      </div>

    </div>
  );
};
