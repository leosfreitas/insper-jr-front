import React from 'react';
import { Container, Box, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from '../pages/static/Logo.png';
import VerifyPermission from './VerifyPermission';

/**
 * Componente para exibir uma página 404 - Não Encontrada.
 *
 * Este componente é exibido quando o usuário tenta acessar uma
 * rota que não existe. Ele fornece opções para redirecionar
 * o usuário de volta à página inicial ou à página de login,
 * dependendo de suas permissões.
 *
 * @returns {JSX.Element} Um elemento JSX representando a página de erro 404.
 */
const NotFound = () => {
    const navigate = useNavigate(); // Navegação programática

    // Verifica as permissões do usuário
    const { permission, isCheckingPermission } = VerifyPermission();

    /**
     * Manipulador de evento para redirecionamento.
     *
     * Este método redireciona o usuário para a página inicial
     * se ele tiver permissão, ou para a página de login se não tiver.
     */
    const handleRedirect = () => {
        console.log(permission);
        if (permission !== null) {
            navigate('/home'); // Redireciona para a página inicial se a permissão for válida
        } else {
            navigate('/login'); // Redireciona para a página de login se não houver permissão
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <img src={Logo} alt="Logo" className="logo-not-found" style={{ width: '100%', height: 'auto', marginBottom: '5%' }} />
                <h1>404 - Página Não Encontrada</h1>
                <p>A página que você está procurando não existe.</p>
                <Button
                    variant="contained"
                    onClick={handleRedirect}
                    fullWidth
                    sx={{ marginTop: 3, backgroundColor: '#015495' }}
                >
                    {permission ? 'Ir para Home' : 'Ir para Login'} 
                </Button>
                <Alert severity="error" className='Alert' sx={{ marginTop: 2 }}>
                    Certifique-se de que a URL está correta ou volte para a página inicial.
                </Alert>
            </Box>
        </Container>
    );
};

export default NotFound;
