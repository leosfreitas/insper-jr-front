import React from 'react';
import HeaderAluno from './HeaderAluno';
import './static/HomeAluno.css';

function HomeAluno() {
    return (
        <>
        <HeaderAluno />
        <div className='home-aluno'>
            <h1>Bem vindo aluno</h1>
        </div>
        </>
    );
}

export default HomeAluno;