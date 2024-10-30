// Importa bibliotecas e componentes necessários
import React, { useEffect, useState } from 'react';
import HeaderAluno from './HeaderAluno'; // Componente para o cabeçalho
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

// Componente principal para exibir avisos do aluno
function AvisosAluno() {
    // Declaração de estados:
    const [avisosGeral, setAvisosGeral] = useState([]); // Armazena avisos gerais
    const [avisosSala, setAvisosSala] = useState([]);   // Armazena avisos específicos da sala
    const [sala, setSala] = useState('');               // Nome ou ID da sala do aluno
    const [loading, setLoading] = useState(true);       // Estado de carregamento
    const [error, setError] = useState(null);           // Estado de erro para exibição de mensagens
    const [value, setValue] = useState(0);              // Índice da aba selecionada
    const cookies = new Cookies();
    const token = cookies.get('token');                 // Recupera o token de autenticação dos cookies

    // useEffect para buscar dados dos avisos ao montar o componente
    useEffect(() => {
        // Função assíncrona para buscar avisos do servidor
        const fetchAvisos = async () => {
            try {
                // Faz uma requisição GET para obter avisos
                const response = await fetch(`http://127.0.0.1:8000/avisos/get`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                // Verifica se a resposta é bem-sucedida
                if (!response.ok) {
                    throw new Error('Falha ao buscar avisos');
                }

                // Armazena os dados dos avisos gerais e da sala no estado
                const data = await response.json();
                setAvisosGeral(data.avisosGeral);
                setAvisosSala(data.avisosSala);
                setSala(data.sala);
            } catch (error) {
                setError(error.message); // Define mensagem de erro
            } finally {
                setLoading(false); // Desativa o estado de carregamento
            }
        };

        fetchAvisos(); // Executa a função de busca ao carregar o componente
    }, [token]); // A função depende do token de autenticação

    // Atualiza o valor do índice de aba selecionado
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // Renderiza um ícone de carregamento enquanto a busca está em andamento
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
                                    <TableCell align="center">
                                        <Typography variant="h5" sx={{ fontWeight: 600 }}>Título</Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="h5" sx={{ fontWeight: 600 }}>Autor</Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="h5" sx={{ fontWeight: 600 }}>Mensagem</Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {avisosGeral.length > 0 ? (
                                    avisosGeral.map((aviso, index) => (
                                        <TableRow 
                                            key={aviso._id} 
                                            sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#f5f5f5' }}
                                        >
                                            <TableCell align="center">
                                                <Typography variant="h6">{aviso.titulo}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="h6">{aviso.autor}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="h6">{aviso.mensagem}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">
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
                                    <TableCell align="center">
                                        <Typography variant="h5" sx={{ fontWeight: 600 }}>Título</Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="h5" sx={{ fontWeight: 600 }}>Autor</Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="h5" sx={{ fontWeight: 600 }}>Mensagem</Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {avisosSala.length > 0 ? (
                                    avisosSala.map((aviso, index) => (
                                        <TableRow 
                                            key={aviso._id} 
                                            sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#f5f5f5' }}
                                        >
                                            <TableCell align="center">
                                                <Typography variant="h6">{aviso.titulo}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="h6">{aviso.autor}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="h6">{aviso.mensagem}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">
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
