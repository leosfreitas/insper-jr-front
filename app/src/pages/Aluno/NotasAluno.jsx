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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

function NotasAluno() {
    // Estados do componente
    const [notas, setNotas] = useState({}); // Armazena as notas do aluno
    const [error, setError] = useState(null); // Armazena mensagens de erro, se houver
    const [loading, setLoading] = useState(true); // Indica se os dados estão sendo carregados
    const [showChart, setShowChart] = useState(false); // Controle de exibição do gráfico
    const [snackbarOpen, setSnackbarOpen] = useState(false); // Controle do Snackbar para mensagens
    const [openFilterDialog, setOpenFilterDialog] = useState(false); // Controle do diálogo de filtro
    const [openChartDialog, setOpenChartDialog] = useState(false); // Controle do diálogo do gráfico
    const [filteredNotas, setFilteredNotas] = useState([]); // Armazena as notas filtradas
    const [filterAvaliacao, setFilterAvaliacao] = useState(''); // Estado para filtro de avaliação
    const [minNota, setMinNota] = useState(''); // Estado para nota mínima no filtro
    const [maxNota, setMaxNota] = useState(''); // Estado para nota máxima no filtro
    const cookies = new Cookies(); // Instância de Cookies para manipulação de cookies
    const token = cookies.get('token'); // Obtém o token de autenticação dos cookies

    // Efeito para buscar notas do aluno ao montar o componente
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/alunos/getNotas`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Adiciona o token ao cabeçalho
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Falha ao buscar notas do aluno'); // Lança erro se a resposta não for ok
                }
                return response.json();
            })
            .then((data) => {
                setNotas(data); // Atualiza as notas com os dados recebidos
                setFilteredNotas(Object.entries(data).sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))); // Filtra e ordena as notas
                setLoading(false); // Atualiza o estado de loading
            })
            .catch((error) => {
                setError(error.message); // Armazena mensagem de erro
                setLoading(false); // Atualiza o estado de loading
            });
    }, [token]); // Dependência: token

    // Renderiza um indicador de carregamento se as notas estiverem sendo carregadas
    if (loading) {
        return <CircularProgress />;
    }

    // Função para determinar o estilo da célula da nota com base no valor da nota
    const getNotaStyle = (notaValue) => {
        if (notaValue < 5) {
            return { backgroundColor: '#ff5252', color: 'black' }; // Vermelho para notas abaixo de 5
        } else if (notaValue >= 5 && notaValue < 7) {
            return { backgroundColor: '#ffd54f', color: 'black' }; // Amarelo para notas entre 5 e 7
        } else {
            return { backgroundColor: '#66bb6a', color: 'black' }; // Verde para notas 7 ou acima
        }
    };

    // Formata os dados filtrados para o gráfico
    const getFilteredLineData = () => {
        return filteredNotas.map(([avaliacao, nota]) => ({
            simulado: avaliacao,
            Nota: parseFloat(nota) || 0,
        }));
    };

    // Abre o diálogo do gráfico e o snackbar
    const handleButtonClick = () => {
        setOpenChartDialog(true); // Abre o diálogo do gráfico
        setSnackbarOpen(true); // Abre o snackbar
    };

    // Abre o diálogo de filtro
    const handleOpenFilter = () => {
        setOpenFilterDialog(true);
    };

    // Fecha o diálogo de filtro
    const handleCloseFilter = () => {
        setOpenFilterDialog(false);
    };

    // Fecha o diálogo do gráfico
    const handleCloseChart = () => {
        setOpenChartDialog(false);
    };

    // Filtra as notas com base nos critérios definidos pelo usuário
    const handleFilterNotas = () => {
        const filtered = Object.entries(notas)
            .filter(([avaliacao, nota]) => {
                const notaNum = parseFloat(nota);
                return (
                    (filterAvaliacao === '' || avaliacao.toLowerCase().includes(filterAvaliacao.toLowerCase())) && // Filtro de avaliação
                    (minNota === '' || notaNum >= parseFloat(minNota)) && // Filtro de nota mínima
                    (maxNota === '' || notaNum <= parseFloat(maxNota)) // Filtro de nota máxima
                );
            })
            .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1])); // Ordena as notas filtradas
    
        setFilteredNotas(filtered); // Atualiza as notas filtradas
        handleCloseFilter(); // Fecha o diálogo de filtro
    };

    // Reseta os filtros aplicados
    const handleResetFilter = () => {
        setFilterAvaliacao(''); // Reseta filtro de avaliação
        setMinNota(''); // Reseta filtro de nota mínima
        setMaxNota(''); // Reseta filtro de nota máxima
        setFilteredNotas(Object.entries(notas).sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))); // Reseta as notas filtradas
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

