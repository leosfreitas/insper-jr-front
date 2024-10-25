import React from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import Logo from '../static/Logo.png';
import Logout from '../../functions/Logout';
import '../static/Header.css';

const HeaderAluno = () => {
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
