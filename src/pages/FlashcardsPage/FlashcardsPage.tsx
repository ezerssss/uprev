import { doc, getDoc } from 'firebase/firestore';
import { Suspense, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import db from '../../firebase/db';
import { errorAlert } from '../../helpers/errors';
import { FlashcardInterface } from '../../interfaces/flashcards';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { shuffle } from '../../helpers/shuffle';
import { FlashcardModeEnum } from '../../enums/flashcard-mode.enum';
import React from 'react';
import { ClipLoader } from 'react-spinners';

const Flashcard = React.lazy(() => import('./components/Flashcard'));

function FlashcardsPage() {
    const [flashcards, setFlashcards] = useState<FlashcardInterface | null>(
        null,
    );
    const [mode, setMode] = useState<FlashcardModeEnum>(
        FlashcardModeEnum.RANDOM,
    );

    const { subject, doc: documentID } = useParams();
    const formattedSubject = subject?.replace('-', ' ') || 'lost';
    const formattedDocumentID = documentID || 'lost';

    const showElements = !!flashcards;

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

                setFlashcards(data);
            } catch (error) {
                errorAlert(error);
            }
        }

        getFirestore();
    }, [formattedSubject, formattedDocumentID, documentID]);

    const renderOneFlashcard = flashcards?.cards.length === 1 && (
        <Flashcard card={flashcards.cards[0]} mode={mode} />
    );

    const renderCarouselFlashcards = flashcards &&
        flashcards.cards.length > 1 && (
            <Suspense
                fallback={
                    <div className="w-full flex justify-center items-center">
                        <ClipLoader />
                    </div>
                }
            >
                <Carousel
                    emulateTouch
                    infiniteLoop
                    showArrows={false}
                    showThumbs={false}
                    showIndicators={false}
                    onChange={(index) => console.log(index)}
                >
                    {flashcards.cards.map((card, index) => (
                        <Flashcard key={index} card={card} mode={mode} />
                    ))}
                </Carousel>
            </Suspense>
        );

    function buttonColor(buttonMode: FlashcardModeEnum): string {
        if (mode !== buttonMode) return '';

        return 'bg-red-500 text-white';
    }

    function handleModeClick(buttonMode: FlashcardModeEnum) {
        setMode(buttonMode);
    }

    function handleShuffleButton() {
        if (!flashcards?.cards) return;

        flashcards.cards = shuffle(flashcards.cards);
        setFlashcards({ ...flashcards });
    }

    return (
        <>
            <section>
                <h1 className="text-4xl font-bold">{flashcards?.title}</h1>
                {showElements && (
                    <p className="text-[12px] my-2">
                        By: {flashcards?.creator} | {flashcards?.email}
                    </p>
                )}
            </section>
            <section className="my-10">
                <p className="text-sm mb-4">Press to flip the card</p>
                <div className="text-sm flex gap-2 items-center flex-wrap">
                    <p>Flashcards Mode:</p>
                    <div className="flex gap-2">
                        <button
                            className={`border rounded-xl p-2 transition ease-in-out duration-500 ${buttonColor(
                                FlashcardModeEnum.RANDOM,
                            )}`}
                            onClick={() =>
                                handleModeClick(FlashcardModeEnum.RANDOM)
                            }
                        >
                            Random
                        </button>
                        <button
                            className={`border rounded-xl p-2 transition ease-in-out duration-500 ${buttonColor(
                                FlashcardModeEnum.KEYWORD,
                            )}`}
                            onClick={() =>
                                handleModeClick(FlashcardModeEnum.KEYWORD)
                            }
                        >
                            Keyword First
                        </button>
                        <button
                            className={`border rounded-xl p-2 transition ease-in-out duration-500 ${buttonColor(
                                FlashcardModeEnum.DESCRIPTION,
                            )}`}
                            onClick={() =>
                                handleModeClick(FlashcardModeEnum.DESCRIPTION)
                            }
                        >
                            Description First
                        </button>
                    </div>
                </div>
                <button
                    className="text-sm mt-2 border rounded-xl p-2 active:bg-red-500 active:text-white transition ease-in-out duration-300"
                    onClick={handleShuffleButton}
                >
                    Shuffle
                </button>
                {renderOneFlashcard}
                {renderCarouselFlashcards}
            </section>
        </>
    );
}

export default FlashcardsPage;
