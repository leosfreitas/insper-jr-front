import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logout from '../../functions/Logout';
import Logo from '../static/Logo.png';
import '../static/Header.css';

const HeaderGestao = () => {
  const location = useLocation(); 

  const getLinkClass = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src={Logo} alt="Logo" className="logo" />
      </div>
      <div className="nav-container">
        <nav>
          <ul>
            <li className={getLinkClass('/home')}>
              <Link to="/home">Home</Link>
            </li>
            <li className={getLinkClass('/conteudo')}>
              <Link to="/conteudo">Conteúdo</Link>
            </li>
            <li className={getLinkClass('/monitoramento')}>
              <Link to="/monitoramento">Monitoramento</Link>
            </li>
            <li className={getLinkClass('/usuarios')}>
              <Link to="/usuarios">Usuários</Link>
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