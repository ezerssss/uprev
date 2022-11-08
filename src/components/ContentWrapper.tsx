import auth from '../firebase/auth';
import { FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Routes } from '../enums/route.enums';
import logo from '../images/logo.png';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import ReactTooltip from 'react-tooltip';
import Modal from 'react-modal';
import { useState } from 'react';
import ModalContent from './ModalContent';
import phone from '../images/phone.png';
import googleplay from '../images/googleplay.png';

interface PropsInterface {
    children: JSX.Element | JSX.Element[];
}

function ContentWrapper(props: PropsInterface) {
    const { children } = props;

    const navigate = useNavigate();

    function handleCloseModal() {
        setIsModalOpen(false);
    }

    function handleOpenModal() {
        setIsModalOpen(true);
    }

    function handleLogout(): void {
        auth.signOut();
        navigate(Routes.LOGIN_PAGE);
    }

    function handleBackButton() {
        navigate(-1);
    }

    function handleForwardButton() {
        navigate(1);
    }

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    return (
        <>
            <ReactTooltip />
            <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal}>
                <ModalContent handleCloseModal={handleCloseModal} />
            </Modal>

            <div className="min-h-[100vh] flex flex-col">
                <header>
                    <nav className="px-4 sm:px-8 2xl:px-64 py-8 flex justify-between items-center">
                        <div
                            className="cursor-pointer flex gap-1 items-center"
                            onClick={() => navigate(Routes.HOME_PAGE)}
                        >
                            <img alt="uprev" className="h-6" src={logo} />
                            <p className="text-2xl font-bold tracking-wide">
                                uprev.
                            </p>
                        </div>
                        <div className="flex gap-5 items-center">
                            <div className="flex gap-2">
                                <button
                                    data-tip="Settings"
                                    onClick={handleOpenModal}
                                >
                                    <FiSettings />
                                </button>
                                <button
                                    data-tip="Go back"
                                    onClick={handleBackButton}
                                >
                                    <IoIosArrowBack />
                                </button>
                                <button
                                    data-tip="Go forward"
                                    onClick={handleForwardButton}
                                >
                                    <IoIosArrowForward />
                                </button>
                            </div>
                            <p
                                className="text-sm cursor-pointer"
                                onClick={handleLogout}
                            >
                                Log out
                            </p>
                        </div>
                    </nav>
                </header>
                <main className="flex-1 px-4 sm:px-8 2xl:px-64">
                    {children}
                </main>
                <footer className="px-5 sm:px-20 2xl:px-64 py-8 max-[1000px]:rounded-t rounded-t-[150px] bg-gray-100 relative">
                    <div className="flex max-[1000px]:flex-col items-center">
                        <div className="max-[1000px]:w-full w-[60%]">
                            <h2 className="font-bold text-lg mt-5">
                                What is uprev?
                            </h2>
                            <p className="text-sm mt-1">
                                uprev is a free study app targeted at UP
                                students. The app hosts student-created quizzes
                                and flashcards. The idea is that you review your
                                topics by creating quizzes or flashcards while
                                helping other students by sharing your
                                knowledge. Let's review together!
                            </p>
                        </div>
                        <div className="max-[1000px]:w-full w-[40%] flex max-[450px]:flex-col-reverse max-[1000px]:flex-row-reverse max-[450px]:items-center items-end justify-end gap-2">
                            <div className="flex flex-col max-[1000px]:items-center items-end">
                                <a
                                    href="https://play.google.com/store/apps/details?id=com.dioskor0.uprev"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <img
                                        alt="google play"
                                        className="max-[550px]:w-[110px] max-[1000px]:w-[160px] w-[110px]"
                                        src={googleplay}
                                    />
                                </a>
                                <p className="max-[550px]:text-[12px] max-[1000px]:text-lg text-[12px] max-[1000px]:text-left text-right">
                                    Download us on mobile!
                                </p>
                            </div>
                            <img
                                alt="uprev mobile app"
                                className="h-[300px] mt-10 min-[1000px]:-mt-[150px]"
                                src={phone}
                            />
                        </div>
                    </div>
                    <p className="mt-10 text-[12px] text-gray-500">
                        Developed by dioskor0
                    </p>
                </footer>
            </div>
        </>
    );
}

export default ContentWrapper;
