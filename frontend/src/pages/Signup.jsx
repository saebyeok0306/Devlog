import React from 'react';
import PageTemplate from 'components/base/PageTemplate';
import HeaderContainer from 'containers/base/HeaderContainer';
import SignupContainer from 'containers/signup/SignupContainer';

function Signup() {
  return (
    <PageTemplate>
      <HeaderContainer/>
      <SignupContainer/>
    </PageTemplate>
  );
}

export default Signup;