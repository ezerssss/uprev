import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import db from '../../firebase/db';
import { errorAlert } from '../../helpers/errors';
import {
    FlashcardInterface,
    SnapshotFlashcard,
} from '../../interfaces/flashcards';
import Flashcard from './components/Flashcard';

function FlashcardsListPage() {
    const { subject } = useParams();
    const formattedSubject = subject?.replace('-', ' ') ?? 'lost';

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [flashcards, setFlashcards] = useState<SnapshotFlashcard[]>([]);

    useEffect(() => {
        const flashcardsRef = collection(
            db,
            'subjects',
            formattedSubject,
            'flashcards',
        );
        const q = query(flashcardsRef);

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            try {
                const snapshotArray: SnapshotFlashcard[] = [];
                querySnapshot.forEach((card) => {
                    const data = card.data() as FlashcardInterface;
                    const object: SnapshotFlashcard = {
                        id: card.id,
                        ...data,
                    };

                    snapshotArray.push(object);
                });

                setFlashcards(snapshotArray);
                setIsLoading(false);
            } catch (error) {
                errorAlert(error);
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleQuizzes() {
        return navigate(`/quizzes/${subject}`);
    }

    const renderLoading = isLoading && (
        <div className="flex justify-center">
            <ClipLoader />
        </div>
    );
    const renderNoFlashCards = !isLoading && !flashcards.length && (
        <p>No Flashcards</p>
    );

    function handleEdit(id: string) {
        return navigate(
            `/create/flashcard?edit=true&id=${id}&subject=${subject}`,
        );
    }

    async function handleDelete(id: string) {
        try {
            await deleteDoc(
                doc(db, 'subjects', formattedSubject, 'flashcards', id),
            );
        } catch (error) {
            errorAlert(error);
        }
    }

    return (
        <>
            <section className="flex justify-between items-center">
                <h1 className="text-4xl my-5">
                    <b className="uppercase">{formattedSubject}</b> Flashcards
                </h1>
                <button
                    className="text-sm my-5 border rounded-xl p-2 hover:bg-red-500 hover:text-white transition ease-in-out duration-500"
                    onClick={handleQuizzes}
                >
                    Quizzes
                </button>
            </section>

            <section className="my-5">
                {renderLoading}
                {renderNoFlashCards}
                {flashcards.map((flashcard) => (
                    <Flashcard
                        key={flashcard.id}
                        flashcard={flashcard}
                        subject={subject}
                        handleDelete={handleDelete}
                        handleEdit={handleEdit}
                    />
                ))}
            </section>
        </>
    );
}

export default FlashcardsListPage;
