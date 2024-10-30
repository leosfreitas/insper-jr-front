import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Select,
    MenuItem,
} from '@mui/material';
import HeaderGestao from './HeaderGestao';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts'; // Importar os componentes do Recharts

function MonitoramentoNotas() {
    const { cpf } = useParams();
    const [aluno, setAluno] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newNota, setNewNota] = useState({ avaliacao: '', nota: '' });
    const [openDialog, setOpenDialog] = useState(false);
    const [openChartDialog, setOpenChartDialog] = useState(false); // Adicionando estado para o gráfico
    const [chartData, setChartData] = useState([]); // Dados do gráfico
    const [filterNota, setFilterNota] = useState('');
    const [filterAvaliacao, setFilterAvaliacao] = useState('');
    const [filteredNotas, setFilteredNotas] = useState([]);
    const [minNota, setMinNota] = useState('');
    const [maxNota, setMaxNota] = useState('');

    const [openFilterDialog, setOpenFilterDialog] = useState(false);
    const cookies = new Cookies();
    const token = cookies.get('token');

    const fetchAluno = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/alunos/get/${cpf}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Falha ao buscar aluno');
            }

            const data = await response.json();
            setAluno(data);
            setFilteredNotas(Object.entries(data.notas).sort((a, b) => parseFloat(b[1]) - parseFloat(a[1])));
            setLoading(false);
        } catch (error) {
            console.error('Erro ao buscar aluno:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    const getFilteredLineData = () => {
        return Object.entries(aluno.notas).map(([simulado, nota]) => ({
            simulado,
            Nota: parseFloat(nota),
        }));
    };

    const handleOpenChart = () => {
        setChartData(getFilteredLineData());
        setOpenChartDialog(true);
    };

    const handleCloseChart = () => setOpenChartDialog(false);

    const getNotaStyle = (notaValue) => {
        if (notaValue < 5) {
            return { backgroundColor: '#ff5252', color: 'black' };
        } else if (notaValue >= 5 && notaValue < 7) {
            return { backgroundColor: '#ffd54f', color: 'black' };
        } else {
            return { backgroundColor: '#66bb6a', color: 'black' };
        }
    };

    const handleAddNota = () => {
        fetch(`http://127.0.0.1:8000/alunos/addNota/${cpf}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ avaliacao: newNota.avaliacao, nota: newNota.nota }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Falha ao adicionar a nota');
                }
                fetchAluno();
                setOpenDialog(false);
                setNewNota({ avaliacao: '', nota: '' });
                return response.json();
            })
            .catch((error) => {
                console.error('Erro ao adicionar nota:', error);
                setError(error.message);
            });
    };

    const handleRemoveNota = (avaliacao) => {
        fetch(`http://127.0.0.1:8000/alunos/removeNota/${cpf}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ avaliacao }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao deletar a nota');
                }
                return response.json();
            })
            .then(() => {
                fetchAluno();
            })
            .catch(error => {
                console.error('Erro ao deletar a nota:', error);
                setError(error.message);
            });
    };

    const handleOpenFilter = () => {
        setOpenFilterDialog(true);
    };

    const handleCloseFilter = () => {
        setOpenFilterDialog(false);
    };

    const handleFilterNotas = () => {
        const filtered = Object.entries(aluno.notas).filter(([avaliacao, nota]) => {
            const notaNum = parseFloat(nota);
            return (
                (filterAvaliacao === '' || avaliacao.toLowerCase().includes(filterAvaliacao.toLowerCase())) &&
                (minNota === '' || notaNum >= parseFloat(minNota)) &&
                (maxNota === '' || notaNum <= parseFloat(maxNota))
            );
        });

        const sortedFiltered = filtered.sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]));
        setFilteredNotas(sortedFiltered);
        handleCloseFilter();
    };

    const handleFilterReset = () => {
        setFilterAvaliacao('');
        setMinNota('');
        setMaxNota('');
        setFilteredNotas(Object.entries(aluno.notas).sort((a, b) => parseFloat(b[1]) - parseFloat(a[1])));
    };

    useEffect(() => {
        fetchAluno();
    }, [token, cpf]);

    return (
        <>
            <HeaderGestao />
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
                <ArrowBackIcon
                    style={{ fontSize: '40px', position: 'absolute', left: '20px', cursor: 'pointer' }}
                    onClick={() => window.location.href = '/monitoramento'}
                />
                {aluno ? (
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{aluno.nome}</Typography>
                ) : (
                    <Typography variant="h4">Carregando...</Typography>
                )}
            </Box>
            {aluno && (
                <>
                    <TableContainer component={Paper} sx={{ height: '50vh', overflowY: 'auto' }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant="h5" sx={{ fontWeight: 600 }}>Avaliação</Typography>
                                    </TableCell>
                                    <TableCell >
                                        <Typography variant="h5" sx={{ fontWeight: 600, paddingLeft: '4%' }}>Nota</Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{ paddingRight: '5%' }}>
                                        <Typography variant="h5" sx={{ fontWeight: 600 }}>Ações</Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredNotas.map(([avaliacao, nota], index) => {
                                    const notaValue = parseFloat(nota);
                                    return (
                                        <TableRow key={avaliacao} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#f5f5f5' }}>
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
                                            <TableCell align="right" sx={{ paddingRight: '3.8%' }}>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => handleRemoveNota(avaliacao)}
                                                    sx={{
                                                        backgroundColor: '#ab2325', 
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
                                                    Remover
                                                </Button>
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
                            onClick={handleOpenChart} 
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
                            Ver gráfico
                        </Button>
                        <Button 
                            variant="contained" 
                            color="error" 
                            onClick={() => setOpenDialog(true)} 
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
                            Adicionar Nota
                        </Button>
                        <Button 
                            variant="contained" 
                            color="error" 
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
                            onClick={handleFilterReset} 
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

                    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                        <DialogTitle>Adicionar Nova Nota</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Avaliação"
                                value={newNota.avaliacao}
                                name="avaliacao"
                                onChange={(e) => setNewNota({ ...newNota, avaliacao: e.target.value })}
                                fullWidth
                                margin="dense"
                            />
                            <TextField
                                label="Nota"
                                value={newNota.nota}
                                name="nota"
                                onChange={(e) => setNewNota({ ...newNota, nota: e.target.value })}
                                fullWidth
                                margin="dense"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button 
                                color="primary" 
                                onClick={() => setOpenDialog(false)}
                                >
                                Cancelar
                            </Button>
                            <Button 
                                color="primary" 
                                onClick={handleAddNota}

                                >
                                Adicionar
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
                    
                    <Dialog open={openChartDialog} onClose={handleCloseChart} fullWidth maxWidth="xl"> {/* Tamanho máximo do dialog */}
            <DialogTitle sx={{ textAlign: 'center' }}>Gráfico de Desempenho</DialogTitle>
            <DialogContent 
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }} 
            >
                <LineChart width={1200} height={800} data={getFilteredLineData()}> 
                    <XAxis dataKey="simulado"  tickFormatter={(value, index) => index + 1}  /> 
                    <YAxis />
                    <Tooltip />
                    <Legend align="right" verticalAlign="top" />
                    <Line type="monotone" dataKey="Nota" stroke="#8884d8" />
                </LineChart>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <Button onClick={handleCloseChart} color="primary">
                    Fechar
                </Button>
            </DialogActions>
        </Dialog>
                </>
            )}
        </>
    );
}

export default MonitoramentoNotas;