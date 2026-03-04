import { forwardRef } from "react";

const ClearButton = forwardRef(function ClearButton(
  { children = "Clear", onClick },
  ref
) {
  return (
    <button className="btn btn--clear" type="button" onClick={onClick} ref={ref}>
      {children}
    </button>
  );
});

export default ClearButton;
