import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Routes } from '../../enums/route.enums';
import db from '../../firebase/db';
import {
    FirebaseQuiz,
    FirebaseQuizAnswers,
    QuizAnswer,
} from '../../interfaces/quiz';
import { UserContext } from '../../App';
import MultipleChoice from './components/MultipleChoice';
import Identification from './components/Identification';
import { errorAlert } from '../../helpers/errors';

function QuizPage() {
    const { subject, doc: documentID } = useParams();
    const navigate = useNavigate();
    const formattedSubject = subject?.replace('-', ' ') || 'lost';
    const formattedDocumentID = documentID || 'lost';

    const { user, isEmailWhitelisted } = useContext(UserContext);
    const [quiz, setQuiz] = useState<FirebaseQuiz | null>(null);
    const [answers, setAnswers] = useState<QuizAnswer[]>([]);
    const [showAnswers, setShowAnswers] = useState<boolean>(false);
    const [isAlreadyTaken, setIsAlreadyTaken] = useState<boolean>(false);

    useEffect(() => {
        async function getFirestore() {
            try {
                const uid = user?.uid || 'lost';
                const quizRef = doc(
                    db,
                    'subjects',
                    formattedSubject,
                    'quizzes',
                    formattedDocumentID,
                );
                const scoreRef = doc(
                    db,
                    'users',
                    uid,
                    'subjects',
                    formattedSubject,
                    'scores',
                    formattedDocumentID,
                );

                const quizSnapshot = await getDoc(quizRef);
                if (!quizSnapshot.exists()) {
                    throw Error(`Quiz not Found: ${documentID}`);
                }
                setQuiz(quizSnapshot.data() as FirebaseQuiz);

                const scoreSnapshot = await getDoc(scoreRef);
                if (scoreSnapshot.exists()) {
                    const scoreData =
                        scoreSnapshot.data() as FirebaseQuizAnswers;
                    setAnswers(scoreData.answers);
                    setIsAlreadyTaken(true);
                    setShowAnswers(true);
                }
            } catch (error) {
                errorAlert(error);
                return navigate(Routes.HOME_PAGE);
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

    const renderQuestions = quiz?.questions.map((item) => (
        <li className="p-2 my-4" key={item.number}>
            {item.question}
            <div className="mt-5">
                {item.type === 'identification' ? (
                    <Identification
                        answers={answers}
                        item={item}
                        showAnswers={showAnswers}
                        handleIdentificationAnswer={handleIdentificationAnswer}
                    />
                ) : (
                    <MultipleChoice
                        answers={answers}
                        item={item}
                        showAnswers={showAnswers}
                        handleMultipleChoiceAnswer={handleMultipleChoiceAnswer}
                    />
                )}
            </div>
        </li>
    ));

    function handleCalculateScore(): number {
        let score = 0;
        quiz?.questions.forEach(({ number, answer }) => {
            const userAnswer = answers.find((ans) => ans.number === number);

            if (answer === userAnswer?.answer) {
                score += 1;
            }
        });
        const quizLength = quiz!.questions.length;

        const isScoreGreaterThanHalf =
            score >= Math.floor(quizLength / 2) && score !== 0;
        const isPerfect = score === quizLength;
        const title = isScoreGreaterThanHalf ? 'Congrats!' : 'Oh no! Try again';
        const text = isPerfect
            ? 'You Aced the quiz!'
            : `Your scored ${score} for this quiz`;
        const type = isScoreGreaterThanHalf ? 'success' : 'info';

        Swal.fire(title, text, type);
        setShowAnswers(true);

        return score;
    }

    async function handleStoreScore(score: number) {
        const uid = user?.uid;
        if (!uid) {
            errorAlert('user uid not found');
            return;
        }

        const docRef = doc(
            db,
            'users',
            uid,
            'subjects',
            formattedSubject,
            'scores',
            formattedDocumentID,
        );

        try {
            const object: FirebaseQuizAnswers = {
                score,
                answers,
            };

            await setDoc(docRef, object);
            setIsAlreadyTaken(true);
        } catch (error) {
            errorAlert(error);
        }
    }

    function handleFinishQuiz() {
        const score = handleCalculateScore();

        if (!isAlreadyTaken) {
            if (isEmailWhitelisted) {
                handleStoreScore(score);
            } else {
                Swal.fire(
                    'Score',
                    'Scores are not recorded for not whitelisted emails.',
                    'info',
                );
            }
        }
    }

    const showElements = !!quiz?.questions.length;

    return (
        <>
            <section>
                <h1 className="text-4xl font-bold">{quiz?.title}</h1>
                {showElements && (
                    <p className="text-[12px] my-2">
                        By: {quiz?.creator} | {quiz?.email}
                    </p>
                )}
            </section>
            <section>
                <ul className="list-decimal list-inside">{renderQuestions}</ul>
            </section>
            <section className="mt-8 mb-16">
                {showElements && (
                    <button
                        className="p-3 border bg-green-400 rounded-xl text-sm hover:bg-red-500 hover:text-white transition ease-in-out duration-500"
                        disabled={!quiz?.questions.length || isAlreadyTaken}
                        onClick={handleFinishQuiz}
                    >
                        Finish Quiz
                    </button>
                )}
            </section>
        </>
    );
}

export default QuizPage;
