import { useCallback, useEffect, useRef, useState } from "react";

const POINTER_POST_SCAN_DELAY = 500;
const POINTER_TARGET_X = 0.5;
const POINTER_TARGET_Y = 0.7;

export const POINTER_MULTI_INTERVAL = 800;

export default function usePointerFlow({
  scanComplete,
  folders,
  containerRef,
  clearRefs,
}) {
  const [active, setActive] = useState(true);
  const [showMulti, setShowMulti] = useState(false);
  const [positions, setPositions] = useState([]);
  const delayRef = useRef(null);

  const getPosition = useCallback(
    (element) => {
      const container = containerRef.current;
      if (!element || !container) return null;

      const tr = element.getBoundingClientRect();
      const cr = container.getBoundingClientRect();
      return {
        x: tr.left - cr.left + tr.width * POINTER_TARGET_X,
        y: tr.top - cr.top + tr.height * POINTER_TARGET_Y,
      };
    },
    [containerRef]
  );

  const hideAndReactivate = useCallback(() => {
    setShowMulti(false);
    setPositions([]);
    if (delayRef.current) clearTimeout(delayRef.current);
  }, []);

  useEffect(() => {
    if (!scanComplete || !active) {
      setShowMulti(false);
      return;
    }

    const hasRemaining = folders.some((f) => !f.isCleared && !f.isClearing);

    if (!hasRemaining) {
      setActive(false);
      setShowMulti(false);
      setPositions([]);
      return;
    }

    delayRef.current = setTimeout(
      () => setShowMulti(true),
      POINTER_POST_SCAN_DELAY
    );

    return () => clearTimeout(delayRef.current);
  }, [scanComplete, active, folders]);

  useEffect(() => {
    if (!showMulti || !active) return;

    const update = () => {
      const pos = clearRefs.current
        .map((node, idx) => {
          const folder = folders[idx];
          if (!node || !folder || folder.isClearing || folder.isCleared)
            return null;
          return getPosition(node);
        })
        .filter(Boolean);

      if (!pos.length) {
        setShowMulti(false);
        setPositions([]);
        return;
      }

      setPositions(pos);
    };

    const rafId = requestAnimationFrame(update);
    window.addEventListener("resize", update);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", update);
    };
  }, [showMulti, active, folders, getPosition, clearRefs]);

  return {
    multiVisible: showMulti && active && positions.length > 0,
    positions,
    hideAndReactivate,
    getPosition,
  };
}
