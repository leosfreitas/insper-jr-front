import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderGestao from './HeaderGestao';
import Cookies from 'universal-cookie';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button,
    Box 
} from '@mui/material';

function MonitoramentoGestao() {
    const [alunos, setAlunos] = useState([]); 
    const [error, setError] = useState(null); 
    const cookies = new Cookies();
    const token = cookies.get('token'); 
    const navigate = useNavigate();

    useEffect(() => {
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
            setAlunos(data.alunos);  
        })
        .catch(error => {
            setError(error.message); 
        });
    }, [token]);

    const handleViewEditar = (cpf) => {
        navigate(`/monitoramento/editar/${cpf}`); 
    };

    const handleViewNotas = (cpf) => {
        navigate(`/monitoramento/notas/${cpf}`);
    };

    const handleAddAluno = () => {
        navigate('/monitoramento/adicionar'); 
    };

    const handleDeleteAluno = (cpf) => {
        if (window.confirm("Tem certeza que deseja deletar este aluno?")) {
            fetch(`http://127.0.0.1:8000/alunos/delete/${cpf}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao deletar o aluno');
                }
                setAlunos(alunos.filter(aluno => aluno.cpf !== cpf));
            })
            .catch(error => {
                setError(error.message); 
            });
        }
    };

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
                <Typography variant="h4">Alunos</Typography>
            </Box>
            {error ? (
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            ) : (
                <>
                    <TableContainer component={Paper} sx={{ backgroundColor: '#f2f2f2' }}> 
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="h5">Nome</Typography>
                                </TableCell>
                                <TableCell align='right' sx={{paddingRight: '7.5%'}}> 
                                    <Typography variant="h5">Ações</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {alunos.map((aluno) => (
                                <TableRow key={aluno.cpf}>
                                    <TableCell>
                                        <Typography variant="h5">{aluno.nome}</Typography>
                                    </TableCell>
                                    <TableCell align="right"> 
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}> 
                                            <Button 
                                                variant="contained" 
                                                color="primary" 
                                                onClick={() => handleViewEditar(aluno.cpf)} 
                                                sx={{ marginRight: '10px', backgroundColor: '#015495'}} 
                                            >
                                                Editar
                                            </Button>
                                            <Button 
                                                variant="contained" 
                                                color="primary" 
                                                onClick={() => handleViewNotas(aluno.cpf)} 
                                                sx={{ marginRight: '10px', backgroundColor: '#015495'}} 
                                            >
                                                Notas
                                            </Button>
                                            <Button 
                                                variant="contained" 
                                                color="secondary" 
                                                onClick={() => handleDeleteAluno(aluno.cpf)}
                                                sx={{ backgroundColor: '#ab2325', '&:hover': { backgroundColor: '#b71c1c' } }} 
                                            >
                                                Remover
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box 
                    mt={3} 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        maxWidth: '25%', 
                        marginTop: '50px !important',
                        margin: '0 auto', 
                        }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddAluno} 
                        sx={{ backgroundColor: '#015495'}}
                    >
                        Adicionar Aluno
                    </Button>
                </Box>
                </>
            )}
        </>
    );
}

export default MonitoramentoGestao;
