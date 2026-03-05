import { useMemo } from "react";
import openStore from "../../builder/openStoreScript";

const PARTICLES = 50;
const SPREAD = 500;

function useFireworksShadows(isOpen) {
  return useMemo(() => {
    const start = Array(PARTICLES).fill("0 0 #fff").join(", ");
    const parts = [];
    for (let i = 0; i < PARTICLES; i++) {
      const x = Math.round(Math.random() * SPREAD - SPREAD / 2);
      const y = Math.round(Math.random() * SPREAD - SPREAD / 1.2);
      const hue = Math.floor(Math.random() * 360);
      parts.push(`${x}px ${y}px hsl(${hue}, 100%, 50%)`);
    }
    const end = parts.join(", ");
    return { start, end };
  }, [isOpen]);
}

export default function CompletionModal({ isOpen, totalFreed }) {
  const fireworks = useFireworksShadows(isOpen);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" role="dialog" aria-live="polite">
      <div
        className="pyro"
        aria-hidden="true"
        style={
          {
            "--fireworks-start": fireworks.start,
            "--fireworks-end": fireworks.end,
          }
        }
      >
        <div className="pyro__burst pyro__burst--before" />
        <div className="pyro__burst pyro__burst--after" />
      </div>
      <div className="modal">
        <p className="modal__copy">
          100% of unwanted files cleared! {totalFreed} MB has been freed
        </p>
        <button className="cta cta--shine" type="button" onClick={openStore}>
          Download app for iOs
        </button>
      </div>
    </div>
  );
}
