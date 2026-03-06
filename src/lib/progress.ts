import type { Topic } from "@/data/questions";

export interface TopicStat {
  answered: number;
  correct: number;
}

export interface QuizProgress {
  answered: number;
  correct: number;
  incorrectIds: number[];
  topicStats: Record<string, TopicStat>;
}

export interface FlashcardProgress {
  masteredIds: number[];
}

export interface NotesProgress {
  readTopics: string[];
}

const KEYS = {
  quiz: "bizlaw_quiz_progress",
  flashcard: "bizlaw_flashcard_progress",
  notes: "bizlaw_notes_progress",
} as const;

const defaultQuiz = (): QuizProgress => ({
  answered: 0,
  correct: 0,
  incorrectIds: [],
  topicStats: {},
});

export function getQuizProgress(): QuizProgress {
  if (typeof window === "undefined") return defaultQuiz();
  try {
    const raw = localStorage.getItem(KEYS.quiz);
    if (!raw) return defaultQuiz();
    const parsed = JSON.parse(raw);
    return { ...defaultQuiz(), ...parsed };
  } catch {
    return defaultQuiz();
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

export function getNotesProgress(): NotesProgress {
  if (typeof window === "undefined") return { readTopics: [] };
  try {
    const raw = localStorage.getItem(KEYS.notes);
    return raw ? JSON.parse(raw) : { readTopics: [] };
  } catch {
    return { readTopics: [] };
  }
}

export function saveNotesProgress(p: NotesProgress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEYS.notes, JSON.stringify(p));
}

export function resetNotesProgress() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEYS.notes);
}

/** クイズ終了時に分野別統計を更新して保存する */
export function saveQuizResult(
  pool: { id: number; topic: Topic }[],
  wrongIds: number[]
) {
  const prev = getQuizProgress();
  const correctIds = pool.map((q) => q.id).filter((id) => !wrongIds.includes(id));

  // update topic stats
  const topicStats = { ...prev.topicStats };
  for (const q of pool) {
    const key = q.topic;
    if (!topicStats[key]) topicStats[key] = { answered: 0, correct: 0 };
    topicStats[key].answered += 1;
    if (!wrongIds.includes(q.id)) topicStats[key].correct += 1;
  }

  // update incorrect ids (remove newly corrected, add new wrongs)
  const finalWrong = [
    ...new Set([...prev.incorrectIds, ...wrongIds]),
  ].filter((id) => !correctIds.includes(id));

  saveQuizProgress({
    answered: prev.answered + pool.length,
    correct: prev.correct + correctIds.length,
    incorrectIds: finalWrong,
    topicStats,
  });
}
