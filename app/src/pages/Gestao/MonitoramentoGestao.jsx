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
    CircularProgress,
} from '@mui/material';

/**
 * Componente MonitoramentoGestao que gerencia o monitoramento de alunos.
 * Permite visualizar, editar, criar e deletar registros de alunos, além de aplicar filtros.
 * 
 * @component
 * @returns {JSX.Element} O componente que renderiza a interface de gestão de alunos.
 */
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


    /**
     * Função para buscar a lista de alunos do servidor.
     * Atualiza os estados 'alunos' e 'originalAlunos' com os dados retornados.
     * Define mensagens de erro em caso de falha.
     * 
     * @returns {Promise<void>}
     */
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

    /**
     * Função para buscar um aluno específico pelo CPF.
     * Atualiza o estado 'alunoEdit' com os dados do aluno encontrado.
     * Define mensagens de erro em caso de falha.
     * 
     * @param {string} cpf - O CPF do aluno a ser buscado.
     * @returns {Promise<void>}
     */
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

     /**
     * Função para salvar as alterações feitas em um aluno editado.
     * Atualiza os dados do aluno no servidor e recarrega a lista de alunos.
     * Define mensagens de erro em caso de falha.
     * 
     * @returns {Promise<void>}
     */
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

    /**
     * Função para abrir o diálogo de edição para um aluno selecionado.
     * 
     * @param {string} cpf - O CPF do aluno a ser editado.
     */
    const handleViewEditar = (cpf) => {
        setSelectedCpf(cpf);  
        setOpenEditDialog(true);
    };

    /**
     * Função para navegar para a página de notas de um aluno selecionado.
     * 
     * @param {string} cpf - O CPF do aluno cujas notas serão visualizadas.
     */
    const handleViewNotas = (cpf) => {
        navigate(`/monitoramento/notas/${cpf}`);
    };

    /**
     * Função para deletar um aluno após confirmação do usuário.
     * Atualiza a lista de alunos após a exclusão.
     * Define mensagens de erro em caso de falha.
     * 
     * @param {string} cpf - O CPF do aluno a ser deletado.
     */
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

    /**
     * Função para abrir o diálogo de criação de aluno.
     */
    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true);
    };

    /**
     * Função para fechar o diálogo de criação de aluno.
     * Reseta os campos do novo aluno e limpa mensagens de erro.
     */
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

    /**
     * Função para fechar o diálogo de edição de aluno.
     * Reseta o aluno editado e limpa mensagens de erro.
     */
    const handleCloseEditDialog = () => {
        setSelectedCpf(null);
        setOpenEditDialog(false);
        setAlunoEdit(null);
        setError(null);
    };

    /**
     * Função para lidar com as mudanças nos campos do formulário de edição.
     * 
     * @param {Object} event - O evento de mudança do campo.
     */
    const handleEditChange = (event) => {
        const { name, value } = event.target;
        setAlunoEdit((prevState) => ({ ...prevState, [name]: value }));
    };

    /**
     * Função para lidar com as mudanças nos campos do formulário de criação de aluno.
     * 
     * @param {Object} e - O evento de mudança do campo.
     */
    const handleCreateAlunoChange = (e) => {
        const { name, value } = e.target;
        setNewAluno(prevState => ({ ...prevState, [name]: value }));
    };

    /**
     * Função para enviar os dados de criação de um novo aluno.
     * Verifica campos obrigatórios e envia os dados para o servidor.
     * Define mensagens de erro em caso de falha.
     */
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

    /**
     * Função para abrir o diálogo de filtragem de alunos.
     */
    const handleFilterOpen = () => {
        setOpenFilterDialog(true);
    };

    /**
     * Função para fechar o diálogo de filtragem de alunos.
     */
    const handleFilterClose = () => {
        setOpenFilterDialog(false);
    };

    /**
     * Função para aplicar os filtros selecionados na lista de alunos.
     * Atualiza o estado 'alunos' com os resultados filtrados.
     */
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

    /**
     * Função para resetar os filtros aplicados.
     */
    const handleFilterReset = () => {
        setFilterNome('');
        setFilterSala('Todas');
        setAlunos(originalAlunos);
    };

    /**
     * Gera uma senha aleatória com um comprimento especificado.
     * 
     * @param {number} [length=10] - O comprimento da senha gerada.
     * @returns {string} A senha gerada.
     */
    const generateRandomPassword = (length = 10) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < length; i++) {
          password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
      };

    /**
     * Efeito colateral que busca alunos quando o componente é montado ou quando o token muda.
     */
    useEffect(() => {
        fetchAlunos();
    }, [token]);

    /**
     * Efeito colateral que busca um aluno quando o CPF selecionado muda.
     */
    useEffect(() => {
        if (selectedCpf) {
            setLoading(true); 
            fetchAluno(selectedCpf);
        }
    }, [selectedCpf]);

    /**
     * Efeito colateral que gera uma senha aleatória quando o diálogo de criação é aberto.
     */
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
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Alunos</Typography>
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
                                    <Typography variant="h5" sx={{ fontWeight: 600 }}>Nome</Typography>
                                </TableCell>
                                <TableCell align='center' sx={{paddingRight: '16%'}}>
                                    <Typography variant="h5" sx={{ fontWeight: 600 }}>Notas</Typography>
                                </TableCell>
                                <TableCell align="right" sx={{ paddingRight: '5%' }}> 
                                    <Typography variant="h5" sx={{ fontWeight: 600 }}>Ações</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {alunos && alunos.map((aluno, index) => (
                            aluno ? (
                                <TableRow key={aluno.cpf} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#f5f5f5' }}>
                                    <TableCell>
                                        <Typography variant="h6">{aluno.nome}</Typography>
                                    </TableCell>
                                    <TableCell>
                                    <Button 
                                            variant="contained" 
                                            color="primary" 
                                            onClick={() => handleViewNotas(aluno.cpf)} 
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
                                            Visualizar
                                        </Button>
                                    </TableCell>
                                    <TableCell align="right"> 
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}> 
                                            <Button 
                                                variant="contained" 
                                                color="primary" 
                                                onClick={() => handleViewEditar(aluno.cpf)} 
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
                                                onClick={() => handleDeleteAluno(aluno.cpf)}
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
                    Adicionar Aluno
                </Button>
                <Button 
                    variant="contained" 
                    color="error" 
                    onClick={handleFilterOpen} 
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
                        variant="text"
                        onClick={handleCloseCreateDialog}
                        sx={{ 
                            color: '#015495', 
                            backgroundColor: 'white', 
                            boxShadow: 'none', 
                            marginRight: '10px', 
                            marginBottom: '10px', 
                            '&:hover': { 
                                color: '#013a6b',
                                backgroundColor: 'white'
                            } 
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        variant="text"
                        onClick={handleCreateAlunoSubmit}
                        sx={{ 
                            color: '#015495', 
                            backgroundColor: 'white', 
                            boxShadow: 'none', 
                            marginBottom: '10px', 
                            '&:hover': { 
                                color: '#013a6b', 
                                backgroundColor: 'white'
                            } 
                        }}
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
                            variant="text" 
                            onClick={handleCloseEditDialog}
                            sx={{ 
                                color: '#015495', 
                                backgroundColor: 'white', 
                                boxShadow: 'none', 
                                marginRight: '10px', 
                                marginBottom: '10px', 
                                '&:hover': { 
                                    color: '#013a6b',
                                    backgroundColor: 'white'
                                } 
                            }}
                            >
                            Cancelar
                        </Button>
                        <Button 
                            variant="text" 
                            onClick={handleEditSave}
                            sx={{ 
                                color: '#015495', 
                                backgroundColor: 'white', 
                                boxShadow: 'none', 
                                marginRight: '10px', 
                                marginBottom: '10px', 
                                '&:hover': { 
                                    color: '#013a6b',
                                    backgroundColor: 'white'
                                } 
                            }}
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
                            variant="text" 
                            onClick={handleFilterClose}
                            sx={{ 
                                color: '#015495', 
                                backgroundColor: 'white', 
                                boxShadow: 'none', 
                                marginRight: '10px', 
                                marginBottom: '10px', 
                                '&:hover': { 
                                    color: '#013a6b',
                                    backgroundColor: 'white'
                                } 
                            }}
                            >
                            Cancelar
                        </Button>
                        <Button 
                            variant="text" 
                            onClick={handleFilterUsers}
                            sx={{ 
                                color: '#015495', 
                                backgroundColor: 'white', 
                                boxShadow: 'none', 
                                marginRight: '10px', 
                                marginBottom: '10px', 
                                '&:hover': { 
                                    color: '#013a6b',
                                    backgroundColor: 'white'
                                } 
                            }}
                            >
                            Filtrar
                        </Button>
                    </DialogActions>
                </Dialog>
        </>
    );
}

export default MonitoramentoGestao;
