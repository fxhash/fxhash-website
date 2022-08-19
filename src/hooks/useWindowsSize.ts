import { useEffect, useState } from "react";

export const breakpoints = {
  vlg: 1600,
  lg: 1200,
  md: 960,
  sm: 768
}
interface WindowSize {
  width: number | undefined,
  height: number | undefined,
}
export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}
