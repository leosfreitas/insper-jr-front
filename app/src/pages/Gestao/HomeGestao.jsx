import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';
import HeaderGestao from './HeaderGestao';
import Cookies from 'universal-cookie';
import { Box, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

/**
 * Componente principal da página de gestão que exibe dados estatísticos sobre alunos e professores.
 *
 * @function HomeGestao
 * @returns {JSX.Element} Elemento JSX representando a interface de gestão.
 */
function HomeGestao() {
    const [data, setData] = useState([]);
    const [barData, setBarData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('separado');
    const [pieFilter, setPieFilter] = useState('total');
    const cookies = new Cookies();
    const token = cookies.get('token');

    /**
     * Função assíncrona que busca dados de alunos, professores e notas de diversas fontes.
     *
     * @async
     * @function fetchData
     * @returns {Promise<void>}
     */
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

    /**
     * Processa os dados das notas para gerar um conjunto de dados para o gráfico de barras.
     *
     * @function processBarData
     * @param {Array<Object>} notasGerais - Array de notas gerais dos alunos.
     * @param {Array<Object>} notasPresencial - Array de notas dos alunos presenciais.
     * @param {Array<Object>} notasOnline - Array de notas dos alunos online.
     * @returns {void}
     */
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
        /**
     * Obtém os dados filtrados para o gráfico de barras.
     *
     * @function getFilteredBarData
     * @returns {Array<Object>} Dados filtrados para o gráfico de barras.
     */
    const getFilteredBarData = () => {
        return barData;
    };

    useEffect(() => {
        fetchData();
    }, []);

    /**
     * Filtra os dados do gráfico de pizza com base no filtro selecionado.
     *
     * @function getFilteredPieData
     * @returns {Array<Object>} Dados filtrados para o gráfico de pizza.
     */
    const getFilteredPieData = () => {
        if (pieFilter === 'total') {
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
        return data;
    };


    const COLORS = ['#0000FF', '#FF0000', '#FFD700', '#006400'];

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

            <Grid container spacing={4} padding={4} direction="row" alignItems="center" justifyContent="center">
    
            {/* Gráfico de pizza para Alunos, Professores e Gestão */}
            <Grid item xs={12} md={6} style={{ display: 'flex', justifyContent: 'center' }}>
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
                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                        <InputLabel id="pie-filter-label" sx={{ marginTop: -1 }}></InputLabel>
                        <Select
                            labelId="pie-filter-label"
                            value={pieFilter}
                            onChange={(e) => setPieFilter(e.target.value)}
                        >
                            <MenuItem value="total">Total de Alunos, Professores e Gestão</MenuItem>
                            <MenuItem value="students">Alunos Presenciais e Alunos Online</MenuItem>
                        </Select>
                    </FormControl>
                    <Typography variant="h6" gutterBottom>
                        Distribuição de Tipos de Usuários
                    </Typography>
                    <PieChart width={400} height={300}>
                        <Pie
                            data={getFilteredPieData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}`}
                            outerRadius={100}
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
            <Grid item xs={12} md={6} style={{ display: 'flex', justifyContent: 'center' }}>
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
                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                        <InputLabel id="filter-label" sx={{ marginTop: -1 }}></InputLabel>
                        <Select
                            labelId="filter-label"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <MenuItem value="separado">Separado</MenuItem>
                            <MenuItem value="geral">Geral</MenuItem>
                        </Select>
                    </FormControl>
                    <Typography variant="h6" gutterBottom>
                        Comparação de Notas
                    </Typography>
                    <BarChart
                        width={450}
                        height={300}
                        data={getFilteredBarData()}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5
                        }}
                    >
                        <XAxis dataKey="subject" tickFormatter={(value, index) => index + 1} />
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
