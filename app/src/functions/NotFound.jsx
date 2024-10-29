import React from 'react';
import { Container, Box, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from '../pages/static/Logo.png';
import VerifyPermission from './VerifyPermission';


const NotFound = () => {
    const navigate = useNavigate();

    const { permission, isCheckingPermission } = VerifyPermission();

    const handleRedirect = () => {
        console.log(permission);
        if (permission !== null) {
            navigate('/home');
        } else {
            navigate('/login');
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
