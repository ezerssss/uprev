import { DraftType } from '../types/draft.types';

export function saveDraft(object: Record<string, any>, type: DraftType) {
    localStorage.setItem(type, JSON.stringify(object));
}

export function getDraft(type: DraftType) {
    const stringData = localStorage.getItem(type);
    if (!stringData) return;

    return JSON.parse(stringData);
}

export function removeDraft(type: DraftType) {
    localStorage.removeItem(type);
}
