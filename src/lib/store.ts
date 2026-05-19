// LocalStorage-backed prediction history (acts as the SQLite DB in-browser).
import type { PredictionResult } from "./predict";

const KEY = "machineguard.history.v1";

export function getHistory(): PredictionResult[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function saveHistory(results: PredictionResult[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(results));
}

export function addPrediction(r: PredictionResult | PredictionResult[]) {
  const list = getHistory();
  const next = Array.isArray(r) ? [...r, ...list] : [r, ...list];
  saveHistory(next.slice(0, 500));
}

export function clearHistory() { saveHistory([]); }
