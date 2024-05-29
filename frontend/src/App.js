import { BrowserRouter, Route, Routes } from "react-router-dom";
// import PrivateRoute from 'routes/PrivateRoute';
import PublicRoute from "routes/PublicRoute";
import AnyRoute from "routes/AnyRoute";

import FooterContainer from "containers/base/FooterContainer";
import Home from "pages/Home";
import { AuthTokenInterceptor } from "api/Axios";
import Editor from "pages/Editor";
import Login from "pages/Login";
import Signup from "pages/Signup";
import Callback from "pages/Callback";
import { useRecoilValue } from "recoil";
import { themeAtom } from "recoil/themeAtom";
import DarkModeProvider from "utils/DarkModeProvider";
import ObserverUser from "utils/ObserverUser";

function App() {
  const isDark = useRecoilValue(themeAtom);

  return (
    <DarkModeProvider>
      <ObserverUser>
        <div className={`wrapper ${isDark ? "dark" : "light"}`}>
          <BrowserRouter basename={process.env.PUBLIC_URL}>
            <div className={`contentWrapper`}>
              <AuthTokenInterceptor>
                <Routes>
                  <Route element={<AnyRoute />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/editor" element={<Editor />} />
                  </Route>
                  <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/callback" element={<Callback />} />
                  </Route>
                  {/* <Route element={<PublicRoute/>}>
                  <Route path="/login" element={<LoginPage/>} />
                </Route>
                <Route element={<PrivateRoute role={"Admin"} />}>
                  <Route path="/admin" element={<AdminPage/>} />
                </Route>
                <Route element={<PrivateRoute role={"Guest"} />}>
                  <Route path="/guest" element={<GuestPage/>} />
                </Route> */}
                </Routes>
              </AuthTokenInterceptor>
            </div>
            <FooterContainer />
          </BrowserRouter>
        </div>
      </ObserverUser>
    </DarkModeProvider>
  );
}

export default App;
