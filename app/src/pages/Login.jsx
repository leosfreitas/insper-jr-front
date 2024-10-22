import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import { Button, TextField, Container, Typography, Alert, Grid, Box } from '@mui/material';
import HeaderLogin from './HeaderLogin';
import { useNavigate } from 'react-router-dom';
import './static/Login.css';

export default function Login() {
  const cookies = new Cookies(); 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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
    <div>
      <HeaderLogin /> 
      <div className='login-container'>
        <Grid className="login-container">
          <Grid>
            <Container>
              <div className='login-wrapper'>
                <div className='login-text'>
                  <form onSubmit={handleSubmit} style={{ opacity: "0.9", backgroundColor: "white" }}>
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
                    <div className='login-button'>
                      <Button
                        variant="contained"
                        type="submit"
                        style={{ marginTop: '10%'}}
                      >
                        Entrar
                      </Button>
                    </div>
                    {error && <Alert severity="error" className='Alert'>{error}</Alert>}
                  </form>
                </div>
              </div>
            </Container>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}