import { CiCircleList, CiEdit, CiCirclePlus } from 'react-icons/ci';
import { QuestionType } from '../../../types/question.types';
import { Quiz } from '../../../interfaces/quiz';

interface PropsInterface {
    questionNumber: number;
    questionObject: Quiz;
    onEditQuestion: (e: any, number: number, key: string) => void;
    onEditChoices: (e: any, number: number, index: number) => void;
    onAddChoices: (number: number) => void;
    onChangeQuestionType: (number: number, type: QuestionType) => void;
    onDelete: (number: number) => void;
}

function QuestionBlock(props: PropsInterface) {
    const {
        questionNumber,
        questionObject,
        onEditQuestion,
        onEditChoices,
        onAddChoices,
        onChangeQuestionType,
        onDelete,
    } = props;
    const { number, type, question, answer, choices } = questionObject;

    function handleQuestionType(questionType: QuestionType) {
        onChangeQuestionType(number, questionType);
    }

    const renderQuestionTypes = (
        <div className="flex">
            <button
                data-tip="Multiple Choice"
                className={`border-2 ${
                    type === 'multiple-choice'
                        ? 'border-gray-300'
                        : 'border-white'
                } p-2 rounded`}
                onClick={() => handleQuestionType('multiple-choice')}
            >
                <CiCircleList />
            </button>
            <button
                data-tip="Identification"
                className={`border-2 ${
                    type === 'identification'
                        ? 'border-gray-300'
                        : 'border-white'
                } p-2 rounded`}
                onClick={() => handleQuestionType('identification')}
            >
                <CiEdit />
            </button>
        </div>
    );

    const renderChoices = type === 'multiple-choice' && (
        <div className="my-3">
            <p>Choices:</p>
            {choices.map((choice, index) => (
                <textarea
                    key={`${number}_${index}`}
                    className="border rounded outline-none p-2 w-full h-[2.5rem] min-h-[2.5rem]"
                    placeholder={`Choice ${index + 1}`}
                    value={choice}
                    onChange={(e) => onEditChoices(e, number, index)}
                />
            ))}
            <button
                className="flex items-center gap-1 mt-2 mb-5"
                onClick={() => onAddChoices(number)}
            >
                <CiCirclePlus /> Add another choice
            </button>
        </div>
    );

    return (
        <div className="border p-3 flex-1 min-h-[80px] text-sm rounded-3xl my-3">
            <textarea
                className="border-b-2 outline-none px-2 w-full h-7 min-h-[1.5rem]"
                placeholder={`Enter Question ${questionNumber}`}
                value={question}
                onChange={(e) => onEditQuestion(e, number, 'question')}
            />
            <div className="flex items-center gap-3 my-3">
                <p>Type of Question:</p>
                {renderQuestionTypes}
            </div>
            {renderChoices}
            <div>
                <p>Correct Answer:</p>
                <textarea
                    className="border rounded outline-none p-2 w-full min-h-[5rem]"
                    placeholder="Enter Answer"
                    value={answer}
                    onChange={(e) => onEditQuestion(e, number, 'answer')}
                />
            </div>
            <button
                className="mt-4 mb-2 p-2 border rounded-xl hover:bg-red-500 hover:text-white transition ease-in-out duration-500"
                onClick={() => onDelete(questionNumber)}
            >
                Delete
            </button>
        </div>
    );
}

export default QuestionBlock;
