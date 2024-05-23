import React from 'react';
import Responsive from 'components/common/Responsive';

import { Footer } from "flowbite-react";

import { BLOG_NAME } from 'constants/base/main';
import "./FooterComponent.scss";
import { Link } from 'react-router-dom';

function FooterComponent() {

  const FooterLinker = ({children, href}) => {
    return (
      <Footer.Link as="div">
        <Link {...href}>
          {children}
        </Link>
      </Footer.Link>
    );
  }

  return (
    <div className="footer">
      <Footer container>
      <Responsive className="footer-responsive">
          <Footer.Copyright href="https://github.com/westreed" by="SeHun.J" year={2024} />
          <Footer.LinkGroup>
            <FooterLinker to="/">Privacy Policy</FooterLinker>
            <FooterLinker to="/">Licensing</FooterLinker>
            <FooterLinker to="/">Contact</FooterLinker>
          </Footer.LinkGroup>
        </Responsive>
      </Footer>
    </div>
  );
}

export default FooterComponent;