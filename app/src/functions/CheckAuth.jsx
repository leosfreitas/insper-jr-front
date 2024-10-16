import Cookies from 'universal-cookie';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

const cookies = new Cookies();

const verifyToken = async () => {
  try {
    const token = cookies.get('token');

    if (token) {
      const response = await fetch('http://localhost:5000/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        console.log('Token válido. Autorizado');
        return true;
      } else {
        const data = await response.json();
        console.log('Falha na autenticação:', data.message);
        return false;
      }
    } else {
      console.log('Token não encontrado');
      return false;
    }
  } catch (error) {
    console.error('Erro durante a verificação de autenticação:', error);
    return false;
  }
};

export default function UseCheckAuth() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const checkLogin = useCallback(async () => {
    const authenticated = await verifyToken();

    if (authenticated) {
      setIsAuthenticated(true);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  return isAuthenticated ? <Outlet /> : null;
}