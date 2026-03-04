import ClearButton from "./ClearButton";

export default function FolderAction({
  icon,
  label,
  count,
  freeSpace,
  isClearing,
  isCleared,
  onClear,
  buttonRef,
}) {
  const resultText = isCleared
    ? `${freeSpace ?? 0} MB of space freed`
    : `${count} unwanted files found`;

  return (
    <div
      className={`action action--folder${isCleared ? " action--cleared" : ""}`}
      role="group"
    >
      <img className="action__icon" src={icon} alt="" />
      <div className="action__text">
        <div className="action__label">{label}</div>
        <div className="action__meta">
          <div className="action__hint">0 mb free space</div>
          <div className="action__result">
            <span
              className={`action__count${
                isCleared ? " action__count--success" : ""
              }`}
            >
              {resultText}
            </span>
            {isClearing ? (
              <div className="action__loader" aria-hidden="true">
                <span className="action__spinner" />
              </div>
            ) : !isCleared ? (
              <ClearButton onClick={onClear} ref={buttonRef} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
