import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { doc, setDoc } from 'firebase/firestore';
import auth from '../firebase/auth';
import db from '../firebase/db';
import { Routes } from '../enums/route.enums';
import { User } from '../interfaces/user';
import { UserContext } from '../App';

interface PropsInterface {
    children: JSX.Element;
}

function AuthWrapper(props: PropsInterface) {
    const { children } = props;
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { setUser } = useContext(UserContext);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            const invalidUser = !user; // || !user.email?.includes('@up.edu.ph')

            if (location.pathname === Routes.LOGIN_PAGE && !invalidUser) {
                const userDocument: User = {
                    displayName: user.displayName || '-',
                    email: user.email || '-',
                    photoURL: user.photoURL || '-',
                };

                await setDoc(doc(db, 'users', user.uid), userDocument, {
                    merge: true,
                });

                navigate(Routes.HOME_PAGE);
                return;
            }

            if (invalidUser) {
                navigate(Routes.LOGIN_PAGE);
            }

            setIsLoading(false);
            if (!invalidUser && setUser) {
                setUser(user);
            }
        });

        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    const render = isLoading ? (
        <div className="w-screen h-screen flex flex-col gap-5 justify-center items-center">
            <h1 className="font-bold text-6xl tracking-wide -mt-5">uprev.</h1>
            <ClipLoader />
        </div>
    ) : (
        children
    );

    return <>{render}</>;
}

export default AuthWrapper;
