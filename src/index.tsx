import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './Home';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import AuthWrapper from './components/AuthWrapper';
import { Routes } from './enums/route.enums';
import ContentWrapper from './components/ContentWrapper';
import CreateQuizPage from './pages/CreateQuizPage/CreateQuizPage';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
);

const router = createBrowserRouter([
    {
        path: Routes.HOME_PAGE,
        element: (
            <AuthWrapper>
                <ContentWrapper>
                    <Home />
                </ContentWrapper>
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
    {
        path: Routes.CREATE_QUIZ_PAGE,
        element: (
            <AuthWrapper>
                <ContentWrapper>
                    <CreateQuizPage />
                </ContentWrapper>
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
