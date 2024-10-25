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
    const [newNota, setNewNota] = useState({ avaliacao: '', nota: '' }); 
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

    const handleEditToggle = () => {
        setEditing(!editing);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setAluno((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSave = () => {
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

    const handleAddNota = () => {
        fetch(`http://127.0.0.1:8000/alunos/addNota/${cpf}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ avaliacao: newNota.avaliacao, nota: newNota.nota }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Falha ao adicionar a nota');
                }
                fetchAluno();
                return response.json();
            })
            .catch((error) => {
                console.error('Erro ao adicionar nota:', error);
                setError(error.message);
            });
    };

    const handleRemoveNota = (avaliacao) => {
        fetch(`http://127.0.0.1:8000/alunos/removeNota/${cpf}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ avaliacao }), 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao deletar a nota');
            }
            return response.json(); 
        })
        .then(() => {
            fetchAluno(); 
        })
        .catch(error => {
            console.error('Erro ao deletar a nota:', error);
            setError(error.message);
        });
    };
    

    useEffect(() => {
        fetchAluno();
    }, [token, cpf]);

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
                                            <TableCell>Ações</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                    {aluno.notas && Object.entries(aluno.notas).map(([avaliacao, nota]) => (
                                        <TableRow key={avaliacao}>
                                            <TableCell>{avaliacao}</TableCell>
                                            <TableCell>{nota}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => handleRemoveNota(avaliacao)}
                                                >
                                                    Remover
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>

                                </Table>
                            </TableContainer>

                            <Box mt={3}>
                                <Typography variant="h6" gutterBottom>
                                    Adicionar Nova Nota
                                </Typography>
                                <TextField
                                    label="Avaliação"
                                    value={newNota.avaliacao}
                                    name="avaliacao"
                                    onChange={(e) => setNewNota({ ...newNota, avaliacao: e.target.value })}
                                    fullWidth
                                />
                                <TextField
                                    label="Nota"
                                    value={newNota.nota}
                                    name="nota"
                                    onChange={(e) => setNewNota({ ...newNota, nota: e.target.value })}
                                    fullWidth
                                    style={{ marginTop: '16px' }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAddNota}
                                    style={{ marginTop: '16px' }}
                                >
                                    Adicionar Nota
                                </Button>
                            </Box>
                        </Box>
                    </>
                )}
            </div>
        </>
    );
}

export default DetalhesAluno;
