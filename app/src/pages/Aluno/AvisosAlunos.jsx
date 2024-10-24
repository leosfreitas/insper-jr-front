import React, { useEffect, useState } from 'react';
import HeaderAluno from './HeaderAluno';
import './static/AvisosAluno.css';
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
import Cookies from 'universal-cookie';

function AvisosAluno() {
    const [avisos, setAvisos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const cookies = new Cookies();
    const token = cookies.get('token');

    useEffect(() => {
        const fetchAvisos = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/aviso/get`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    throw new Error('Falha ao buscar avisos');
                }

                const data = await response.json();
                console.log('Avisos:', JSON.stringify(data, null, 2)); 
                setAvisos(data.avisos);  
            } catch (error) {
                console.error('Erro ao buscar avisos:', error); 
                setError(error.message); 
            } finally {
                setLoading(false);
            }
        };

        fetchAvisos();
    }, [token]);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <>
            <HeaderAluno />
            <div className='home-aluno'>
                {error && <Alert severity="error">{error}</Alert>}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Título</TableCell>
                                <TableCell>Autor</TableCell>
                                <TableCell>Mensagem</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {avisos.map((aviso) => (
                                <TableRow key={aviso._id}>
                                    <TableCell>{aviso.titulo}</TableCell>
                                    <TableCell>{aviso.autor}</TableCell>
                                    <TableCell>{aviso.mensagem}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </>
    );
}

export default AvisosAluno;
