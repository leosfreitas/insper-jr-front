import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importando useNavigate para navegação
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
    Button
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

    return (
        <>
            <HeaderGestao />
            <div className='home-gestao'>
                {error ? (
                    <Typography variant="h6" color="error">
                        {error}
                    </Typography>
                ) : (
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
                                            >
                                                Ver Detalhes
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>
        </>
    );
}

export default MonitoramentoGestao;
