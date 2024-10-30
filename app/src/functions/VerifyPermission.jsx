import { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

/**
 * Hook para verificar as permissões do usuário.
 *
 * Este hook é responsável por recuperar as permissões do usuário
 * a partir de um token de autenticação armazenado em cookies.
 * Ele fornece o estado das permissões e um indicador de carregamento
 * que pode ser utilizado em outros componentes.
 *
 * @returns {Object} Um objeto contendo as permissões do usuário e o estado de verificação.
 * @returns {boolean} permission - As permissões do usuário, ou null se não puderem ser recuperadas.
 * @returns {boolean} isCheckingPermission - Um indicador se a verificação de permissão está em andamento.
 */
const VerifyPermission = () => {
  const [permission, setPermission] = useState(null); // Estado para armazenar a permissão do usuário
  const [isCheckingPermission, setIsCheckingPermission] = useState(true); // Estado para controle de carregamento

  useEffect(() => {
    /**
     * Função assíncrona para verificar as permissões do usuário.
     * Esta função faz uma chamada à API para obter as permissões
     * baseadas no token de autenticação.
     */
    const checkPermission = async () => {
      try {
        const token = cookies.get('token'); // Recupera o token do cookie
        if (token) {
          const response = await fetch('http://127.0.0.1:8000/user/permission', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ token }),
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Permissão recebida da API:', data.permissao);
            setPermission(data.permissao); // Atualiza o estado com a permissão recebida
          } else {
            console.error('Erro na resposta da API:', response.statusText);
            setPermission(null); // Define como null se houve erro na resposta
          }
        } else {
          console.log('Token não encontrado.');
          setPermission(null); // Define como null se o token não estiver presente
        }
      } catch (error) {
        console.error('Erro ao verificar permissão:', error);
        setPermission(null); // Define como null em caso de erro
      } finally {
        setIsCheckingPermission(false); // Atualiza o estado para indicar que a verificação foi concluída
      }
    };

    checkPermission(); // Chama a função de verificação de permissão
  }, []); // Efeito executado apenas uma vez na montagem do componente

  return { permission, isCheckingPermission }; // Retorna as permissões e o estado de verificação
};

export default VerifyPermission;
