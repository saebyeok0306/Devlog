"use client";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { put_blog_visit_api } from "@/api/info";
import { useRecoilState } from "recoil";
import { renderAtom } from "@/recoil/renderAtom";

export default function NextThemeProvider({ children, ...props }) {
  const [render, setRender] = useRecoilState(renderAtom);

  useEffect(() => {
    setRender(true);
    put_blog_visit_api();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO: 나중에는 google bot인 경우를 따로 판단해서 화면 표시하기.
  if (!render) {
    return <>{children}</>;
    // return <></>;
  } // for persistent theme page.

  return (
    <ThemeProvider storageKey={"theme"} attribute="class" {...props}>
      {children}
    </ThemeProvider>
  );
}
