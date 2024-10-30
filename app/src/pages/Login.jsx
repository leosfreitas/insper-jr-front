import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import { Button, TextField, Container, Alert, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from './static/Logo.png';

/**
 * Componente de Login da aplicação.
 *
 * Este componente permite que os usuários façam login na aplicação usando seu e-mail
 * e senha. Ele gerencia o estado dos campos de entrada e lida com a autenticação,
 * salvando um token de autenticação em cookies.
 *
 * @returns {JSX.Element} O componente renderizado.
 */
export default function Login() {
  // Instancia o gerenciador de cookies
  const cookies = new Cookies();
  
  // Estados para gerenciar email, senha e mensagens de erro
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState(null); 
  
  // Navegação programática
  const navigate = useNavigate();

  /**
   * Manipula o envio do formulário de login.
   *
   * @param {Event} e - O evento do formulário.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    try {
      // Faz uma requisição POST para a API de login
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }) // Envia email e senha como JSON
      });

      // Verifica se a resposta da API foi bem-sucedida
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // Armazena o token nos cookies
        cookies.set("token", data.token, { path: "/" }); 
        // Redireciona para a página inicial
        window.location.href = "/"; 
      } else {
        // Trata erros de autenticação
        const errorData = await response.json();
        console.log(errorData);
        setError("Credenciais não conferem. Confirme seu email e senha."); 
      }
    } catch (error) {
      // Trata erros de rede ou outros erros
      console.log(error);
      setError("Ocorreu um erro ao tentar fazer login."); 
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
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
          {/* Exibe mensagem de erro se houver */}
          {error && <Alert severity="error" className='Alert' sx={{ marginTop: 2 }}>{error}</Alert>}
        </form>
      </Box>
    </Container>
  );
}
