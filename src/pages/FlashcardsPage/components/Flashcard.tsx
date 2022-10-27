import { useRef } from 'react';
import { shuffle } from '../../../helpers/shuffle';
import { CardsInterface } from '../../../interfaces/flashcards';

interface PropsInterface {
    card: CardsInterface;
}

function Flashcard(props: PropsInterface) {
    const { card } = props;
    const { keyword, description } = card;
    const randomlyArrangedText = shuffle([keyword, description]);

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
                    <p>{randomlyArrangedText[0]}</p>
                </div>
                <div
                    className="flip-card-back min-h-[20rem] border rounded-2xl drop-shadow cursor-pointer p-6 flex items-center justify-center"
                    onClick={handleClick}
                >
                    <p>{randomlyArrangedText[1]}</p>
                </div>
            </div>
        </div>
    );
}

export default Flashcard;
