import React from 'react';
import PageTemplate from 'components/base/PageTemplate';
import LoginContainer from 'containers/login/LoginContainer';
import HeaderContainer from 'containers/base/HeaderContainer';

function Login() {
  return (
    <PageTemplate>
      <HeaderContainer/>
      <LoginContainer/>
    </PageTemplate>
  );
}

// <LoginContainer/>
export default Login;