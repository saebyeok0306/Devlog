import React from "react";
import Responsive from "components/common/Responsive";

import "./Signup.scss";
import { Link } from "react-router-dom";
import EmailIcon from "assets/icons/Email";
import PasswordIcon from "assets/icons/Password";
import UsernameIcon from "assets/icons/Username";
import { user_join_api } from "api/User";

const Register = (e) => {
  e.preventDefault();
  console.log("Register");

  // user_join_api
}

function Signup() {
  return (
    <Responsive className="signup">
      <div className="signup-box">
        <div className="title">
          회원가입
          <div className="liner"/>
        </div>
        <div className="inputs">
          <div className="input">
            <UsernameIcon/>
            <input type="text" placeholder="이름"/>
          </div>
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
        <div className="buttons">
          <div className="button" onClick={Register}>회원가입</div>
          <Link className="button pick" to="/login">로그인하기</Link>
        </div>
      </div>
    </Responsive>
  );
}

export default Signup;