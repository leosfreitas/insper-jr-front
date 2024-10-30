import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Importa Link e useLocation do react-router-dom para navegação
import Logout from '../../functions/Logout'; // Importa a função de logout
import Logo from '../static/Logo.png'; // Importa o logo como imagem estática
import '../static/Header.css'; // Importa o arquivo de estilos CSS para o cabeçalho

// Componente funcional para o cabeçalho do professor
const HeaderProfessor = () => {
  const location = useLocation(); // Hook do React Router para acessar o objeto de localização atual

  // Função para determinar a classe do link com base no caminho atual
  const getLinkClass = (path) => {
    return location.pathname === path ? 'active' : ''; // Retorna 'active' se o caminho atual for igual ao caminho do link
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
            <li>
              <Logout />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default HeaderProfessor;