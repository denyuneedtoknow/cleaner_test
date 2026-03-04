import { useEffect, useMemo, useRef, useState } from "react";
import "./styles.css";
import scanIcon from "../public/images/scan_pic.png";
import folderIcon from "../public/images/full_folder_pic.png";
import emptyFolderIcon from "../public/images/folder_pic.png";
import pointerIcon from "../public/images/pointer.png";
import FolderAction from "./components/FolderAction";
import ScanAction from "./components/ScanAction";
import CompletionModal from "./components/CompletionModal";

const categories = ["Spam", "Promotions", "Newsletters"];
const POINTER_DELAY = 500;
const POINTER_ANIM_DURATION = 2000;
const SCAN_DURATION = 1000;
const POINTER_MULTI_INTERVAL = 800;
const POINTER_POST_SCAN_DELAY = 500;
const POINTER_TARGET_X = 0.5;
const POINTER_TARGET_Y = 0.7;

export default function App() {
  const [scanComplete, setScanComplete] = useState(false);
  const [pointerActive, setPointerActive] = useState(true);
  const [introPointerVisible, setIntroPointerVisible] = useState(false);
  const [introPointerPos, setIntroPointerPos] = useState({ x: 0, y: 0 });
  const [clearPointerPositions, setClearPointerPositions] = useState([]);
  const [clearPointersActive, setClearPointersActive] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const containerRef = useRef(null);
  const scanButtonRef = useRef(null);
  const clearRefs = useRef([]);
  const [folders, setFolders] = useState(() =>
    categories.map((label) => ({
      label,
      count: Math.floor(60 + Math.random() * 240),
      freeSpace: null,
      isClearing: false,
      isCleared: false,
    }))
  );
  const totalFreed = useMemo(
    () =>
      folders.reduce((sum, folder) => {
        return sum + (folder.freeSpace || 0);
      }, 0),
    [folders]
  );
  const allCleared = folders.every((folder) => folder.isCleared);
  const clearTimeoutsRef = useRef([]);
  const modalTimeoutRef = useRef(null);

  useEffect(() => {
    if (!allCleared) {
      setShowModal(false);
      if (modalTimeoutRef.current) {
        clearTimeout(modalTimeoutRef.current);
      }
      return;
    }

    modalTimeoutRef.current = setTimeout(() => {
      setShowModal(true);
    }, 300);

    return () => {
      if (modalTimeoutRef.current) {
        clearTimeout(modalTimeoutRef.current);
      }
    };
  }, [allCleared]);

  const setClearRef = (index) => (node) => {
    clearRefs.current[index] = node;
  };

  const getPointerPosition = (element) => {
    const container = containerRef.current;
    if (!element || !container) {
      return null;
    }

    const targetRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const x =
      targetRect.left - containerRect.left + targetRect.width * POINTER_TARGET_X;
    const y =
      targetRect.top - containerRect.top + targetRect.height * POINTER_TARGET_Y;

    return { x, y };
  };

  const handleClearClick = (index) => {
    setIntroPointerVisible(false);
    setClearPointerPositions([]);
    setClearPointersActive(false);

    const target = folders[index];
    if (!target || target.isClearing || target.isCleared) {
      return;
    }

    setFolders((prev) =>
      prev.map((folder, idx) =>
        idx === index ? { ...folder, isClearing: true } : folder
      )
    );

    if (clearTimeoutsRef.current[index]) {
      clearTimeout(clearTimeoutsRef.current[index]);
    }

    const timeoutId = setTimeout(() => {
      setFolders((prev) => {
        const updated = prev.map((folder, idx) => {
          if (idx !== index) {
            return folder;
          }
          const freeSpace = (Math.floor(2 + Math.random() * 8)) * 93;
          return {
            ...folder,
            isClearing: false,
            isCleared: true,
            freeSpace,
          };
        });

        const remaining = updated.some((folder) => !folder.isCleared);
        if (remaining) {
          setClearPointersActive(true);
        } else {
          setPointerActive(false);
          setClearPointersActive(false);
        }

        return updated;
      });
    }, 200);

    clearTimeoutsRef.current[index] = timeoutId;
  };

  useEffect(() => {
    let showTimeout;
    let scanTimeout;
    let completeTimeout;

    const startPointer = () => {
      document.body.classList.remove("scanning", "scan-complete");
      setScanComplete(false);
      setPointerActive(true);
      setIntroPointerVisible(false);
      setClearPointerPositions([]);
      setClearPointersActive(false);

      showTimeout = setTimeout(() => {
        const introPos = getPointerPosition(scanButtonRef.current);
        if (introPos) {
          setIntroPointerPos(introPos);
          setIntroPointerVisible(true);
        }

        scanTimeout = setTimeout(() => {
          setIntroPointerVisible(false);
          document.body.classList.add("scanning");
          completeTimeout = setTimeout(() => {
            document.body.classList.remove("scanning");
            document.body.classList.add("scan-complete");
            setScanComplete(true);
          }, SCAN_DURATION);
        }, POINTER_ANIM_DURATION);
      }, POINTER_DELAY);
    };

    if (document.readyState === "complete") {
      startPointer();
    } else {
      window.addEventListener("load", startPointer, { once: true });
    }

    return () => {
      window.removeEventListener("load", startPointer);
      clearTimeout(showTimeout);
      clearTimeout(scanTimeout);
      clearTimeout(completeTimeout);
      clearTimeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, []);

  useEffect(() => {
    if (!scanComplete || !pointerActive) {
      setClearPointersActive(false);
      return;
    }

    const delayTimeout = setTimeout(() => {
      setClearPointersActive(true);
    }, POINTER_POST_SCAN_DELAY);

    return () => {
      clearTimeout(delayTimeout);
    };
  }, [scanComplete, pointerActive]);

  useEffect(() => {
    if (!clearPointersActive || !pointerActive) {
      return;
    }

    const updatePositions = () => {
      const positions = clearRefs.current
        .map((node, idx) => {
          const folder = folders[idx];
          if (!node || !folder || folder.isClearing || folder.isCleared) {
            return null;
          }
          return getPointerPosition(node);
        })
        .filter(Boolean);

      if (!positions.length) {
        setClearPointerPositions([]);
        setClearPointersActive(false);
        return;
      }

      setClearPointerPositions(positions);
    };

    const rafId = requestAnimationFrame(updatePositions);
    window.addEventListener("resize", updatePositions);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updatePositions);
    };
  }, [clearPointersActive, pointerActive, folders]);

  return (
    <div className="playable">
      <main className="playable__content" ref={containerRef}>
        <ScanAction
          icon={scanIcon}
          label={scanComplete ? "Done!" : "Analyze"}
          hint={
            scanComplete
              ? "Choose folders to clean up with ease!"
              : "Scan mailbox to find clutter"
          }
          loadingText="Scanning…"
          buttonRef={scanButtonRef}
        />

        <div className="actions">
          {folders.map((folder, index) => (
            <FolderAction
              key={folder.label}
              icon={folder.isCleared ? emptyFolderIcon : folderIcon}
              label={folder.label}
              count={folder.count}
              freeSpace={folder.freeSpace}
              isClearing={folder.isClearing}
              isCleared={folder.isCleared}
              onClear={() => handleClearClick(index)}
              buttonRef={setClearRef(index)}
            />
          ))}
        </div>

        {introPointerVisible ? (
          <img
            className="pointer pointer--intro"
            src={pointerIcon}
            alt=""
            style={{ left: `${introPointerPos.x}px`, top: `${introPointerPos.y}px` }}
          />
        ) : null}

        {clearPointersActive && pointerActive
          ? clearPointerPositions.map((pos, index) => {
              const cycleDuration =
                clearPointerPositions.length * POINTER_MULTI_INTERVAL;
              return (
                <img
                  key={`${pos.x}-${pos.y}-${index}`}
                  className="pointer pointer--multi"
                  src={pointerIcon}
                  alt=""
                  style={{
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    animationDelay: `${index * POINTER_MULTI_INTERVAL}ms`,
                    animationDuration: `${cycleDuration}ms`,
                  }}
                />
              );
            })
          : null}
      </main>
      <CompletionModal isOpen={showModal} totalFreed={totalFreed} />
    </div>
  );
}
