import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';
import HeaderGestao from './HeaderGestao';
import Cookies from 'universal-cookie';
import { Box, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function HomeGestao() {
    const [data, setData] = useState([]);
    const [barData, setBarData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('geral');
    const [pieFilter, setPieFilter] = useState('total'); // Filtro inicial como 'total' para exibir total de alunos
    const cookies = new Cookies();
    const token = cookies.get('token');

    const fetchData = async () => {
        try {
            const [alunosPresencialResponse, alunosOnlineResponse, professoresResponse, gestaoResponse, notasGeraisResponse, notasPresencialResponse, notasOnlineResponse] = await Promise.all([
                fetch("http://127.0.0.1:8000/info/getNumeroAlunosPresencial", { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }),
                fetch("http://127.0.0.1:8000/info/getNumeroAlunosOnline", { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }),
                fetch("http://127.0.0.1:8000/info/getNumeroProfessores", { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }),
                fetch("http://127.0.0.1:8000/info/getNumeroGestao", { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }),
                fetch("http://127.0.0.1:8000/info/getNotasGerais", { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }),
                fetch("http://127.0.0.1:8000/info/getNotasPresencial", { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } }),
                fetch("http://127.0.0.1:8000/info/getNotasOnline", { method: 'GET', headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            const alunosPresenciais = await alunosPresencialResponse.json();
            const alunosOnline = await alunosOnlineResponse.json();
            const professores = await professoresResponse.json();
            const gestao = await gestaoResponse.json();
            const notasGerais = await notasGeraisResponse.json();
            const notasPresencial = await notasPresencialResponse.json();
            const notasOnline = await notasOnlineResponse.json();

            setData([
                { name: "Alunos Presencial", value: alunosPresenciais },
                { name: "Alunos Online", value: alunosOnline },
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

    const getFilteredPieData = () => {
        if (pieFilter === 'total') {
            // Calcula o total de alunos e retorna uma única entrada "Alunos"
            const totalAlunos = data
                .filter(item => item.name.includes('Alunos'))
                .reduce((sum, item) => sum + item.value, 0);
            return [
                { name: "Alunos", value: totalAlunos },
                { name: "Professores", value: data.find(item => item.name === 'Professores')?.value || 0 },
                { name: "Gestão", value: data.find(item => item.name === 'Gestão')?.value || 0 }
            ];
        }
        if (pieFilter === 'students') return data.filter(item => item.name.includes('Alunos'));
        return data; // Exibe todos
    };

    const getFilteredBarData = () => {
        return barData;
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
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Bem vindo</Typography>
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

                <Grid item xs={12} style={{ width: '50%' }}  sx={{marginBottom:2}}>
                    <FormControl fullWidth>
                        <InputLabel id="pie-filter-label" sx={{marginTop:-1}}></InputLabel>
                        <Select
                            labelId="pie-filter-label"
                            value={pieFilter}
                            onChange={(e) => setPieFilter(e.target.value)}
                        >
                            <MenuItem value="total">Total de Alunos, Professores e Gestão</MenuItem>
                            <MenuItem value="students">Alunos Presenciais e Alunos Online</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                        <Typography variant="h6" gutterBottom>
                            Distribuição de Tipos de Usuários
                        </Typography>
                        <PieChart width={500} height={400}>
                            <Pie
                                data={getFilteredPieData()}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}`}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {getFilteredPieData().map((entry, index) => (
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
                                <InputLabel id="filter-label" sx={{marginTop:-1}}></InputLabel>
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
                            Comparação de Notas
                        </Typography>
                        <BarChart
                            width={600}
                            height={400}
                            data={getFilteredBarData()}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5
                            }}
                        >
                            <XAxis dataKey="subject" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey={filter === 'geral' ? 'Geral' : 'Presencial'} fill="#0000FF" />
                            {filter === 'separado' && <Bar dataKey="Online" fill="#FF0000" />}
                        </BarChart>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}

export default HomeGestao;
