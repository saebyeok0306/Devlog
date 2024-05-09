import React from 'react';
import Responsive from 'components/common/Responsive';

import { BLOG_NAME } from 'constants/base/main';
import "./Footer.scss";

function Footer() {
  return (
    <div className="footer">
      <Responsive className="footer-responsive">
        <div className="liner" />
        <p className="footer-content">{BLOG_NAME}</p>
        <p className="footer-content">@ 2024 갈대 Powered by React.js & Spring</p>
        <p className="footer-content"><a href="https://www.flaticon.com/uicons">Flaticon</a>의 UIcon</p>
      </Responsive>
    </div>
  );
}

export default Footer;