import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // 포트 번호 3000으로 설정
    host: "0.0.0.0",
  },
  // build: {
  //   sourcemap: false,  // 소스 맵 비활성화
  // },
  build: {
    outDir: "build", // 기본값 'dist' 대신 'build'로 지정
  },
  resolve: {
    alias: {
      "@/": "/src/", // src 디렉토리를 '@'로 지정
    },
  },
});
