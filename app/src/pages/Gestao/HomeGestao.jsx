import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, Legend,LineChart } from 'recharts';
import HeaderGestao from './HeaderGestao';
import Cookies from 'universal-cookie';
import { Box, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function HomeGestao() {
    const [data, setData] = useState([]);
    const [barData, setBarData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('geral');
    const cookies = new Cookies();
    const token = cookies.get('token');

    const fetchData = async () => {
        try {
            const [alunospresenicalResponse, alunosOnlineResponse, professoresResponse, gestaoResponse, notasGeraisResponse, notasPresencialResponse, notasOnlineResponse] = await Promise.all([
                fetch("http://127.0.0.1:8000/info/getNumeroAlunosPresencial", { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }),
                fetch("http://127.0.0.1:8000/info/getNumeroAlunosOnline", { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }),
                fetch("http://127.0.0.1:8000/info/getNumeroProfessores", { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }),
                fetch("http://127.0.0.1:8000/info/getNumeroGestao", { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }),
                fetch("http://127.0.0.1:8000/info/getNotasGerais", { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }),
                fetch("http://127.0.0.1:8000/info/getNotasPresencial", { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }),
                fetch("http://127.0.0.1:8000/info/getNotasOnline", { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            const alunos_presenciais = await alunospresenicalResponse.json();
            const alunos_online = await alunosOnlineResponse.json();
            const professores = await professoresResponse.json();
            const gestao = await gestaoResponse.json();
            const notasGerais = await notasGeraisResponse.json();
            const notasPresencial = await notasPresencialResponse.json();
            const notasOnline = await notasOnlineResponse.json();

            setData([
                { name: "Alunos Presencial", value: alunos_presenciais },
                { name: "Alunos Online", value: alunos_online },
                { name: "Professores", value: professores },
                { name: "Gestão", value: gestao }
            ]);

            processBarData(notasGerais, notasPresencial, notasOnline);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            setLoading(false);
        }
    };

    const processBarData = (notasGerais, notasPresencial, notasOnline) => {
        const subjects = Object.keys(notasPresencial[0]);
        const processedBarData = subjects.map(subject => {
            const avgPresencial = notasPresencial.reduce((sum, aluno) => sum + parseFloat(aluno[subject] || 0), 0) / notasPresencial.length;
            const avgOnline = notasOnline.reduce((sum, aluno) => sum + parseFloat(aluno[subject] || 0), 0) / notasOnline.length;
            const avgGeral = notasGerais.reduce((sum, aluno) => sum + parseFloat(aluno[subject] || 0), 0) / notasGerais.length;

            return { subject, Geral: avgGeral.toFixed(2), Presencial: avgPresencial.toFixed(2), Online: avgOnline.toFixed(2) };
        });

        setBarData(processedBarData);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getFilteredBarData = () => {
        return barData; // Retorna os dados presenciais e online para o gráfico
    };
    const COLORS = ['#0000FF', '#FF0000', '#FFD700', '#006400']; // Azul, Vermelho, Amarelo, Verde Escuro


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

            <Grid container spacing={4} padding={4} direction="column" alignItems="center">

                {/* Gráfico de pizza para Alunos, Professores e Gestão */}
                <Grid item xs={12} style={{ width: '80%' }}>
                    <Box 
                        sx={{
                            backgroundColor: 'white',
                            boxShadow: 3,
                            borderRadius: 2,
                            padding: 2,
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%'
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Distribuição de Alunos, Professores e Gestão
                        </Typography>
                        <PieChart width={500} height={400}>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}`}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </Box>
                </Grid>

                {/* Gráfico de barras para comparação de notas */}
                <Grid item xs={12} style={{ width: '80%' }}>
                    <Box 
                        sx={{
                            backgroundColor: 'white',
                            boxShadow: 3,
                            borderRadius: 2,
                            padding: 2,
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%'
                        }}
                    >
                        {/* Componente de filtro */}
                        <Grid item xs={12} style={{ width: '50%' }}  sx={{marginTop:1}}>
                            <FormControl fullWidth>
                                <InputLabel id="filter-label" sx={{marginTop:-1}}>Selecione o Filtro</InputLabel>
                                <Select
                                    labelId="filter-label"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                >
                                    <MenuItem value="geral">Geral</MenuItem>
                                    <MenuItem value="separado">Separado</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Typography variant="h6" gutterBottom>
                            {filter === 'geral' ? 'Notas Gerais' : 'Notas Presencial vs Online'}
                        </Typography>
                        <BarChart
                            width={1000}
                            height={400}
                            data={getFilteredBarData()} // Usa os dados filtrados
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis dataKey="subject" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {filter === 'geral' ? (
                                <Bar dataKey="Geral" fill={COLORS[0]} />
                            ) : (
                                <>
                                    <Bar dataKey="Presencial" fill={COLORS[3]}  />
                                    <Bar dataKey="Online" fill={COLORS[1]}  />
                                </>
                            )}
                        </BarChart>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}

export default HomeGestao;
