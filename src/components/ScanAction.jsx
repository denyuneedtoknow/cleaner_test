export default function ScanAction({ icon, label, hint, buttonRef, loadingText }) {
  return (
    <button className="action action--scan" type="button" ref={buttonRef}>
      <img className="action__icon" src={icon} alt="" />
      <div className="action__text">
        <div className="action__label">{label}</div>
        <div className="action__hint">{hint}</div>
      </div>
      <div className="loader">
        <div className="loader__spinner" />
        <div className="loader__text">{loadingText}</div>
      </div>
    </button>
  );
}
