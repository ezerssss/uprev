import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Routes } from '../../enums/route.enums';
import db from '../../firebase/db';
import { Quiz, SnapshotFirebaseQuiz } from '../../interfaces/quiz';

function QuizPage() {
    const { subject, doc: documentID } = useParams();
    const navigate = useNavigate();
    const formattedSubject = subject?.replace('-', ' ') || 'lost';
    const formattedDocumentID = documentID || 'lost';

    const [quiz, setQuiz] = useState<SnapshotFirebaseQuiz | null>(null);
    const [answers, setAnswers] = useState<
        { number: number; answer: string }[]
    >([]);

    useEffect(() => {
        async function getFirestore() {
            const quizRef = doc(
                db,
                'subjects',
                formattedSubject,
                'quizzes',
                formattedDocumentID,
            );

            try {
                const docSnapshot = await getDoc(quizRef);
                if (!docSnapshot.exists()) {
                    throw Error(`Quiz not Found: ${documentID}`);
                }

                setQuiz(docSnapshot.data() as SnapshotFirebaseQuiz);
            } catch (error) {
                console.error(error);

                await Swal.fire(
                    'Error',
                    'Something went wrong, please contact Ezra Magbanua',
                    'error',
                );

                navigate(Routes.HOME_PAGE);
            }
        }

        getFirestore();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formattedSubject, formattedDocumentID, documentID]);

    function handleIdentificationAnswer(e: any, number: number) {
        const itemIndex = answers.findIndex(
            (answer) => answer.number === number,
        );

        if (itemIndex < 0) {
            setAnswers([
                ...answers,
                {
                    number: number,
                    answer: e.target.value,
                },
            ]);

            return;
        }

        const answer = answers[itemIndex];
        answer.answer = e.target.value;

        answers[itemIndex] = answer;

        setAnswers([...answers]);
    }

    function renderIdentification(item: Quiz) {
        const { number } = item;
        const textValue =
            answers.find((answer) => answer.number === number)?.answer || '';

        return (
            <textarea
                className="border-b-2 outline-none px-2 w-full h-7 min-h-[1.5rem]"
                placeholder="Enter Answer"
                value={textValue}
                onChange={(e) => handleIdentificationAnswer(e, number)}
            />
        );
    }

    function handleMultipleChoiceAnswer(answer: string, number: number) {
        const itemIndex = answers.findIndex(
            (answer) => answer.number === number,
        );

        if (itemIndex < 0) {
            setAnswers([
                ...answers,
                {
                    number: number,
                    answer,
                },
            ]);

            return;
        }

        const answerFound = answers[itemIndex];
        answerFound.answer = answer;

        answers[itemIndex] = answerFound;

        setAnswers([...answers]);
    }

    function renderMultipleChoice(item: Quiz) {
        const { number } = item;

        return (
            <>
                <p>Choices: </p>
                <div className="grid grid-cols-2 gap-2 p-2">
                    {item.choices.map((choice, index) => {
                        const answer = answers.find(
                            (answer) => answer.number === number,
                        );

                        const isSelected = answer?.answer === choice;

                        return (
                            <button
                                key={`${choice}_${index}`}
                                className={`border-2 p-2 rounded-2xl hover:bg-red-500 hover:text-white transition ease-in-out duration-500 ${
                                    isSelected && 'bg-red-500 text-white'
                                }`}
                                onClick={() =>
                                    handleMultipleChoiceAnswer(choice, number)
                                }
                            >
                                {choice}
                            </button>
                        );
                    })}
                </div>
            </>
        );
    }

    const renderQuizzes = quiz?.questions.map((item) => (
        <li className="p-2 my-4" key={item.number}>
            {item.question}
            <div className="mt-5">
                {item.type === 'identification'
                    ? renderIdentification(item)
                    : renderMultipleChoice(item)}
            </div>
        </li>
    ));

    function handleFinishQuiz() {
        let score = 0;
        quiz?.questions.forEach(({ number, answer }) => {
            const userAnswer = answers.find((ans) => ans.number === number);

            if (answer === userAnswer?.answer) {
                score += 1;
            }
        });

        const quizLength = quiz!.questions.length;
        const isScoreGreaterThanHalf = score >= Math.floor(quizLength / 2);
        const isPerfect = score === quizLength;

        const title = isScoreGreaterThanHalf ? 'Congrats!' : 'Oh no! Try again';
        const text = isPerfect
            ? 'You Aced the quiz!'
            : `Your scored ${score} for this quiz`;
        const type = isScoreGreaterThanHalf ? 'success' : 'info';

        Swal.fire(title, text, type);
    }

    return (
        <>
            <section>
                <h1 className="text-4xl font-bold">{quiz?.title}</h1>
                <p className="text-[12px] my-2">
                    By: {quiz?.creator} | {quiz?.email}
                </p>
            </section>
            <section>
                <ul className="list-decimal list-inside">{renderQuizzes}</ul>
            </section>
            <section className="mt-8 mb-16">
                <button
                    className="p-3 border bg-green-400 rounded-xl text-sm hover:bg-red-500 hover:text-white transition ease-in-out duration-500"
                    disabled={!quiz?.questions.length}
                    onClick={handleFinishQuiz}
                >
                    Finish Quiz
                </button>
            </section>
        </>
    );
}

export default QuizPage;
