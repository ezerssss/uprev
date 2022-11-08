import corporate from '../images/corporate-image.png';
import { useNavigate } from 'react-router-dom';
import { Routes } from '../enums/route.enums';
import { ConfigContext } from '../App';
import { useContext } from 'react';
import { validateSubjects } from '../helpers/config';

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
            <div className="flex flex-col-reverse flex-col items-center 2xl:items-end justify-between gap-5 2xl:gap-24 2xl:flex-row">
                <section className="w-full 2xl:w-[40%]">
                    <h1 className="text-[3.2rem] leading-none font-bold my-10 text-center 2xl:text-left text-[#ec7495]">
                        Let's review <br /> together.
                    </h1>
                    <div className="grid grid-rows-2 grid-cols-3 gap-1 sm:gap-3 w-[280px] sm:w-[400px] m-auto 2xl:m-0">
                        {validateSubjects(
                            subjects.filter((subject) => !!subject),
                        ).map((subject) => (
                            <button
                                className="aspect-square w-full border-2 border-[#9ddadb] rounded-2xl hover:scale-105 hover:bg-[#9ddadb]  transition ease-in-out duration-500 flex justify-center items-center uppercase"
                                key={subject}
                                disabled={!subject}
                                onClick={() => handleSubjectClick(subject)}
                            >
                                <p>{subject}</p>
                            </button>
                        ))}
                    </div>
                </section>
                <section className="w-full max-w-[600px] 2xl:w-[55%]">
                    <div>
                        <img
                            alt="uprev"
                            className="rounded-2xl w-full"
                            src={corporate}
                        />
                    </div>
                </section>
            </div>
            <div className="mt-7 flex flex-col items-center 2xl:items-start">
                <p className="my-5 font-bold text-lg">
                    Help others review! Make your own:
                </p>
                <div className="flex gap-2">
                    <button
                        className="text-center border-2 bg-[#9ddadb] px-5 py-3 rounded-2xl hover:text-white transition ease-in-out duration-500"
                        onClick={handleCreateQuiz}
                    >
                        Quiz
                    </button>
                    <button
                        className="text-center border-2 bg-[#9ddadb] px-5 py-3 rounded-2xl hover:text-white transition ease-in-out duration-500"
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
