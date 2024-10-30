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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Button,
    Box,
} from '@mui/material';
import HeaderProfessor from './HeaderProfessor';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts'; // Importa os componentes do Recharts

function MonitoramentoNotasProfessor() {
    const { cpf } = useParams(); // Obtém o CPF do aluno a partir da URL
    const [aluno, setAluno] = useState(null); // Estado para armazenar os dados do aluno
    const [error, setError] = useState(null); // Estado para armazenar mensagens de erro
    const [openFilterDialog, setOpenFilterDialog] = useState(false); // Estado para controle do diálogo de filtro
    const [filterAvaliacao, setFilterAvaliacao] = useState(''); // Estado para filtro de avaliações
    const [filteredNotas, setFilteredNotas] = useState(null); // Estado para armazenar notas filtradas
    const [openDialog, setOpenDialog] = useState(false); // Estado para controle de um diálogo adicional
    const [openChartDialog, setOpenChartDialog] = useState(false); // Estado para controle do diálogo do gráfico
    const [chartData, setChartData] = useState([]); // Estado para armazenar os dados do gráfico
    const [minNota, setMinNota] = useState(''); // Estado para filtro de nota mínima
    const [maxNota, setMaxNota] = useState(''); // Estado para filtro de nota máxima
    const [loading, setLoading] = useState(true); // Estado para controle de carregamento
    const cookies = new Cookies(); // Instância de Cookies para gerenciar cookies
    const token = cookies.get('token'); // Obtém o token de autenticação

    // Função para buscar os dados do aluno do servidor
    const fetchAluno = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/alunos/get/${cpf}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Adiciona o token no cabeçalho
                },
            });

            if (!response.ok) {
                throw new Error('Falha ao buscar aluno'); // Lança erro se a resposta não for bem-sucedida
            }

            const data = await response.json(); // Converte a resposta para JSON
            setAluno(data); // Atualiza o estado com os dados do aluno
            setFilteredNotas(Object.entries(data.notas).sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))); // Armazena notas filtradas e ordenadas
            setLoading(false); // Atualiza o estado de carregamento
        } catch (error) {
            console.error('Erro ao buscar aluno:', error); // Loga erro no console
            setError(error.message); // Atualiza o estado de erro
            setLoading(false); // Atualiza o estado de carregamento
        }
    };

    // Função para preparar os dados para o gráfico
    const getFilteredLineData = () => {
        return Object.entries(aluno.notas).map(([simulado, nota]) => ({
            simulado,
            Nota: parseFloat(nota), // Converte as notas para número
        }));
    };

    // Função para abrir o diálogo do gráfico
    const handleOpenChart = () => {
        setChartData(getFilteredLineData()); // Define os dados do gráfico
        setOpenChartDialog(true); // Abre o diálogo do gráfico
    };

    // Função para fechar o diálogo do gráfico
    const handleCloseChart = () => setOpenChartDialog(false);

    // Função para abrir o diálogo de filtro
    const handleOpenFilter = () => {
        setOpenFilterDialog(true); // Abre o diálogo de filtro
    };

    // Função para fechar o diálogo de filtro
    const handleCloseFilter = () => {
        setOpenFilterDialog(false); // Fecha o diálogo de filtro
    };

    // Função para determinar o estilo da célula de nota com base no valor da nota
    const getNotaStyle = (notaValue) => {
        if (notaValue < 5) {
            return { backgroundColor: '#ff5252', color: 'black' }; // Vermelho para notas abaixo de 5
        } else if (notaValue >= 5 && notaValue < 7) {
            return { backgroundColor: '#ffd54f', color: 'black' }; // Amarelo para notas entre 5 e 7
        } else {
            return { backgroundColor: '#66bb6a', color: 'black' }; // Verde para notas 7 ou superiores
        }
    };

    // Função para filtrar as notas com base nos critérios definidos
    const handleFilterNotas = () => {
        const filtered = Object.entries(aluno.notas).filter(([avaliacao, nota]) => {
            const notaNum = parseFloat(nota);
            
            return (
                (filterAvaliacao === '' || avaliacao.toLowerCase().includes(filterAvaliacao.toLowerCase())) && // Filtro de avaliação
                (minNota === '' || notaNum >= parseFloat(minNota)) && // Filtro de nota mínima
                (maxNota === '' || notaNum <= parseFloat(maxNota)) // Filtro de nota máxima
            );
        });
    
        const sortedFiltered = filtered.sort((a, b) => parseFloat(b[1]) - parseFloat(a[1])); // Ordena as notas filtradas
    
        setFilteredNotas(sortedFiltered); // Atualiza as notas filtradas
        handleCloseFilter(); // Fecha o diálogo de filtro
    };

    // Função para resetar os filtros
    const handleResetFilter = () => {
        setFilterAvaliacao(''); // Limpa o filtro de avaliação
        setMinNota(''); // Limpa o filtro de nota mínima
        setMaxNota(''); // Limpa o filtro de nota máxima
        setFilteredNotas(Object.entries(aluno.notas).sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))); // Restaura notas originais
    };

    // Hook que busca os dados do aluno ao montar o componente
    useEffect(() => {
        fetchAluno(); // Chama a função para buscar o aluno
    }, [token, cpf]); // Dependências: reexecuta se o token ou CPF mudar

    return (
        <>
            <HeaderProfessor />
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
                    onClick={() => window.location.href = '/home'}
                />
                {aluno ? (
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{aluno.nome}</Typography>
                ) : (
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Carregando...</Typography> 
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
                                    <TableCell align="right" sx={{ paddingRight: '20%' }}>
                                        <Typography variant="h5" sx={{ fontWeight: 600 }}>Nota</Typography>
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
                            Ver Gráfico
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
                            }}                        >
                            Filtrar dados
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

export default MonitoramentoNotasProfessor;
