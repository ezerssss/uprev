import { CardsInterface } from '../../../interfaces/flashcards';

interface PropsInterface {
    card: CardsInterface;
    onEdit: (e: any, number: number, key: string) => void;
    onDelete: (number: number) => void;
}

function Flashcard(props: PropsInterface) {
    const { card, onEdit, onDelete } = props;
    const { keyword, description, number } = card;

    return (
        <div className="border p-3 flex-1 min-h-[80px] text-sm rounded-3xl my-3">
            <div className="flex gap-2 my-4">
                <p>Keyword: </p>
                <textarea
                    className="border-b-2 outline-none px-2 w-full h-7 min-h-[1.5rem]"
                    placeholder="Enter Keyword"
                    value={keyword}
                    onChange={(e) => onEdit(e, number, 'keyword')}
                />
            </div>
            <div className="flex gap-2 mt-7 mb-4">
                <p>Description: </p>
                <textarea
                    className="border-b-2 outline-none px-2 w-full h-28 min-h-[1.5rem]"
                    placeholder="Enter Description"
                    value={description}
                    onChange={(e) => onEdit(e, number, 'description')}
                />
            </div>
            <button
                className="mt-4 mb-2 p-2 border rounded-xl hover:bg-red-500 hover:text-white transition ease-in-out duration-500"
                onClick={() => onDelete(number)}
            >
                Delete
            </button>
        </div>
    );
}

export default Flashcard;
