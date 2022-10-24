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
    creator: string;
    email: string;
    questions: Quiz[];
}

export interface SnapshotFirebaseQuiz extends FirebaseQuiz {
    id: string;
}
