import { useState, useRef, useCallback, useEffect } from 'react';

interface UseSecretAdminTriggerOptions {
  requiredHoldSeconds?: number;
  onTrigger: () => void;
}

interface SecretTriggerHandlers {
  onClick: (e: React.MouseEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

export const useSecretAdminTrigger = ({
  requiredHoldSeconds = 10,
  onTrigger,
}: UseSecretAdminTriggerOptions): {
  handlers: SecretTriggerHandlers;
  isHolding: boolean;
  progress: number;
} => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);

  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef<number | null>(null);
  const isArmedRef = useRef(false);
  const holdIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const resetHold = useCallback(() => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    setIsHolding(false);
    setProgress(0);
  }, []);

  const handleClick = useCallback(() => {
    clickCountRef.current += 1;

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    if (clickCountRef.current === 2) {
      // Double-clic détecté : le système s'arme pendant 3 secondes pour l'appui long
      isArmedRef.current = true;
      clickCountRef.current = 0;

      clickTimeoutRef.current = window.setTimeout(() => {
        isArmedRef.current = false;
      }, 3000);
    } else {
      clickTimeoutRef.current = window.setTimeout(() => {
        clickCountRef.current = 0;
        isArmedRef.current = false;
      }, 400);
    }
  }, []);

  const startHold = useCallback(() => {
    if (!isArmedRef.current) return;

    resetHold();
    setIsHolding(true);
    startTimeRef.current = Date.now();

    const totalMs = requiredHoldSeconds * 1000;

    holdIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(100, Math.round((elapsed / totalMs) * 100));
      setProgress(pct);

      if (elapsed >= totalMs) {
        resetHold();
        isArmedRef.current = false;
        onTrigger();
      }
    }, 100);
  }, [requiredHoldSeconds, onTrigger, resetHold]);

  useEffect(() => {
    return () => {
      resetHold();
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, [resetHold]);

  const handlers: SecretTriggerHandlers = {
    onClick: handleClick,
    onMouseDown: startHold,
    onMouseUp: resetHold,
    onMouseLeave: resetHold,
    onTouchStart: startHold,
    onTouchEnd: resetHold,
  };

  return {
    handlers,
    isHolding,
    progress,
  };
};
