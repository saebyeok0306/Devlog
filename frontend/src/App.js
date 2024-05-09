import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from 'routes/PrivateRoute';
import PublicRoute from 'routes/PublicRoute';
import AnyRoute from 'routes/AnyRoute';

import FooterContainer from 'containers/base/FooterContainer';
import Home from 'pages/Home';
import { AuthTokenInterceptor } from 'api/Axios';
import Editor from 'pages/Editor';
import Login from 'pages/Login';
import Signup from 'pages/Signup';

function App() {
  return (
    <div className={`wrapper`}>
      <div className={`contentWrapper`}>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <AuthTokenInterceptor>
          <Routes>
            <Route element={<AnyRoute/>}>
              <Route path="/" element={<Home/>} />
              <Route path="/editor" element={<Editor/>} />
            </Route>
            <Route element={<PublicRoute/>}>
              <Route path="/login" element={<Login/>} />
              <Route path="/signup" element={<Signup/>} />
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
        </BrowserRouter>
      </div>
      <FooterContainer/>
    </div>
  );
}

export default App;
