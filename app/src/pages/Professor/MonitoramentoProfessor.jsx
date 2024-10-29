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
    const [alunos, setAlunos] = useState([]); 
    const [error, setError] = useState(null); 
    const [openFilterDialog, setOpenFilterDialog] = useState(false);
    const [filterNome, setFilterNome] = useState('');
    const [filterSala, setFilterSala] = useState('Todas');
    const [originalAlunos, setOriginalAlunos] = useState([]);
    const cookies = new Cookies();
    const token = cookies.get('token'); 
    const navigate = useNavigate();

    const fetchAlunos = () => {
        fetch('http://127.0.0.1:8000/alunos/get', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao buscar alunos');
            }
            return response.json();
        })
        .then(data => {
            setOriginalAlunos(data.alunos || []);
            setAlunos(data.alunos || []);  
        })
        .catch(error => {
            setError(error.message);
        });
    };

    const handleViewNotas = (cpf) => {
        navigate(`/monitoramento/notas/${cpf}`);
    };

    const handleFilterOpen = () => {
        setOpenFilterDialog(true);
    };

    const handleFilterClose = () => {
        setOpenFilterDialog(false);
    };

    const handleFilterUsers = () => {
        const filteredAlunos = originalAlunos.filter(alunos => {
            return (
                (filterNome === '' || alunos.nome.toLowerCase().includes(filterNome.toLowerCase())) &&
                (filterSala === 'Todas' || alunos.sala === filterSala)
            );
        });

        setAlunos(filteredAlunos); 
        handleFilterClose(); 
    };

    const handleResetFilter = () => {
        setAlunos(originalAlunos);
        setFilterNome('');
        setFilterSala('Todas');
    };


    useEffect(() => {
        fetchAlunos();
    }, [token]);

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
                <Typography variant="h4">Alunos</Typography>
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
                                    <Typography variant="h5">Nome</Typography>
                                </TableCell>
                                <TableCell align="right" sx={{ paddingRight: '5%' }}>
                                    <Typography variant="h5">Notas</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {alunos && alunos.map((aluno) => (
                            aluno ? (
                                <TableRow key={aluno.cpf}>
                                    <TableCell>
                                        <Typography variant="h6">{aluno.nome}</Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{ paddingRight: '4%' }}> 
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
                        variant="contained" 
                        color="primary" 
                        onClick={handleFilterClose}
                        sx={{ marginRight: '10px', backgroundColor: '#015495', marginBottom: '10px'}} 
                        >
                        Cancelar
                    </Button>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleFilterUsers}
                        sx={{ marginRight: '10px', backgroundColor: '#015495', marginBottom: '10px'}} 
                        >
                        Filtrar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default MonitoramentoProfessor;
