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
    Box
} from '@mui/material';
import HeaderProfessor from './HeaderProfessor';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function MonitoramentoNotasProfessor() {
    const { cpf } = useParams();
    const [aluno, setAluno] = useState(null);
    const [error, setError] = useState(null);
    const [openFilterDialog, setOpenFilterDialog] = useState(false);
    const [filterAvaliacao, setFilterAvaliacao] = useState('');
    const [filteredNotas, setFilteredNotas] = useState(null);
    const [minNota, setMinNota] = useState('');
    const [maxNota, setMaxNota] = useState('');
    const [loading, setLoading] = useState(true);
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

    const handleOpenFilter = () => {
        setOpenFilterDialog(true);
    };

    const handleCloseFilter = () => {
        setOpenFilterDialog(false);
    };

    const getNotaStyle = (notaValue) => {
        if (notaValue < 5) {
            return { backgroundColor: '#ff5252', color: 'black' };
        } else if (notaValue >= 5 && notaValue < 7) {
            return { backgroundColor: '#ffd54f', color: 'black' };
        } else {
            return { backgroundColor: '#66bb6a', color: 'black' };
        }
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

    const handleResetFilter = () => {
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
                    <Typography variant="h4">{aluno.nome}</Typography>
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
                                        <Typography variant="h5">Avaliação</Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{ paddingRight: '20%' }}>
                                        <Typography variant="h5">Nota</Typography>
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
                                variant="contained" 
                                color="primary" 
                                onClick={handleCloseFilter}
                                sx={{ marginRight: '10px', backgroundColor: '#015495', marginBottom: '10px'}}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={handleFilterNotas}
                                sx={{ marginRight: '10px', backgroundColor: '#015495', marginBottom: '10px'}} 
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

export default MonitoramentoNotasProfessor;
