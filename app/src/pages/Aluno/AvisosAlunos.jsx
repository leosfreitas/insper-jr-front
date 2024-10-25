import React, { useEffect, useState } from 'react';
import HeaderAluno from './HeaderAluno';
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
    const [avisosGeral, setAvisosGeral] = useState([]);
    const [avisosSala, setAvisosSala] = useState([]);
    const [sala, setSala] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const cookies = new Cookies();
    const token = cookies.get('token');

    useEffect(() => {
        const fetchAvisos = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/avisos/get`, {
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
                setAvisosGeral(data.avisosGeral);  
                setAvisosSala(data.avisosSala);    
                setSala(data.sala);               
            } catch (error) {
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
            <div className='home-aluno'>
                {error && <Alert severity="error">{error}</Alert>}

                <Typography variant="h6" gutterBottom>
                    Avisos Gerais:
                </Typography>
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
                            {avisosGeral.map((aviso) => (
                                <TableRow key={aviso._id}>
                                    <TableCell>{aviso.titulo}</TableCell>
                                    <TableCell>{aviso.autor}</TableCell>
                                    <TableCell>{aviso.mensagem}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                    Avisos da Sala: {sala}
                </Typography>
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
                            {avisosSala.map((aviso) => (
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
