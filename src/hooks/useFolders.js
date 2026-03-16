import { useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_CATEGORIES = ["Spam", "Promotions", "Newsletters"];
const CLEAR_DURATION = 200;

export default function useFolders(categoryLabels = DEFAULT_CATEGORIES) {
  const [folders, setFolders] = useState(() =>
    categoryLabels.map((label) => ({
      label,
      count: Math.floor(60 + Math.random() * 240),
      freeSpace: null,
      isClearing: false,
      isCleared: false,
    }))
  );

  const timeoutsRef = useRef([]);

  const totalFreed = useMemo(
    () => folders.reduce((sum, f) => sum + (f.freeSpace || 0), 0),
    [folders]
  );

  const allCleared = useMemo(
    () => folders.every((f) => f.isCleared),
    [folders]
  );

  const clearFolder = (index) => {
    const target = folders[index];
    if (!target || target.isClearing || target.isCleared) return;

    setFolders((prev) =>
      prev.map((f, idx) =>
        idx === index ? { ...f, isClearing: true } : f
      )
    );

    if (timeoutsRef.current[index]) {
      clearTimeout(timeoutsRef.current[index]);
    }

    timeoutsRef.current[index] = setTimeout(() => {
      setFolders((prev) =>
        prev.map((f, idx) => {
          if (idx !== index) return f;
          return {
            ...f,
            isClearing: false,
            isCleared: true,
            freeSpace: Math.floor(2 + Math.random() * 8) * 93,
          };
        })
      );
    }, CLEAR_DURATION);
  };

  useEffect(() => {
    return () => timeoutsRef.current.forEach((id) => clearTimeout(id));
  }, []);

  return { folders, clearFolder, totalFreed, allCleared };
}
