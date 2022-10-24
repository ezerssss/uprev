import { collection, getDocs, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import db from '../../firebase/db';
import { FirebaseQuiz, SnapshotFirebaseQuiz } from '../../interfaces/quiz';

function QuizListPage() {
    let { subject } = useParams();
    const navigate = useNavigate();
    const formattedSubject = subject?.replace('-', ' ') ?? 'lost';

    const [quizzes, setQuizzes] = useState<SnapshotFirebaseQuiz[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function getFirestore() {
            const quizzesRef = collection(
                db,
                'subjects',
                formattedSubject,
                'quizzes',
            );
            const q = query(quizzesRef);

            try {
                const querySnapshot = await getDocs(q);
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
        }

        getFirestore();
    }, [formattedSubject]);

    const renderLoading = isLoading && (
        <div className="flex justify-center">
            <ClipLoader />
        </div>
    );

    const renderNoQuizzes = !isLoading && !quizzes.length && <p>No Quizzes</p>;

    function handleQuizClick(id: string) {
        return navigate(`/quizzes/${formattedSubject}/${id}`);
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
                {quizzes.map(({ id, title, questions, creator, email }) => (
                    <div
                        key={id}
                        className="border p-5 rounded-xl my-3 hover:bg-red-500 hover:text-white transition ease-in-out duration-500 cursor-pointer"
                        onClick={() => handleQuizClick(id)}
                    >
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
                ))}
            </section>
        </>
    );
}

export default QuizListPage;
