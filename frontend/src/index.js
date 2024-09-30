import React from "react";
import ReactDOM from "react-dom/client";

import { RecoilRoot } from "recoil";
import { CookiesProvider } from "react-cookie";
import App from "App";

import "styles/main.scss";
import "styles/base/font.css";
import "styles/base/tailwind.css";
import "react-toastify/dist/ReactToastify.css";
import "ckeditor5/ckeditor5.css";
import "tocbot/dist/tocbot.css";
import "highlight.js/styles/github-dark.css";

function Index() {
  return (
    <RecoilRoot>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </RecoilRoot>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Index />);
