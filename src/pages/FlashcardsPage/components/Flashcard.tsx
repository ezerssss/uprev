import React from 'react';
import { shuffle } from '../../../helpers/shuffle';
import { CardsInterface } from '../../../interfaces/flashcards';

interface PropsInterface {
    card: CardsInterface;
}

function Flashcard(props: PropsInterface) {
    const { card } = props;
    const { keyword, description } = card;
    const randomlyArrangedText = shuffle([keyword, description]);

    return (
        <div className="m-auto min-h-[20rem] w-full lg:w-1/2 border rounded-2xl drop-shadow flex items-center justify-center flip-card cursor-pointer">
            <div className="flip-card-inner">
                <div className="flip-card-front">
                    <p>{randomlyArrangedText[0]}</p>
                </div>
                <div className="flip-card-back">
                    <p>{randomlyArrangedText[1]}</p>
                </div>
            </div>
        </div>
    );
}

export default Flashcard;
