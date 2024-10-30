import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Importa Link e useLocation para navegação
import Logo from '../static/Logo.png'; // Importa o logo da aplicação
import Logout from '../../functions/Logout'; // Importa função de logout
import '../static/Header.css'; // Importa o arquivo de estilos CSS

// Componente HeaderAluno que renderiza o cabeçalho da aplicação para o aluno
const HeaderAluno = () => {
  // Hook useLocation para obter a rota atual do navegador
  const location = useLocation(); 

  // Função que define a classe 'active' no link ativo (destacando a página atual)
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
            <li className={getLinkClass('/grade')}>
              <Link to="/grade">Grade Horária</Link>
            </li>
            <li className={getLinkClass('/notas')}>
              <Link to="/notas">Notas</Link>
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

export default HeaderAluno;
