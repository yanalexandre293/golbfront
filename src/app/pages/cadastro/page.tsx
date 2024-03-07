'use client';

import { useState } from "react";

export default function CreateUser() {
    const [nome, setNome] = useState('');
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmSenha, setConfirmSenha] = useState('');
    const [error, setError] = useState<string>('');
    const url = 'http://localhost:5066/';

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        if (senha !== confirmSenha) {
            setError('As senhas não coincidem.');
            return;
        }
        const newUser = {
            id: 0,
            nome,
            login,
            senha
        };
        try {
            const response = await fetch(`${url}Usuario/cadastrar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });
            if (!response.ok) {
                throw new Error('Erro ao criar usuário.');
            }
            console.log(JSON.stringify(newUser));
            //window.location.href = '/pages/login'
        } catch (error) {
            setError('Erro ao criar usuário: ' + error);
        }
    };

    
    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-semibold mb-4">Crie sua conta</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input
                    type="text"
                    placeholder="Nome"
                    className="w-full px-4 py-2 border border-gray-300 mb-4 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Login"
                    className="w-full px-4 py-2 border border-gray-300 mb-4 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Senha"
                    className="w-full px-4 py-2 border border-gray-300 mb-4 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirmar senha"
                    className="w-full px-4 py-2 border border-gray-300 mb-4 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                    value={confirmSenha}
                    onChange={(e) => setConfirmSenha(e.target.value)}
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md transition duration-300 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
                >
                    Criar conta
                </button>
            </form>
        </div>
    );
}
