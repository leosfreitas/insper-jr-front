import Cookies from 'universal-cookie';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

// Instancia o gerenciador de cookies
const cookies = new Cookies();

/**
 * Verifica a validade do token de autenticação.
 *
 * Esta função faz uma requisição para verificar se o token
 * de autenticação armazenado nos cookies é válido.
 *
 * @returns {Promise<boolean>} Retorna uma promessa que resolve para true
 * se o token for válido, ou false caso contrário.
 */
const verifyToken = async () => {
  try {
    const token = cookies.get('token');

    if (token) {
      const response = await fetch('http://127.0.0.1:8000/auth/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        console.log('Token válido. Autorizado');
        return true; // Token é válido
      } else {
        const data = await response.json();
        console.log('Falha na autenticação:', data.message);
        return false; // Token não é válido
      }
    } else {
      console.log('Token não encontrado');
      return false; // Nenhum token encontrado
    }
  } catch (error) {
    console.error('Erro durante a verificação de autenticação:', error);
    return false; // Erro ao verificar o token
  }
};

/**
 * Componente que verifica a autenticação do usuário.
 *
 * Este componente verifica se o usuário está autenticado
 * ao renderizar as rotas filhas. Se o usuário não estiver
 * autenticado, ele será redirecionado para a página de login.
 *
 * @returns {JSX.Element|null} O componente Outlet se o usuário estiver autenticado,
 * ou null caso contrário.
 */
export default function CheckAuth() {
  const navigate = useNavigate(); // Navegação programática
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticação

  /**
   * Verifica se o usuário está autenticado.
   *
   * Esta função chama a função verifyToken e atualiza o estado
   * de autenticação com base na resposta.
   */
  const checkLogin = useCallback(async () => {
    const authenticated = await verifyToken();

    if (authenticated) {
      setIsAuthenticated(true); // Atualiza estado se autenticado
    } else {
      navigate('/login'); // Redireciona para login se não autenticado
    }
  }, [navigate]);

  useEffect(() => {
    checkLogin(); // Chama a verificação ao montar o componente
  }, [checkLogin]);

  return isAuthenticated ? <Outlet /> : null; // Renderiza Outlet se autenticado
}
