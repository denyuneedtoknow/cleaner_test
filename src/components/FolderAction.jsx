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
  hintFreeSpace,
  unwantedFiles,
  spaceFreed,
  clearLabel,
}) {
  const resultText = isCleared
    ? `${freeSpace ?? 0} ${spaceFreed}`
    : `${count} ${unwantedFiles}`;

  return (
    <div
      className={`action action--folder${isCleared ? " action--cleared" : ""}`}
      role="group"
    >
      <img className="action__icon" src={icon} alt="" />
      <div className="action__text">
        <div className="action__label">{label}</div>
        <div className="action__meta">
          <div className="action__hint">{hintFreeSpace}</div>
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
              <ClearButton onClick={onClear} ref={buttonRef}>
                {clearLabel}
              </ClearButton>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
