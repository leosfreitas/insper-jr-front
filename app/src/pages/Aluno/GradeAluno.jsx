import React, { useEffect, useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import HeaderAluno from './HeaderAluno';
import Cookies from 'universal-cookie';
import { Grid, Card, CardContent, Typography, Container, Alert, Box, IconButton, FormControl } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import './static/DatePickerStyler.css';

// Componente principal que exibe a grade horária do aluno
function GradeAluno() {
    // Estados para armazenar a data selecionada, a lista de aulas, o status de carregamento e erros
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Objeto para lidar com cookies e recuperar o token de autenticação do usuário
    const cookies = new Cookies();
    const token = cookies.get("token");

    // Função para formatar a data no padrão 'DD-MM-YYYY' para uso na requisição de dados
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Atualiza a data selecionada quando o usuário escolhe uma nova data no calendário
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    // Componente customizado para o botão de seleção de data, estilizado com um ícone de calendário
    const CustomDateInput = forwardRef(({ onClick }, ref) => (
        <IconButton onClick={onClick} ref={ref} sx={{
            backgroundColor: '#ab2325', 
            color: 'white', 
            borderRadius: '5px',
            padding: '10px',
            marginLeft: '10px',
            '&:hover': {
                backgroundColor: '#a02024',
            },
        }}>
            <CalendarMonthIcon style={{ fontSize: '40px' }} />
        </IconButton>
    ));

    // Hook useEffect para buscar a lista de aulas do aluno sempre que a data selecionada ou o token mudar
    useEffect(() => {
        // Função assíncrona para buscar dados da grade de aulas do aluno da API
        const fetchGrades = async () => {
            setLoading(true); // Inicia o estado de carregamento
            try {
                // Requisição para obter a grade baseada na data selecionada
                const response = await fetch(`http://127.0.0.1:8000/grade/${formatDate(selectedDate)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Token de autenticação
                    },
                });
                if (!response.ok) {
                    throw new Error('Falha ao buscar grade do aluno');
                }
                const data = await response.json();
                console.log("Dados recebidos da API:", data);

                // Verifica se a resposta da API é um array de dados válidos
                if (Array.isArray(data)) {
                    setGrades(data);
                } else {
                    setGrades([]);
                    setError('A resposta da API não é um array');
                }
                setError(null);
            } catch (error) {
                console.error('Erro ao buscar grades:', error);
                setError(error.message);
                setGrades([]);
            } finally {
                setLoading(false); // Finaliza o estado de carregamento
            }
        };

        fetchGrades(); // Chama a função para buscar as grades
    }, [token, selectedDate]);

    return (
        <>
            <HeaderAluno />
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
                    position: 'relative', 
                }}
            >   
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Grade Horária</Typography>
            </Box>

            <Box
                sx={{
                    textAlign: 'center',
                    marginTop: '20px', 
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: 600 }}>Selecione a data:</Typography>
                <FormControl variant="outlined" sx={{ display: 'inline-block', marginTop: '10px' }}>
                    <DatePicker 
                        selected={selectedDate} 
                        onChange={handleDateChange} 
                        dateFormat="dd/MM/yyyy" 
                        customInput={<CustomDateInput />}
                        showPopperArrow={false}
                    />
                </FormControl>
            </Box>

            <Container>
                {loading ? (
                    <Typography variant="h6">Carregando...</Typography>
                ) : (
                    <Grid container spacing={3} style={{ marginTop: '20px' }}>
                        {error && <Alert severity="error">{error}</Alert>}
                        {grades.length === 0 ? (
                            <Grid item xs={12}>
                                <Typography variant="h6" align="center">Nenhuma aula encontrada para esta data.</Typography>
                            </Grid>
                        ) : (
                            grades.map(({ _id, horario, materia, local, topico, professor }) => (
                                <Grid item xs={12} sm={6} md={4} key={_id}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" component="div">
                                                {horario}
                                            </Typography>
                                            <Typography color="text.secondary">
                                                Matéria: {materia}
                                            </Typography>
                                            <Typography color="text.secondary">
                                                Sala ou link: {local}
                                            </Typography>
                                            <Typography color="text.secondary">
                                                Tópico: {topico}
                                            </Typography>
                                            <Typography color="text.secondary">
                                                Professor: {professor}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        )}
                    </Grid>
                )}
            </Container>
        </>
    );
}

export default GradeAluno;
