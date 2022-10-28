export interface CardsInterface {
    keyword: string;
    description: string;
    number: number;
}

export interface FlashcardInterface {
    title: string;
    creator: string;
    email: string;
    cards: CardsInterface[];
}

export interface DraftFlashcard extends FlashcardInterface {
    subject: string;
}

export interface SnapshotFlashcard extends FlashcardInterface {
    id: string;
}
