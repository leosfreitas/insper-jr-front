import React, { useEffect, useState } from 'react';
import HeaderAluno from './HeaderAluno';
import './static/HomeAluno.css';
import Cookies from 'universal-cookie';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Typography,
    Alert,
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
            <div className='home-aluno'>
                <Typography variant="h4" gutterBottom>
                    Suas notas
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}

                {Object.keys(notas).length === 0 ? (
                    <Typography variant="h6">Nenhuma nota encontrada.</Typography>
                ) : (
                    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Avaliação</TableCell>
                                    <TableCell>Nota</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.entries(notas).map(([avaliacao, nota]) => {
                                    const notaRender = typeof nota === 'object' ? JSON.stringify(nota) : nota;

                                    return (
                                        <TableRow key={avaliacao}>
                                            <TableCell>{avaliacao}</TableCell>
                                            <TableCell>{notaRender}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>
        </>
    );
}

export default NotasAluno;
