import React, { useEffect, useState } from 'react';
import HeaderAluno from './HeaderAluno';
import Cookies from 'universal-cookie';
import {
    CircularProgress,
    Typography,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box
} from '@mui/material';

function NotasAluno() {
    const [notas, setNotas] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const cookies = new Cookies();
    const token = cookies.get('token');

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/alunos/getNotas`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Falha ao buscar notas do aluno');
                }
                return response.json();
            })
            .then((data) => {
                setNotas(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [token]);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <>
            <HeaderAluno />
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
                <Typography variant="h4">Notas do Aluno</Typography>
            </Box>

            {error ? (
                <Alert severity="error">{error}</Alert>
            ) : Object.keys(notas).length === 0 ? (
                <Typography variant="h6" sx={{ mt: 3, textAlign: 'center' }}>
                    Nenhuma nota encontrada.
                </Typography>
            ) : (
                <TableContainer component={Paper} sx={{ height: '63vh', overflowY: 'auto' }} >
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="h5">Avaliação</Typography>
                                </TableCell>
                                <TableCell align="right" sx={{ paddingRight: '5%' }}>
                                    <Typography variant="h5">Nota</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.entries(notas).map(([avaliacao, nota]) => {
                                const notaRender = typeof nota === 'object' ? JSON.stringify(nota) : nota;
                                return (
                                    <TableRow key={avaliacao}>
                                        <TableCell>
                                            <Typography variant="h6">{avaliacao}</Typography>
                                        </TableCell>
                                        <TableCell align="right"  sx={{ paddingRight: '5%' }}>
                                            <Typography variant="h6">{notaRender}</Typography>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </>
    );
}

export default NotasAluno;
