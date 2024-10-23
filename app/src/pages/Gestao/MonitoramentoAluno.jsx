import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import {
    Typography,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
} from '@mui/material';
import HeaderGestao from './HeaderGestao';

function DetalhesAluno() {
    const { cpf } = useParams();
    const [aluno, setAluno] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const cookies = new Cookies();
    const token = cookies.get('token');

    useEffect(() => {
        fetch(`http://localhost:5000/aluno/${cpf}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Falha ao buscar aluno');
                }
                return response.json();
            })
            .then((data) => {
                setAluno(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Erro ao buscar aluno:', error);
                setError(error.message);
                setLoading(false);
            });
    }, [token, cpf]);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <>
            <HeaderGestao />
            <div className='home-gestao'>
                <Typography variant="h4" gutterBottom>
                    Detalhes do Aluno
                </Typography>
                {aluno && (
                    <>
                        <Typography variant="h6">Nome: {aluno.nome}</Typography>
                        <Typography variant="h6">CPF: {aluno.cpf}</Typography>
                        <Box mt={3}>
                            <Typography variant="h5" gutterBottom>
                                Notas do Aluno
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Avaliação</TableCell>
                                            <TableCell>Nota</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.entries(aluno.notas).map(([avaliacao, nota]) => (
                                            <TableRow key={avaliacao}>
                                                <TableCell>{avaliacao}</TableCell>
                                                <TableCell>{nota}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </>
                )}
                {error && (
                    <Typography variant="h6" color="error">
                        {error}
                    </Typography>
                )}
            </div>
        </>
    );
}

export default DetalhesAluno;
