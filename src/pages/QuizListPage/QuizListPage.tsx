import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
} from 'firebase/firestore';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import { UserContext } from '../../App';
import db from '../../firebase/db';
import { FirebaseQuiz, SnapshotFirebaseQuiz } from '../../interfaces/quiz';

function QuizListPage() {
    let { subject } = useParams();
    const navigate = useNavigate();
    const formattedSubject = subject?.replace('-', ' ') ?? 'lost';
    const { user } = useContext(UserContext);

    const [quizzes, setQuizzes] = useState<SnapshotFirebaseQuiz[]>([]);
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

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            try {
                const snapshotArray: SnapshotFirebaseQuiz[] = [];
                querySnapshot.forEach((doc) => {
                    snapshotArray.push({
                        id: doc.id,
                        ...(doc.data() as FirebaseQuiz),
                    });
                });

                setQuizzes(snapshotArray);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);

                Swal.fire(
                    'Error',
                    'Something went wrong, please contact Ezra Magbanua',
                    'error',
                );
            }
        });

        return () => unsubscribe();
    }, [formattedSubject]);

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
            console.error(error);

            Swal.fire(
                'Error',
                'Something went wrong, please contact Ezra Magbanua',
                'error',
            );
        }
    }

    function handleEdit(id: string) {
        return navigate(`/create?edit=true&id=${id}&subject=${subject}`);
    }

    return (
        <>
            <section>
                <h1 className="text-4xl my-5 mb-10">
                    <b className="uppercase">{formattedSubject}</b> Quizzes
                </h1>
            </section>

            <section className="my-5">
                {renderLoading}
                {renderNoQuizzes}
                {quizzes.map(({ id, title, questions, creator, email }) => {
                    const areButtonsVisible = email === user?.email;

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
                            {areButtonsVisible && (
                                <div
                                    className="flex gap-2 text-sm"
                                    ref={buttonsRef}
                                >
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
                                </div>
                            )}
                        </div>
                    );
                })}
            </section>
        </>
    );
}

export default QuizListPage;
