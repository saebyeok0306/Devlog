"use client";

import NextThemeProvider from "@/utils/NextThemeProvider";
import { CookiesProvider } from "react-cookie";
import { RecoilRoot } from "recoil";
import NextPostProcesser from "./NextPostProcesser";
import ClientToastContainer from "./ToastContainer";
import { AxiosProvider } from "@/api/axios";

export default function NextProvider({ children }) {
  return (
    <RecoilRoot>
      <CookiesProvider>
        <NextThemeProvider>
          <AxiosProvider>
            <ClientToastContainer />
            <NextPostProcesser>{children}</NextPostProcesser>
          </AxiosProvider>
        </NextThemeProvider>
      </CookiesProvider>
    </RecoilRoot>
  );
}
