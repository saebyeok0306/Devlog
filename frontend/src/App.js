import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "routes/PrivateRoute";
import PublicRoute from "routes/PublicRoute";
import AnyRoute from "routes/AnyRoute";

import FooterContainer from "containers/base/FooterContainer";
import Home from "pages/Home";
import { AxiosProvider } from "api/Axios";
import Editor from "pages/Editor";
import Login from "pages/Login";
import Signup from "pages/Signup";
import Callback from "pages/Callback";
import Post from "pages/Post";
import { useRecoilValue } from "recoil";
import { themeAtom } from "recoil/themeAtom";
import DarkModeProvider from "utils/DarkModeProvider";
import CategoryManager from "pages/CategoryManager";
import { ROLE_TYPE } from "utils/RoleType";
import ToastContainerComponent from "utils/ToastContainer";
import { useEffect } from "react";
import { GetPayload } from "utils/authenticate";
import Profile from "pages/Profile";

function App() {
  const isDark = useRecoilValue(themeAtom);
  const readyPayload = GetPayload();

  useEffect(() => {
    if (isDark) {
      if (!document.body.classList.contains("dark"))
        document.body.classList.add("dark");
    } else {
      if (document.body.classList.contains("dark"))
        document.body.classList.remove("dark");
    }
  }, [isDark]);

  // if (!readyPayload) {
  //   return <div>Loading...</div>;
  // }

  return (
    <DarkModeProvider>
      <ToastContainerComponent />
      <div className={`wrapper`}>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <AxiosProvider>
            <div className={`contentWrapper`}>
              <Routes>
                <Route element={<AnyRoute />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/post/:postUrl" element={<Post />} />
                </Route>
                <Route element={<PublicRoute />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/callback" element={<Callback />} />
                </Route>
                <Route element={<PrivateRoute role={ROLE_TYPE.USER} />}>
                  <Route path="/editor" element={<Editor />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
                <Route
                  path="/manager"
                  element={<PrivateRoute role={ROLE_TYPE.ADMIN} />}
                >
                  <Route path="category" element={<CategoryManager />} />
                  <Route path="info" element={<div>info</div>} />
                </Route>
                <Route path="*" element={<Navigate to="/" />} />
                {/* 모든 경로를 홈으로 리다이렉트 */}
              </Routes>
            </div>
            <FooterContainer />
          </AxiosProvider>
        </BrowserRouter>
      </div>
    </DarkModeProvider>
  );
}

export default App;
