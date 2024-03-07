'use client';

import { useEffect, useState } from "react";

export default function Login() {
    const url = 'http://localhost:5066/';
    const [token, setToken] = useState<string | null>(null);
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [error, setError] = useState('');

    function handleLogin(usuario: string, senha: string) {
        if (!usuario || !senha) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        fetch(`${url}Auth/login?login=${usuario}&senha=${senha}`,{
            method: 'POST'
        }).then((res) => {
            if (!res.ok) {
                throw new Error('Falha ao fazer login. Por favor, verifique suas credenciais.');
            }
            return res.json();
        }).then((data) => {
            const token = data.token;
            setToken(token);
            sessionStorage.setItem('token', token);
            setError('');
        }).catch((error) => {
            setError(error.message);
            console.error('Erro ao recuperar os dados:', error);
        });
    }

    // Redirect if token exists
    useEffect(() => {
        if (token) {
            window.location.href = '/';
        }
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-semibold mb-4">Faça login na sua conta</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 border border-gray-300 mb-4 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Senha"
                    className="w-full px-4 py-2 border border-gray-300 mb-4 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
                <button
                    onClick={() => handleLogin(usuario, senha)}
                    className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md transition duration-300 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
                >
                    Login
                </button>
                <p className="mt-4 text-sm text-gray-600">
                    Ainda não tem uma conta? <a href="/pages/cadastro" className="text-blue-500">Registre-se</a>
                </p>
            </div>
        </div>
    );
}
