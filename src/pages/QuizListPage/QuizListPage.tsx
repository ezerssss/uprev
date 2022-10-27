import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    query,
} from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { UserContext } from '../../App';
import db from '../../firebase/db';
import { errorAlert } from '../../helpers/errors';
import {
    FirebaseQuiz,
    FirebaseQuizAnswers,
    SnapshotFirebaseQuiz,
    SnapshotFirebaseQuizWithScores,
} from '../../interfaces/quiz';
import Quiz from './components/Quiz';

function QuizListPage() {
    let { subject } = useParams();
    const navigate = useNavigate();
    const formattedSubject = subject?.replace('-', ' ') ?? 'lost';
    const { user } = useContext(UserContext);

    const [quizzes, setQuizzes] = useState<SnapshotFirebaseQuizWithScores[]>(
        [],
    );
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const quizzesRef = collection(
            db,
            'subjects',
            formattedSubject,
            'quizzes',
        );
        const q = query(quizzesRef);

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            try {
                const snapshotArray: SnapshotFirebaseQuizWithScores[] = [];
                for (const document of querySnapshot.docs) {
                    const quizWithId: SnapshotFirebaseQuiz = {
                        id: document.id,
                        ...(document.data() as FirebaseQuiz),
                    };
                    const uid = user?.uid || 'lost';
                    const scoreRef = doc(
                        db,
                        'users',
                        uid,
                        'subjects',
                        formattedSubject,
                        'scores',
                        document.id,
                    );
                    const scoreSnapshot = await getDoc(scoreRef);
                    const scoreData =
                        scoreSnapshot.data() as FirebaseQuizAnswers | null;

                    const object: SnapshotFirebaseQuizWithScores = {
                        ...quizWithId,
                        userScore: scoreData,
                    };

                    snapshotArray.push(object);
                }

                setQuizzes(snapshotArray);
                setIsLoading(false);
            } catch (error) {
                errorAlert(error);
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, [formattedSubject, user?.uid]);

    const renderLoading = isLoading && (
        <div className="flex justify-center">
            <ClipLoader />
        </div>
    );

    const renderNoQuizzes = !isLoading && !quizzes.length && <p>No Quizzes</p>;

    async function handleDelete(id: string) {
        try {
            await deleteDoc(
                doc(db, 'subjects', formattedSubject, 'quizzes', id),
            );
        } catch (error) {
            errorAlert(error);
        }
    }

    function handleEdit(id: string) {
        return navigate(`/create/quiz?edit=true&id=${id}&subject=${subject}`);
    }

    function handleFlashcards() {
        return navigate(`/flashcards/${subject}`);
    }

    return (
        <>
            <section className="flex justify-between items-center">
                <h1 className="text-4xl my-5">
                    <b className="uppercase">{formattedSubject}</b> Quizzes
                </h1>
                <button
                    className="text-sm my-5 border rounded-xl p-2 hover:bg-red-500 hover:text-white transition ease-in-out duration-500"
                    onClick={handleFlashcards}
                >
                    Flashcards
                </button>
            </section>

            <section className="my-5">
                {renderLoading}
                {renderNoQuizzes}
                {quizzes.map((quiz) => (
                    <Quiz
                        key={quiz.id}
                        subject={subject}
                        quiz={quiz}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                    />
                ))}
            </section>
        </>
    );
}

export default QuizListPage;
