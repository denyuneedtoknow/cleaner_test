import { useEffect, useState } from "react";

const POINTER_DELAY = 500;
const POINTER_ANIM_DURATION = 2000;
const SCAN_DURATION = 1000;

export default function useScanSequence() {
  const [phase, setPhase] = useState("idle");

  useEffect(() => {
    let t1, t2, t3;

    const start = () => {
      t1 = setTimeout(() => {
        setPhase("intro-pointer");

        t2 = setTimeout(() => {
          setPhase("scanning");

          t3 = setTimeout(() => {
            setPhase("complete");
          }, SCAN_DURATION);
        }, POINTER_ANIM_DURATION);
      }, POINTER_DELAY);
    };

    if (document.readyState === "complete") {
      start();
    } else {
      window.addEventListener("load", start, { once: true });
    }

    return () => {
      window.removeEventListener("load", start);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return {
    phase,
    isScanning: phase === "scanning",
    scanComplete: phase === "complete",
    showIntroPointer: phase === "intro-pointer",
  };
}
