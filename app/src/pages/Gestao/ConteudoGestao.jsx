import React, { useEffect, useState } from 'react';
import HeaderGestao from './HeaderGestao';
import './static/ConteudoGestao.css';
import Cookies from 'universal-cookie';
import { Button, TextField, Container, Typography, Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert } from '@mui/material';

function ConteudoGestao() {
    const cookies = new Cookies();
    const token = cookies.get("token");

    const [titulo, setTitulo] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [avisos, setAvisos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const response = await fetch("http://127.0.0.1:5000/aviso", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ titulo, mensagem })
          });
    
          if (response.ok) {
            const data = await response.json();
            console.log("Aviso criado com sucesso:", data);
            setTitulo('');
            setMensagem('');
            fetchAvisos(); 
          } else {
            const errorData = await response.json();
            console.log("Erro:", errorData);
          }
        } catch (error) {
          console.log("Erro ao fazer a requisição:", error);
        }
    };

    const fetchAvisos = async () => {
        setLoading(true); // Mostrar loading enquanto faz a requisição
        try {
            const response = await fetch(`http://127.0.0.1:5000/aviso`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error('Falha ao buscar avisos');
            }

            const data = await response.json();
            setAvisos(data.avisos);  
        } catch (error) {
            setError(error.message); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAvisos();
    }, [token]);

    return (
        <>
            <HeaderGestao />
            <Container>
                <Box className='conteudo-gestao' sx={{ mt: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Criar Aviso
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Título"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            required
                        />
                        <TextField
                            label="Mensagem"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                            value={mensagem}
                            onChange={(e) => setMensagem(e.target.value)}
                            required
                        />
                        <Button 
                            variant="contained" 
                            color="primary" 
                            type="submit" 
                            sx={{ mt: 2 }}
                        >
                            Criar Aviso
                        </Button>
                    </form>

                    <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                        Avisos Criados
                    </Typography>

                    {/* Mostrar erros ou loading enquanto os avisos são buscados */}
                    {loading ? (
                        <CircularProgress />
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Título</TableCell>
                                        <TableCell>Autor</TableCell>
                                        <TableCell>Mensagem</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {avisos.map((aviso) => (
                                        <TableRow key={aviso._id}>
                                            <TableCell>{aviso.titulo}</TableCell>
                                            <TableCell>{aviso.autor}</TableCell>
                                            <TableCell>{aviso.mensagem}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            </Container>
        </>
    );
}

export default ConteudoGestao;
