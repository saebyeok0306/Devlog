"use client";
import { useWindow } from "./hooks/useWindow";

export default function NextPostProcesser({ children }) {
  useWindow();

  return <>{children}</>;
}
