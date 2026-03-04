"use client";
import { useState, useEffect, useCallback } from "react";
import { questions, TOPIC_LABELS, TOPIC_COLORS, type Topic } from "@/data/questions";
import { getQuizProgress, saveQuizProgress } from "@/lib/progress";

type Mode = "select" | "quiz" | "result";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizPage() {
  const [mode, setMode] = useState<Mode>("select");
  const [selectedTopic, setSelectedTopic] = useState<Topic | "all">("all");
  const [pool, setPool] = useState(questions);
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [wrongIds, setWrongIds] = useState<number[]>([]);

  const current = pool[idx];

  const startQuiz = useCallback((mode: "all" | "wrong" | Topic) => {
    let base = questions;
    if (mode === "wrong") {
      const prog = getQuizProgress();
      const ids = new Set(prog.incorrectIds);
      base = questions.filter((q) => ids.has(q.id));
      if (base.length === 0) {
        alert("間違えた問題がまだありません。");
        return;
      }
    } else if (mode !== "all") {
      base = questions.filter((q) => q.topic === mode);
    }
    setPool(shuffle(base));
    setIdx(0);
    setChosen(null);
    setScore(0);
    setWrongIds([]);
    setMode("quiz");
  }, []);

  function handleAnswer(optIdx: number) {
    if (chosen !== null) return;
    setChosen(optIdx);
    const isCorrect = optIdx === current.correctAnswer;
    if (isCorrect) {
      setScore((s) => s + 1);
    } else {
      setWrongIds((w) => [...w, current.id]);
    }
  }

  function handleNext() {
    if (idx + 1 >= pool.length) {
      // save progress
      const prev = getQuizProgress();
      const newWrong = Array.from(
        new Set([...prev.incorrectIds, ...wrongIds].filter((id) => !pool.slice(0, idx + 1).some((q) => q.id === id && !wrongIds.includes(id))))
      );
      // correct: remove from incorrect list if answered correctly now
      const answeredCorrectlyIds = pool.slice(0, idx + 1).map((q) => q.id).filter((id) => !wrongIds.includes(id));
      const finalWrong = [...new Set([...prev.incorrectIds, ...wrongIds])].filter((id) => !answeredCorrectlyIds.includes(id));
      saveQuizProgress({
        answered: prev.answered + pool.length,
        correct: prev.correct + score + (chosen === current.correctAnswer ? 1 : 0),
        incorrectIds: finalWrong,
      });
      setMode("result");
    } else {
      setIdx((i) => i + 1);
      setChosen(null);
    }
  }

  const topicOptions: { value: Topic | "all"; label: string }[] = [
    { value: "all", label: "全分野" },
    ...Object.entries(TOPIC_LABELS).map(([k, v]) => ({
      value: k as Topic,
      label: v,
    })),
  ];

  if (mode === "select") {
    const prog = getQuizProgress();
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-slate-700">模擬テスト</h1>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h2 className="font-semibold text-slate-600 mb-3">分野を選んで開始</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {topicOptions.map((t) => (
              <button
                key={t.value}
                onClick={() => startQuiz(t.value as Topic | "all")}
                className="px-3 py-2 rounded-lg text-sm font-medium border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-left"
              >
                {t.label}
                <span className="ml-1 text-xs text-slate-400">
                  ({t.value === "all" ? questions.length : questions.filter((q) => q.topic === t.value).length}問)
                </span>
              </button>
            ))}
          </div>
        </div>

        {prog.incorrectIds.length > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
            <h2 className="font-semibold text-rose-700 mb-2">苦手問題を復習</h2>
            <p className="text-sm text-rose-600 mb-3">
              間違えた問題が <strong>{prog.incorrectIds.length}問</strong> あります。
            </p>
            <button
              onClick={() => startQuiz("wrong")}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors"
            >
              苦手問題だけ解く
            </button>
          </div>
        )}
      </div>
    );
  }

  if (mode === "result") {
    const total = pool.length;
    const pct = Math.round((score / total) * 100);
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-slate-700">結果</h1>
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
          <div className={`text-6xl font-bold mb-2 ${pct >= 70 ? "text-green-500" : "text-rose-500"}`}>
            {pct}%
          </div>
          <p className="text-slate-500 mb-1">
            {total}問中 <span className="font-semibold text-slate-700">{score}問</span> 正解
          </p>
          {pct >= 70 ? (
            <p className="text-green-600 font-medium">合格ライン達成！</p>
          ) : (
            <p className="text-rose-500 font-medium">もう少し！苦手分野を復習しましょう。</p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setMode("select")}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            もう一度
          </button>
          <button
            onClick={() => { setMode("select"); }}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            分野選択に戻る
          </button>
        </div>
      </div>
    );
  }

  // quiz mode
  const isAnswered = chosen !== null;
  const isCorrect = chosen === current.correctAnswer;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">
          {idx + 1} / {pool.length}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${TOPIC_COLORS[current.topic]}`}>
          {TOPIC_LABELS[current.topic]}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-100 rounded-full">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all"
          style={{ width: `${((idx + 1) / pool.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <p className="font-medium text-slate-800 leading-relaxed">{current.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {current.options.map((opt, i) => {
          let cls =
            "w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ";
          if (!isAnswered) {
            cls += "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 bg-white";
          } else if (i === current.correctAnswer) {
            cls += "border-green-400 bg-green-50 text-green-800 font-medium";
          } else if (i === chosen) {
            cls += "border-rose-400 bg-rose-50 text-rose-800";
          } else {
            cls += "border-slate-200 bg-white text-slate-400";
          }
          return (
            <button key={i} className={cls} onClick={() => handleAnswer(i)}>
              <span className="font-bold mr-2 text-slate-400">
                {["ア", "イ", "ウ", "エ"][i]}.
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {isAnswered && (
        <div className={`rounded-xl p-4 border ${isCorrect ? "bg-green-50 border-green-200" : "bg-rose-50 border-rose-200"}`}>
          <p className={`font-semibold mb-1 ${isCorrect ? "text-green-700" : "text-rose-700"}`}>
            {isCorrect ? "正解！" : "不正解"}
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">{current.explanation}</p>
        </div>
      )}

      {/* Next button */}
      {isAnswered && (
        <button
          onClick={handleNext}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          {idx + 1 >= pool.length ? "結果を見る" : "次の問題"}
        </button>
      )}
    </div>
  );
}
