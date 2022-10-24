import auth from '../firebase/auth';
import { BsFacebook, BsTwitter, BsYoutube } from 'react-icons/bs';
import { FaTiktok } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Routes } from '../enums/route.enums';
import logo from '../images/logo.png';

interface PropsInterface {
    children: JSX.Element | JSX.Element[];
}

function ContentWrapper(props: PropsInterface) {
    const { children } = props;

    const navigate = useNavigate();

    function handleLogout(): void {
        auth.signOut();
        navigate(Routes.LOGIN_PAGE);
    }

    return (
        <div className="min-h-[100vh] flex flex-col">
            <header>
                <nav className="px-4 sm:px-8 2xl:px-64 py-8 flex justify-between items-center">
                    <div
                        className="cursor-pointer flex -ml-4"
                        onClick={() => navigate(Routes.HOME_PAGE)}
                    >
                        <img alt="uprev" className="h-10" src={logo} />
                        <p className="text-2xl font-bold tracking-wide -ml-3">
                            uprev.
                        </p>
                    </div>
                    <div>
                        <p
                            className="text-sm cursor-pointer"
                            onClick={handleLogout}
                        >
                            Log out
                        </p>
                    </div>
                </nav>
            </header>
            <main className="flex-1 px-4 sm:px-8 2xl:px-64">{children}</main>
            <footer className="px-4 sm:px-8 2xl:px-64 py-8">
                <div className="flex justify-between mb-2 items-center">
                    <p className="text-3xl">
                        <b>uprev.</b>
                    </p>
                    <div className="flex gap-2">
                        <BsFacebook />
                        <BsTwitter />
                        <BsYoutube />
                        <FaTiktok />
                    </div>
                </div>
                <hr className="h-[2px] bg-gray-200" />
                <div className="text-[13px] flex min-h-[5rem] text-gray-500">
                    <div className="w-1/2 mt-5 px-2 border-r-[.5px]">
                        <p>
                            <b>What is uprev?</b>
                        </p>
                        <p>
                            Web application for UP students where they can take
                            and create quizzes
                        </p>
                    </div>
                    <div className="w-1/2 border-l-[.5px] mt-5 px-2">
                        <p>
                            <b>Who are we?</b>
                        </p>
                        <p>
                            Lorem ipsum dolor sit amet consectetur, adipisicing
                            elit. Delectus sed veniam nam voluptatum modi fugit
                            nisi dolore earum a tenetur!
                        </p>
                    </div>
                </div>
                <div className="flex justify-between mt-6">
                    <p className="text-sm text-gray-500">
                        Developed by dioskor0
                    </p>
                    <p className="text-sm text-gray-500">Want to contribute?</p>
                </div>
            </footer>
        </div>
    );
}

export default ContentWrapper;
