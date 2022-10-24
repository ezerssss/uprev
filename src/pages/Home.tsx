import corporate from '../images/corporate-image.webp';
import { CiCircleList, CiEdit } from 'react-icons/ci';
import { BsCode } from 'react-icons/bs';
import logo from '../images/logo.png';
import { useNavigate } from 'react-router-dom';
import { Routes } from '../enums/route.enums';

function Home() {
    const navigate = useNavigate();

    function handleCreateQuiz() {
        return navigate(Routes.CREATE_QUIZ_PAGE);
    }

    function handleSubjectClick(subject: string) {
        const formattedSubject = subject.replace(' ', '-');
        return navigate(`/quizzes/${formattedSubject}`);
    }

    return (
        <>
            <div className="flex flex-col items-center 2xl:items-start gap-10 2xl:flex-row">
                <section className="w-full 2xl:w-1/2 mt-5">
                    <img
                        alt="corporate"
                        className="rounded-2xl w-96 block 2xl:hidden my-5 m-auto"
                        src={corporate}
                    />
                    <h1 className="text-[3.2rem] leading-none font-bold my-10 text-center 2xl:text-left">
                        Let's review <br /> together.
                    </h1>
                    <div className="grid grid-rows-2 grid-cols-3 gap-1 sm:gap-5 w-[280px] sm:w-[450px] m-auto 2xl:m-0">
                        {['math 18', 'cmsc 11', 'cmsc 56', 'cmsc 10'].map(
                            (subject) => (
                                <button
                                    className="aspect-square w-full border-2 rounded-2xl hover:scale-105 hover:bg-red-500 hover:text-white transition ease-in-out duration-500 flex justify-center items-center uppercase"
                                    key={subject}
                                    onClick={() => handleSubjectClick(subject)}
                                >
                                    <p>{subject}</p>
                                </button>
                            ),
                        )}
                    </div>
                </section>
                <section className="w-1/2 hidden 2xl:block ">
                    {/* <div>
                        <img
                            alt="corporate"
                            className="rounded-2xl w-full mt-32"
                            src={corporate}
                        />
                    </div> */}
                </section>
            </div>
            <div className="mt-24 mb-14 h-[250px] flex flex-col justify-center items-center gap-5 relative overflow-clip">
                <p className="z-20">Want to help your fellow students?</p>
                <button
                    className="text-lg leading-none font-bold text-center border-2 px-10 h-16 rounded-2xl hover:bg-red-500 hover:text-white transition ease-in-out duration-500 z-20"
                    onClick={handleCreateQuiz}
                >
                    Make your own quiz
                </button>
                <div className="flex gap-5 z-20">
                    <CiCircleList size={30} />
                    <CiEdit size={30} />
                    <BsCode size={30} />
                </div>
                <img
                    alt="uprev"
                    className="absolute opacity-5 m-auto"
                    src={logo}
                />
            </div>
        </>
    );
}

export default Home;
