import React from 'react';
import { BiCheckCircle } from 'react-icons/bi';
import { TbCircleX } from 'react-icons/tb';
import { Quiz, QuizAnswer } from '../../../interfaces/quiz';

interface PropsInterface {
    answers: QuizAnswer[];
    item: Quiz;
    showAnswers: boolean;
    handleIdentificationAnswer: (e: any, number: number) => void;
}
function Identification(props: PropsInterface) {
    const { answers, item, showAnswers, handleIdentificationAnswer } = props;
    const { number } = item;
    const textValue =
        answers.find((answer) => answer.number === number)?.answer || '';

    const isAnswerCorrect = textValue === item.answer;

    return (
        <div className="relative">
            <textarea
                className={`border-b-2 outline-none px-2 w-full h-7 min-h-[1.5rem] ${
                    showAnswers && isAnswerCorrect && 'bg-green-500 text-white'
                } ${
                    showAnswers && !isAnswerCorrect && 'bg-red-500 text-white'
                }`}
                disabled={showAnswers}
                placeholder="Enter Answer"
                value={textValue}
                onChange={(e) => handleIdentificationAnswer(e, number)}
            />
            {showAnswers && isAnswerCorrect && (
                <BiCheckCircle className="absolute right-3 top-1 text-white" />
            )}{' '}
            {showAnswers && !isAnswerCorrect && (
                <>
                    <TbCircleX className="absolute right-3 top-1 text-white" />
                    <p className="text-sm mt-2">Correct answer:</p>
                    <input
                        readOnly
                        className="w-full p-2 border outline-none"
                        value={item.answer}
                    />
                </>
            )}
        </div>
    );
}

export default Identification;
