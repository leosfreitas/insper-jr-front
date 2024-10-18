import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logout from '../../functions/Logout';
import '../static/Header.css';

const HeaderGestao = () => {

  const getLinkClass = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src='Logo.png' alt="Logo" className="logo" />
      </div>
      <div className="nav-container">
        <nav>
          <ul>
            <li className={getLinkClass('/home')}>
              <Link to="/home">Home</Link>
            </li>
            <li className={getLinkClass('/conteudo')}>
              <Link to="/conteudo">Gerenciamento de Conteúdo</Link>
            </li>
            <li className={getLinkClass('/monitoramento')}>
              <Link to="/monitoramento">Monitoramento Acadêmico</Link>
            </li>
            <li>
              <Logout />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default HeaderGestao;