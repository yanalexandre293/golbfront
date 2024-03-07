'use client';

import { useEffect } from 'react';

export default function Home() {

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
          window.location.href = '/pages/home';
        } else {
          window.location.href = '/pages/login';
        }
    }, []);

    return (
        <div>
        </div>
    );
}
