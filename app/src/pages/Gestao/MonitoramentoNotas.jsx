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
} from '@mui/material';
import HeaderGestao from './HeaderGestao';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';

function MonitoramentoNotas() {
    const { cpf } = useParams();
    const [aluno, setAluno] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newNota, setNewNota] = useState({ avaliacao: '', nota: '' });
    const [showForm, setShowForm] = useState(false); // Estado para controlar a exibição do formulário
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
            setLoading(false);
        } catch (error) {
            console.error('Erro ao buscar aluno:', error);
            setError(error.message);
            setLoading(false);
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
                setShowForm(false); // Ocultar o formulário após adicionar a nota
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
                <AddIcon
                    style={{ fontSize: '40px', position: 'absolute', right: '20px', cursor: 'pointer' }}
                    onClick={() => setShowForm(!showForm)} 
                />
                {aluno ? (
                <Typography variant="h4">{aluno.nome}</Typography>
                ) : (
                    <Typography variant="h4">Carregando...</Typography> 
                )}
            </Box>
                {aluno && (
                    <>
                        <Box mt={3}>
                            <TableContainer component={Paper} sx={{ backgroundColor: '#f2f2f2' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                        <TableCell>
                                            <Typography variant="h6">
                                                Avaliação
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="h6">
                                                Nota
                                            </Typography>
                                        </TableCell>
                                        <TableCell align='right' sx={{paddingRight: '3%'}}>
                                            <Typography variant="h6">
                                                Ações
                                            </Typography>
                                        </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {aluno.notas && Object.entries(aluno.notas).map(([avaliacao, nota]) => (
                                        <TableRow key={avaliacao}>
                                            <TableCell>
                                                <Typography variant="h5">{avaliacao}</Typography>
                                            </TableCell>
                                            <TableCell >
                                                <Typography variant="h5">{nota}</Typography>
                                            </TableCell>
                                            <TableCell align='right'>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    sx={{ backgroundColor: '#ab2325', '&:hover': { backgroundColor: '#b71c1c' } }} 
                                                    onClick={() => handleRemoveNota(avaliacao)}
                                                >
                                                    Remover
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                </Table>
                            </TableContainer>

                            {showForm && ( 
                                <Box 
                                    mt={3} 
                                    sx={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'center', 
                                        maxWidth: '25%', 
                                        marginTop: '16px !important',
                                        margin: '0 auto', 
                                    }}
                                >
                                    <Typography variant="h6" gutterBottom>
                                        Adicionar Nova Nota
                                    </Typography>
                                    <TextField
                                        label="Avaliação"
                                        value={newNota.avaliacao}
                                        name="avaliacao"
                                        onChange={(e) => setNewNota({ ...newNota, avaliacao: e.target.value })}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Nota"
                                        value={newNota.nota}
                                        name="nota"
                                        onChange={(e) => setNewNota({ ...newNota, nota: e.target.value })}
                                        fullWidth
                                        sx={{ marginTop: '16px' }} 
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleAddNota}
                                        sx={{ marginTop: '16px', backgroundColor: '#015495' }} 
                                    >
                                        Adicionar Nota
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </>
                )}
        </>
    );
}

export default MonitoramentoNotas;
