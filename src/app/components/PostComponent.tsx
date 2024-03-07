'use client';

import { useEffect, useState } from "react";
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInMonths, differenceInSeconds, differenceInWeeks, differenceInYears } from 'date-fns';


export default function PostComponent(props: any) {
    const url = 'http://localhost:5066/';
    const [posts, setPosts] = useState<Post[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [curtidos, setCurtidos] = useState<{ [key: number]: boolean }>({});
    const [token, setToken] = useState<string | null>(null);


    useEffect(() => {
        const token = sessionStorage.getItem('token');
        setToken(token);
        if (token != null) {
            fetchPosts(token);
            fetchUsuarios(token);
            fetchCurtidos(token, props.usuarioId);
        }
    }, []);

    const fetchPosts = async (token: any) => {
        return await fetch(`${url}Post/listar`,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((res) => {
            if (!res.ok) {
            throw new Error('Falha ao recuperar os dados da API');
            }
            return res.json();
        })
        .then((p) => setPosts(p))
        .catch((error) => console.error('Erro ao recuperar os dados:', error));
    };

    const fetchUsuarios = async (token: any) => {
        return await fetch(`${url}Usuario/listar`,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((res) => {
            if (!res.ok) {
            throw new Error('Falha ao recuperar os dados da API');
            }
            return res.json();
        })
        .then((u) => setUsuarios(u))
        .catch((error) => console.error('Erro ao recuperar os dados:', error));
    };


    const fetchCurtidos = async (token: any, usuarioId: number) => {
        try {
            const res = await fetch(`${url}Post/listarCurtidos`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!res.ok) {
                throw new Error('Falha ao recuperar os dados da API');
            }
    
            const data = await res.json();
            const curtidosMap: { [key: number]: boolean } = {};
    
            data.forEach((curtido: PostCurtido) => {
                if (curtido.usuarioId === usuarioId) {
                    curtidosMap[curtido.postId] = true;
                } else {
                    curtidosMap[curtido.postId] = false;
                }
            });

            console.log(data);
            console.log(curtidosMap);
    
            setCurtidos(curtidosMap);
        } catch (error) {
            console.error('Erro ao recuperar os dados:', error);
        }
    };

    


    const formatRelativeTime = (postDate: Date): string => {
        const currentDate = new Date();

        const secondsDiff = differenceInSeconds(currentDate, postDate);
        if (secondsDiff < 60) {
            return `agora`;
        }

        const minutesDiff = differenceInMinutes(currentDate, postDate);
        if (minutesDiff < 60) {
            return `${minutesDiff} minutos atrás`;
        }

        const hoursDiff = differenceInHours(currentDate, postDate);
        if (hoursDiff < 24) {
            return `${hoursDiff} horas atrás`;
        }

        const daysDiff = differenceInDays(currentDate, postDate);
        if (daysDiff < 7) {
            return `${daysDiff} dias atrás`;
        }

        const weeksDiff = differenceInWeeks(currentDate, postDate);
        if (weeksDiff < 4) {
            return `${weeksDiff} semanas atrás`;
        }

        const monthsDiff = differenceInMonths(currentDate, postDate);
        if (monthsDiff < 12) {
            return `${monthsDiff} meses atrás`;
        }

        const yearsDiff = differenceInYears(currentDate, postDate);
        return `${yearsDiff} anos atrás`;
    };


    const handleCurtir = async (postId: number, usuarioId: number, token: any) => {
        try {
            const response = await fetch(`http://localhost:5066/Post/curtir?PostId=${postId}&UsuarioId=${usuarioId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ PostId: postId, UsuarioId: usuarioId })
            });

            if (response.ok) {
                let isCurtido = false;
                if(curtidos[postId] == true){
                    isCurtido = true;
                }else{
                    isCurtido = false;
                }
                
                setCurtidos({ ...curtidos, [postId]: !isCurtido });
                fetchPosts(token);
            } else {
                console.error('Erro ao curtir a postagem:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao curtir a postagem:', error);
        }
    };


    return (
        <div>
            {posts.map((post) => (
                <div key={post.Id}>
                    <div className="bg-white shadow-md rounded-lg px-4 pt-4 pb-2 mb-4 w-[30vw]">
                        <div className="flex mb-2">
                            <div className="w-10 h-10 rounded-full mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-user-filled" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z" strokeWidth="0" fill="currentColor" />
                                    <path d="M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z" strokeWidth="0" fill="currentColor" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-lg font-semibold">{post.Usuario.Nome}</div>
                                <div className="text-gray-500 text-sm">@{post.Usuario.Login}</div>
                            </div>

                            <button className="rounded bg-blue-800 text-white text-sm ml-[5%] px-2 m-0 h-fit">
                                Seguir
                            </button>
                        </div>

                        <div>
                            <p className="text-gray-800 pb-3">{post.Mensagem}</p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 border-b border-gray-200 pb-3">
                                {formatRelativeTime(new Date(post.DataHora))}
                            </p>
                        </div>

                        <div className="flex border-b border-gray-200 py-3 gap-4">
                            <div>
                                <p className="text-sm"><b>{post.Curtidas}</b> Likes</p>
                            </div>
                            <div>
                                <p className="text-sm"><b>{post.Compartilhamentos}</b> Compartilhamentos</p>
                            </div>
                        </div>

                        <div className="flex mt-2 w-full m-0">
                            <div className="flex-grow flex justify-center m-0 p-0">
                                <button className="hover:bg-red-300 rounded-full p-1" onClick={() => handleCurtir(post.Id, props.usuarioId, token)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-heart" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill={curtidos[post.Id] ? "red" : "none"} strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex-grow flex justify-center">
                                <button className="fill-none hover:bg-blue-300 rounded-full p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-share-3" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <path d="M13 4v4c-6.575 1.028 -9.02 6.788 -10 12c-.037 .206 5.384 -5.962 10 -6v4l8 -7l-8 -7z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}