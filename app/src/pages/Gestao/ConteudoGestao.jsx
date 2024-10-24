import React, { useEffect, useState } from 'react';
import HeaderGestao from './HeaderGestao';
import './static/ConteudoGestao.css';
import Cookies from 'universal-cookie';
import { Button, TextField, Container, Typography, Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function ConteudoGestao() {
    const cookies = new Cookies();
    const token = cookies.get("token");

    const [titulo, setTitulo] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [tipo, setTipo] = useState('Geral'); // Novo estado para o tipo de aviso
    const [avisos, setAvisos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const response = await fetch("http://127.0.0.1:8000/avisos/create", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ titulo, mensagem, tipo }) // Incluindo o tipo na requisição
          });
    
          if (response.ok) {
            const data = await response.json();
            console.log("Aviso criado com sucesso:", data);
            setTitulo('');
            setMensagem('');
            setTipo('Geral'); // Resetando o tipo após a criação
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
        setLoading(true); 
        try {
            const response = await fetch(`http://127.0.0.1:8000/avisos/get`, {
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
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Tipo</InputLabel>
                            <Select
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                label="Tipo"
                            >
                                <MenuItem value="Online">Online</MenuItem>
                                <MenuItem value="Presencial">Presencial</MenuItem>
                                <MenuItem value="Geral">Geral</MenuItem>
                            </Select>
                        </FormControl>
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
                                        <TableCell>Tipo</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {avisos.map((aviso) => (
                                        <TableRow key={aviso._id}>
                                            <TableCell>{aviso.titulo}</TableCell>
                                            <TableCell>{aviso.autor}</TableCell>
                                            <TableCell>{aviso.mensagem}</TableCell>
                                            <TableCell>{aviso.tipo}</TableCell>
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
