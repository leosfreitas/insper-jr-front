import React from 'react';
import HeaderLogin from '../pages/HeaderLogin';
import './static/NotFound.css';

const NotFound = () => {
    return (
        <div>
            <HeaderLogin />
            <div className='not-found'>
                <h1>404 - Página Não Encontrada</h1>
                <p>A página que você está procurando não existe.</p>
            </div>
        </div>
    );
};

export default NotFound;