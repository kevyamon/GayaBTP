import { useState, useRef, useCallback, useEffect } from 'react';

interface UseSecretAdminTriggerOptions {
  requiredHoldSeconds?: number;
  onTrigger: () => void;
}

export interface SecretTriggerHandlers {
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onPointerLeave: (e: React.PointerEvent) => void;
  onPointerCancel: (e: React.PointerEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onTouchCancel: (e: React.TouchEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onMouseLeave: (e: React.MouseEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
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

  const lastPressTimeRef = useRef<number>(0);
  const holdIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const isTriggeredRef = useRef(false);

  const clearHoldTimer = useCallback(() => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    setIsHolding(false);
    setProgress(0);
    isTriggeredRef.current = false;
  }, []);

  const handlePressStart = useCallback(() => {
    const now = Date.now();
    const timeSinceLast = now - lastPressTimeRef.current;

    // Si la pression survient entre 60ms et 650ms après la précédente, c'est le 2ᵉ appui (double-tap)
    if (timeSinceLast >= 60 && timeSinceLast <= 650) {
      clearHoldTimer();
      setIsHolding(true);
      startTimeRef.current = Date.now();
      isTriggeredRef.current = false;

      const totalMs = requiredHoldSeconds * 1000;

      holdIntervalRef.current = window.setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const pct = Math.min(100, Math.round((elapsed / totalMs) * 100));
        setProgress(pct);

        if (elapsed >= totalMs && !isTriggeredRef.current) {
          isTriggeredRef.current = true;
          clearHoldTimer();

          // Retour haptique sur mobile si supporté
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try {
              navigator.vibrate([100, 50, 150]);
            } catch {
              // Ignore si non supporté
            }
          }

          onTrigger();
        }
      }, 100);
    } else {
      // 1er appui enregistré
      lastPressTimeRef.current = now;
      clearHoldTimer();
    }
  }, [requiredHoldSeconds, onTrigger, clearHoldTimer]);

  const handlePressEnd = useCallback(() => {
    clearHoldTimer();
  }, [clearHoldTimer]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    // Empêche l'affichage du menu contextuel mobile lors du maintien prolongé
    e.preventDefault();
  }, []);

  useEffect(() => {
    return () => {
      clearHoldTimer();
    };
  }, [clearHoldTimer]);

  const handlers: SecretTriggerHandlers = {
    onPointerDown: handlePressStart,
    onPointerUp: handlePressEnd,
    onPointerLeave: handlePressEnd,
    onPointerCancel: handlePressEnd,
    onTouchStart: handlePressStart,
    onTouchEnd: handlePressEnd,
    onTouchCancel: handlePressEnd,
    onMouseDown: handlePressStart,
    onMouseUp: handlePressEnd,
    onMouseLeave: handlePressEnd,
    onContextMenu: handleContextMenu,
  };

  return {
    handlers,
    isHolding,
    progress,
  };
};
