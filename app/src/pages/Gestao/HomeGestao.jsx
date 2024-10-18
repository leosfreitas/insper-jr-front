import React from 'react';
import HeaderGestao from './HeaderGestao';
import './static/HomeGestao.css';

function HomeGestao() {
    return (
        <>
        <HeaderGestao />
        <div className='home-gestao'>
            <h1>Bem vindo, gestao</h1>
        </div>
        </>
    );
}

export default HomeGestao;