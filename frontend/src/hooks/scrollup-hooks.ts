import { useEffect } from "react";

export function useScrollUp(): any {
  useEffect(() => {
    window.scrollTo(0, 0);
  });
}
