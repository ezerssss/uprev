import { addDoc, collection } from 'firebase/firestore';
import { useRef, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import ReactTooltip from 'react-tooltip';
import Swal from 'sweetalert2';
import { defaultQuestion } from '../../constants/question';
import db from '../../firebase/db';
import { FirebaseQuiz, Quiz } from '../../interfaces/quiz';
import { QuestionType } from '../../types/question.types';
import QuestionBlock from './components/Question';

function CreateQuizPage() {
    const [number, setNumber] = useState<number>(1);
    const [questions, setQuestions] = useState<Quiz[]>([defaultQuestion]);
    const [isPosting, setIsPosting] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');

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

    async function handlePostQuiz() {
        setIsPosting(true);

        const subject = ref.current?.value || 'lost';

        try {
            const object: FirebaseQuiz = {
                title,
                questions,
            };

            await addDoc(
                collection(db, 'subjects', subject, 'quizzes'),
                object,
            );

            Swal.fire('Success', 'Quiz Posted', 'success');

            setIsPosting(false);
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

    const renderPostButton = isPosting ? <ClipLoader size={10} /> : 'Post Quiz';

    return (
        <>
            <ReactTooltip />
            <section className="flex gap-2 items-center">
                <p>Subject</p>
                <select
                    className="uppercase border p-2 rounded-xl outline-none"
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
                    onClick={handlePostQuiz}
                >
                    {renderPostButton}
                </button>
            </section>
        </>
    );
}

export default CreateQuizPage;
