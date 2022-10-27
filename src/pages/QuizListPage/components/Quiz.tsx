import React, { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../App';
import { SnapshotFirebaseQuizWithScores } from '../../../interfaces/quiz';

interface PropsInterface {
    subject: string | undefined;
    quiz: SnapshotFirebaseQuizWithScores;
    handleEdit: (id: string) => void;
    handleDelete: (id: string) => Promise<void>;
}

function Quiz(props: PropsInterface) {
    const { subject, quiz, handleEdit, handleDelete } = props;
    const { email, userScore, questions, title, creator, id } = quiz;
    const { user } = useContext(UserContext);

    const areButtonsVisible = email === user?.email;

    const renderScore = userScore && (
        <p>
            Score: {userScore.score} / {questions.length}
        </p>
    );

    const navigate = useNavigate();
    const buttonsRef = useRef<HTMLDivElement | null>(null);
    function handleQuizClick(e: any, id: string) {
        const clickingButtons = buttonsRef.current?.contains(e.target);
        if (clickingButtons) {
            return;
        }

        return navigate(`/quizzes/${subject}/${id}`);
    }

    return (
        <div
            className="border p-5 rounded-xl my-3 cursor-pointer flex justify-between items-center hover:bg-red-500 hover:text-white transition ease-in-out duration-500"
            onClick={(e) => handleQuizClick(e, id)}
        >
            <div>
                <p>{title}</p>
                <div className="text-[12px]">
                    <p className="mb-3">Item Count: {questions.length}</p>
                    <p>
                        By: {creator} | {email}
                    </p>
                </div>
            </div>
            <div className="flex gap-2 text-sm items-center" ref={buttonsRef}>
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
}

export default Quiz;
