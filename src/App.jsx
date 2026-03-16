import { useEffect, useRef, useState } from "react";
import "./styles.css";
import scanIcon from "../public/images/scan_pic.png";
import folderIcon from "../public/images/full_folder_pic.png";
import emptyFolderIcon from "../public/images/folder_pic.png";
import pointerIcon from "../public/images/pointer.png";
import FolderAction from "./components/FolderAction";
import ScanAction from "./components/ScanAction";
import CompletionModal from "./components/CompletionModal";
import useFolders from "./hooks/useFolders";
import useScanSequence from "./hooks/useScanSequence";
import usePointerFlow, { POINTER_MULTI_INTERVAL } from "./hooks/usePointerFlow";
import localizationMap from "./locales";

const lang = language || "en";
const s = localizationMap.get(lang) || localizationMap.get("en");

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [introPointerPos, setIntroPointerPos] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);
  const scanButtonRef = useRef(null);
  const clearRefs = useRef([]);

  const { folders, clearFolder, totalFreed, allCleared } = useFolders(s.categories);
  const { isScanning, scanComplete, showIntroPointer } = useScanSequence();
  const {
    multiVisible,
    positions,
    hideAndReactivate,
    getPosition,
  } = usePointerFlow({ scanComplete, folders, containerRef, clearRefs });

  useEffect(() => {
    if (!showIntroPointer) return;
    const pos = getPosition(scanButtonRef.current);
    if (pos) setIntroPointerPos(pos);
  }, [showIntroPointer, getPosition]);

  useEffect(() => {
    if (!allCleared) {
      setShowModal(false);
      return;
    }
    const timeout = setTimeout(() => setShowModal(true), 300);
    return () => clearTimeout(timeout);
  }, [allCleared]);

  const setClearRef = (index) => (node) => {
    clearRefs.current[index] = node;
  };

  const handleClearClick = (index) => {
    hideAndReactivate();
    clearFolder(index);
  };

  return (
    <div className={`playable${isScanning ? " playable--scanning" : ""}${scanComplete ? " playable--complete" : ""}`}>
      <main className="playable__content" ref={containerRef}>
        <ScanAction
          icon={scanIcon}
          label={scanComplete ? s.scanDone : s.scanAnalyze}
          hint={scanComplete ? s.scanHintComplete : s.scanHintInitial}
          loadingText={s.scanning}
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
              hintFreeSpace={s.hintFreeSpace}
              unwantedFiles={s.unwantedFiles}
              spaceFreed={s.spaceFreed}
              clearLabel={s.clear}
            />
          ))}
        </div>

        {showIntroPointer && (
          <img
            className="pointer pointer--intro"
            src={pointerIcon}
            alt=""
            style={{
              left: `${introPointerPos.x}px`,
              top: `${introPointerPos.y}px`,
            }}
          />
        )}

        {multiVisible &&
          positions.map((pos, index) => {
            const cycleDuration = positions.length * POINTER_MULTI_INTERVAL;
            return (
              <img
                key={`pointer-${index}`}
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
          })}
      </main>
      <CompletionModal
        isOpen={showModal}
        totalFreed={totalFreed}
        modalCopy={s.modalCopy}
        downloadCta={s.downloadCta}
      />
    </div>
  );
}
