import { ToastContainer } from "react-toastify";
import { useRecoilValue } from "recoil";
import { themeAtom } from "@/recoil/themeAtom";

function ToastContainerComponent() {
  const isDark = useRecoilValue(themeAtom);
  return (
    <ToastContainer
      position="top-center"
      autoClose={2000}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      theme={`${isDark ? "dark" : "light"}`}
    />
  );
}

export default ToastContainerComponent;
