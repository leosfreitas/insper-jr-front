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

function ConteudoGestao() {
    const cookies = new Cookies();
    const token = cookies.get("token");

    const [avisos, setAvisos] = useState([]);
    const [grades, setGrades] = useState([]);   
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openGrade, setOpenGrade] = useState(false);
    const [openAviso, setOpenAviso] = useState(false);
    const [newAviso, setNewAviso] = useState({ titulo: '', mensagem: '', tipo: 'Geral' });
    const [data, setData] = useState(new Date());
    const [newGrade, setNewGrade] = useState({ horario: '', materia: '', local: '', topico: '', professor: '', sala: 'Presencial', data: data });
    const [view, setView] = useState('avisos');

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleDateChange = (date) => {
        setData(date);
    };

    function formatDateView(string) {
        return string.replace(/-/g, "/");
    }

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
            setAvisos(data.avisos);  
        } catch (error) {
            setError(error.message); 
        } finally {
            setLoading(false);
        }
    };

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
        } catch (error) {
            setError(error.message); 
        } finally {
            setLoading(false);
        }
    };
                    

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

    const OpenGradeDialog = () => {
        setOpenGrade(true);
    };

    const OpenAvisoDialog = () => {
        setOpenAviso(true);
    };

    const CloseAvisoDialog = () => {
        setOpenAviso(false);
        setError(null);
    };

    const CloseGradeDialog = () => {
        setOpenGrade(false);
        setError(null);
    };

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
                <Typography variant="h4">Avisos e Grade Horária</Typography>
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
                                        <Typography variant="h5">Título</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h5">Autor</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h5">Mensagem</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h5">Tipo</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h5">Ações</Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(avisos) && avisos.length > 0 ? (
                                    avisos.map((aviso) => (
                                        <TableRow key={aviso._id}>
                                            <TableCell>
                                                <Typography variant="h6">{aviso.titulo}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6">{aviso.autor}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6">{aviso.mensagem}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="h6">{aviso.tipo}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Button 
                                                    variant="contained" 
                                                    color="error" 
                                                    onClick={() => handleDelete(aviso._id)} 
                                                    sx={{ backgroundColor: '#ab2325', '&:hover': { backgroundColor: '#b71c1c' } }} 
                                                >
                                                    Remover
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            <Typography variant="h6">Nenhum aviso disponível</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ 
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '5vh',
                        }}>
                        <Button 
                            variant="contained" 
                            color="error" 
                            onClick={OpenAvisoDialog}
                            sx={{ backgroundColor: '#015495'}} 
                        >
                            Adicionar Aviso
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
                                        variant="contained" 
                                        color="primary" 
                                        onClick={CloseAvisoDialog}
                                        sx={{ marginRight: '10px', backgroundColor: '#015495', marginBottom: '10px'}} 
                                        >
                                        Cancelar
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={handleSubmit}
                                        sx={{ marginRight: '10px', backgroundColor: '#015495', marginBottom: '10px'}} 
                                        >
                                        Adicionar
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
                                            <Typography variant="h5">Data</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="h5">Horário</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="h5">Matéria</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="h5">Professor</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="h5">Sala</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="h5">Ações</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                            <TableBody>
                            {Array.isArray(grades) && grades.length > 0 ? (
                                    grades.map((grade) => (
                                        <TableRow key={grade._id}>
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
                                                    sx={{ backgroundColor: '#ab2325', '&:hover': { backgroundColor: '#b71c1c' } }} 
                                                >
                                                    Remover
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            <Typography variant="h6">Nenhuma Grade disponível</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ 
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '5vh',
                        }}>
                        <Button 
                            variant="contained" 
                            color="error" 
                            onClick={OpenGradeDialog}
                            sx={{ backgroundColor: '#015495'}} 
                        >
                            Adicionar Grade
                        </Button>
                    </Box>
                    <Dialog open={openGrade} onClose={CloseGradeDialog}>
                        <DialogTitle>Criar Grade</DialogTitle>
                            <DialogContent>
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
                                        selected={data}
                                        onChange={handleDateChange}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Selecionar data"
                                        className="date-picker"
                                    />
                            </DialogContent>
                                <DialogActions>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={CloseGradeDialog}
                                        sx={{ marginRight: '10px', backgroundColor: '#015495', marginBottom: '10px'}} 
                                        >
                                        Cancelar
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={handleGrade}
                                        sx={{ marginRight: '10px', backgroundColor: '#015495', marginBottom: '10px'}} 
                                        >
                                        Adicionar
                                    </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </>
    );
}

export default ConteudoGestao;