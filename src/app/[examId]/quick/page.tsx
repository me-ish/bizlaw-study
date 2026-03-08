"use client";
import { useState, useEffect, useCallback } from "react";
import { questions, TOPIC_LABELS, TOPIC_COLORS, type Topic } from "@/data/questions";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = "select" | "question" | "answer" | "done";

export default function QuickPage() {
  const [phase, setPhase] = useState<Phase>("select");
  const [topicFilter, setTopicFilter] = useState<Topic | "all">("all");
  const [pool, setPool] = useState(questions);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);

  const current = pool[idx];

  function start(filter: Topic | "all") {
    const base = filter === "all" ? questions : questions.filter((q) => q.topic === filter);
    setPool(shuffle(base));
    setIdx(0);
    setCorrect(0);
    setWrong(0);
    setTopicFilter(filter);
    setPhase("question");
  }

  function handleJudge(isCorrect: boolean) {
    if (isCorrect) setCorrect((n) => n + 1);
    else setWrong((n) => n + 1);
    if (idx + 1 >= pool.length) {
      setPhase("done");
    } else {
      setIdx((i) => i + 1);
      setPhase("question");
    }
  }

  // キーボード操作
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (phase === "question" && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        setPhase("answer");
      } else if (phase === "answer") {
        if (e.key === "o" || e.key === "O" || e.key === "ArrowRight") handleJudge(true);
        else if (e.key === "x" || e.key === "X" || e.key === "ArrowLeft") handleJudge(false);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [phase, idx]);

  const topics = Object.keys(TOPIC_LABELS) as Topic[];
  const total = correct + wrong;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  if (phase === "select") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-700">一問一答</h1>
          <p className="text-sm text-slate-500 mt-0.5">問題を見て正解を思い浮かべ、○×で自己採点する高速演習モード</p>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
          <span>キーボード操作:</span>
          <kbd className="bg-white border border-slate-200 rounded px-1.5 py-0.5">Space</kbd><span>答えを見る</span>
          <kbd className="bg-white border border-slate-200 rounded px-1.5 py-0.5">O / →</kbd><span>正解</span>
          <kbd className="bg-white border border-slate-200 rounded px-1.5 py-0.5">X / ←</kbd><span>不正解</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <h2 className="font-semibold text-slate-600 mb-3 text-sm">分野を選んで開始</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => start("all")}
              className="px-3 py-2.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-left"
            >
              全分野
              <span className="ml-1 text-xs text-slate-400">({questions.length}問)</span>
            </button>
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => start(t)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-left"
              >
                {TOPIC_LABELS[t]}
                <span className="ml-1 text-xs text-slate-400">
                  ({questions.filter((q) => q.topic === t).length}問)
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-800">
            <strong>使い方：</strong>問題文を読んで頭の中で答えを考え、
            「答えを見る」ボタンで正解を確認してから○×で自己採点します。
            択一式の模擬テストより素早く回転できます。
          </p>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="space-y-5">
        <h1 className="text-xl font-bold text-slate-700">結果</h1>
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
          <div className={`text-6xl font-bold mb-2 ${pct >= 70 ? "text-green-500" : "text-rose-500"}`}>
            {pct}%
          </div>
          <p className="text-slate-500 mb-1">
            {pool.length}問中 <span className="font-semibold text-slate-700">{correct}問</span> 正解
          </p>
          <div className="flex justify-center gap-4 mt-3 text-sm">
            <span className="text-green-600 font-medium">○ {correct}問</span>
            <span className="text-rose-500 font-medium">✕ {wrong}問</span>
          </div>
          {pct >= 70 ? (
            <p className="text-green-600 font-medium mt-2">合格ライン達成！</p>
          ) : (
            <p className="text-rose-500 font-medium mt-2">もう少し！復習して再挑戦。</p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => start(topicFilter)}
            className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            もう一度
          </button>
          <button
            onClick={() => setPhase("select")}
            className="flex-1 py-2.5 border border-slate-300 rounded-xl font-medium hover:bg-slate-50 transition-colors"
          >
            分野選択に戻る
          </button>
        </div>
      </div>
    );
  }

  // question or answer phase
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">{idx + 1} / {pool.length}</span>
          <div className="flex gap-2 text-xs">
            <span className="text-green-600 font-medium">○ {correct}</span>
            <span className="text-rose-500 font-medium">✕ {wrong}</span>
          </div>
        </div>
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

      {/* Question card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm min-h-32">
        <p className="font-medium text-slate-800 leading-relaxed text-base">
          {current.question}
        </p>
      </div>

      {phase === "question" ? (
        <button
          onClick={() => setPhase("answer")}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          答えを見る（Space）
        </button>
      ) : (
        <>
          {/* Answer reveal */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-slate-500 mb-2">正解</p>
            <p className="text-sm font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              {current.options[current.correctAnswer]}
            </p>
            {current.keywords && current.keywords.length > 0 && (
              <div className="pt-1">
                <p className="text-xs font-semibold text-indigo-500 mb-1.5">💡 浮かべるべきキーワード</p>
                <div className="flex flex-wrap gap-1.5">
                  {current.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full px-2.5 py-1 font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <p className="text-xs text-slate-600 leading-relaxed pt-1">{current.explanation}</p>
          </div>

          {/* Self-judge buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => handleJudge(false)}
              className="flex-1 py-3 bg-rose-50 border-2 border-rose-300 text-rose-700 rounded-xl font-bold text-lg hover:bg-rose-100 transition-colors"
            >
              ✕ 不正解（X）
            </button>
            <button
              onClick={() => handleJudge(true)}
              className="flex-1 py-3 bg-green-50 border-2 border-green-300 text-green-700 rounded-xl font-bold text-lg hover:bg-green-100 transition-colors"
            >
              ○ 正解（O）
            </button>
          </div>
        </>
      )}

      <button
        onClick={() => setPhase("select")}
        className="w-full text-xs text-slate-400 hover:text-slate-600 py-1 transition-colors"
      >
        中断して分野選択に戻る
      </button>
    </div>
  );
}
