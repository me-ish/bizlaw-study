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

function keys(examId: string) {
  return {
    quiz: `${examId}_quiz_progress`,
    flashcard: `${examId}_flashcard_progress`,
    notes: `${examId}_notes_progress`,
  };
}

const defaultQuiz = (): QuizProgress => ({
  answered: 0,
  correct: 0,
  incorrectIds: [],
  topicStats: {},
});

export function getQuizProgress(examId: string): QuizProgress {
  if (typeof window === "undefined") return defaultQuiz();
  try {
    const raw = localStorage.getItem(keys(examId).quiz);
    if (!raw) return defaultQuiz();
    return { ...defaultQuiz(), ...JSON.parse(raw) };
  } catch {
    return defaultQuiz();
  }
}

export function saveQuizProgress(examId: string, p: QuizProgress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(keys(examId).quiz, JSON.stringify(p));
}

export function resetQuizProgress(examId: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(keys(examId).quiz);
}

export function getFlashcardProgress(examId: string): FlashcardProgress {
  if (typeof window === "undefined") return { masteredIds: [] };
  try {
    const raw = localStorage.getItem(keys(examId).flashcard);
    return raw ? JSON.parse(raw) : { masteredIds: [] };
  } catch {
    return { masteredIds: [] };
  }
}

export function saveFlashcardProgress(examId: string, p: FlashcardProgress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(keys(examId).flashcard, JSON.stringify(p));
}

export function resetFlashcardProgress(examId: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(keys(examId).flashcard);
}

export function getNotesProgress(examId: string): NotesProgress {
  if (typeof window === "undefined") return { readTopics: [] };
  try {
    const raw = localStorage.getItem(keys(examId).notes);
    return raw ? JSON.parse(raw) : { readTopics: [] };
  } catch {
    return { readTopics: [] };
  }
}

export function saveNotesProgress(examId: string, p: NotesProgress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(keys(examId).notes, JSON.stringify(p));
}

export function resetNotesProgress(examId: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(keys(examId).notes);
}

export function saveQuickJudge(examId: string, questionId: number, isCorrect: boolean) {
  const prev = getQuizProgress(examId);
  let incorrectIds = [...prev.incorrectIds];
  if (isCorrect) {
    incorrectIds = incorrectIds.filter((id) => id !== questionId);
  } else if (!incorrectIds.includes(questionId)) {
    incorrectIds.push(questionId);
  }
  saveQuizProgress(examId, { ...prev, incorrectIds });
}

export function removeWrong(examId: string, questionId: number) {
  const prev = getQuizProgress(examId);
  saveQuizProgress(examId, {
    ...prev,
    incorrectIds: prev.incorrectIds.filter((id) => id !== questionId),
  });
}

export function saveQuizResult(
  examId: string,
  pool: { id: number; topic: string }[],
  wrongIds: number[]
) {
  const prev = getQuizProgress(examId);
  const correctIds = pool.map((q) => q.id).filter((id) => !wrongIds.includes(id));

  const topicStats = { ...prev.topicStats };
  for (const q of pool) {
    if (!topicStats[q.topic]) topicStats[q.topic] = { answered: 0, correct: 0 };
    topicStats[q.topic].answered += 1;
    if (!wrongIds.includes(q.id)) topicStats[q.topic].correct += 1;
  }

  const finalWrong = [...new Set([...prev.incorrectIds, ...wrongIds])].filter(
    (id) => !correctIds.includes(id)
  );

  saveQuizProgress(examId, {
    answered: prev.answered + pool.length,
    correct: prev.correct + correctIds.length,
    incorrectIds: finalWrong,
    topicStats,
  });
}
