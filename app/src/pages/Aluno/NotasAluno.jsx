import React, { useEffect, useState } from 'react';
import HeaderAluno from './HeaderAluno';
import './static/NotasAluno.css';
import Cookies from 'universal-cookie';
import {
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
        <div className='notas-container'>
            <HeaderAluno />
            <div className='back-nota-aluno'>
                <div className='provas-write'>
                    <h1>Provas</h1>
                </div>
                <div className='notas-write'>
                    <h1>Notas</h1>
                </div>
            </div>

            {error && <Alert severity="error">{error}</Alert>}

            {Object.keys(notas).length === 0 ? (
                <Typography variant="h6">Nenhuma nota encontrada.</Typography>
            ) : (
                <div className='notas-list'>
                    {Object.entries(notas).map(([avaliacao, nota]) => {
                        const notaRender = typeof nota === 'object' ? JSON.stringify(nota) : nota;
                        return (
                            <div key={avaliacao} className='avaliacao-nota'>
                                <div className='avaliacao'>
                                    <h2>{avaliacao}</h2>
                                </div>
                                <div className='nota'>
                                    <h2>{notaRender}</h2>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default NotasAluno;
