import React from 'react';
import HeaderProfessor from './HeaderProfessor'; // Importa o componente HeaderProfessor
import MonitoramentoProfessor from './MonitoramentoProfessor'; // Importa o componente MonitoramentoProfessor

// Componente funcional para a página inicial do professor
function HomeProfessor() {
    return (
        <>
            {/* Renderiza o componente MonitoramentoProfessor */}
            <MonitoramentoProfessor />
        </>
    );
}

export default HomeProfessor;
