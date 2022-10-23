import auth from '../firebase/auth';
import { BsFacebook, BsTwitter, BsYoutube } from 'react-icons/bs';
import { FaTiktok } from 'react-icons/fa';

interface PropsInterface {
    children: JSX.Element | JSX.Element[];
}

function ContentWrapper(props: PropsInterface) {
    const { children } = props;

    function handleLogout(): void {
        auth.signOut();
    }

    return (
        <div className="min-h-[100vh] flex flex-col">
            <header>
                <nav className="px-20 lg:px-64 py-8 flex justify-between items-center">
                    <p className="text-2xl font-bold tracking-wide">uprev.</p>
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
            <main className="flex-1">{children}</main>
            <footer className="px-20 lg:px-64 py-8">
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
                <div className="flex h-32 text-gray-500">
                    <div className="w-[48%] mt-5">
                        <p>What is uprev?</p>
                        <p>
                            Web application for UP students where they can{' '}
                            <b>take</b> and <b>create</b> quizzes
                        </p>
                    </div>
                    <div className="h-[100%] bg-gray-200 w-[1px] mx-4"></div>
                    <div className="w-[48%] mt-5">
                        <p>Who are we?</p>
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
