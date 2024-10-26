import React, { useEffect, useState } from 'react';
import HeaderProfessor from './HeaderProfessor';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Cookies from 'universal-cookie';
import { 
    Button, 
    Table, 
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
import AddIcon from '@mui/icons-material/Add';


function ConteudoProfessor() {
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
            <HeaderProfessor />
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
                <Grid container rowSpacing={2}>
                    <Grid item xs={12}>
                        <Typography 
                            variant="h4" 
                            onClick={() => setView('avisos')} 
                            sx={{ 
                                cursor: 'pointer', 
                                transition: '0.3s', 
                                fontSize: view === 'avisos' ? '2.5rem' : '1.5rem',
                            }}
                        >
                            Avisos
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography 
                            variant="h4" 
                            onClick={() => setView('grade')} 
                            sx={{ 
                                cursor: 'pointer', 
                                transition: '0.3s', 
                                fontSize: view === 'grade' ? '2.5rem' : '1.5rem', 
                            }}
                        >
                            Grade
                        </Typography>
                    </Grid> 
                </Grid>
                {view === 'avisos' ? (
                    <AddIcon
                        style={{ fontSize: '40px', position: 'absolute', right: '20px', cursor: 'pointer' }}
                        onClick={OpenAvisoDialog}
                    />
                        ) : (
                    <AddIcon
                        style={{ fontSize: '40px', position: 'absolute', right: '20px', cursor: 'pointer' }}
                        onClick={OpenGradeDialog}
                    />
                )}
            </Box>

            {view === 'avisos' && (
                <>  
                    <TableContainer component={Paper} sx={{ maxHeight: '50vh' }}>
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
                                {avisos.map((aviso) => (
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
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
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
                    <TableContainer component={Paper}  sx={{ backgroundColor: '#f2f2f2', maxHeight: '50vh', overflowY: 'auto' }}>
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
                                            <Typography variant="h5">Sala</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="h5">Ações</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                            <TableBody>
                                {grades.map((grade) => (
                                    <TableRow key={grade._id}>
                                        <TableCell>
                                            <Typography variant="h6">{grade.data}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="h6">{grade.horario}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="h6">{grade.materia}</Typography>
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
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
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

export default ConteudoProfessor;
