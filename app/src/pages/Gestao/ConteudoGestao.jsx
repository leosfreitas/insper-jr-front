import React, { useEffect, useState } from 'react';
import HeaderGestao from './HeaderGestao';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './static/ConteudoGestao.css';
import Cookies from 'universal-cookie';
import { Button, TextField, Container, Typography, Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function ConteudoGestao() {
    const cookies = new Cookies();
    const token = cookies.get("token");

    const [titulo, setTitulo] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [tipo, setTipo] = useState('Geral');
    const [avisos, setAvisos] = useState([]);
    const [grades, setGrades] = useState([]);   
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [data, setData] = useState(new Date());
    const [horario, setHorario] = useState('');
    const [materia, setMateria] = useState('');
    const [local, setLocal] = useState('');
    const [topico, setTopico] = useState('');
    const [professor, setProfessor] = useState('');
    const [sala, setSala] = useState('Presencial');

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
                    horario,
                    materia,
                    local,
                    topico,
                    professor,
                    sala,
                    data: formatDate(data) 
                }) 
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Grade criada com sucesso:", data);
                setHorario('');
                setMateria('');
                setLocal('');
                setTopico('');
                setProfessor('');
                setSala('');
                setData(new Date());
                fetchGrades(); 
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
                body: JSON.stringify({ titulo, mensagem, tipo }) 
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Aviso criado com sucesso:", data);
                setTitulo('');
                setMensagem('');
                setTipo('Geral'); 
                fetchAvisos(); 
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

    useEffect(() => {
        fetchAvisos();
        fetchGrades();
    }, [token]);

    return (
        <>
            <HeaderGestao />
            <Container>
                <Box className='conteudo-gestao' sx={{ mt: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Selecionar Seção
                    </Typography>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Selecionar</InputLabel>
                        <Select
                            value={view}
                            onChange={(e) => setView(e.target.value)}
                            label="Selecionar"
                        >
                            <MenuItem value="avisos">Avisos</MenuItem>
                            <MenuItem value="grade">Grade</MenuItem>
                        </Select>
                    </FormControl>

                    {view === 'avisos' && (
                        <>
                            <Typography variant="h4" gutterBottom>
                                Criar Aviso
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    label="Título"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                    required
                                />
                                <TextField
                                    label="Mensagem"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    multiline
                                    rows={4}
                                    value={mensagem}
                                    onChange={(e) => setMensagem(e.target.value)}
                                    required
                                />
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Tipo</InputLabel>
                                    <Select
                                        value={tipo}
                                        onChange={(e) => setTipo(e.target.value)}
                                        label="Tipo"
                                    >
                                        <MenuItem value="Online">Online</MenuItem>
                                        <MenuItem value="Presencial">Presencial</MenuItem>
                                        <MenuItem value="Geral">Geral</MenuItem>
                                    </Select>
                                </FormControl>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    type="submit" 
                                    sx={{ mt: 2 }}
                                >
                                    Criar Aviso
                                </Button>
                            </form>

                            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                                Avisos Criados
                            </Typography>

                            {loading ? (
                                <CircularProgress />
                            ) : error ? (
                                <Alert severity="error">{error}</Alert>
                            ) : (
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Título</TableCell>
                                                <TableCell>Autor</TableCell>
                                                <TableCell>Mensagem</TableCell>
                                                <TableCell>Tipo</TableCell>
                                                <TableCell>Ações</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {avisos.map((aviso) => (
                                                <TableRow key={aviso._id}>
                                                    <TableCell>{aviso.titulo}</TableCell>
                                                    <TableCell>{aviso.autor}</TableCell>
                                                    <TableCell>{aviso.mensagem}</TableCell>
                                                    <TableCell>{aviso.tipo}</TableCell>
                                                    <TableCell>
                                                        <Button 
                                                            variant="outlined" 
                                                            color="error" 
                                                            onClick={() => handleDelete(aviso._id)} 
                                                        >
                                                            Remover
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </>
                    )}

                    {view === 'grade' && (
                        <>
                            <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
                                Criar Grade
                            </Typography>
                            <form onSubmit={handleGrade}>
                                <TextField
                                    label="Horário"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={horario}
                                    onChange={(e) => setHorario(e.target.value)}
                                    required
                                />
                                <TextField
                                    label="Matéria"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={materia}
                                    onChange={(e) => setMateria(e.target.value)}
                                    required
                                />
                                <TextField
                                    label="Local"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={local}
                                    onChange={(e) => setLocal(e.target.value)}
                                    required
                                />
                                <TextField
                                    label="Tópico"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={topico}
                                    onChange={(e) => setTopico(e.target.value)}
                                    required
                                />
                                <TextField
                                    label="Professor"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={professor}
                                    onChange={(e) => setProfessor(e.target.value)}
                                    required
                                />
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Sala</InputLabel>
                                    <Select
                                        value={sala}
                                        onChange={(e) => setSala(e.target.value)}
                                        label="Sala"
                                    >
                                        <MenuItem value="Presencial">Presencial</MenuItem>
                                        <MenuItem value="Online">Online</MenuItem>
                                    </Select>
                                </FormControl>
                                <DatePicker
                                    selected={data}
                                    onChange={handleDateChange}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="Selecionar data"
                                    className="date-picker"
                                />
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    type="submit" 
                                    sx={{ mt: 2 }}
                                >
                                    Criar Grade
                                </Button>
                            </form>
                            <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                                Grades Criadas
                            </Typography>

                            {loading ? (
                                <CircularProgress />
                            ) : error ? (
                                <Alert severity="error">{error}</Alert>
                            ) : (
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Data</TableCell>
                                                <TableCell>Horario</TableCell>
                                                <TableCell>Materia</TableCell>
                                                <TableCell>Sala</TableCell>
                                                <TableCell>Ações</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {grades.map((grade) => (
                                                <TableRow key={grade._id}>
                                                    <TableCell>{grade.data}</TableCell>
                                                    <TableCell>{grade.horario}</TableCell>
                                                    <TableCell>{grade.materia}</TableCell>
                                                    <TableCell>{grade.sala}</TableCell>
                                                    <TableCell>
                                                        <Button 
                                                            variant="outlined" 
                                                            color="error" 
                                                            onClick={() => handleGradeDelete(grade._id)} 
                                                        >
                                                            Remover
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </>
                    )}
                </Box>
            </Container>
        </>
    );
}

export default ConteudoGestao;
