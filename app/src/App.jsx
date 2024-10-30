import { Route, Routes, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';

// Importação das páginas e funções
import Login from './pages/Login';
import HomeAluno from './pages/Aluno/HomeAluno';
import GradeAluno from './pages/Aluno/GradeAluno';
import NotasAluno from './pages/Aluno/NotasAluno';
import HomeGestao from './pages/Gestao/HomeGestao';
import ConteudoGestao from './pages/Gestao/ConteudoGestao';
import MonitoramentoGestao from './pages/Gestao/MonitoramentoGestao';
import MonitoramentoNotas from './pages/Gestao/MonitoramentoNotas';
import ControleUsuarios from './pages/Gestao/ControleUsuarios';
import HomeProfessor from './pages/Professor/HomeProfessor';
import ConteudoProfessor from './pages/Professor/ConteudoProfessor';
import MonitoramentoNotasProfessor from './pages/Professor/MonitoramentoNotasProfessor';
import VerifyPermission from './functions/VerifyPermission';
import CheckAuth from './functions/CheckAuth';
import NotFound from './functions/NotFound';

/**
 * Componente principal da aplicação.
 *
 * Este componente gerencia as rotas da aplicação e a aplicação de temas.
 * Ele utiliza o React Router para navegação entre diferentes páginas, 
 * verificando as permissões do usuário e redirecionando conforme necessário.
 *
 * @returns {JSX.Element} O componente renderizado.
 */
function App() {
  // Criação de um tema utilizando Material-UI
  const theme = createTheme({
    typography: {
      fontFamily: 'Open Sans, sans-serif',
    },
  });

  // Verifica as permissões do usuário
  const { permission, isCheckingPermission } = VerifyPermission();

  // Exibe um carregando enquanto as permissões estão sendo verificadas
  if (isCheckingPermission) {
    return <div></div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        {/* Redireciona para a página de login ou home dependendo da permissão */}
        <Route
          path="/"
          element={permission === null ? <Navigate to="/login" /> : <Navigate to="/home" />}
        />

        {/* Rota para a página de login */}
        <Route path="/login" element={<Login />} />

        {/* Roteamento protegido com base nas permissões */}
        <Route element={<CheckAuth />}>
          {permission === 'ALUNO' && (
            <>
              <Route path="/home" element={<HomeAluno />} />
              <Route path="/grade" element={<GradeAluno />} />
              <Route path="/notas" element={<NotasAluno />} />
            </>
          )}
          {permission === 'GESTAO' && (
            <>
              <Route path="/home" element={<HomeGestao />} />
              <Route path="/conteudo" element={<ConteudoGestao />} />
              <Route path="/usuarios" element={<ControleUsuarios />} />
              <Route path="/monitoramento" element={<MonitoramentoGestao />} />
              <Route path="/monitoramento/notas/:cpf" element={<MonitoramentoNotas />} />
            </>
          )}
          {permission === 'PROFESSOR' && (
            <>
              <Route path="/home" element={<HomeProfessor />} />
              <Route path="/conteudo" element={<ConteudoProfessor />} />
              <Route path="/monitoramento/notas/:cpf" element={<MonitoramentoNotasProfessor />} />
            </>
          )}
        </Route>

        {/* Rota para qualquer caminho não encontrado */}
        <Route path="*" element={<Navigate to="/404" />} />
        {/* Rota para página 404 */}
        <Route path="/404" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
