import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    query,
} from 'firebase/firestore';
import { useContext, useEffect, useRef, useState } from 'react';
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

function QuizListPage() {
    let { subject } = useParams();
    const navigate = useNavigate();
    const formattedSubject = subject?.replace('-', ' ') ?? 'lost';
    const { user } = useContext(UserContext);

    const [quizzes, setQuizzes] = useState<SnapshotFirebaseQuizWithScores[]>(
        [],
    );
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const buttonsRef = useRef<HTMLDivElement | null>(null);

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

    function handleQuizClick(e: any, id: string) {
        const clickingButtons = buttonsRef.current?.contains(e.target);
        if (clickingButtons) {
            return;
        }

        return navigate(`/quizzes/${formattedSubject}/${id}`);
    }

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
        return navigate(`/create?edit=true&id=${id}&subject=${subject}`);
    }

    return (
        <>
            <section className="flex justify-between items-center">
                <h1 className="text-4xl my-5">
                    <b className="uppercase">{formattedSubject}</b> Quizzes
                </h1>
                <button className="text-sm my-5 border rounded-xl p-2 hover:bg-red-500 hover:text-white transition ease-in-out duration-500">
                    Flashcards
                </button>
            </section>

            <section className="my-5">
                {renderLoading}
                {renderNoQuizzes}
                {quizzes.map(
                    ({ id, title, questions, creator, email, userScore }) => {
                        const areButtonsVisible = email === user?.email;

                        const renderScore = userScore && (
                            <p>
                                Score: {userScore.score} / {questions.length}
                            </p>
                        );

                        return (
                            <div
                                key={id}
                                className="border p-5 rounded-xl my-3 cursor-pointer flex justify-between items-center hover:bg-red-500 hover:text-white transition ease-in-out duration-500"
                                onClick={(e) => handleQuizClick(e, id)}
                            >
                                <div>
                                    <p>{title}</p>
                                    <div className="text-[12px]">
                                        <p className="mb-3">
                                            Item Count: {questions.length}
                                        </p>
                                        <p>
                                            By: {creator} | {email}
                                        </p>
                                    </div>
                                </div>
                                <div
                                    className="flex gap-2 text-sm items-center"
                                    ref={buttonsRef}
                                >
                                    {renderScore}
                                    {areButtonsVisible && (
                                        <>
                                            <button
                                                className="p-2 border rounded-xl hover:bg-green-600"
                                                disabled={!areButtonsVisible}
                                                onClick={() => handleEdit(id)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="p-2 border rounded-xl hover:bg-slate-500"
                                                disabled={!areButtonsVisible}
                                                onClick={() => handleDelete(id)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    },
                )}
            </section>
        </>
    );
}

export default QuizListPage;
