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
    Box
} from '@mui/material';
import HeaderProfessor from './HeaderProfessor';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';

function MonitoramentoNotasProfessor() {
    const { cpf } = useParams();
    const [aluno, setAluno] = useState(null);
    const [error, setError] = useState(null);
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
            setLoading(false);
        } catch (error) {
            console.error('Erro ao buscar aluno:', error);
            setError(error.message);
            setLoading(false);
        }
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
                                    <TableCell>
                                        <Typography variant="h5">Nota</Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {aluno.notas && Object.entries(aluno.notas).map(([avaliacao, nota]) => (
                                    <TableRow key={avaliacao}>
                                        <TableCell>
                                            <Typography variant="h6">{avaliacao}</Typography>
                                        </TableCell>
                                        <TableCell >
                                            <Typography variant="h6">{nota}</Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
        </>
    );
}

export default MonitoramentoNotasProfessor;
