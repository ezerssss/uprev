import React, { createContext, useEffect, useState } from 'react';
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
import FlashcardsListPage from './pages/FlashcardsListPage/FlashcardsListPage';
import FlashcardsPage from './pages/FlashcardsPage/FlashcardsPage';
import CreateFlashcardPage from './pages/CreateFlashcardPage/CreateFlashcardPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import { getSubjectsConfig } from './helpers/config';

export const UserContext = createContext<{
    isEmailWhitelisted: boolean | null;
    user: User | null;
    setIsEmailWhitelisted: React.Dispatch<
        React.SetStateAction<boolean | null>
    > | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>> | null;
}>({
    isEmailWhitelisted: false,
    user: null,
    setUser: null,
    setIsEmailWhitelisted: null,
});

export const ConfigContext = createContext<{
    subjects: string[];
    setSubjects: React.Dispatch<React.SetStateAction<string[]>> | null;
}>({ subjects: [], setSubjects: null });

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
            path: Routes.CREATE_FLASHCARD_PAGE,
            element: (
                <AuthWrapper>
                    <ContentWrapper>
                        <CreateFlashcardPage />
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
        {
            path: Routes.FLASHCARDS_LIST_PAGE,
            element: (
                <AuthWrapper>
                    <ContentWrapper>
                        <FlashcardsListPage />
                    </ContentWrapper>
                </AuthWrapper>
            ),
        },
        {
            path: Routes.FLASHCARDS_PAGE,
            element: (
                <AuthWrapper>
                    <ContentWrapper>
                        <FlashcardsPage />
                    </ContentWrapper>
                </AuthWrapper>
            ),
        },
        {
            path: Routes.PRIVACY_POLICY_PAGE,
            element: (
                <ContentWrapper>
                    <PrivacyPolicyPage />
                </ContentWrapper>
            ),
        },
    ]);

    const [user, setUser] = useState<User | null>(null);
    const [isEmailWhitelisted, setIsEmailWhitelisted] = useState<
        boolean | null
    >(false);
    const [subjects, setSubjects] = useState<string[]>([
        '',
        '',
        '',
        '',
        '',
        '',
    ]);

    useEffect(() => {
        setSubjects(getSubjectsConfig());
    }, []);

    return (
        <UserContext.Provider
            value={{
                isEmailWhitelisted: isEmailWhitelisted,
                user,
                setUser,
                setIsEmailWhitelisted: setIsEmailWhitelisted,
            }}
        >
            <ConfigContext.Provider value={{ subjects, setSubjects }}>
                <RouterProvider router={router} />
            </ConfigContext.Provider>
        </UserContext.Provider>
    );
}

export default App;
