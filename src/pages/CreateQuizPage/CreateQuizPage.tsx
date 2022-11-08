import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import { defaultQuestion } from '../../constants/question';
import { ConfigContext, UserContext } from '../../App';
import db from '../../firebase/db';
import { DraftQuiz, FirebaseQuiz, Quiz } from '../../interfaces/quiz';
import { QuestionType } from '../../types/question.types';
import QuestionBlock from './components/Question';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { errorAlert } from '../../helpers/errors';
import { getDraft, removeDraft, saveDraft } from '../../helpers/draft';
import { getHighestNumber } from '../../helpers/number';
import { THREE_MINUTES } from '../../constants/time';
import { BiX } from 'react-icons/bi';

function CreateQuizPage() {
    const { user, isUpEmail } = useContext(UserContext);
    const [number, setNumber] = useState<number>(1);
    const [questions, setQuestions] = useState<Quiz[]>([defaultQuestion]);
    const [isPosting, setIsPosting] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [fromDrafts, setFromDrafts] = useState<boolean>(false);
    const [dropdownSelection, setDropdownSelection] =
        useState<string>('math 18');

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

                setDropdownSelection(subject);
                setNumber(getHighestNumber(data) + 1);
                setTitle(data.title);
                setQuestions(data.questions);
            } catch (error) {
                errorAlert(error);
            }
        }

        getFirestoreDocument();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing, id]);

    function handleDraft(draft: DraftQuiz) {
        setFromDrafts(true);
        setDropdownSelection(draft.subject);

        setNumber(getHighestNumber(draft) + 1);
        setTitle(draft.title);
        setQuestions(draft.questions);
    }

    function handleSaveDraft() {
        const shouldSaveToDraft = !!questions[0].question;

        if (!shouldSaveToDraft) return;

        const draft: DraftQuiz = {
            subject: dropdownSelection,
            creator: user?.displayName || '-',
            email: user?.email || '-',
            title,
            questions,
        };

        saveDraft(draft, 'quizDraft');
    }

    useEffect(() => {
        const draft = getDraft('quizDraft');

        if (draft) {
            handleDraft(draft);
        }
    }, []);

    useEffect(() => {
        const intervalID = setInterval(handleSaveDraft, THREE_MINUTES);

        return () => clearInterval(intervalID);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title, JSON.stringify(questions), dropdownSelection]);

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
        if (!isUpEmail) {
            Swal.fire(
                'Error',
                'To post a quiz, you must use your UP email',
                'info',
            );
            setIsPosting(false);

            return;
        }

        const subject = dropdownSelection;
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
            removeDraft('quizDraft');

            const popUpText = isEditing ? 'Quiz Edited' : 'Quiz Posted';

            await Swal.fire(
                popUpText,
                'Click the button to redirect to the quiz',
                'success',
            );

            const formattedSubject = subject.replace(' ', '-');
            navigate(`/quizzes/${formattedSubject}/${id}`);
        } catch (error) {
            errorAlert(error);
            setIsPosting(false);
        }
    }

    function handleDelete(number: number) {
        setQuestions(
            questions.filter((question) => question.number !== number),
        );
    }

    const postButtonText = isEditing ? 'Edit Quiz' : 'Post Quiz';

    const renderSubmitButton = isPosting ? (
        <ClipLoader size={10} />
    ) : (
        postButtonText
    );

    const renderFromDrafts = fromDrafts && (
        <div className="rounded-xl p-3 bg-blue-200 text-sm mb-5 flex justify-between items-center">
            <p>Restored from drafts</p>
            <button onClick={() => setFromDrafts(false)}>
                <BiX />
            </button>
        </div>
    );

    const { subjects } = useContext(ConfigContext);

    return (
        <>
            {renderFromDrafts}
            <section className="flex gap-2 items-center">
                <p>Subject</p>
                <select
                    className="uppercase border p-2 rounded-xl outline-none cursor-pointer"
                    disabled={isEditing}
                    value={dropdownSelection}
                    onChange={(e) => setDropdownSelection(e.target.value)}
                >
                    {subjects
                        .filter((subject) => !!subject)
                        .map((subject) => (
                            <option key={subject} value={subject}>
                                {subject}
                            </option>
                        ))}
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
