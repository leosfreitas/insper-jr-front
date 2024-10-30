import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logout from '../../functions/Logout';
import Logo from '../static/Logo.png';
import '../static/Header.css';

/**
 * Componente que representa o cabeçalho da gestão.
 *
 * @function HeaderGestao
 * @returns {JSX.Element} O componente do cabeçalho com links de navegação.
 */
const HeaderGestao = () => {
  const location = useLocation(); 

  /**
   * Retorna a classe CSS para o link baseado no caminho atual.
   *
   * @param {string} path - O caminho para o qual o link aponta.
   * @returns {string} A classe 'active' se o caminho atual corresponder ao caminho do link, caso contrário, uma string vazia.
   */
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
