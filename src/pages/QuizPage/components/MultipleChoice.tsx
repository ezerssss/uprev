import React from 'react';
import { BiCheckCircle, BiX } from 'react-icons/bi';
import { Quiz, QuizAnswer } from '../../../interfaces/quiz';

interface PropsInterface {
    answers: QuizAnswer[];
    item: Quiz;
    showAnswers: boolean;
    handleMultipleChoiceAnswer: (answer: string, number: number) => void;
}

function MultipleChoice(props: PropsInterface) {
    const { answers, item, showAnswers, handleMultipleChoiceAnswer } = props;
    const { number } = item;

    return (
        <>
            <p>Choices: </p>
            <div className="grid grid-cols-2 gap-2 p-2">
                {item.choices.map((choice, index) => {
                    const answer = answers.find(
                        (answer) => answer.number === number,
                    );

                    const isSelected = answer?.answer === choice;
                    const isSelectedWrong =
                        showAnswers &&
                        isSelected &&
                        answer?.answer !== item.answer;
                    const isChoiceCorrectAnswer =
                        showAnswers && choice === item.answer;

                    return (
                        <button
                            disabled={showAnswers}
                            key={`${choice}_${index}`}
                            className={`border-2 p-2 rounded-2xl hover:bg-slate-500 hover:text-white transition ease-in-out duration-500 ${
                                isSelected &&
                                !showAnswers &&
                                'bg-slate-500 text-white'
                            } ${isSelectedWrong && 'bg-red-500 text-white'} ${
                                isChoiceCorrectAnswer && 'bg-green-500'
                            } 
                                ${
                                    showAnswers &&
                                    'flex justify-between items-center'
                                }`}
                            onClick={() =>
                                handleMultipleChoiceAnswer(choice, number)
                            }
                        >
                            <p>{choice}</p>
                            {isChoiceCorrectAnswer && (
                                <BiCheckCircle className="text-white" />
                            )}
                            {isSelectedWrong && (
                                <BiX className="text-red-800" />
                            )}
                        </button>
                    );
                })}
            </div>
        </>
    );
}

export default MultipleChoice;
