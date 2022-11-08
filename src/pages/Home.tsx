import corporate from '../images/corporate-image.png';
import { useNavigate } from 'react-router-dom';
import { Routes } from '../enums/route.enums';
import { ConfigContext } from '../App';
import { useContext } from 'react';

function Home() {
    const navigate = useNavigate();

    const { subjects } = useContext(ConfigContext);

    function handleCreateQuiz() {
        return navigate(Routes.CREATE_QUIZ_PAGE);
    }
    function handleCreateFlashcard() {
        return navigate(Routes.CREATE_FLASHCARD_PAGE);
    }

    function handleSubjectClick(subject: string) {
        const formattedSubject = subject.replace(' ', '-');
        return navigate(`/quizzes/${formattedSubject}`);
    }

    return (
        <>
            <div className="flex flex-col-reverse flex-col items-center gap-10 2xl:flex-row">
                <section className="w-full 2xl:w-[40%]">
                    <h1 className="text-[3.2rem] leading-none font-bold my-10 text-center 2xl:text-left">
                        Let's review <br /> together.
                    </h1>
                    <div className="grid grid-rows-2 grid-cols-3 gap-1 sm:gap-5 w-[280px] sm:w-[450px] m-auto 2xl:m-0">
                        {subjects.map((subject) => (
                            <button
                                className="aspect-square w-full border-2 rounded-2xl hover:scale-105 hover:bg-red-500 hover:text-white transition ease-in-out duration-500 flex justify-center items-center uppercase"
                                key={subject}
                                disabled={!subject}
                                onClick={() => handleSubjectClick(subject)}
                            >
                                <p>{subject}</p>
                            </button>
                        ))}
                    </div>
                </section>
                <section className="w-full max-w-[600px] 2xl:w-[60%]">
                    <div>
                        <img
                            alt="uprev"
                            className="rounded-2xl w-full"
                            src={corporate}
                        />
                    </div>
                </section>
            </div>
            <div className="mt-24 flex flex-col items-center 2xl:items-start mb-14">
                <p className="my-5 font-bold text-lg">
                    Help others review! Make your own:
                </p>
                <div className="flex gap-2">
                    <button
                        className="text-center border-2 px-5 py-3 rounded-2xl hover:bg-red-500 hover:text-white transition ease-in-out duration-500"
                        onClick={handleCreateQuiz}
                    >
                        Quiz
                    </button>
                    <button
                        className="text-center border-2 px-5 py-3 rounded-2xl hover:bg-red-500 hover:text-white transition ease-in-out duration-500"
                        onClick={handleCreateFlashcard}
                    >
                        Flashcard
                    </button>
                </div>
            </div>
        </>
    );
}

export default Home;
