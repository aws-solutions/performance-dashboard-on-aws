import { useEffect } from "react";

export function useScrollUp(oldStep: number, step: number): any {
  useEffect(() => {
    if (oldStep !== step) {
      window.scrollTo(0, 0);
      oldStep = step;
    }
  }, [step]);
}
