import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderGestao from './HeaderGestao';
import './static/MonitoramentoGestao.css';
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

    const handleViewDetails = (cpf) => {
        navigate(`/monitoramento/${cpf}`); 
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
            <div className='home-gestao'>
                {error ? (
                    <Typography variant="h6" color="error">
                        {error}
                    </Typography>
                ) : (
                    <>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Nome</strong></TableCell>
                                        <TableCell><strong>Email</strong></TableCell>
                                        <TableCell><strong>Ações</strong></TableCell> 
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {alunos.map((aluno) => (
                                        <TableRow key={aluno.cpf}>
                                            <TableCell>{aluno.nome}</TableCell>
                                            <TableCell>{aluno.email}</TableCell>
                                            <TableCell>
                                                <Button 
                                                    variant="contained" 
                                                    color="primary" 
                                                    onClick={() => handleViewDetails(aluno.cpf)} 
                                                    style={{ marginRight: '10px' }}
                                                >
                                                    Ver Informações
                                                </Button>
                                                <Button 
                                                    variant="contained" 
                                                    color="secondary" 
                                                    onClick={() => handleDeleteAluno(aluno.cpf)}
                                                >
                                                    Deletar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box mt={3} display="flex" justifyContent="flex-end">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddAluno} 
                            >
                                Adicionar Aluno
                            </Button>
                        </Box>
                    </>
                )}
            </div>
        </>
    );
}

export default MonitoramentoGestao;
