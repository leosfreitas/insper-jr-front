import React from 'react';
import Logo from './static/Logo.png';
import './static/Header.css';

const HeaderLogin = () => {
  return (
    <header className="header">
      <div className="logo-container">
      <img src={Logo} alt="logo" className="logo" />
      </div>
    </header>
  );
};

export default HeaderLogin;