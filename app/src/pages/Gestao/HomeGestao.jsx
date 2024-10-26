import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import HeaderGestao from './HeaderGestao';
import Cookies from 'universal-cookie';
import { Box, Typography } from '@mui/material';

function HomeGestao() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const cookies = new Cookies();
    const token = cookies.get('token');

    const fetchData = async () => {
        try {
            const [alunosResponse, professoresResponse, gestaoResponse] = await Promise.all([
                fetch("http://127.0.0.1:8000/info/getNumeroAlunos", {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }),
                fetch("http://127.0.0.1:8000/info/getNumeroProfessores", {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }),
                fetch("http://127.0.0.1:8000/info/getNumeroGestao", {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            ]);
    
            const alunos = await alunosResponse.json();
            const professores = await professoresResponse.json();
            const gestao = await gestaoResponse.json();
    
            setData([
                { name: "Alunos", value: alunos },
                { name: "Professores", value: professores },
                { name: "Gestão", value: gestao }
            ]);
    
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

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
                    <Typography variant="h4">Bem vindo</Typography>
                </Box>
                <PieChart width={500} height={400}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
        </>
    );
};


export default HomeGestao;