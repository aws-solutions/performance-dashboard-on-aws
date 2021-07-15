import { useState, useRef, useEffect } from "react";

export function useFileLoaded(
  setToHide: React.Dispatch<React.SetStateAction<boolean>>,
  loadingFile: boolean
) {
  // firstUpdate stops useEffect from executing after the first render
  // secondUpdate stops useEffect from executing when resource starts loading
  const firstUpdate = useRef(true);
  const secondUpdate = useRef(true);
  useEffect(() => {
    if (secondUpdate.current) {
      if (firstUpdate.current) {
        firstUpdate.current = false;
        return;
      }
      secondUpdate.current = false;
      return;
    }
    setToHide(false);
  }, [loadingFile]);
}
