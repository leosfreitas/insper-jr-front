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
    Button,
    TextField,
    Select,
    MenuItem,
} from '@mui/material';
import HeaderGestao from './HeaderGestao';
import './static/MonitoramentoAluno.css';

function DetalhesAluno() {
    const { cpf } = useParams();
    const [aluno, setAluno] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const cookies = new Cookies();
    const token = cookies.get('token');

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/alunos/get/${cpf}`, {
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

    const handleEditToggle = () => {
        setEditing(!editing);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setAluno((prevState) => ({ ...prevState, [name]: value }));
    };
    

    const handleSave = () => {
        console.log(aluno);
        fetch(`http://127.0.0.1:8000/alunos/update/${aluno.cpf}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(aluno),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Falha ao salvar alterações');
                }
                return response.json();
            })
            .then(() => {
                setEditing(false); 
            })
            .catch((error) => {
                console.error('Erro ao salvar alterações:', error);
                setError(error.message);
            });
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <>
            <HeaderGestao />
            <div className='monitoramento-aluno-gestao'>
                <Typography variant="h4" gutterBottom>
                    Detalhes do Aluno
                </Typography>
                {aluno && (
                    <>
                        <TextField
                            label="Nome"
                            value={aluno.nome}
                            name="nome"
                            onChange={handleChange}
                            disabled={!editing}
                            fullWidth
                        />
                        <TextField
                            label="CPF"
                            value={aluno.cpf}
                            name="cpf"
                            disabled 
                            fullWidth
                            style={{ marginTop: '16px' }}
                        />
                        <TextField
                            label="Email"
                            value={aluno.email}
                            name="email"
                            onChange={handleChange}
                            disabled={!editing}
                            fullWidth
                            style={{ marginTop: '16px' }}
                        />
                        <Select
                            label="Sala"
                            value={aluno.sala}
                            name="sala"
                            onChange={handleChange}
                            disabled={!editing}
                            fullWidth
                            style={{ marginTop: '16px' }}
                        >
                            <MenuItem value="Online">Online</MenuItem>
                            <MenuItem value="Presencial">Presencial</MenuItem>
                        </Select>
                        {error && (
                            <Typography variant="h6" color="error">
                                {error}
                            </Typography>
                        )}
                        <Box mt={3}>
                            <Button variant="contained" onClick={handleEditToggle}>
                                {editing ? 'Cancelar' : 'Editar'}
                            </Button>
                            {editing && (
                                <Button variant="contained" color="primary" onClick={handleSave} style={{ marginLeft: '16px' }}>
                                    Salvar
                                </Button>
                            )}
                        </Box>
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
            </div>
        </>
    );
}

export default DetalhesAluno;
