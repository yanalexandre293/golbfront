'use client';

import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import PostComponent from "../../components/PostComponent";

export default function Home() {
  const url = 'http://localhost:5066/';
  const [token, setToken] = useState<string | null>(null);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const usuarioIdFromToken: number = decodedToken?.UsuarioId;
      setUsuarioId(usuarioIdFromToken);

      console.log(decodedToken);
      console.log(usuarioIdFromToken);
      console.log(decodedToken);
      console.log(usuarioIdFromToken);
      console.log(decodedToken);
      console.log(usuarioIdFromToken);
    }
  }, [token]);

  const handleLogout = async () => {
    fetch(`${url}Auth/logout`, {
      method: 'POST'
    })
    .then(() => {
      sessionStorage.removeItem('token');
    })
    .then(() => {
      window.location.href = '/';
    })
    .catch((error) => {
      console.error('Erro ao realizar o logout:', error);
    });
  }

  useEffect(() => {
    if (!sessionStorage.getItem('token')) {
      window.location.href = '/pages/login';
    }
  }, []);

  return (
    <main>
      <button onClick={handleLogout}>Sair</button>
      <div>
        {usuarioId !== null ? usuarioId : "Carregando..."}
      </div>
      <div className="flex flex-col items-center justify-between m-12">
        <PostComponent usuarioId={usuarioId}/>
      </div>
    </main>
  );
}
