import React, { useEffect, useState } from 'react';
import HeaderAluno from './HeaderAluno';
import Cookies from 'universal-cookie';
import {
    CircularProgress,
    Typography,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Button,
    Snackbar, // Importa o Snackbar
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // Ícone para fechar o Snackbar
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

function NotasAluno() {
    const [notas, setNotas] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showChart, setShowChart] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false); // Estado para o Snackbar
    const cookies = new Cookies();
    const token = cookies.get('token');

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/alunos/getNotas`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Falha ao buscar notas do aluno');
                }
                return response.json();
            })
            .then((data) => {
                setNotas(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [token]);

    if (loading) {
        return <CircularProgress />;
    }

    const getNotaStyle = (notaValue) => {
        if (notaValue < 5) {
            return { backgroundColor: '#ff5252', color: 'black' };
        } else if (notaValue >= 5 && notaValue < 7) {
            return { backgroundColor: '#ffd54f', color: 'black' };
        } else {
            return { backgroundColor: '#66bb6a', color: 'black' };
        }
    };

    const getFilteredLineData = () => {
        return Object.entries(notas).map(([avaliacao, nota]) => ({
            simulado: avaliacao,
            Nota: parseFloat(nota) || 0,
        }));
    };

    const handleButtonClick = () => {
        setShowChart(!showChart);
        setSnackbarOpen(true); // Abre o Snackbar ao clicar no botão
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

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
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Desempenho</Typography>
            </Box>

            {error ? (
                <Alert severity="error">{error}</Alert>
            ) : Object.keys(notas).length === 0 ? (
                <Typography variant="h6" sx={{ mt: 3, textAlign: 'center' }}>
                    Nenhuma nota encontrada.
                </Typography>
            ) : (
                <>
                    <TableContainer 
                        component={Paper} 
                        sx={{
                            margin: '0 auto',
                            height: '55vh', 
                            overflowY: 'auto', 
                            borderRadius: '16px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant="h5" sx={{ fontWeight: 600 }}>Simulado</Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{ paddingRight: '20%' }}>
                                        <Typography variant="h5" sx={{ fontWeight: 600 }}>Nota</Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(notas).map(([avaliacao, nota], index) => {
                                    const notaRender = typeof nota === 'object' ? JSON.stringify(nota) : nota;
                                    const notaValue = parseFloat(notaRender);

                                    return (
                                        <TableRow
                                            key={avaliacao}
                                            sx={{
                                                backgroundColor: index % 2 === 0 ? 'white' : '#f5f5f5',
                                            }}
                                        >
                                            <TableCell>
                                                <Typography variant="h6">{avaliacao}</Typography>
                                            </TableCell>
                                            <TableCell align="right" sx={{ paddingRight: '19%' }}>
                                                <Box
                                                    sx={{

                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        padding: '10px 25px',
                                                        borderRadius: '25px',
                                                        ...getNotaStyle(notaValue),
                                                        fontWeight: 'bold',
                                                        fontSize: '1.3rem',
                                                    }}
                                                >
                                                    {notaRender}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    
                    {/* Botão posicionado acima e centralizado */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                    <Button
                        variant="contained"
                        onClick={handleButtonClick}
                        sx={{
                            backgroundColor: '#ab2325', // Cor de fundo
                            color: 'white', // Cor do texto
                            borderRadius: '25px', // Arredondamento das bordas
                            padding: '10px 20px', // Espaçamento interno
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Sombra do botão
                            transition: 'background-color 0.3s, transform 0.3s', // Transição suave para efeitos
                            '&:hover': {
                                backgroundColor: '#9a191c', // Cor de fundo ao passar o mouse
                                transform: 'scale(1.05)', // Aumentar levemente ao passar o mouse
                            },
                        }}
                    >
                        {showChart ? 'Esconder Gráfico' : 'Ver Gráfico'}
                    </Button>
                    </Box>

                    {showChart && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 4 }}>
                        <Typography variant="h6" sx={{ marginBottom: 2, textAlign: 'center' }}>
                            Gráfico de Desempenho
                        </Typography>
                        <LineChart
                            width={1000}
                            height={400}
                            data={getFilteredLineData()} 
                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        >
                            <XAxis dataKey="simulado" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Nota" stroke="#82ca9d" strokeWidth={2} />
                        </LineChart>
                    </Box>
                    )}

                    {/* Snackbar para feedback do usuário */}
                    <Snackbar
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Posição do Snackbar
                        open={snackbarOpen}
                        autoHideDuration={3000} // Duração em milissegundos
                        onClose={handleSnackbarClose}
                        message={showChart ? 'Gráfico criado!' : 'Gráfico escondido!'} // Mensagem do Snackbar
                        action={
                            <IconButton
                                size="small"
                                aria-label="close"
                                color="inherit"
                                onClick={handleSnackbarClose}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        }
                    />
                </>
            )}
        </>
    );
}

export default NotasAluno;
