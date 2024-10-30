import React, { useEffect, useState } from 'react';
import HeaderGestao from './HeaderGestao';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Cookies from 'universal-cookie';
import { 
    Button, 
    Table, 
    Tabs,
    Tab,
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    Grid,
    Box,
    Typography,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';

/**
 * Componente que gerencia a exibição e manipulação de avisos e grades.
 * Utiliza cookies para autenticação e fornece funções para criação, recuperação,
 * filtragem e exclusão de avisos e grades.
 *
 * @component
 */
function ConteudoGestao() {
    const cookies = new Cookies();
    const token = cookies.get("token");
    const [data, setData] = useState(new Date());
    const [view, setView] = useState('avisos');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [avisos, setAvisos] = useState([]);
    const [openAviso, setOpenAviso] = useState(false);
    const [newAviso, setNewAviso] = useState({ titulo: '', mensagem: '', tipo: 'Geral' });
    const [openAvisosFilterDialog, setOpenAvisosFilterDialog] = useState(false);
    const [originalAvisos, setOriginalAvisos] = useState([]);
    const [filterProfessor, setFilterProfessor] = useState('');
    const [filterTitulo, setFilterTitulo] = useState('');
    const [filterTipo, setFilterTipo] = useState('Todos');
    const [filterHorario, setFilterHorario] = useState('');

    const [grades, setGrades] = useState([]);   
    const [openGrade, setOpenGrade] = useState(false);
    const [newGrade, setNewGrade] = useState({ horario: '', materia: '', local: '', topico: '', professor: '', sala: 'Presencial', data: data });
    const [openGradeFilterDialog, setOpenGradeFilterDialog] = useState(false);
    const [originalGrades, setOriginalGrades] = useState([]);
    const [filterData, setFilterData] = useState(new Date());
    const [filterSala, setFilterSala] = useState('Todas');	

    /**
     * Formata uma data no formato 'DD-MM-AAAA'.
     *
     * @param {Date} date - A data a ser formatada.
     * @returns {string} A data formatada como uma string.
     */
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    /**
     * Atualiza a data atual.
     *
     * @param {Date} date - A nova data a ser definida.
     */
    const handleDateChange = (date) => {
        setData(date);
    };

    /**
     * Atualiza a data do filtro.
     *
     * @param {Date} date - A nova data do filtro a ser definida.
     */
    const handleFilterDate = (date) => {
        setFilterData(date);
    };

    /**
     * Formata uma string de data, substituindo '-' por '/'.
     *
     * @param {string} string - A string de data a ser formatada.
     * @returns {string} A string de data formatada.
     */
    function formatDateView(string) {
        return string.replace(/-/g, "/");
    }

    /**
     * Manipula a criação de uma nova grade.
     *
     * @param {Event} e - O evento de submissão do formulário.
     */
    const handleGrade = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:8000/grade/create", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    horario: newGrade.horario,
                    materia: newGrade.materia,
                    local: newGrade.local,
                    topico: newGrade.topico,
                    professor: newGrade.professor,
                    sala: newGrade.sala,
                    data: formatDate(data) 
                }) 
            });

            if (response.ok) {
                const data = await response.json();
                fetchGrades(); 
                setOpenGrade(false);
                setData(new Date());
                setNewGrade({ horario: '', materia: '', local: '', topico: '', professor: '', sala: 'Presencial', data: data });
                return response.json();
            } else {
                const errorData = await response.json();
                console.log("Erro:", errorData);
            }
        } catch (error) {
            console.log("Erro ao fazer a requisição:", error);
        }
    };

    /**
     * Manipula a criação de um novo aviso.
     *
     * @param {Event} e - O evento de submissão do formulário.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://127.0.0.1:8000/avisos/create", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ titulo: newAviso.titulo , mensagem: newAviso.mensagem, tipo: newAviso.tipo }) 
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Aviso criado com sucesso:", data);
                fetchAvisos();
                setOpenAviso(false);
                setNewAviso({ titulo: '', mensagem: '', tipo: 'Geral' });
                return response.json();
            } else {
                const errorData = await response.json();
                console.log("Erro:", errorData);
            }
        } catch (error) {
            console.log("Erro ao fazer a requisição:", error);
        }
    };

    /**
     * Recupera a lista de avisos da API.
     * Define o estado de loading para true durante a busca e, em seguida, tenta buscar os avisos.
     * Se a requisição for bem-sucedida, os avisos são armazenados nos estados `originalAvisos` e `avisos`.
     * Se ocorrer um erro, a mensagem de erro é armazenada no estado `error`.
     *
     * @async
     * @function fetchAvisos
     * @returns {Promise<void>} 
     */
    const fetchAvisos = async () => {
        setLoading(true); 
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
            setOriginalAvisos(data.avisos);
            setAvisos(data.avisos);  
        } catch (error) {
            setError(error.message); 
        } finally {
            setLoading(false);
        }
    };

    /**
     * Recupera a lista de grades da API.
     * Define o estado de loading para true durante a busca e, em seguida, tenta buscar as grades.
     * Se a requisição for bem-sucedida, as grades são armazenadas nos estados `originalGrades` e `grades`.
     * Se ocorrer um erro, a mensagem de erro é armazenada no estado `error`.
     *
     * @async
     * @function fetchGrades
     * @returns {Promise<void>}
     */
    const fetchGrades = async () => {
        setLoading(true); 
        try {
            const response = await fetch(`http://127.0.0.1:8000/grade/get`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (!response.ok) {
                throw new Error('Falha ao buscar grades');
            }
            const data = await response.json();
            setGrades(data.grades);  
            setOriginalGrades(data.grades);
        } catch (error) {
            setError(error.message); 
        } finally {
            setLoading(false);
        }
    };
                    
    /**
     * Exclui um aviso baseado no ID fornecido.
     * Se a requisição de deleção for bem-sucedida, a lista de avisos é atualizada.
     *
     * @async
     * @function handleDelete
     * @param {string} id - O ID do aviso a ser excluído.
     * @returns {Promise<void>}
     */
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/avisos/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                console.log("Aviso deletado com sucesso");
                fetchAvisos();
            } else {
                const errorData = await response.json();
                console.log("Erro ao deletar aviso:", errorData);
            }
        } catch (error) {
            console.log("Erro ao fazer a requisição de deleção:", error);
        }
    };

    /**
     * Exclui uma grade baseada no ID fornecido.
     * Se a requisição de deleção for bem-sucedida, a lista de grades é atualizada.
     *
     * @async
     * @function handleGradeDelete
     * @param {string} id - O ID da grade a ser excluída.
     * @returns {Promise<void>}
     */
    const handleGradeDelete = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/grade/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                console.log("Grade deletada com sucesso");
                fetchGrades();
            } else {
                const errorData = await response.json();
                console.log("Erro ao deletar grade:", errorData);
            }
        } catch (error) {
            console.log("Erro ao fazer a requisição de deleção:", error);
        }
    };

    /**
     * Abre o diálogo para criar ou editar uma grade.
     *
     * @function OpenGradeDialog
     */
    const OpenGradeDialog = () => {
        setOpenGrade(true);
    };

    /**
     * Abre o diálogo para criar ou editar um aviso.
     *
     * @function OpenAvisoDialog
     */
    const OpenAvisoDialog = () => {
        setOpenAviso(true);
    };


    /**
     * Abre o diálogo de filtro para avisos.
     *
     * @function OpenAvisosFilterDialog
     */
    const OpenAvisosFilterDialog = () => {
        setOpenAvisosFilterDialog(true);
    };

    /**
     * Fecha o diálogo de filtro para avisos.
     *
     * @function handleCloseAvisosFilterDialog
     */
    const handleCloseAvisosFilterDialog = () => {
        setOpenAvisosFilterDialog(false);
    };

    /**
     * Abre o diálogo de filtro para grades.
     *
     * @function OpenGradeFilterDialog
     */
    const OpenGradeFilterDialog = () => {
        setOpenGradeFilterDialog(true);
    };

    /**
     * Fecha o diálogo de filtro para grades.
     *
     * @function handleCloseGradeFilterDialog
     */
    const handleCloseGradeFilterDialog = () => {
        setOpenGradeFilterDialog(false);
    };

    /**
     * Fecha o diálogo de aviso e reseta o estado de erro.
     *
     * @function CloseAvisoDialog
     */
    const CloseAvisoDialog = () => {
        setOpenAviso(false);
        setError(null);
    };

    /**
     * Fecha o diálogo de grade e reseta o estado de erro.
     *
     * @function CloseGradeDialog
     */
    const CloseGradeDialog = () => {
        setOpenGrade(false);
        setError(null);
    };

    /**
     * Filtra os avisos com base nos critérios fornecidos.
     * Atualiza o estado de avisos com os avisos filtrados e fecha o diálogo de filtro.
     *
     * @function handleFilterAvisos
     */
    const handleFilterAvisos = () => {
        const filteredAvisos = originalAvisos.filter(aviso => {
            return (
                (filterTitulo === '' || aviso.titulo.toLowerCase().includes(filterTitulo.toLowerCase())) &&
                (filterTipo === 'Todos' || aviso.tipo === filterTipo)
            );
        });
    
        setAvisos(filteredAvisos); 
        handleCloseAvisosFilterDialog(); 
    };

    /**
     * Filtra as grades com base nos critérios fornecidos.
     * Atualiza o estado de grades com as grades filtradas e fecha o diálogo de filtro.
     *
     * @function handleFilterGrades
     */
    const handleFilterGrades = () => {
        const filteredGrades = originalGrades.filter(grade => {
            return (
                (filterHorario === '' || grade.horario.toLowerCase().includes(filterHorario.toLowerCase())) &&
                (filterData === '' || grade.data === formatDate(filterData)) &&
                (filterProfessor === '' || grade.professor.toLowerCase().includes(filterProfessor.toLowerCase())) &&
                (filterSala === 'Todas' || grade.sala === filterSala)
            );
        });
    
        setGrades(filteredGrades); 
        handleCloseGradeFilterDialog(); 
    };

    /**
     * Reseta os filtros de avisos para os valores padrão.
     *
     * @function handleResetFilterAvisos
     */
    const handleResetFilterAvisos = () => {
        setFilterTitulo('');
        setFilterTipo('Todos');
        setAvisos(originalAvisos);

    };

    /**
     * Reseta os filtros de grades para os valores padrão.
     *
     * @function handleResetFilterGrades
     */
    const handleResetFilterGrades = () => { 
        setFilterHorario('');
        setFilterData('');
        setFilterProfessor('');
        setFilterSala('Todas');
        setGrades(originalGrades);
    };

    /**
     * Executa as funções de busca de avisos e grades ao montar o componente.
     *
     * @function useEffect
     * @returns {void}
     */
    useEffect(() => {
        fetchAvisos();
        fetchGrades();
    }, [token]);

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
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Avisos e Grade Horária</Typography>
            </Box>
        <Tabs
            value={view} 
            onChange={(event, newValue) => setView(newValue)} 
            TabIndicatorProps={{
                sx: {
                    backgroundColor: '#015495',
                    height: '4px',
                },
            }}
            sx={{
                backgroundColor: '#f5f5f5',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                padding: '8px',
            }}
            >
            <Tab
                label="Avisos"
                value="avisos" 
                sx={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: '#333',
                    '&.Mui-selected': {
                        color: '#015495',
                    },
                    transition: 'background-color 0.3s',
                }}
            />
            <Tab
                label="Grade Horária"
                value="grade" 
                sx={{
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color: '#333',
                    '&.Mui-selected': {
                        color: '#015495',
                    },
                    transition: 'background-color 0.3s',
                }}
            />
            </Tabs>
            {view === 'avisos' && (
                <>  
                    <TableContainer component={Paper} sx={{ height: '45vh' }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant="h5" sx={{ fontWeight: 600 }}>Título</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h5" sx={{ fontWeight: 600 }}>Autor</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h5" sx={{ fontWeight: 600,marginLeft:'40%'}}>Mensagem</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h5" sx={{ fontWeight: 600 }}>Tipo</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h5" sx={{ fontWeight: 600,marginLeft:'15%'}}>Ações</Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(avisos) && avisos.length > 0 ? (
                                    avisos.map((aviso, index) => (
                                        <TableRow key={aviso._id} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#f5f5f5' }}>
                                            <TableCell>
                                                <Typography variant="h6">{aviso.titulo}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6">{aviso.autor}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6" sx={{marginLeft:'5%'}}>{aviso.mensagem}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6">{aviso.tipo}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Button 
                                                    variant="contained" 
                                                    color="error" 
                                                    onClick={() => handleDelete(aviso._id)} 
                                                    sx={{
                                                        backgroundColor: '#ab2325', 
                                                        color: 'white',
                                                        borderRadius: '25px', 
                                                        padding: '10px 20px',
                                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
                                                        transition: 'transform 0.3s', 
                                                        '&:hover': {
                                                            transform: 'scale(1.05)',
                                                        }}}
                                                >
                                                    Remover
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            <Typography variant="h6">Nenhum aviso encontrado</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ 
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '4vh',
                        gap: 3,
                        }}>
                        <Button 
                            variant="contained" 
                            color="error" 
                            onClick={OpenAvisoDialog}
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
                            Adicionar Aviso
                        </Button>
                        <Button 
                            variant="contained" 
                            color="error" 
                            onClick={OpenAvisosFilterDialog} 
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
                            onClick={handleResetFilterAvisos} 
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
                    <Dialog open={openAviso} onClose={CloseAvisoDialog}>
                        <DialogTitle>Criar Aviso</DialogTitle>
                            <DialogContent>
                                    <TextField
                                        label="Título"
                                        value={newAviso.titulo}
                                        name="titulo"
                                        onChange={(e) => setNewAviso({ ...newAviso, titulo: e.target.value })}
                                        fullWidth
                                        margin="dense"
                                    />
                                    <TextField
                                        label="Mensagem"
                                        value={newAviso.mensagem}
                                        name="mensagem"
                                        onChange={(e) => setNewAviso({ ...newAviso, mensagem: e.target.value })}
                                        fullWidth
                                        margin="dense"
                                    />
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Tipo</InputLabel>
                                        <Select
                                            onChange={(e) => setNewAviso({ ...newAviso, tipo: e.target.value })}
                                            label="Tipo"
                                            value = {newAviso.tipo}
                                            required
                                        >
                                            <MenuItem value="Online">Online</MenuItem>
                                            <MenuItem value="Presencial">Presencial</MenuItem>
                                            <MenuItem value="Geral">Geral</MenuItem>
                                        </Select>
                                    </FormControl>
                            </DialogContent>
                                <DialogActions>
                                    <Button 
                                        color="primary" 
                                        onClick={CloseAvisoDialog}
                                        >
                                        Cancelar
                                    </Button>
                                    <Button 
                                        color="primary" 
                                        onClick={handleSubmit}
                                        >
                                        Adicionar
                                    </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={openAvisosFilterDialog} onClose={handleCloseAvisosFilterDialog}>
                        <DialogTitle>Filtrar Avisos</DialogTitle>
                        <DialogContent>
                        <TextField
                            label="Título"
                            fullWidth
                            margin="normal"
                            value={filterTitulo}
                            onChange={(e) => setFilterTitulo(e.target.value)}
                        />
                        <TextField
                            select
                            label="Tipo"
                            fullWidth
                            margin="normal"
                            value={filterTipo} 
                            onChange={(e) => setFilterTipo(e.target.value)} 
                        >
                            <MenuItem value="Todos">Todos</MenuItem> 
                            <MenuItem value="Geral">Geral</MenuItem>
                            <MenuItem value="Presencial">Presencial</MenuItem>
                            <MenuItem value="Online">Online</MenuItem>
                        </TextField>

                        </DialogContent>
                        <DialogActions>
                            <Button 
                                color="primary" 
                                onClick={handleCloseAvisosFilterDialog}
                                >
                                Cancelar
                            </Button>
                            <Button 
                                color="primary" 
                                onClick={handleFilterAvisos}
                                >
                                Filtrar
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}

            {view === 'grade' && (
                <>  
                    <TableContainer component={Paper}  sx={{ height: '45vh', overflowY: 'auto' }}>
                        <Table stickyHeader>
                            <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="h5" sx={{ fontWeight: 600,marginLeft:'8%' }}>Data</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="h5" sx={{ fontWeight: 600,marginLeft:'6%' }}>Horário</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="h5" sx={{ fontWeight: 600,marginLeft:'4%' }}>Matéria</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="h5" sx={{ fontWeight: 600,marginLeft:'4%' }}>Professor</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="h5" sx={{ fontWeight: 600 ,marginLeft:'9%'}}>Sala</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="h5" sx={{ fontWeight: 600,marginLeft:'6%'}}>Ações</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                            <TableBody>
                            {Array.isArray(grades) && grades.length > 0 ? (
                                    grades.map((grade, index) => (
                                        <TableRow key={grade._id} sx={{ backgroundColor: index % 2 === 0 ? 'white' : '#f5f5f5' }}>
                                            <TableCell>
                                                <Typography variant="h6">{formatDateView(grade.data)}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6">{grade.horario}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6">{grade.materia}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6">{grade.professor}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6">{grade.sala}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Button 
                                                    variant="contained" 
                                                    color="error" 
                                                    onClick={() => handleGradeDelete(grade._id)} 
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
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            <Typography variant="h6">Nenhuma Grade encontrada</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ 
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '4vh',
                        gap: 3,
                        }}>
                        <Button 
                            variant="contained" 
                            color="error" 
                            onClick={OpenGradeDialog}
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
                            Adicionar Grade
                        </Button>
                        <Button 
                            variant="contained" 
                            color="error" 
                            onClick={OpenGradeFilterDialog} 
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
                            onClick={handleResetFilterGrades} 
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
                    <Dialog open={openGrade} onClose={CloseGradeDialog}>
                        <DialogTitle>Criar Grade</DialogTitle>
                            <DialogContent sx={{overflowX: 'hidden', overflowY: 'hidden'}}>
                                    <TextField
                                        label="Horário"
                                        value={newGrade.horario}
                                        name="horario"
                                        onChange={(e) => setNewGrade({ ...newGrade, horario: e.target.value })}
                                        fullWidth
                                        margin="dense"
                                    />
                                    <TextField
                                        label="Matéria"
                                        value={newGrade.materia}
                                        name="materia"
                                        onChange={(e) => setNewGrade({ ...newGrade, materia: e.target.value })}
                                        fullWidth
                                        margin="dense"
                                    />
                                    <TextField
                                        label="Local"
                                        value={newGrade.local}
                                        name="local"
                                        onChange={(e) => setNewGrade({ ...newGrade, local: e.target.value })}
                                        fullWidth
                                        margin="dense"
                                    />
                                    <TextField
                                        label="Tópico"
                                        value={newGrade.topico}
                                        name="topico"
                                        onChange={(e) => setNewGrade({ ...newGrade, topico: e.target.value })}
                                        fullWidth
                                        margin="dense"
                                    />
                                    <TextField
                                        label="Professor"
                                        value={newGrade.professor}
                                        name="professor"
                                        onChange={(e) => setNewGrade({ ...newGrade, professor: e.target.value })}
                                        fullWidth
                                        margin="dense"
                                    />
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Sala</InputLabel>
                                        <Select
                                            onChange={(e) => setNewGrade({ ...newGrade, sala: e.target.value })}
                                            label="Sala"
                                            value={newGrade.sala}
                                            required
                                        >
                                            <MenuItem value="Online">Online</MenuItem>
                                            <MenuItem value="Presencial">Presencial</MenuItem>
                                        </Select>
                                    </FormControl>
                                        <DatePicker
                                        label = "Data"
                                        selected={data}
                                        onChange={handleDateChange}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Selecionar data"
                                        className="date-picker"
                                        width = '100%'
                                        />
                            </DialogContent>
                                <DialogActions>
                                    <Button 
                                        color="primary" 
                                        onClick={CloseGradeDialog}
                                        >
                                        Cancelar
                                    </Button>
                                    <Button 
                                        color="primary" 
                                        onClick={handleGrade}
                                        >
                                        Adicionar
                                    </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={openGradeFilterDialog} onClose={handleCloseGradeFilterDialog}>
                        <DialogTitle>Filtrar Grade</DialogTitle>
                        <DialogContent sx={{overflowX: 'hidden'}}>
                        
                        <TextField
                            label="Horário"
                            fullWidth
                            margin="normal"
                            value={filterHorario} 
                            onChange={(e) => setFilterHorario(e.target.value)} 
                        />
                        <TextField
                            label="Professor"
                            fullWidth
                            margin="normal"
                            value={filterProfessor} 
                            onChange={(e) => setFilterProfessor(e.target.value)} 
                        />
                        <TextField
                            select
                            label="Tipo"
                            fullWidth
                            margin="normal"
                            value={filterSala} 
                            onChange={(e) => setFilterSala(e.target.value)} 
                        >
                            <MenuItem value="Todas">Todas</MenuItem> 
                            <MenuItem value="Presencial">Presencial</MenuItem>
                            <MenuItem value="Online">Online</MenuItem>
                        </TextField>
                                <DatePicker
                                selected={filterData}
                                onChange={handleFilterDate}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Selecionar data"
                                className="date-picker"
                                width = '100%'
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button 
                                color="primary" 
                                onClick={handleCloseGradeFilterDialog}
                                >
                                Cancelar
                            </Button>
                            <Button 
                                color="primary" 
                                onClick={handleFilterGrades}
                                >
                                Filtrar
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </>
    );
}

export default ConteudoGestao;