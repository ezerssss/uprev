import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import db from '../../firebase/db';
import { errorAlert } from '../../helpers/errors';
import { FlashcardInterface } from '../../interfaces/flashcards';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import Flashcard from './components/Flashcard';
import { shuffle } from '../../helpers/shuffle';

function FlashcardsPage() {
    const [flashcard, setFlashcard] = useState<FlashcardInterface | null>(null);

    const { subject, doc: documentID } = useParams();
    const formattedSubject = subject?.replace('-', ' ') || 'lost';
    const formattedDocumentID = documentID || 'lost';

    const showElements = !!flashcard;

    useEffect(() => {
        async function getFirestore() {
            try {
                const flashcardRef = doc(
                    db,
                    'subjects',
                    formattedSubject,
                    'flashcards',
                    formattedDocumentID,
                );

                const flashcardSnapshot = await getDoc(flashcardRef);
                if (!flashcardSnapshot.exists()) {
                    throw Error(`Quiz not Found: ${documentID}`);
                }
                const data = flashcardSnapshot.data() as FlashcardInterface;
                data.cards = shuffle(data.cards);

                setFlashcard(data);
            } catch (error) {
                errorAlert(error);
            }
        }

        getFirestore();
    }, [formattedSubject, formattedDocumentID, documentID]);

    const renderOneFlashcard = flashcard?.cards.length === 1 && (
        <Flashcard card={flashcard.cards[0]} />
    );

    const renderCarouselFlashcards = flashcard &&
        flashcard.cards.length > 1 && (
            <Carousel emulateTouch infiniteLoop showArrows showThumbs={false}>
                {flashcard.cards.map((card, index) => (
                    <Flashcard key={index} card={card} />
                ))}
            </Carousel>
        );

    return (
        <>
            <section>
                <h1 className="text-4xl font-bold">{flashcard?.title}</h1>
                {showElements && (
                    <p className="text-[12px] my-2">
                        By: {flashcard?.creator} | {flashcard?.email}
                    </p>
                )}
            </section>
            <section className="my-10">
                <p className="text-sm mb-4">Press to flip the card</p>
                {renderOneFlashcard}
                {renderCarouselFlashcards}
            </section>
        </>
    );
}

export default FlashcardsPage;
