import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import {
    Typography,
    TextField,
    Select,
    MenuItem,
    Button,
    Box,
    CircularProgress,
} from '@mui/material';
import HeaderGestao from './HeaderGestao';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const MonitoramentoEditar = () => {
    const { cpf } = useParams();
    const cookies = new Cookies();
    const token = cookies.get('token');
    
    const [aluno, setAluno] = useState(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
        } catch (error) {
            console.error('Erro ao buscar aluno:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditToggle = () => {
        setEditing((prev) => !prev);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setAluno((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/alunos/update/${aluno.cpf}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(aluno),
            });
    
            if (!response.ok) {
                throw new Error('Falha ao salvar alterações');
            }
    
            setEditing(false);
        } catch (error) {
            console.error('Erro ao salvar alterações:', error);
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchAluno();
    }, [token, cpf]);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <>
            <HeaderGestao />
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
                onClick={() => window.location.href = '/monitoramento'}
            />                
            <Typography variant="h4">Editar Aluno</Typography>
            </Box>
            <div className='monitoramento-editar'>
                {error && (
                    <Typography variant="h6" color="error">
                        {error}
                    </Typography>
                )}
                {aluno && (
                    <>
                        <Box 
                            mt={3} 
                            sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                maxWidth: '25%', 
                                marginTop: '50px !important',
                                margin: '0 auto', 
                                }}
                        >
                            <TextField
                                label="Nome"
                                value={aluno.nome}
                                name="nome"
                                onChange={handleChange}
                                disabled={!editing}
                                fullWidth
                                style={{ marginBottom: '16px' }}
                            />
                            <TextField
                                label="CPF"
                                value={aluno.cpf}
                                name="cpf"
                                disabled
                                fullWidth
                                style={{ marginBottom: '16px' }}
                            />
                            <TextField
                                label="Email"
                                value={aluno.email}
                                name="email"
                                onChange={handleChange}
                                disabled={!editing}
                                fullWidth
                                style={{ marginBottom: '16px' }}
                            />
                            <Select
                                label="Sala"
                                value={aluno.sala}
                                name="sala"
                                onChange={handleChange}
                                disabled={!editing}
                                fullWidth
                                style={{ marginBottom: '16px' }}
                            >
                                <MenuItem value="Online">Online</MenuItem>
                                <MenuItem value="Presencial">Presencial</MenuItem>
                            </Select>
                            <Box mt={3}>
                                <Button variant="contained" onClick={handleEditToggle} style={{ marginLeft: '16px', backgroundColor: '#015495'}}>
                                    {editing ? 'Cancelar' : 'Editar'}
                                </Button>
                                {editing && (
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={handleSave} 
                                        style={{ marginLeft: '16px', backgroundColor: '#015495'}}
                                    >
                                        Salvar
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </>
                )}
            </div>
        </>
    );
};

export default MonitoramentoEditar;
