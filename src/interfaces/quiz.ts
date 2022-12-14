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

export interface DraftQuiz extends FirebaseQuiz {
    subject: string;
}

export interface SnapshotFirebaseQuiz extends FirebaseQuiz {
    id: string;
}

export interface SnapshotFirebaseQuizWithScores extends SnapshotFirebaseQuiz {
    userScore: FirebaseQuizAnswers | null;
}

export interface QuizAnswer {
    number: number;
    answer: string;
}

export interface FirebaseQuizAnswers {
    score: number;
    answers: QuizAnswer[];
}
