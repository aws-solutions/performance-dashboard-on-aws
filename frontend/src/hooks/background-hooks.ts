import { useEffect } from "react";

export function useChangeBackgroundColor(): any {
  //store previous color
  const originalBackroundColor = document.body.style.background;

  useEffect(() => {
    //change color
    document.body.style.background = "#fafafa";

    // returned function will be called on component unmount
    return () => {
      //reset color
      document.body.style.background = originalBackroundColor;
    };
  }, [originalBackroundColor]);
}
