import { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const VerifyPermission = () => {
  const [permission, setPermission] = useState(null);
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const token = cookies.get('token');
        if (token) {
          const response = await fetch('http://localhost:5000/user-permission', {
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
            setPermission(data.permissao);
          } else {
            console.error('Erro na resposta da API:', response.statusText);
            setPermission(null);
          }
        } else {
          console.log('Token não encontrado.');
          setPermission(null);
        }
      } catch (error) {
        console.error('Erro ao verificar permissão:', error);
        setPermission(null);
      } finally {
        setIsCheckingPermission(false);
      }
    };
    checkPermission();
  }, []);

  return { permission, isCheckingPermission };
};

export default VerifyPermission;
