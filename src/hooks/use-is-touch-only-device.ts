import { useEffect, useState } from "react";

export function useIsTouchOnlyDevice() {
  const [hasTouch, setHasTouch] = useState(false);
  const [noPreciseInput, setNoPreciseInput] = useState(false);

  useEffect(() => {
    const deviceHasTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const deviceHasNoPreciseInput = !matchMedia("(any-pointer: fine)").matches;

    setHasTouch(deviceHasTouch);
    setNoPreciseInput(deviceHasNoPreciseInput);
  }, []);

  return hasTouch && noPreciseInput;
}
