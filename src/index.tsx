import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import AuthWrapper from './components/AuthWrapper';
import { Routes } from './enums/route.enums';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);

const router = createBrowserRouter([
    {
        path: Routes.HOME_PAGE,
        element: (
            <AuthWrapper>
                <App />
            </AuthWrapper>
        ),
        errorElement: <NotFoundPage />,
    },
    {
        path: Routes.LOGIN_PAGE,
        element: (
            <AuthWrapper>
                <LoginPage />
            </AuthWrapper>
        ),
    },
]);

root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
