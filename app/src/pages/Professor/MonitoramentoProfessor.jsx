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
    Button
} from '@mui/material';
import HeaderProfessor from './HeaderProfessor';

function MonitoramentoProfessor() {
    const [alunos, setAlunos] = useState([]); 
    const [error, setError] = useState(null); 
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
            setAlunos(data.alunos || []);  
        })
        .catch(error => {
            setError(error.message);
        });
    };

    const handleViewNotas = (cpf) => {
        navigate(`/monitoramento/notas/${cpf}`);
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
                                <TableCell> 
                                    <Typography variant="h5">Ações</Typography>
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
                                    <TableCell> 
                                        <Box> 
                                            <Button 
                                                variant="contained" 
                                                color="primary" 
                                                onClick={() => handleViewNotas(aluno.cpf)} 
                                                sx={{ marginRight: '10px', backgroundColor: '#015495'}} 
                                            >
                                                Visualizar Notas
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : null
                        ))}
                    </TableBody>
                    </Table>
                </TableContainer>
            )}
        </>
    );
}

export default MonitoramentoProfessor;
