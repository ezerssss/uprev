import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useContext, useEffect, useRef, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import { defaultQuestion } from '../../constants/question';
import { UserContext } from '../../App';
import db from '../../firebase/db';
import { FirebaseQuiz, Quiz } from '../../interfaces/quiz';
import { QuestionType } from '../../types/question.types';
import QuestionBlock from './components/Question';
import { useNavigate, useSearchParams } from 'react-router-dom';

function CreateQuizPage() {
    const { user } = useContext(UserContext);
    const [number, setNumber] = useState<number>(1);
    const [questions, setQuestions] = useState<Quiz[]>([defaultQuestion]);
    const [isPosting, setIsPosting] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const isEditing = !!searchParams.get('edit');
    let id = searchParams.get('id');

    useEffect(() => {
        async function getFirestoreDocument() {
            if (!id) {
                return;
            }

            const subject = searchParams.get('subject')?.replace('-', ' ');
            if (!subject) {
                return;
            }

            const docRef = doc(db, 'subjects', subject, 'quizzes', id);
            try {
                const docSnap = await getDoc(docRef);
                const data = docSnap.data() as FirebaseQuiz;

                ref.current!.value = subject;
                let highestNumber = 0;

                data.questions.forEach((question) => {
                    if (question.number > highestNumber) {
                        highestNumber = question.number;
                    }
                });

                setNumber(highestNumber + 1);
                setTitle(data.title);
                setQuestions(data.questions);
            } catch (error) {
                console.error(error);

                Swal.fire(
                    'Error',
                    'Something went wrong, please contact Ezra Magbanua',
                    'error',
                );
            }
        }

        getFirestoreDocument();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing, id]);

    function handleEditQuestion(e: any, number: number, key: string): void {
        const index = questions.findIndex((object) => object.number === number);

        if (index < 0) return;

        const question = questions[index] as Record<string, any>;
        question[key] = e.target.value;

        questions[index] = question as Quiz;

        setQuestions([...questions]);
    }

    function handleEditChoices(e: any, number: number, index: number) {
        const questionIndex = questions.findIndex(
            (object) => object.number === number,
        );

        if (questionIndex < 0) return;

        const question = questions[questionIndex];
        question.choices[index] = e.target.value;

        questions[questionIndex] = question;

        setQuestions([...questions]);
    }

    function handleAddChoices(number: number) {
        const questionIndex = questions.findIndex(
            (object) => object.number === number,
        );

        if (questionIndex < 0) return;

        const question = questions[questionIndex];
        question.choices.push('');

        questions[questionIndex] = question;

        setQuestions([...questions]);
    }

    function handleChangeQuestionType(number: number, type: QuestionType) {
        const questionIndex = questions.findIndex(
            (object) => object.number === number,
        );

        if (questionIndex < 0) return;

        const question = questions[questionIndex];
        question.type = type;

        questions[questionIndex] = question;

        setQuestions([...questions]);
    }

    function handleAddAnotherQuestion() {
        const question: Quiz = {
            type: 'multiple-choice',
            number: number,
            choices: ['', ''],
            question: '',
            answer: '',
        };

        setNumber(number + 1);
        setQuestions([...questions, question]);
    }

    const ref = useRef<HTMLSelectElement | null>(null);

    async function handlePost(
        object: FirebaseQuiz,
        subject: string,
    ): Promise<string> {
        const doc = await addDoc(
            collection(db, 'subjects', subject, 'quizzes'),
            object,
        );

        return doc.id;
    }

    async function handleEdit(object: FirebaseQuiz) {
        if (!id) {
            console.error('No Id found');
            return;
        }

        const subject = searchParams.get('subject')?.replace('-', ' ');
        if (!subject) {
            console.error('No subject found');
            return;
        }

        const docRef = doc(db, 'subjects', subject, 'quizzes', id);

        await updateDoc(docRef, { ...object });
    }

    async function handleSubmitButton() {
        setIsPosting(true);

        const subject = ref.current?.value || 'lost';
        const object: FirebaseQuiz = {
            creator: user?.displayName || '-',
            email: user?.email || '-',
            title,
            questions,
        };

        try {
            if (isEditing) {
                handleEdit(object);
            } else {
                id = await handlePost(object, subject);
            }

            setIsPosting(false);

            const popUpText = isEditing ? 'Quiz Edited' : 'Quiz Posted';

            await Swal.fire(
                popUpText,
                'Click the button to redirect to the quiz',
                'success',
            );

            const formattedSubject = subject.replace(' ', '-');
            navigate(`/quizzes/${formattedSubject}/${id}`);
        } catch (error) {
            console.error(error);
            setIsPosting(false);

            Swal.fire(
                'Error',
                'Something went wrong, please contact Ezra Magbanua',
                'error',
            );
        }
    }

    function handleDelete(number: number) {
        setQuestions(
            questions.filter((question) => question.number !== number),
        );
    }

    useEffect(() => {
        const unloadCallback = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = '';
            return '';
        };

        window.addEventListener('beforeunload', unloadCallback);
        return () => window.removeEventListener('beforeunload', unloadCallback);
    }, []);

    const postButtonText = isEditing ? 'Edit Quiz' : 'Post Quiz';

    const renderSubmitButton = isPosting ? (
        <ClipLoader size={10} />
    ) : (
        postButtonText
    );

    return (
        <>
            <section className="flex gap-2 items-center">
                <p>Subject</p>
                <select
                    className="uppercase border p-2 rounded-xl outline-none"
                    ref={ref}
                    disabled={isEditing}
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
                    placeholder="Enter Quiz Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </section>
            <section className="my-5">
                {questions.map((question, index) => (
                    <QuestionBlock
                        key={question.number}
                        questionNumber={index}
                        questionObject={question}
                        onEditQuestion={handleEditQuestion}
                        onEditChoices={handleEditChoices}
                        onAddChoices={handleAddChoices}
                        onChangeQuestionType={handleChangeQuestionType}
                        onDelete={handleDelete}
                    />
                ))}
            </section>
            <section className="flex gap-2 justify-center items-center text-sm">
                <button
                    className="p-2 border rounded-xl hover:bg-red-500 hover:text-white transition ease-in-out duration-500"
                    onClick={handleAddAnotherQuestion}
                >
                    Add another question
                </button>
                <button
                    className="p-2 border rounded-xl hover:bg-green-500 hover:text-white transition ease-in-out duration-500"
                    onClick={handleSubmitButton}
                >
                    {renderSubmitButton}
                </button>
            </section>
        </>
    );
}

export default CreateQuizPage;
