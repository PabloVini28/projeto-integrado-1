import React from 'react';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import LoginPage from './authentication/login';
import HomePage from './pages/Inicio/HomePage';

import AlunosPage from './pages/Alunos/AlunosPage';
import PlanosPage from './pages/Planos/PlanosPage';
import FinanceiroPage from './pages/Financeiro/FinanceiroPage';
import PatrimonioPage from './pages/Patrimonio/PatrimonioPage';
import RelatoriosPage from './pages/Relatorios/RelatoriosPage';
import ConfigPage from './pages/Configuracoes/ConfigPage';


const router = createHashRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "alunos",
                element: <AlunosPage />,
            },
            {
                path: "planos",
                element: <PlanosPage />,
            },
            {
                path: "financeiro",
                element: <FinanceiroPage />,
            },
            {
                path: "patrimonio",
                element: <PatrimonioPage />,
            },
            {
                path: "relatorios",
                element: <RelatoriosPage />,
            },
            {
                path: "configuracoes",
                element: <ConfigPage />,
            },
        ],
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);