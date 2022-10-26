import React, { createContext, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthWrapper from './components/AuthWrapper';
import ContentWrapper from './components/ContentWrapper';
import Home from './pages/Home';
import { Routes } from './enums/route.enums';
import ErrorPage from './pages/ErrorPage';
import LoginPage from './pages/LoginPage';
import CreateQuizPage from './pages/CreateQuizPage/CreateQuizPage';
import QuizListPage from './pages/QuizListPage/QuizListPage';
import QuizPage from './pages/QuizPage/QuizPage';
import { User } from 'firebase/auth';

export const UserContext = createContext<{
    isUpEmail: boolean | null;
    user: User | null;
    setIsUpEmail: React.Dispatch<React.SetStateAction<boolean | null>> | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>> | null;
}>({
    isUpEmail: false,
    user: null,
    setUser: null,
    setIsUpEmail: null,
});

function App() {
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
            errorElement: <ErrorPage />,
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
        {
            path: Routes.QUIZ_LIST_PAGE,
            element: (
                <AuthWrapper>
                    <ContentWrapper>
                        <QuizListPage />
                    </ContentWrapper>
                </AuthWrapper>
            ),
        },
        {
            path: Routes.QUIZ_PAGE,
            element: (
                <AuthWrapper>
                    <ContentWrapper>
                        <QuizPage />
                    </ContentWrapper>
                </AuthWrapper>
            ),
        },
    ]);

    const [user, setUser] = useState<User | null>(null);
    const [isUpEmail, setIsUpEmail] = useState<boolean | null>(false);

    return (
        <UserContext.Provider
            value={{ isUpEmail, user, setUser, setIsUpEmail }}
        >
            <RouterProvider router={router} />
        </UserContext.Provider>
    );
}

export default App;
