import React from "react";
import Responsive from "components/common/Responsive";
import { Link } from "react-router-dom";

import "./Login.scss";
import EmailIcon from "assets/icons/Email";
import PasswordIcon from "assets/icons/Password";


function Login() {
  return (
    <Responsive className="login">
      <div className="login-box">
        <div className="title">
          로그인
          <div className="liner"/>
        </div>
        <div className="inputs">
          <div className="input">
            <EmailIcon/>
            <input type="email" placeholder="이메일"/>
          </div>
          <div className="input">
            <PasswordIcon/>
            <input type="password" placeholder="비밀번호"/>
          </div>
        </div>
        <div className="etc">
          <div className="find">비밀번호를 잊어버리셨나요?</div>
          <Link>비밀번호 찾기</Link>
        </div>
        <div className="buttons row">
          <Link className="button pick" to="/signup">
            회원가입
          </Link>
          <div className="button">로그인하기</div>
        </div>
        <div className="liner">
          <p className="or">OR</p>
        </div>
        <div className="buttons">
          <div className="button oauth google">구글 로그인</div>
        </div>
      </div>
    </Responsive>
  );
}

export default Login;