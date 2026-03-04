"use client";
import { useState, useEffect } from "react";
import { flashcards, type Flashcard } from "@/data/flashcards";
import { TOPIC_LABELS, TOPIC_COLORS, type Topic } from "@/data/questions";
import { getFlashcardProgress, saveFlashcardProgress } from "@/lib/progress";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FlashcardsPage() {
  const [topicFilter, setTopicFilter] = useState<Topic | "all">("all");
  const [pool, setPool] = useState<Flashcard[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<number[]>([]);

  useEffect(() => {
    const fp = getFlashcardProgress();
    setMasteredIds(fp.masteredIds);
  }, []);

  useEffect(() => {
    const filtered =
      topicFilter === "all"
        ? flashcards
        : flashcards.filter((c) => c.topic === topicFilter);
    setPool(shuffle(filtered));
    setIdx(0);
    setFlipped(false);
  }, [topicFilter]);

  const current = pool[idx];

  function handleMastered(mastered: boolean) {
    const prev = getFlashcardProgress();
    let updated: number[];
    if (mastered && current) {
      updated = Array.from(new Set([...prev.masteredIds, current.id]));
    } else if (current) {
      updated = prev.masteredIds.filter((id) => id !== current.id);
    } else {
      updated = prev.masteredIds;
    }
    setMasteredIds(updated);
    saveFlashcardProgress({ masteredIds: updated });
    goNext();
  }

  function goNext() {
    setFlipped(false);
    setTimeout(() => setIdx((i) => (i + 1) % pool.length), 50);
  }

  function goPrev() {
    setFlipped(false);
    setTimeout(() => setIdx((i) => (i - 1 + pool.length) % pool.length), 50);
  }

  const isMastered = current ? masteredIds.includes(current.id) : false;
  const masteredInPool = pool.filter((c) => masteredIds.includes(c.id)).length;

  const topics = Array.from(new Set(flashcards.map((c) => c.topic)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-700">単語帳</h1>
        <span className="text-sm text-slate-500">
          マスター: {masteredIds.length} / {flashcards.length}
        </span>
      </div>

      {/* Topic filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setTopicFilter("all")}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            topicFilter === "all"
              ? "bg-indigo-600 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"
          }`}
        >
          全分野
        </button>
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => setTopicFilter(t)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              topicFilter === t
                ? "bg-indigo-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"
            }`}
          >
            {TOPIC_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Progress */}
      {pool.length > 0 && (
        <div>
          <div className="flex justify-between text-sm text-slate-500 mb-1">
            <span>{idx + 1} / {pool.length}</span>
            <span>マスター: {masteredInPool} / {pool.length}</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full">
            <div
              className="h-full bg-violet-500 rounded-full transition-all"
              style={{ width: `${((idx + 1) / pool.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Card */}
      {current && (
        <div className="flip-card" style={{ height: "320px" }}>
          <div className={`flip-card-inner w-full h-full ${flipped ? "flipped" : ""}`}>
            {/* Front */}
            <div
              className="flip-card-front w-full h-full bg-white border-2 border-violet-300 rounded-2xl shadow-md flex flex-col items-center justify-center p-6 cursor-pointer select-none"
              onClick={() => setFlipped(true)}
            >
              <span className={`text-xs px-2 py-1 rounded-full font-medium mb-4 ${TOPIC_COLORS[current.topic]}`}>
                {TOPIC_LABELS[current.topic]}
              </span>
              <p className="text-2xl font-bold text-slate-800 text-center mb-2">
                {current.term}
              </p>
              {current.reading && (
                <p className="text-sm text-slate-400">{current.reading}</p>
              )}
              <p className="text-xs text-violet-400 mt-6">タップして定義を確認</p>
              {isMastered && (
                <span className="absolute top-4 right-4 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">
                  マスター済
                </span>
              )}
            </div>

            {/* Back */}
            <div
              className="flip-card-back w-full bg-violet-50 border-2 border-violet-300 rounded-2xl shadow-md flex flex-col p-6 cursor-pointer select-none overflow-y-auto"
              onClick={() => setFlipped(false)}
              style={{ minHeight: "320px" }}
            >
              <p className="text-lg font-bold text-violet-800 mb-3">{current.term}</p>
              <p className="text-sm text-slate-700 leading-relaxed flex-1">
                {current.definition}
              </p>
              {current.example && (
                <div className="mt-3 bg-white rounded-lg p-3 border border-violet-200">
                  <p className="text-xs text-violet-600 font-semibold mb-1">例</p>
                  <p className="text-xs text-slate-600">{current.example}</p>
                </div>
              )}
              <p className="text-xs text-violet-300 mt-3 text-center">タップして戻る</p>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      {current && (
        <div className="space-y-3">
          <div className="flex gap-3">
            <button
              onClick={goPrev}
              className="flex-1 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              前へ
            </button>
            <button
              onClick={goNext}
              className="flex-1 py-2 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              次へ
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleMastered(false)}
              className="flex-1 py-2 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-medium hover:bg-rose-100 transition-colors"
            >
              もう一度
            </button>
            <button
              onClick={() => handleMastered(true)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                isMastered
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-green-50 border border-green-200 text-green-700 hover:bg-green-100"
              }`}
            >
              {isMastered ? "マスター済" : "マスター！"}
            </button>
          </div>
        </div>
      )}

      {pool.length === 0 && (
        <div className="text-center py-16 text-slate-400">カードがありません</div>
      )}
    </div>
  );
}
