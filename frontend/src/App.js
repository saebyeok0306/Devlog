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
import { useEffect, useState } from "react";
import { GetPayload } from "utils/authenticate";
import Profile from "pages/Profile";
import { ClockLoader, HashLoader } from "react-spinners";
import PostStatistics from "pages/PostStatistics";
import UserRoute from "routes/UserRoute";
import { Initizalize } from "utils/reactGA4";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [maintenance, setMaintenance] = useState(false);
  const isDark = useRecoilValue(themeAtom);
  GetPayload(setIsLoading, setMaintenance);
  Initizalize();

  useEffect(() => {
    if (isDark) {
      if (!document.body.classList.contains("dark"))
        document.body.classList.add("dark");
    } else {
      if (document.body.classList.contains("dark"))
        document.body.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    if (maintenance) {
      const interval = setInterval(() => {
        window.location.reload();
      }, 30000); // 30,000ms = 30초

      // 컴포넌트 언마운트 시 interval 해제
      return () => clearInterval(interval);
    }
  }, [maintenance]);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  if (maintenance) {
    return (
      <DarkModeProvider>
        <ToastContainerComponent />
        <div className={`wrapper`}>
          <div className="maintenance-container">
            <div className="maintenance-content">
              <ClockLoader className="maintenance-icon" />
              <h1>서버 점검 중입니다</h1>
              <p>빠른 시일 내에 복구될 예정입니다. 잠시만 기다려주세요.</p>
              <button
                onClick={() => window.location.reload()}
                className="retry-button"
              >
                다시 시도하기
              </button>
            </div>
          </div>
        </div>
      </DarkModeProvider>
    );
  }

  return (
    <DarkModeProvider>
      <ToastContainerComponent />
      <div className={`wrapper`}>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <AxiosProvider>
            {!isLoading ? (
              <>
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
                    <Route element={<UserRoute />}>
                      <Route path="/editor" element={<Editor />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route
                        path="/post/:postUrl/statistics"
                        element={<PostStatistics />}
                      />
                    </Route>
                    {/* TODO: editor는 내부적으로 따로 권한처리 */}
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
              </>
            ) : (
              <div style={{ flex: 1 }}>
                <HashLoader
                  size={150}
                  color={isDark ? "#fff" : "#000"}
                  cssOverride={{
                    display: "block",
                    margin: "0 auto 0 auto",
                    marginTop: "20%",
                  }}
                />
              </div>
            )}
          </AxiosProvider>
        </BrowserRouter>
      </div>
    </DarkModeProvider>
  );
}

export default App;
