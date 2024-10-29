import React, { useEffect, useState } from 'react';
import HeaderAluno from './HeaderAluno';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Typography,
    Alert,
    Box,
    Tabs,
    Tab,
} from '@mui/material';
import Cookies from 'universal-cookie';

function AvisosAluno() {
    const [avisosGeral, setAvisosGeral] = useState([]);
    const [avisosSala, setAvisosSala] = useState([]);
    const [sala, setSala] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [value, setValue] = useState(0); 
    const cookies = new Cookies();
    const token = cookies.get('token');

    useEffect(() => {
        const fetchAvisos = async () => {
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
                setAvisosGeral(data.avisosGeral);  
                setAvisosSala(data.avisosSala);    
                setSala(data.sala);               
            } catch (error) {
                setError(error.message); 
            } finally {
                setLoading(false);
            }
        };

        fetchAvisos();
    }, [token]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <HeaderAluno />
            <Box
                sx={{
                    backgroundColor: '#ab2325',
                    color: 'white',
                    width: '100%',
                    height: '25vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Avisos e Comunicados</Typography>
            </Box>

            <Box >
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Tabs
                    value={value}
                    onChange={handleChange}
                    TabIndicatorProps={{
                        sx: {
                        backgroundColor: '#015495', 
                        height: '4px',
                        },
                    }}
                    sx={{
                        backgroundColor: '#f5f5f5', 
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
                        padding: '8px', 
                    }}
                    >
                    <Tab
                        label="Avisos Gerais"
                        sx={{
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: '#333', 
                        '&.Mui-selected': {
                            color: '#015495', 
                        },
                        transition: 'background-color 0.3s', 
                        }}
                    />
                    <Tab
                        label={`Avisos da Sala: ${sala}`}
                        sx={{
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: '#333', 
                        '&.Mui-selected': {
                            color: '#015495', 
                        },
                        transition: 'background-color 0.3s', 
                        }}
                    />
                </Tabs>

                {value === 0 && ( 
                        <TableContainer component={Paper} sx={{ height: '50vh', overflowY: 'auto' }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ width: '25%' }}>
                                            <Typography variant="h5" sx={{ fontWeight: 600 }}>Título</Typography>
                                        </TableCell>
                                        <TableCell sx={{ width: '25%' }}>
                                            <Typography variant="h5" sx={{ fontWeight: 600 }}>Autor</Typography>
                                        </TableCell>
                                        <TableCell sx={{ width: '50%' }}>
                                            <Typography variant="h5" sx={{ fontWeight: 600 }}>Mensagem</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {avisosGeral.length > 0 ? (
                                        avisosGeral.map((aviso) => (
                                            <TableRow key={aviso._id}>
                                                <TableCell>
                                                    <Typography variant="h6">{aviso.titulo}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="h6">{aviso.autor}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="h6">{aviso.mensagem}</Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            <Typography variant="h6">Nenhum aviso encontrado</Typography>
                                        </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                )}

                {value === 1 && ( 
                        <TableContainer component={Paper} sx={{ height: '50vh', overflowY: 'auto' }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ width: '25%' }}>
                                            <Typography variant="h5" sx={{ fontWeight: 600 }}>Título</Typography>
                                        </TableCell>
                                        <TableCell sx={{ width: '25%' }}>
                                            <Typography variant="h5" sx={{ fontWeight: 600 }}>Autor</Typography>
                                        </TableCell>
                                        <TableCell sx={{ width: '50%' }}>
                                            <Typography variant="h5" sx={{ fontWeight: 600 }}>Mensagem</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {avisosSala.length > 0 ? (
                                        avisosSala.map((aviso) => (
                                            <TableRow key={aviso._id}>
                                                <TableCell>
                                                    <Typography variant="h6">{aviso.titulo}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="h6">{aviso.autor}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="h6">{aviso.mensagem}</Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                <Typography variant="h6">Nenhum aviso encontrado</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                )}
            </Box>
        </>
    );
}

export default AvisosAluno;
