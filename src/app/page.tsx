"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '../utils/axios';
import './styles/Login.css';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await API.post('/token/', { username, password });
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            API.defaults.headers['Authorization'] = 'Bearer ' + response.data.access;
            router.push('/Home');
        } catch (error) {
            console.error('Erro ao fazer login:', error);
        }
    };

    return (
        <div className="login-container">
            <h1 className='login-title'>LOGIN</h1>
            <form onSubmit={handleSubmit} className='form-login'>
                <div className='inputs-labels'>
                    <h3>Usuário</h3>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className='inputs'
                    />
                </div>
                <div className='inputs-labels'>
                    <h3>Senha</h3>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='inputs'
                    />
                </div>
                <button type="submit" className="login-button">Entrar</button>
            </form>
        </div>
    );
}