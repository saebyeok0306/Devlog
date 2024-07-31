import React, { useState } from "react";
import Responsive from "components/common/Responsive";
import { Link, useNavigate } from "react-router-dom";

import "./Login.scss";
import EmailIcon from "assets/icons/Email";
import PasswordIcon from "assets/icons/Password";
import { user_login_api } from "api/User";
import { authAtom } from "recoil/authAtom";
import { useRecoilState } from "recoil";
import { OAUTH2_URI } from "constants/api/oauth";
import { signIn } from "utils/authenticate";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const [, setAuthDto] = useRecoilState(authAtom);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      loginAction(event);
    }
  };

  const loginAction = (e) => {
    e.preventDefault();

    user_login_api(email, password)
      .then((res) => {
        console.log(res);
        const access_token = res.headers["authorization"];
        const refresh_token = res.headers["authorization-refresh"];
        signIn(access_token, refresh_token, setAuthDto);
        navigate("/");
      })
      .catch((err) => {
        toast.error(`${err.response?.data ? err.response.data.error : err}`);
        console.log(err);
      });
  };

  const oauthLoginAction = (e) => {
    e.preventDefault();
    const provider = "google";
    const link = `${process.env.REACT_APP_API_ENDPOINT}${OAUTH2_URI}${provider}`;
    window.location.href = link;
  };

  return (
    <Responsive className="login">
      <div className="login-box">
        <div className="title">
          로그인
          <div className="liner" />
        </div>
        <div className="login-align">
          <div className="login-left">
            <div className="inputs">
              <div className="input">
                <EmailIcon />
                <input
                  type="email"
                  placeholder="이메일"
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e)}
                  tabIndex={1}
                />
              </div>
              <div className="input">
                <PasswordIcon />
                <input
                  type="password"
                  placeholder="비밀번호"
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e)}
                  tabIndex={2}
                />
              </div>
            </div>
            <div className="etc">
              <div className="find">비밀번호를 잊어버리셨나요?</div>
              <Link tabIndex={3}>비밀번호 찾기</Link>
            </div>
          </div>
          <div className="login-right">
            <div className="buttons col">
              <div className="button" onClick={loginAction} tabIndex={4}>
                로그인 하기
              </div>
              <div
                className="button oauth google"
                onClick={oauthLoginAction}
                tabIndex={5}
              >
                구글 로그인
              </div>
              <Link className="button pick" to="/signup" tabIndex={6}>
                계정 만들기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Responsive>
  );
}

export default Login;
