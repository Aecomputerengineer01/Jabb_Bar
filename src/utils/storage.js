import { createInitialStockData } from '../data/initialDrinks';

const STORAGE_KEY_ITEMS = 'jabb_bar_stock_items_v2';
const STORAGE_KEY_HISTORY = 'jabb_bar_shift_history_v2';
const STORAGE_KEY_DATE = 'jabb_bar_current_shift_date_v2';
const STORAGE_KEY_SETTINGS = 'jabb_bar_settings_v2';

export const loadStoredItems = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ITEMS);
    if (!raw) return createInitialStockData();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return createInitialStockData();
  } catch (err) {
    console.error('Error loading stored items:', err);
    return createInitialStockData();
  }
};

export const saveStoredItems = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
    return true;
  } catch (err) {
    console.error('Error saving items:', err);
    return false;
  }
};

export const loadShiftHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error loading history:', err);
    return [];
  }
};

export const saveShiftHistory = (history) => {
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    return true;
  } catch (err) {
    console.error('Error saving history:', err);
    return false;
  }
};

export const loadCurrentShiftDate = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DATE);
    if (raw) return raw;
    const now = new Date();
    return now.toISOString().split('T')[0];
  } catch (err) {
    return new Date().toISOString().split('T')[0];
  }
};

export const saveCurrentShiftDate = (dateStr) => {
  try {
    localStorage.setItem(STORAGE_KEY_DATE, dateStr);
  } catch (err) {
    console.error('Error saving shift date:', err);
  }
};

export const formatThaiDate = (dateStr) => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    });
  } catch {
    return dateStr;
  }
};

export const formatThaiTime = (date = new Date()) => {
  return date.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};
