import React from 'react'; // Importa a biblioteca React para construir componentes
import AvisosAlunos from './AvisosAlunos'; // Importa o componente AvisosAlunos

// Componente HomeAluno que representa a página inicial do aluno
function HomeAluno() {
    return (
        <>
            {/* Renderiza o componente AvisosAlunos */}
            <AvisosAlunos />
        </>
    );
}

export default HomeAluno; // Exporta o componente para uso em outras partes da aplicação
