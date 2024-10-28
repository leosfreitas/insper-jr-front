import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import { Button, TextField, Container, Alert, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from './static/Logo.png';

export default function Login() {
  const cookies = new Cookies(); 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        cookies.set("token", data.token, { path: "/" }); 
        window.location.href = "/"; 
      } else {
        const errorData = await response.json();
        console.log(errorData);
        setError("Credenciais não conferem. Confirme seu email e senha."); 
      }
    } catch (error) {
      console.log(error);
      setError("Ocorreu um erro ao tentar fazer login."); 
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
        <img src={Logo} alt="logo-login" className="logo-login" style={{ width: '100%', height: 'auto', marginBottom: '5%' }} />
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            fullWidth
            type="email"
            name="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            type="password"
            name="password"
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            variant="outlined"
            margin="normal"
          />
          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{ marginTop: 3, backgroundColor: '#015495' }}
          >
            Entrar
          </Button>
          {error && <Alert severity="error" className='Alert' sx={{ marginTop: 2 }}>{error}</Alert>}
        </form>
      </Box>
    </Container>
  );
}
