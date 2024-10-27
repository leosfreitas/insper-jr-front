import React, { useEffect, useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import HeaderAluno from './HeaderAluno';
import Cookies from 'universal-cookie';
import { Grid, Card, CardContent, Typography, Container, Alert, Box, IconButton, FormControl, InputLabel } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import './static/DatePickerStyler.css';

function GradeAluno() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const cookies = new Cookies();
    const token = cookies.get("token");

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    useEffect(() => {
        const fetchGrades = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://127.0.0.1:8000/grade/${formatDate(selectedDate)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Falha ao buscar grade do aluno');
                }
                const data = await response.json();
                console.log("Dados recebidos da API:", data);

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
                setLoading(false);
            }
        };

        fetchGrades();
    }, [token, selectedDate]);

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
                    padding: '0 20px',
                }}
            >   
                <Typography variant="h4">Grade Horária</Typography>
                <FormControl variant="outlined" sx={{ position: 'absolute', right: '10%', top:'10%' }}>
                    <InputLabel sx={{ color: 'white' }}></InputLabel>
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
                            <Typography variant="h6">Nenhuma grade encontrada para esta data.</Typography>
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
