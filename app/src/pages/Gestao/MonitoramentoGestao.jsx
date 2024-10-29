import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderGestao from './HeaderGestao';
import Cookies from 'universal-cookie';
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    MenuItem,
    Select,
    CircularProgress,
} from '@mui/material';

function MonitoramentoGestao() {
    const [alunos, setAlunos] = useState([]); 
    const [error, setError] = useState(null); 
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [alunoEdit, setAlunoEdit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCpf, setSelectedCpf] = useState(null);
    const [newAluno, setNewAluno] = useState({
        nome: '',
        password: '',
        cpf: '',
        email: '',
        sala: 'Presencial',
    });
    const [originalAlunos, setOriginalAlunos] = useState([]);
    const [filterNome, setFilterNome] = useState('');
    const [filterSala, setFilterSala] = useState('Todas');
    const [openFilterDialog, setOpenFilterDialog] = useState(false);

    const cookies = new Cookies();
    const token = cookies.get('token'); 
    const navigate = useNavigate();

    const fetchAlunos = () => {
        fetch('http://127.0.0.1:8000/alunos/get', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao buscar alunos');
            }
            return response.json();
        })
        .then(data => {
            setOriginalAlunos(data.alunos || []);
            setAlunos(data.alunos || []);  
        })
        .catch(error => {
            setError(error.message);
        });
    };

    const fetchAluno = async (cpf) => {
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
            setAlunoEdit(data);
        } catch (error) {
            console.error('Erro ao buscar aluno:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditSave = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/alunos/update/${alunoEdit.cpf}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(alunoEdit),
            });
    
            if (!response.ok) {
                throw new Error('Falha ao salvar alterações');
            }
            handleCloseEditDialog();
            if (response.ok) {
                fetchAlunos();
            }

        } catch (error) {
            console.error('Erro ao salvar alterações:', error);
            setError(error.message);
        }
    };

    const handleViewEditar = (cpf) => {
        setSelectedCpf(cpf);  
        setOpenEditDialog(true);
    };

    const handleViewNotas = (cpf) => {
        navigate(`/monitoramento/notas/${cpf}`);
    };

    const handleDeleteAluno = (cpf) => {
        if (window.confirm("Tem certeza que deseja deletar este aluno?")) {
            fetch(`http://127.0.0.1:8000/alunos/delete/${cpf}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao deletar o aluno');
                }
                setAlunos(alunos.filter(aluno => aluno.cpf !== cpf));
            })
            .catch(error => {
                setError(error.message); 
            });
        }
    };

    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true);
    };

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
        setNewAluno({
            nome: '',
            password: '',
            cpf: '',
            email: '',
            sala: 'Presencial',
        });
        setError(null);
    };

    const handleCloseEditDialog = () => {
        setSelectedCpf(null);
        setOpenEditDialog(false);
        setAlunoEdit(null);
        setError(null);
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setAlunoEdit((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleCreateAlunoChange = (e) => {
        const { name, value } = e.target;
        setNewAluno(prevState => ({ ...prevState, [name]: value }));
    };

    const handleCreateAlunoSubmit = () => {
        if (!newAluno || !newAluno.nome) { 
            setError("Por favor, preencha todos os campos obrigatórios.");
            return;
        }
    
        fetch('http://127.0.0.1:8000/alunos/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newAluno),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao adicionar aluno');
            }
            return response.json();
        })
        .then(data => {
            setAlunos(prevAlunos => [...prevAlunos, data.aluno]);
            handleCloseCreateDialog();
            fetchAlunos();  
        })
        .catch(error => {
            setError(error.message);
        });
    };    

    const handleFilterOpen = () => {
        setOpenFilterDialog(true);
    };

    const handleFilterClose = () => {
        setOpenFilterDialog(false);
    };

    const handleFilterUsers = () => {
        const filteredAlunos = originalAlunos.filter(alunos => {
            return (
                (filterNome === '' || alunos.nome.toLowerCase().includes(filterNome.toLowerCase())) &&
                (filterSala === 'Todas' || alunos.sala === filterSala)
            );
        });

        setAlunos(filteredAlunos); 
        handleFilterClose(); 
    };

    const handleFilterReset = () => {
        setFilterNome('');
        setFilterSala('Todas');
        setAlunos(originalAlunos);
    };

    const generateRandomPassword = (length = 10) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < length; i++) {
          password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
      };

    useEffect(() => {
        fetchAlunos();
    }, [token]);
    
    useEffect(() => {
        if (selectedCpf) {
            setLoading(true); 
            fetchAluno(selectedCpf);
        }
    }, [selectedCpf]);

    useEffect(() => {
        if (openCreateDialog) {
            const randomPassword = generateRandomPassword();
            setNewAluno((prevState) => ({ ...prevState, password: randomPassword }));
        }
    }, [openCreateDialog]);

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
                <Typography variant="h4">Alunos</Typography>
            </Box>
            {error ? (
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            ) : (
                <TableContainer component={Paper} sx={{ height: '50vh', overflowY: 'auto' }}> 
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="h5">Nome</Typography>
                                </TableCell>
                                <TableCell align='center' sx={{paddingRight: '18%'}}>
                                    <Typography variant="h5">Notas</Typography>
                                </TableCell>
                                <TableCell align="right" sx={{ paddingRight: '5%' }}> 
                                    <Typography variant="h5">Ações</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {alunos && alunos.map((aluno) => (
                            aluno ? (
                                <TableRow key={aluno.cpf}>
                                    <TableCell>
                                        <Typography variant="h6">{aluno.nome}</Typography>
                                    </TableCell>
                                    <TableCell>
                                    <Button 
                                            variant="contained" 
                                            color="primary" 
                                            onClick={() => handleViewNotas(aluno.cpf)} 
                                            sx={{ marginRight: '10px', backgroundColor: '#015495'}} 
                                        >
                                            Visualizar
                                        </Button>
                                    </TableCell>
                                    <TableCell align="right"> 
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}> 
                                            <Button 
                                                variant="contained" 
                                                color="primary" 
                                                onClick={() => handleViewEditar(aluno.cpf)} 
                                                sx={{ marginRight: '10px', backgroundColor: '#015495'}} 
                                            >
                                                Editar
                                            </Button>
                                            <Button 
                                                variant="contained" 
                                                color="secondary" 
                                                onClick={() => handleDeleteAluno(aluno.cpf)}
                                                sx={{ backgroundColor: '#ab2325', '&:hover': { backgroundColor: '#b71c1c' } }} 
                                            >
                                                Remover
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : null
                        ))}
                    </TableBody>
                    </Table>
                </TableContainer>
            )}
            <Box sx={{ 
                display: 'flex',
                justifyContent: 'center',
                marginTop: '5vh',
                gap: 3,
                }}>
                <Button 
                    variant="contained" 
                    color="error" 
                    onClick={handleOpenCreateDialog} 
                    sx={{ backgroundColor: '#015495'}} 
                >
                    Adicionar Aluno
                </Button>
                <Button
                    variant="contained"
                    onClick={handleFilterReset} 
                    sx={{
                        backgroundColor: '#015495', 
                        color: 'white',
                        borderRadius: '25px', 
                        padding: '10px 20px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
                        transition: 'transform 0.3s', 
                        '&:hover': {
                            transform: 'scale(1.05)',
                        },
                    }}
                    >
                    Resetar Filtro
                </Button>
                <Button 
                    variant="contained" 
                    color="error" 
                    onClick={handleFilterOpen} 
                    sx={{ backgroundColor: '#015495'}} 
                >
                    Filtrar dados
                </Button>
            </Box>
            <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
                <DialogTitle>Adicionar Aluno</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nome"
                        name="nome"
                        value={newAluno.nome}
                        onChange={handleCreateAlunoChange}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={newAluno.email}
                        onChange={handleCreateAlunoChange}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="CPF"
                        name="cpf"
                        value={newAluno.cpf}
                        onChange={handleCreateAlunoChange}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        select
                        label="Tipo de Sala"
                        name="sala"
                        value={newAluno.sala}
                        onChange={handleCreateAlunoChange}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="Online">Online</MenuItem>
                        <MenuItem value="Presencial">Presencial</MenuItem>
                    </TextField>
                    <TextField
                        label="Senha"
                        name="password"
                        type="password"
                        value={newAluno.password}
                        onChange={handleCreateAlunoChange}
                        required
                        fullWidth
                        margin="normal"
                    />
                    {error && (
                        <Typography variant="h6" color="error">
                            {error}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleCloseCreateDialog}
                        sx={{ marginRight: '10px', backgroundColor: '#015495', marginBottom: '10px'}} 
                        >
                        Cancelar
                    </Button>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleCreateAlunoSubmit}
                        sx={{ marginRight: '10px', backgroundColor: '#015495', marginBottom: '10px'}} 
                        >
                        Adicionar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>Editar Aluno</DialogTitle>
                    <DialogContent>
                        {loading ? (
                            <CircularProgress />
                        ) : alunoEdit && (
                            <>
                                <TextField
                                    label="Nome"
                                    value={alunoEdit.nome}
                                    name="nome"
                                    onChange={handleEditChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="CPF"
                                    value={alunoEdit.cpf}
                                    name="cpf"
                                    disabled
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Email"
                                    value={alunoEdit.email}
                                    name="email"
                                    onChange={handleEditChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    select
                                    label="Sala"
                                    fullWidth
                                    margin="normal"
                                    value={alunoEdit.sala}
                                    name="sala"  
                                    onChange={handleEditChange}
                                >
                                    <MenuItem value="Online">Online</MenuItem>
                                    <MenuItem value="Presencial">Presencial</MenuItem>
                                </TextField>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleCloseEditDialog}
                            sx={{ marginRight: '10px', backgroundColor: '#015495', marginBottom: '10px'}} 
                            >
                            Cancelar
                        </Button>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleEditSave}
                            sx={{ marginRight: '10px', backgroundColor: '#015495', marginBottom: '10px'}} 
                            >
                            Editar
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openFilterDialog} onClose={handleFilterClose}>
                    <DialogTitle>Filtrar Alunos</DialogTitle>
                    <DialogContent>
                    <TextField
                        label="Nome"
                        fullWidth
                        margin="normal"
                        value={filterNome}
                        onChange={(e) => setFilterNome(e.target.value)}
                    />
                    <TextField
                        select
                        label="Sala"
                        fullWidth
                        margin="normal"
                        value={filterSala} 
                        onChange={(e) => setFilterSala(e.target.value)} 
                    >
                        <MenuItem value="Todas">Todas</MenuItem> 
                        <MenuItem value="Online">Online</MenuItem>
                        <MenuItem value="Presencial">Presencial</MenuItem>
                    </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleFilterClose}
                            sx={{ marginRight: '10px', backgroundColor: '#015495', marginBottom: '10px'}} 
                            >
                            Cancelar
                        </Button>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleFilterUsers}
                            sx={{ marginRight: '10px', backgroundColor: '#015495', marginBottom: '10px'}} 
                            >
                            Filtrar
                        </Button>
                    </DialogActions>
                </Dialog>
        </>
    );
}

export default MonitoramentoGestao;
