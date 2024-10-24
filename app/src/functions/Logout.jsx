import React from 'react';
import Cookies from 'universal-cookie';
import { Link, useNavigate } from 'react-router-dom';

const cookies = new Cookies();

const Logout = () => {
    const navigate = useNavigate();
    const token = cookies.get('token');

    const handleLogout = (e) => {
        e.preventDefault();

        fetch('http://127.0.0.1:8000/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to logout');
            }
            cookies.remove('token', { path: '/' });
            navigate('/login');
        })
        .catch(error => {
            console.error('Error logging out:', error);
        });
    };

    return (
        <Link to="/logout" onClick={handleLogout}>Logout</Link>
    );
};

export default Logout;