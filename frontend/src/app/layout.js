import { ThemeModeScript } from "flowbite-react";
import "./globals.css";
import "@/styles/main.scss";
import "@/styles/base/font.css";

import NextProvider from "@/utils/NextProvider";
import FooterContainer from "@/containers/base/FooterContainer";

export const revalidate = 3600; // fetch cache 1 hour
export const metadata = {
  title: "devLog",
  description: "개발자의 개발이야기",
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning lang="ko">
      <head>
        <ThemeModeScript />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const theme = localStorage.getItem("theme");
              const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
              const resolvedTheme = theme === "system" ? systemTheme : theme;
              document.documentElement.setAttribute("data-theme", resolvedTheme);
              document.documentElement.classList.add(resolvedTheme);
              document.documentElement.style.colorScheme = resolvedTheme;
            `,
          }}
        ></script>
      </head>
      <body>
        <NextProvider>
          <div className={`wrapper`}>
            <div className={`contentWrapper`}>{children}</div>
            <FooterContainer />
          </div>
        </NextProvider>
      </body>
    </html>
  );
}
