import { windowAtom } from "@/recoil/windowAtom";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

export function useWindow() {
  const [windows, setWindows] = useRecoilState(windowAtom);

  useEffect(() => {
    const handleResize = () => {
      setWindows({ ...windows, width: window.innerWidth });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
}
