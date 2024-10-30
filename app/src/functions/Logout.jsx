import React from 'react';
import Cookies from 'universal-cookie';
import { Link, useNavigate } from 'react-router-dom';

// Instancia o gerenciador de cookies
const cookies = new Cookies();

/**
 * Componente para realizar logout do usuário.
 *
 * Este componente gerencia o processo de logout,
 * removendo o token de autenticação armazenado nos cookies
 * e redirecionando o usuário para a página de login.
 *
 * @returns {JSX.Element} Um link que, ao ser clicado, executa o logout.
 */
const Logout = () => {
    const navigate = useNavigate(); // Navegação programática
    const token = cookies.get('token'); // Recupera o token dos cookies

    /**
     * Manipulador de evento para o logout.
     *
     * Este método faz uma requisição para o servidor para
     * efetuar o logout, remove o token dos cookies e redireciona
     * o usuário para a página de login.
     *
     * @param {React.MouseEvent} e - O evento de clique do link.
     */
    const handleLogout = (e) => {
        e.preventDefault(); // Previne o comportamento padrão do link

        fetch('http://127.0.0.1:8000/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Envia o token para autenticação
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to logout'); // Lança erro se a resposta não for OK
            }
            cookies.remove('token', { path: '/' }); // Remove o token dos cookies
            navigate('/login'); // Redireciona para a página de login
        })
        .catch(error => {
            console.error('Error logging out:', error); // Log de erro em caso de falha
        });
    };

    return (
        <Link to="/logout" onClick={handleLogout}>Logout</Link> // Link para logout
    );
};

export default Logout;
