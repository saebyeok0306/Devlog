import React from 'react';
import './Header.scss';
import Responsive from '../../common/Responsive';
import { Link } from 'react-router-dom';

function Header({right, menu}) {
  return (
    <div className="header">
      <Responsive>
        <div className="header-menu">
          <Link className='brand' to="/">
            JSH's Devlog
          </Link>
          <div>
            여기에 검색창 넣자.
          </div>
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