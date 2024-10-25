import React from 'react';
import HeaderAluno from './HeaderAluno';
import './static/HomeAluno.css';
import AvisosAlunos from './AvisosAlunos';

function HomeAluno() {
    return (
        <>
        <HeaderAluno />
        <div className='home-aluno'>
            <AvisosAlunos />
        </div>
        </>
    );
}

export default HomeAluno;