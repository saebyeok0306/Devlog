import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "routes/PrivateRoute";
import PublicRoute from "routes/PublicRoute";
import AnyRoute from "routes/AnyRoute";

import FooterContainer from "containers/base/FooterContainer";
import Home from "pages/Home";
import { AuthTokenInterceptor } from "api/Axios";
import Editor from "pages/Editor";
import Login from "pages/Login";
import Signup from "pages/Signup";
import Callback from "pages/Callback";
import Post from "pages/Post";
import { useRecoilValue } from "recoil";
import { themeAtom } from "recoil/themeAtom";
import DarkModeProvider from "utils/DarkModeProvider";
import AuthProvider from "utils/AuthProvider";
import CategoryManager from "pages/CategoryManager";
import { ROLE_TYPE } from "utils/RoleType";
import ToastContainerComponent from "utils/ToastContainer";
import { useEffect } from "react";

function App() {
  const isDark = useRecoilValue(themeAtom);

  useEffect(() => {
    if (isDark) {
      if (!document.body.classList.contains("dark"))
        document.body.classList.add("dark");
    } else {
      if (document.body.classList.contains("dark"))
        document.body.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <DarkModeProvider>
      <ToastContainerComponent />
      <div className={`wrapper`}>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          {/* <AuthProvider> */}
          <div className={`contentWrapper`}>
            <AuthTokenInterceptor>
              <Routes>
                <Route element={<AnyRoute />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/editor" element={<Editor />} />
                  <Route path="/post/:postUrl" element={<Post />} />
                </Route>
                <Route element={<PublicRoute />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/callback" element={<Callback />} />
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
            </AuthTokenInterceptor>
          </div>
          <FooterContainer />
          {/* </AuthProvider> */}
        </BrowserRouter>
      </div>
    </DarkModeProvider>
  );
}

export default App;
