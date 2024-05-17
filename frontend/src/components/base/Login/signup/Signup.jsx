import React, { useState } from "react";
import Responsive from "components/common/Responsive";

import "./Signup.scss";
import { Link, useNavigate } from "react-router-dom";
import EmailIcon from "assets/icons/Email";
import PasswordIcon from "assets/icons/Password";
import UsernameIcon from "assets/icons/Username";
import { user_join_api } from "api/User";


function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      registerAction(event);
    }
  };

  const registerAction = (e) => {
    e.preventDefault();
    console.log("Register");
  
    user_join_api(username, password, email)
    .then((res) => {
      alert("가입 성공!\n", res);
      navigate("/login");
    })
    .catch((err) => {
      if (err.response?.data) {
        alert(err.response.data.error);
      }
      else {
        alert(err);
      }
      console.log(err);
    })
  }

  return (
    <Responsive className="signup">
      <div className="signup-box">
        <div className="title">
          회원가입
          <div className="liner"/>
        </div>
        <div className="signup-align">
          <div className="signup-left">
            <div className="inputs">
              <div className="input">
                <UsernameIcon/>
                <input
                  type="text"
                  placeholder="이름"
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e)}
                  tabIndex={1}
                />
              </div>
              <div className="input">
                <EmailIcon/>
                <input
                  type="email"
                  placeholder="이메일"
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e)}
                  tabIndex={2}
                />
              </div>
              <div className="input">
                <PasswordIcon/>
                <input
                  type="password"
                  placeholder="비밀번호"
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e)}
                  tabIndex={3}
                />
              </div>
            </div>
            <div className="etc">
              <div className="find">비밀번호를 잊어버리셨나요?</div>
              <Link tabIndex={4}>비밀번호 찾기</Link>
            </div>
          </div>
          <div className="signup-right">
            <div className="buttons col">
              <div className="button" onClick={registerAction} tabIndex={5}>계정 만들기</div>
              <Link className="button pick" to="/login" tabIndex={6}>로그인 하기</Link>
            </div>
          </div>
        </div>
      </div>
    </Responsive>
  );
}

export default Signup;