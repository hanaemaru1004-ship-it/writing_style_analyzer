"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const RESET_DELAY_MS = 2000;

export function useClipboard() {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), RESET_DELAY_MS);
      return true;
    } catch {
      return false;
    }
  }, []);

  return { copied, copy };
}
