import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import HeaderAluno from './HeaderAluno';
import './static/GradeAluno.css'; 
import Cookies from 'universal-cookie';
import { Grid, Card, CardContent, Typography, Container } from '@mui/material'; // Import MUI components

function GradeAluno() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [grade, setGrade] = useState({});
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
        fetch(`http://localhost:5000/aluno/grade/${formatDate(selectedDate)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Falha ao buscar aluno');
                }
                return response.json();
            })
            .then((grade) => {
                setGrade(grade);
            })
            .catch((error) => {
                console.error('Erro ao buscar aluno:', error);
            });
    }, [token, selectedDate]);

    return (
        <>
            <HeaderAluno />
            <Container>
                <div className='grade-aluno'>
                    <div className="calendario-container">
                        <Typography variant="h5" gutterBottom>Selecione uma data:</Typography>
                        <DatePicker 
                            selected={selectedDate} 
                            onChange={handleDateChange} 
                            dateFormat="dd/MM/yyyy" 
                            inline
                        />
                    </div>
                    <Grid container spacing={3} style={{ marginTop: '20px' }}>
                        {Object.entries(grade).map(([time, subject]) => (
                            <Grid item xs={12} sm={6} md={4} key={time}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {time}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            {subject}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </Container>
        </>
    );
}

export default GradeAluno;
