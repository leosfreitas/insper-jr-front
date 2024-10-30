import React, { useState, useEffect } from 'react';
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
    CircularProgress,
} from '@mui/material';
import './static/date-picker.css'

function ControleUsuarios() {
    const [users, setUsers] = useState([]); 
    const [error, setError] = useState(null); 
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openFilterDialog, setOpenFilterDialog] = useState(false);
    const [originalUsers, setOriginalUsers] = useState([]);
    const [filterNome, setFilterNome] = useState('');
    const [filterPermissao, setFilterPermissao] = useState('Todas');
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [userEdit, setUserEdit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const [newUser, setNewUser] = useState({
        nome: '',
        cpf: '',
        email: '',
        permissao: 'PROFESSOR',
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
                throw new Error('Falha ao buscar usuários');
            }
            return response.json();
        })
        .then(data => {
            setUsers(data.users || []);
            setOriginalUsers(data.users || []);  
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

    const handleOpenFilterDialog = () => {
        setOpenFilterDialog(true);
    };

    const handleCloseFilterDialog = () => {
        setOpenFilterDialog(false);
    };

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
        setNewUser({
            nome: '',
            cpf: '',
            email: '',
            permissao: 'PROFESSOR',
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

    const handleFilterUsers = () => {
        const filteredUsers = originalUsers.filter(user => {
            return (
                (filterNome === '' || user.nome.toLowerCase().includes(filterNome.toLowerCase())) &&
                (filterPermissao === 'Todas' || user.permissao === filterPermissao)
            );
        });
    
        setUsers(filteredUsers); 
        handleCloseFilterDialog(); 
    };

    const handleFilterReset = () => {
        setUsers(originalUsers);
        setFilterNome('');
        setFilterPermissao('Todas');
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
        if (openCreateDialog) {
            const randomPassword = generateRandomPassword();
            setNewUser((prevState) => ({ ...prevState, password: randomPassword }));
        }
    }, [openCreateDialog]);


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
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Usuários</Typography>
            </Box>
            {error ? (
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            ) : (
                <TableContainer component={Paper} sx={{ height: '50vh', overflowY: 'auto' }}> 
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow >
                                <TableCell>
                                    <Typography variant="h5" sx={{ fontWeight: 600 }}>Nome</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="h5" sx={{ fontWeight: 600 }}>Permissão</Typography>
                                </TableCell>
                                <TableCell align='right' sx={{paddingRight: '4.5%'}}> 
                                    <Typography variant="h5" sx={{ fontWeight: 600 }}>Ações</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {users && users.map((user, index) => (
                            user ? (
                                <TableRow key={user._id} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#f5f5f5' }}>
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
                                                Editar
                                            </Button>
                                            <Button 
                                                variant="contained" 
                                                color="secondary" 
                                                onClick={() => handleUserDelete(user._id)}
                                                sx={{
                                                    backgroundColor: '#ab2325', 
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
                    Adicionar Usuário
                </Button>
                <Button 
                    variant="contained" 
                    color="error" 
                    onClick={handleOpenFilterDialog} 
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
                    Filtrar dados
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
                        color="primary" 
                        onClick={handleCloseCreateDialog}
                        >
                        Cancelar
                    </Button>
                    <Button 
                        color="primary" 
                        onClick={handleCreateUser}
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
                                <TextField
                                    select
                                    label="Permissão"
                                    fullWidth
                                    margin="normal"
                                    name="permissao"
                                    value={userEdit.permissao} 
                                    onChange={handleEditChange}
                                >
                                    <MenuItem value="GESTAO">Gestão</MenuItem>
                                    <MenuItem value="PROFESSOR">Professor</MenuItem>
                                </TextField>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            color="primary" 
                            onClick={handleCloseEditDialog}
                            >
                            Cancelar
                        </Button>
                        <Button 
                            color="primary" 
                            onClick={handleEditSave}
                            >
                            Editar
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openFilterDialog} onClose={handleCloseFilterDialog}>
                    <DialogTitle>Filtrar Usuários</DialogTitle>
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
                        label="Permissão"
                        fullWidth
                        margin="normal"
                        value={filterPermissao} 
                        onChange={(e) => setFilterPermissao(e.target.value)} 
                    >
                        <MenuItem value="Todas">Todas</MenuItem> 
                        <MenuItem value="GESTAO">Gestão</MenuItem>
                        <MenuItem value="PROFESSOR">Professor</MenuItem>
                    </TextField>

                    </DialogContent>
                    <DialogActions>
                        <Button 
                            color="primary" 
                            onClick={handleCloseFilterDialog}
                            >
                            Cancelar
                        </Button>
                        <Button 
                            color="primary" 
                            onClick={handleFilterUsers}
                            >
                            Filtrar
                        </Button>
                    </DialogActions>
                </Dialog>
        </>
    );
}

export default ControleUsuarios;
