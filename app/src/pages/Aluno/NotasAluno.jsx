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
    Snackbar, 
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

function NotasAluno() {
    const [notas, setNotas] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showChart, setShowChart] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false); 
    const [openFilterDialog, setOpenFilterDialog] = useState(false);
    const [openChartDialog, setOpenChartDialog] = useState(false); 
    const [filteredNotas, setFilteredNotas] = useState([]);
    const [filterAvaliacao, setFilterAvaliacao] = useState('');
    const [minNota, setMinNota] = useState('');
    const [maxNota, setMaxNota] = useState('');
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
                setFilteredNotas(Object.entries(data).sort((a, b) => parseFloat(b[1]) - parseFloat(a[1])));
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
        return filteredNotas.map(([avaliacao, nota]) => ({
            simulado: avaliacao,
            Nota: parseFloat(nota) || 0,
        }));
    };

    const handleButtonClick = () => {
        setOpenChartDialog(true);
        setSnackbarOpen(true); 
    };

    const handleOpenFilter = () => {
        setOpenFilterDialog(true);
    };

    const handleCloseFilter = () => {
        setOpenFilterDialog(false);
    };

    const handleCloseChart = () => {
        setOpenChartDialog(false);
    };

    const handleFilterNotas = () => {
        const filtered = Object.entries(notas)
            .filter(([avaliacao, nota]) => {
                const notaNum = parseFloat(nota);
                return (
                    (filterAvaliacao === '' || avaliacao.toLowerCase().includes(filterAvaliacao.toLowerCase())) &&
                    (minNota === '' || notaNum >= parseFloat(minNota)) &&
                    (maxNota === '' || notaNum <= parseFloat(maxNota))
                );
            })
            .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]));
    
        setFilteredNotas(filtered);
        handleCloseFilter();
    };

    const handleResetFilter = () => {
        setFilterAvaliacao('');
        setMinNota('');
        setMaxNota('');
        setFilteredNotas(Object.entries(notas).sort((a, b) => parseFloat(b[1]) - parseFloat(a[1])));
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
) : (
    <>
        {filteredNotas.length === 0 && (
            <Typography variant="h6" sx={{ mt: 3, textAlign: 'center' }}>
                Nenhuma nota encontrada.
            </Typography>
        )}

        <TableContainer 
            component={Paper} 
            sx={{
                margin: '0 auto',
                height: '50vh', 
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
                    {filteredNotas.map(([avaliacao, nota], index) => {
                        const notaValue = parseFloat(nota);
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
                                        {nota}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>

        <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            marginTop: '5vh',
            gap: 3,
        }}>
            <Button
                variant="contained"
                onClick={handleButtonClick}
                sx={{
                    backgroundColor: '#015495', 
                    color: 'white',
                    borderRadius: '25px', 
                    padding: '10px 20px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
                    transition: 'transform 0.3s', 
                    '&:hover': {
                        transform: 'scale(1.05)',
                    },
                }}
            >
                {showChart ? 'Esconder Gráfico' : 'Ver Gráfico'}
            </Button>

            <Button
                variant="contained"
                onClick={handleOpenFilter} 
                sx={{
                    backgroundColor: '#015495', 
                    color: 'white',
                    borderRadius: '25px', 
                    padding: '10px 20px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
                    transition: 'transform 0.3s', 
                    '&:hover': {
                        transform: 'scale(1.05)',
                    },
                }}
            >
                Filtrar Dados
            </Button>

            <Button
                variant="contained"
                onClick={handleResetFilter} 
                sx={{
                    backgroundColor: '#015495', 
                    color: 'white',
                    borderRadius: '25px', 
                    padding: '10px 20px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
                    transition: 'transform 0.3s', 
                    '&:hover': {
                        transform: 'scale(1.05)',
                    },
                }}
            >
                Resetar Filtro
            </Button>
        </Box>

                    <Dialog open={openChartDialog} onClose={handleCloseChart} fullWidth maxWidth="md">
                        <DialogTitle sx={{ textAlign: 'center' }}>Gráfico de Desempenho</DialogTitle>
                        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <LineChart width={500} height={300} data={getFilteredLineData()} >
                                <XAxis dataKey="simulado" tick={{ textAnchor: 'middle',dx:3 }} />
                                <YAxis />
                                <Tooltip />
                                <Legend  align="right" verticalAlign="top" />
                                <Line type="monotone" dataKey="Nota" stroke="#8884d8" />
                            </LineChart>
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: 'center' }}>
                            <Button onClick={handleCloseChart} color="primary">
                                Fechar
                            </Button>
                        </DialogActions>
                    </Dialog>

                <Dialog open={openFilterDialog} onClose={handleCloseFilter}>
                        <DialogTitle>Filtrar Notas</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Avaliação"
                                fullWidth
                                margin="normal"
                                value={filterAvaliacao}
                                onChange={(e) => setFilterAvaliacao(e.target.value)}
                            />
                            
                            <TextField
                                select
                                label="Notas Acima de"
                                fullWidth
                                margin="normal"
                                value={minNota}
                                onChange={(e) => setMinNota(e.target.value)}
                            >
                                <MenuItem value="">Nenhuma</MenuItem>
                                {[...Array(10).keys()].map((num) => (
                                    <MenuItem key={num + 1} value={num + 1}>{num + 1}</MenuItem>
                                ))}
                            </TextField>
                            
                            <TextField
                                select
                                label="Notas Abaixo de"
                                fullWidth
                                margin="normal"
                                value={maxNota}
                                onChange={(e) => setMaxNota(e.target.value)}
                            >
                                <MenuItem value="">Nenhuma</MenuItem>
                                {[...Array(10).keys()].map((num) => (
                                    <MenuItem key={num + 1} value={num + 1}>{num + 1}</MenuItem>
                                ))}
                            </TextField>
                        </DialogContent>
                        <DialogActions>
                            <Button 
                                color="primary" 
                                onClick={handleCloseFilter}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                color="primary" 
                                onClick={handleFilterNotas}
                            >
                                Filtrar
                            </Button>
                        </DialogActions>
                    </Dialog>

                </>
            )}
        </>
    );
}

export default NotasAluno;

