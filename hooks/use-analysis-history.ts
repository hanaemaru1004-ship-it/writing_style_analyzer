"use client";

import { useCallback, useSyncExternalStore } from "react";

import { addToHistory, loadHistory, removeFromHistory } from "@/lib/storage";
import type { AnalysisResult } from "@/lib/types";

type Listener = () => void;

const EMPTY_HISTORY: AnalysisResult[] = [];

const listeners = new Set<Listener>();
let cachedHistory: AnalysisResult[] = loadHistory();

function emitChange() {
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return cachedHistory;
}

function getServerSnapshot(): AnalysisResult[] {
  return EMPTY_HISTORY;
}

export function useAnalysisHistory() {
  const history = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addItem = useCallback((result: AnalysisResult) => {
    cachedHistory = addToHistory(cachedHistory, result);
    emitChange();
  }, []);

  const removeItem = useCallback((id: string) => {
    cachedHistory = removeFromHistory(cachedHistory, id);
    emitChange();
  }, []);

  return { history, addItem, removeItem };
}
