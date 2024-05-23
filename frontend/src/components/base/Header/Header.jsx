import React from 'react';
import Responsive from 'components/common/Responsive';
import { Link } from 'react-router-dom';

import { BLOG_NAME } from 'constants/base/main';
import './Header.scss';

function Header({right, menu}) {
  return (
    <div className={`header`}>
      <Responsive>
        <div className="header-menu">
          <Link className='brand' to="/">
            {BLOG_NAME}
          </Link>
          {/* 여기에 넣으면 중간에 컴포넌트 삽입 */}
          <div className="header-right">
            {right}
            {menu}
          </div>
        </div>
      </Responsive>
    </div>
  );
}

export default Header;