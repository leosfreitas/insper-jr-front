import React, { useState } from 'react';
import { TextField, Button, MenuItem, Typography, Box } from '@mui/material';
import HeaderGestao from './HeaderGestao';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const MonitoramentoAdicionar = () => {
    const [nome, setNome] = useState('');
    const [password, setPassword] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [sala, setSala] = useState('Presencial'); 
    const [error, setError] = useState(null);
    const cookies = new Cookies();
    const token = cookies.get('token');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault(); 

        const alunoData = {
            nome,
            password,
            cpf,
            email,
            sala
        };

        fetch('http://127.0.0.1:8000/alunos/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(alunoData),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Falha ao adicionar aluno');
            }
            return response.json();
        })
        .then((data) => {
            console.log('Aluno criado com sucesso:', data);
            navigate('/monitoramento'); 
        })
        .catch((error) => {
            console.error('Erro ao adicionar aluno:', error);
            setError(error.message);
        });
    };

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
                <Typography variant="h4">Adicionar Aluno</Typography>
            </Box>
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
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="CPF"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        select
                        label="Tipo de Sala"
                        value={sala}
                        onChange={(e) => setSala(e.target.value)}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="Online">Online</MenuItem>
                        <MenuItem value="Presencial">Presencial</MenuItem>
                    </TextField>
                    <TextField
                        label="Senha"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        fullWidth
                        margin="normal"
                    />
                    {error && (
                        <Typography variant="h6" color="error">
                            {error}
                        </Typography>
                    )}
                    <Button sx={{backgroundColor: '#015495', marginTop: '16px'}}
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        fullWidth
                        >
                        Enviar
                    </Button>
                </form>
            </Box>
        </>
    );
};

export default MonitoramentoAdicionar;
