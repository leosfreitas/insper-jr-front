import { Route, Routes, Navigate } from 'react-router-dom';
import React from 'react';

import Login from './pages/Login';
import HomeAluno from './pages/Aluno/HomeAluno';
import HomeGestao from './pages/Gestao/HomeGestao';

import VerifyPermission from './functions/VerifyPermission';
import CheckAuth from './functions/CheckAuth';
import NotFound from './functions/NotFound';

function App() {
  const { permission, isCheckingPermission } = VerifyPermission();

  if (isCheckingPermission) {
    return <div></div>;
  }

  return (
    <>
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
            </>
          )}
          {permission === 'GESTAO' && (
            <>
              <Route path="/home" element={<HomeGestao />} />
            </>
          )}
        </Route>
        <Route path="*" element={<Navigate to="/404" />} />
        <Route path="/404" element={<NotFound />} />


      </Routes>
    </>
  );
}

export default App;
