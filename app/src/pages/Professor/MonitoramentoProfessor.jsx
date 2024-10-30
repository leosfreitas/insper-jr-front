import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem
} from '@mui/material';
import HeaderProfessor from './HeaderProfessor';

function MonitoramentoProfessor() {
    // Estado para armazenar a lista de alunos
    const [alunos, setAlunos] = useState([]); 
    // Estado para armazenar mensagens de erro
    const [error, setError] = useState(null); 
    // Estado para controlar a abertura do diálogo de filtro
    const [openFilterDialog, setOpenFilterDialog] = useState(false);
    // Estado para armazenar o filtro de nome
    const [filterNome, setFilterNome] = useState('');
    // Estado para armazenar o filtro de sala, com valor inicial como 'Todas'
    const [filterSala, setFilterSala] = useState('Todas');
    // Estado para armazenar a lista original de alunos
    const [originalAlunos, setOriginalAlunos] = useState([]);
    const cookies = new Cookies();
    // Obtém o token do cookie para autenticação
    const token = cookies.get('token'); 
    const navigate = useNavigate();

    // Função para buscar a lista de alunos do servidor
    const fetchAlunos = () => {
        fetch('http://127.0.0.1:8000/alunos/get', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Adiciona o token no cabeçalho
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao buscar alunos'); // Lança erro se a resposta não for bem-sucedida
            }
            return response.json(); // Converte a resposta para JSON
        })
        .then(data => {
            // Atualiza os estados com os dados retornados
            setOriginalAlunos(data.alunos || []);
            setAlunos(data.alunos || []);  
        })
        .catch(error => {
            setError(error.message); // Atualiza o estado de erro caso ocorra um problema
        });
    };

    // Função para navegar até a página de visualização de notas de um aluno específico
    const handleViewNotas = (cpf) => {
        navigate(`/monitoramento/notas/${cpf}`); // Redireciona para a rota correspondente
    };

    // Função para abrir o diálogo de filtro
    const handleFilterOpen = () => {
        setOpenFilterDialog(true); // Atualiza o estado para abrir o diálogo
    };

    // Função para fechar o diálogo de filtro
    const handleFilterClose = () => {
        setOpenFilterDialog(false); // Atualiza o estado para fechar o diálogo
    };

    // Função para aplicar os filtros na lista de alunos
    const handleFilterUsers = () => {
        const filteredAlunos = originalAlunos.filter(aluno => {
            return (
                (filterNome === '' || aluno.nome.toLowerCase().includes(filterNome.toLowerCase())) &&
                (filterSala === 'Todas' || aluno.sala === filterSala) // Aplica os filtros de nome e sala
            );
        });

        setAlunos(filteredAlunos); // Atualiza a lista de alunos filtrados
        handleFilterClose(); // Fecha o diálogo após aplicar o filtro
    };

    // Função para resetar os filtros e restaurar a lista original de alunos
    const handleResetFilter = () => {
        setAlunos(originalAlunos); // Restaura a lista original de alunos
        setFilterNome(''); // Limpa o filtro de nome
        setFilterSala('Todas'); // Redefine o filtro de sala para 'Todas'
    };

    // Hook que busca os alunos ao montar o componente
    useEffect(() => {
        fetchAlunos(); // Chama a função para buscar alunos
    }, [token]); // Dependência: reexecuta se o token mudar


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
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Alunos</Typography>
            </Box>
            {error ? (
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            ) : (
                <TableContainer component={Paper} sx={{ height: '50vh', overflowY: 'auto' }}> 
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="h5" sx={{ fontWeight: 600 }}>Nome</Typography>
                                </TableCell>
                                <TableCell align="right" sx={{ paddingRight: '5%' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 600 }}>Notas</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {alunos && alunos.map((aluno, index) => (
                                aluno ? (
                                    <TableRow key={aluno.cpf} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#f5f5f5' }}>
                                        <TableCell>
                                            <Typography variant="h6">{aluno.nome}</Typography>
                                        </TableCell>
                                        <TableCell align="right" sx={{ paddingRight: '3.3%' }}> 
                                            <Button 
                                                variant="contained" 
                                                color="primary" 
                                                onClick={() => handleViewNotas(aluno.cpf)} 
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
                                                Visualizar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ) : null
                            ))}
                        </TableBody>

                    </Table>
                </TableContainer>
            )}
            <Box sx={{ 
                display: 'flex',
                justifyContent: 'center',
                marginTop: '5vh',
                gap: 3,
            }}>
                    <Button 
                        variant="contained" 
                        color="error" 
                        onClick={handleFilterOpen} 
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
            <Dialog open={openFilterDialog} onClose={handleFilterClose}>
                <DialogTitle>Filtrar Alunos</DialogTitle>
                <DialogContent>
                <TextField
                    label="Nome"
                    fullWidth
                    margin="normal"
                    value={filterNome}
                    onChange={(e) => setFilterNome(e.target.value)}
                />
                <TextField
                    select
                    label="Sala"
                    fullWidth
                    margin="normal"
                    value={filterSala} 
                    onChange={(e) => setFilterSala(e.target.value)} 
                >
                    <MenuItem value="Todas">Todas</MenuItem> 
                    <MenuItem value="Online">Online</MenuItem>
                    <MenuItem value="Presencial">Presencial</MenuItem>
                </TextField>
                </DialogContent>
                <DialogActions>
                    <Button 
                        color="primary" 
                        onClick={handleFilterClose}
                        >
                        Cancelar
                    </Button>
                    <Button 
                        color="primary" 
                        onClick={handleFilterUsers}
                        >
                        Filtrar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default MonitoramentoProfessor;
