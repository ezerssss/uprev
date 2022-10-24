import { QuestionType } from '../types/question.types';

export interface Quiz {
    type: QuestionType;
    number: number;
    choices: string[];
    question: string;
    answer: string;
}

export interface FirebaseQuiz {
    title: string;
    questions: Quiz[];
}
