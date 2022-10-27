import React, { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../App';
import { SnapshotFlashcard } from '../../../interfaces/flashcards';

interface PropsInterface {
    flashcard: SnapshotFlashcard;
    subject: string | undefined;
    handleEdit: (id: string) => void;
    handleDelete: (id: string) => Promise<void>;
}

function Flashcard(props: PropsInterface) {
    const { flashcard, subject, handleEdit, handleDelete } = props;
    const { title, creator, email, id } = flashcard;

    const { user } = useContext(UserContext);

    const areButtonsVisible = email === user?.email;

    const buttonsRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    function handleFlashCardClick(e: any, id: string) {
        const clickingButtons = buttonsRef.current?.contains(e.target);
        if (clickingButtons) {
            return;
        }

        return navigate(`/flashcards/${subject}/${id}`);
    }

    return (
        <div
            className="border p-5 rounded-xl my-3 cursor-pointer hover:bg-red-500 flex justify-between items-center hover:text-white transition ease-in-out duration-500"
            onClick={(e) => handleFlashCardClick(e, id)}
        >
            <div>
                <p>{title}</p>
                <div className="text-[12px]">
                    <p>
                        By: {creator} | {email}
                    </p>
                </div>
            </div>
            <div className="flex gap-2 text-sm items-center" ref={buttonsRef}>
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

export default Flashcard;
