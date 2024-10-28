import { Route, Routes, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import React from 'react';

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

function App() {
  const theme = createTheme({
    typography: {
      fontFamily: 'Open Sans, sans-serif', 
    },
  });

  const { permission, isCheckingPermission } = VerifyPermission();

  if (isCheckingPermission) {
    return <div></div>;
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <Routes>
          <Route
            path="/"
            element={permission === null ? <Navigate to="/login" /> : <Navigate to="/home" />}
          />

          <Route path="/login" element={<Login />} />

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
          <Route path="*" element={<Navigate to="/404" />} />
          <Route path="/404" element={<NotFound />} />
        </Routes>
       </ThemeProvider>
      </>
  );
}

export default App;
