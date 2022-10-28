import { useRef } from 'react';
import { FlashcardModeEnum } from '../../../enums/flashcard-mode.enum';
import { shuffle } from '../../../helpers/shuffle';
import { CardsInterface } from '../../../interfaces/flashcards';

interface PropsInterface {
    card: CardsInterface;
    mode: FlashcardModeEnum;
}

function Flashcard(props: PropsInterface) {
    const { card, mode } = props;
    const { keyword, description } = card;
    const randomlyArrangedText = shuffle([keyword, description]);
    let first = randomlyArrangedText[0];
    let second = randomlyArrangedText[1];

    if (mode === FlashcardModeEnum.KEYWORD) {
        first = keyword;
        second = description;
    } else if (mode === FlashcardModeEnum.DESCRIPTION) {
        first = description;
        second = keyword;
    }

    const ref = useRef<HTMLDivElement | null>(null);

    function handleClick() {
        if (!ref.current) return;

        ref.current.classList.toggle('flipped-card');
    }

    return (
        <div className="flip-card w-full lg:w-1/2 min-h-[25rem] m-auto pt-7">
            <div className="flip-card-inner" ref={ref}>
                <div
                    className="flip-card-front min-h-[20rem] border rounded-2xl drop-shadow cursor-pointer p-6 flex items-center justify-center"
                    onClick={handleClick}
                >
                    <p>{first}</p>
                </div>
                <div
                    className="flip-card-back min-h-[20rem] border rounded-2xl drop-shadow cursor-pointer p-6 flex items-center justify-center"
                    onClick={handleClick}
                >
                    <p>{second}</p>
                </div>
            </div>
        </div>
    );
}

export default Flashcard;
