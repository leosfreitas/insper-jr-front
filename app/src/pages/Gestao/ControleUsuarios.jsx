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

function ControleUsuarios() {
    const [users, setUsers] = useState([]); 
    const [error, setError] = useState(null); 
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [userEdit, setUserEdit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const [newUser, setNewUser] = useState({
        nome: '',
        cpf: '',
        email: '',
        permissao: 'ALUNO',
        password: '',
    });
    const cookies = new Cookies();
    const token = cookies.get('token'); 

    const fetchUsers = () => {
        fetch('http://127.0.0.1:8000/user/get', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao buscar usuaários');
            }
            return response.json();
        })
        .then(data => {
            setUsers(data.users || []);  
        })
        .catch(error => {
            setError(error.message);
        });
    };

    const fetchUser = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/user/get/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Falha ao buscar usuário');
            }
            const data = await response.json();
            setUserEdit(data);
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUserDelete = (id) => {
        if (window.confirm("Tem certeza que deseja deletar este usuário?")) {
            fetch(`http://127.0.0.1:8000/user/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao deletar o usuário');
                }
                setUsers(users.filter(user => user._id !== id));
            })
            .catch(error => {
                setError(error.message); 
            });
        }
    };

    const handleEditSave = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/user/update/${userEdit._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(userEdit),
            });
    
            if (!response.ok) {
                throw new Error('Falha ao salvar alterações');
            }
            handleCloseEditDialog();
            if (response.ok) {
                fetchUsers();
            }

        } catch (error) {
            console.error('Erro ao salvar alterações:', error);
            setError(error.message);
        }
    };

    const handleViewEditar = (id) => {
        setSelectedId(id);  
        setOpenEditDialog(true);
    };

    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true);
    };

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
        setNewUser({
            nome: '',
            cpf: '',
            email: '',
            permissao: 'ALUNO',
            password: '',
        });
        setError(null);
    };

    const handleCloseEditDialog = () => {
        setSelectedId(null);
        setOpenEditDialog(false);
        setUserEdit(null);
        setError(null);
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setUserEdit((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleCreateUserChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prevState => ({ ...prevState, [name]: value }));
    };

    const handleCreateUser = () => {
        if (!newUser || !newUser.nome) { 
            setError("Por favor, preencha todos os campos obrigatórios.");
            return;
        }
    
        fetch('http://127.0.0.1:8000/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newUser),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Falha ao adicionar usuário');
            }
            return response.json();
        })
        .then(data => {
            setUsers(prevUsers => [...prevUsers, data.users]);
            handleCloseCreateDialog();
            fetchUsers();  
        })
        .catch(error => {
            setError(error.message);
        });
    };    

    useEffect(() => {
        fetchUsers();
    }, [token]);
    
    useEffect(() => {
        if (selectedId) {
            setLoading(true); 
            fetchUser(selectedId);
        }
    }, [selectedId]);

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
                <Typography variant="h4">Usuários</Typography>
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
                                <TableCell>
                                    <Typography variant="h5">Permissão</Typography>
                                </TableCell>
                                <TableCell align='right'> 
                                    <Typography variant="h5">Ações</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {users && users.map((user) => (
                            user ? (
                                <TableRow key={user._id}>
                                    <TableCell>
                                        <Typography variant="h6">{user.nome}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h6">{user.permissao}</Typography>
                                    </TableCell>
                                    <TableCell align="right"> 
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}> 
                                            <Button 
                                                variant="contained" 
                                                color="primary" 
                                                onClick={() => handleViewEditar(user._id)} 
                                                sx={{ marginRight: '10px', backgroundColor: '#015495'}} 
                                            >
                                                Editar
                                            </Button>
                                            <Button 
                                                variant="contained" 
                                                color="secondary" 
                                                onClick={() => handleUserDelete(user._id)}
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
                }}>
                <Button 
                    variant="contained" 
                    color="error" 
                    onClick={handleOpenCreateDialog} 
                    sx={{ backgroundColor: '#015495'}} 
                >
                    Adicionar Usuário
                </Button>
            </Box>
            <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
                <DialogTitle>Adicionar Aluno</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nome"
                        name="nome"
                        value={newUser.nome}
                        onChange={handleCreateUserChange}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={newUser.email}
                        onChange={handleCreateUserChange}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="CPF"
                        name="cpf"
                        value={newUser.cpf}
                        onChange={handleCreateUserChange}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        select
                        label="Permissão"
                        name="permissao"
                        value={newUser.permissao}
                        onChange={handleCreateUserChange}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="GESTAO">Gestão</MenuItem>
                        <MenuItem value="PROFESSOR">Professor</MenuItem>
                        <MenuItem value="ALUNO">Aluno</MenuItem>
                    </TextField>
                    <TextField
                        label="Senha"
                        name="password"
                        type="password"
                        value={newUser.password}
                        onChange={handleCreateUserChange}
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
                        onClick={handleCreateUser}
                        sx={{ marginRight: '10px', backgroundColor: '#015495', marginBottom: '10px'}} 
                        >
                        Adicionar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>Editar Usuário</DialogTitle>
                    <DialogContent>
                        {loading ? (
                            <CircularProgress />
                        ) : userEdit && (
                            <>
                                <TextField
                                    label="Nome"
                                    value={userEdit.nome}
                                    name="nome"
                                    onChange={handleEditChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="CPF"
                                    value={userEdit.cpf}
                                    name="cpf"
                                    disabled
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Email"
                                    value={userEdit.email}
                                    name="email"
                                    onChange={handleEditChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <Select
                                    label="Permissão"
                                    value={userEdit.permissao}
                                    name="permissao"
                                    onChange={handleEditChange}
                                    fullWidth
                                    margin="normal"
                                >
                                    <MenuItem value="GESTAO">Gestão</MenuItem>
                                    <MenuItem value="PROFESSOR">Professor</MenuItem>
                                    <MenuItem value="ALUNO">Aluno</MenuItem>
                                </Select>
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
        </>
    );
}

export default ControleUsuarios;
