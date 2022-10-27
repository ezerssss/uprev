import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import { UserContext } from '../../App';
import db from '../../firebase/db';
import { errorAlert } from '../../helpers/errors';
import {
    CardsInterface,
    FlashcardInterface,
} from '../../interfaces/flashcards';
import Flashcard from './components/Flashcard';

function CreateFlashcardPage() {
    const { user, isUpEmail } = useContext(UserContext);
    const navigate = useNavigate();
    const [title, setTitle] = useState<string>('');
    const [cards, setCards] = useState<CardsInterface[]>([
        {
            keyword: '',
            description: '',
            number: 0,
        },
    ]);
    const [number, setNumber] = useState<number>(1);
    const [isPosting, setIsPosting] = useState<boolean>(false);

    const ref = useRef<HTMLSelectElement | null>(null);
    const [searchParams] = useSearchParams();
    let id = searchParams.get('id');

    const isEditing = !!searchParams.get('edit');
    const postButtonText = isEditing ? 'Edit Flashcards' : 'Post Flashcards';

    useEffect(() => {
        async function getFirestoreDocument() {
            if (!id) {
                return;
            }

            const subject = searchParams.get('subject')?.replace('-', ' ');
            if (!subject) {
                return;
            }

            const docRef = doc(db, 'subjects', subject, 'flashcards', id);
            try {
                const docSnap = await getDoc(docRef);
                const data = docSnap.data() as FlashcardInterface;

                ref.current!.value = subject;
                let highestNumber = 0;

                data.cards.forEach((card) => {
                    if (card.number > highestNumber) {
                        highestNumber = card.number;
                    }
                });

                setNumber(highestNumber + 1);
                setTitle(data.title);
                setCards(data.cards);
            } catch (error) {
                errorAlert(error);
            }
        }

        getFirestoreDocument();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing, id]);

    const renderSubmitButton = isPosting ? (
        <ClipLoader size={10} />
    ) : (
        postButtonText
    );

    function handleDelete(number: number) {
        setCards(cards.filter((card) => card.number !== number));
    }

    function handleCardEdit(e: any, number: number, key: string) {
        const index = cards.findIndex((object) => object.number === number);

        if (index < 0) return;

        const question = cards[index] as Record<string, any>;
        question[key] = e.target.value;

        cards[index] = question as CardsInterface;

        setCards([...cards]);
    }

    function handleAddAnotherCard() {
        const card: CardsInterface = {
            keyword: '',
            description: '',
            number,
        };

        setNumber(number + 1);
        setCards([...cards, card]);
    }

    async function handleEdit(object: FlashcardInterface) {
        if (!id) {
            console.error('No Id found');
            return;
        }

        const subject = searchParams.get('subject')?.replace('-', ' ');
        if (!subject) {
            console.error('No subject found');
            return;
        }

        const docRef = doc(db, 'subjects', subject, 'flashcards', id);

        await updateDoc(docRef, { ...object });
    }

    async function handlePost(
        object: FlashcardInterface,
        subject: string,
    ): Promise<string> {
        const doc = await addDoc(
            collection(db, 'subjects', subject, 'flashcards'),
            object,
        );

        return doc.id;
    }

    async function handleSubmit() {
        setIsPosting(true);
        if (!isUpEmail) {
            Swal.fire(
                'Error',
                'To post a quiz, you must use your UP email',
                'info',
            );
            setIsPosting(false);

            return;
        }

        const subject = ref.current?.value || 'lost';
        const object: FlashcardInterface = {
            creator: user?.displayName || '-',
            email: user?.email || '-',
            title,
            cards,
        };

        try {
            if (isEditing) {
                handleEdit(object);
            } else {
                id = await handlePost(object, subject);
            }

            setIsPosting(false);

            const popUpText = isEditing
                ? 'Flashcards Edited'
                : 'Flashcards Posted';

            await Swal.fire(
                popUpText,
                'Click the button to redirect to the flashcards',
                'success',
            );

            const formattedSubject = subject.replace(' ', '-');
            navigate(`/flashcards/${formattedSubject}/${id}`);
        } catch (error) {
            errorAlert(error);
            setIsPosting(false);
        }
    }

    return (
        <>
            <section className="flex gap-2 items-center">
                <p>Subject</p>
                <select
                    className="uppercase border p-2 rounded-xl outline-none cursor-pointer"
                    ref={ref}
                >
                    <option value="math 18">math 18</option>
                    <option value="cmsc 10">cmsc 10</option>
                    <option value="cmsc 11">cmsc 11</option>
                    <option value="cmsc 56">cmsc 56</option>
                </select>
            </section>
            <section className="flex gap-2 my-3 text-sm">
                <p>Title: </p>
                <textarea
                    className="border-b-2 outline-none px-2 w-full h-7 min-h-[1.5rem]"
                    placeholder="Enter Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </section>
            <section className="my-5">
                {cards.map((card) => (
                    <Flashcard
                        key={card.number}
                        card={card}
                        onEdit={handleCardEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </section>
            <section className="flex gap-2 justify-center items-center text-sm">
                <button
                    className="p-2 border rounded-xl hover:bg-red-500 hover:text-white transition ease-in-out duration-500"
                    onClick={handleAddAnotherCard}
                >
                    Add another card
                </button>
                <button
                    className="p-2 border rounded-xl hover:bg-green-500 hover:text-white transition ease-in-out duration-500"
                    onClick={handleSubmit}
                >
                    {renderSubmitButton}
                </button>
            </section>
        </>
    );
}

export default CreateFlashcardPage;