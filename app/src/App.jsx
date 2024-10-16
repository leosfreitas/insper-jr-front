import { Route, Routes, Navigate } from 'react-router-dom';
import React from 'react';

import Login from './pages/Login';
import HomeAluno from './pages/Aluno/HomeAluno';
import HomeGestao from './pages/Gestao/HomeGestao';

import verifyPermission from './functions/UserPermission';
import UseCheckAuth from './functions/CheckAuth';


function App() {
  const { permission, isCheckingPermission } = verifyPermission();

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

        <Route element={<UseCheckAuth />}>
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
    

      </Routes>
    </>
  );
}

export default App;
