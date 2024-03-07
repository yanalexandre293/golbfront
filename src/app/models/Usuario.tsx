interface Usuario{
    Id: number;
    Nome: string;
    Login: string;
    Amigos: Usuario[];
    Posts: Post[];
}