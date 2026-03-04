export interface QuizProgress {
  answered: number;
  correct: number;
  incorrectIds: number[];
}

export interface FlashcardProgress {
  masteredIds: number[];
}

const KEYS = {
  quiz: "bizlaw_quiz_progress",
  flashcard: "bizlaw_flashcard_progress",
} as const;

export function getQuizProgress(): QuizProgress {
  if (typeof window === "undefined")
    return { answered: 0, correct: 0, incorrectIds: [] };
  try {
    const raw = localStorage.getItem(KEYS.quiz);
    return raw ? JSON.parse(raw) : { answered: 0, correct: 0, incorrectIds: [] };
  } catch {
    return { answered: 0, correct: 0, incorrectIds: [] };
  }
}

export function saveQuizProgress(p: QuizProgress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.quiz, JSON.stringify(p));
}

export function resetQuizProgress() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS.quiz);
}

export function getFlashcardProgress(): FlashcardProgress {
  if (typeof window === "undefined") return { masteredIds: [] };
  try {
    const raw = localStorage.getItem(KEYS.flashcard);
    return raw ? JSON.parse(raw) : { masteredIds: [] };
  } catch {
    return { masteredIds: [] };
  }
}

export function saveFlashcardProgress(p: FlashcardProgress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.flashcard, JSON.stringify(p));
}

export function resetFlashcardProgress() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS.flashcard);
}
