import openStore from "../../builder/openStoreScript";

export default function CompletionModal({ isOpen, totalFreed }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" role="dialog" aria-live="polite">
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
