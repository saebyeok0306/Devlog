import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { themeAtom } from "recoil/themeAtom";

function DarkModeProvider({ children }) {
  const [, setThemeMode] = useRecoilState(themeAtom);

  useEffect(() => {
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      if (Number(localStorage.getItem("theme")) !== 2) return;
      setThemeMode(e.matches);
    };

    matchMedia.addEventListener("change", handleChange);
    return () => {
      matchMedia.removeEventListener("change", handleChange);
    };
  }, []);

  return <>{children}</>;
}

export default DarkModeProvider;
