"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { questions, TOPIC_LABELS, TOPIC_COLORS, type Topic } from "@/data/questions";
import { getQuizProgress, removeWrong } from "@/lib/progress";
import Link from "next/link";

export default function WrongPage() {
  const params = useParams();
  const examId = params.examId as string;
  const [wrongIds, setWrongIds] = useState<Set<number>>(new Set());
  const [openIds, setOpenIds] = useState<Set<number>>(new Set());
  const [topicFilter, setTopicFilter] = useState<Topic | "all">("all");

  useEffect(() => {
    const prog = getQuizProgress(examId);
    setWrongIds(new Set(prog.incorrectIds));
  }, [examId]);

  const wrongQuestions = questions.filter((q) => wrongIds.has(q.id));
  const usedTopics = [...new Set(wrongQuestions.map((q) => q.topic))] as Topic[];
  const filtered =
    topicFilter === "all"
      ? wrongQuestions
      : wrongQuestions.filter((q) => q.topic === topicFilter);

  function toggleOpen(id: number) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleMaster(id: number) {
    removeWrong(examId, id);
    setWrongIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  if (wrongIds.size === 0) {
    return (
      <div className="space-y-5">
        <h1 className="text-xl font-bold text-slate-700">苦手問題</h1>
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <p className="text-4xl mb-3">🎉</p>
          <p className="font-semibold text-slate-700 mb-1">苦手問題はありません</p>
          <p className="text-sm text-slate-400">
            模擬テストや一問一答で間違えた問題が自動的にここに表示されます。
          </p>
          <Link
            href={`/${examId}/quick`}
            className="inline-block mt-5 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            一問一答を始める
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-700">苦手問題</h1>
          <p className="text-sm text-slate-500 mt-0.5">間違えた問題を確認して克服しよう</p>
        </div>
        <span className="text-sm font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
          {wrongIds.size}問
        </span>
      </div>

      {/* 一問一答で復習ボタン */}
      <Link
        href={`/${examId}/quick`}
        className="flex items-center justify-center gap-2 w-full py-3 bg-rose-600 text-white rounded-xl font-medium hover:bg-rose-700 transition-colors"
      >
        苦手問題を一問一答で集中攻略する →
      </Link>

      {/* Topic filter */}
      {usedTopics.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTopicFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              topicFilter === "all"
                ? "bg-rose-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:border-rose-300"
            }`}
          >
            全分野 ({wrongQuestions.length})
          </button>
          {usedTopics.map((t) => {
            const count = wrongQuestions.filter((q) => q.topic === t).length;
            return (
              <button
                key={t}
                onClick={() => setTopicFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  topicFilter === t
                    ? "bg-rose-600 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-rose-300"
                }`}
              >
                {TOPIC_LABELS[t]} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Question list */}
      <div className="space-y-2">
        {filtered.map((q) => {
          const isOpen = openIds.has(q.id);
          return (
            <div key={q.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <button
                className="w-full flex items-start justify-between px-4 py-3.5 text-left hover:bg-slate-50 transition-colors gap-3"
                onClick={() => toggleOpen(q.id)}
              >
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <span
                    className={`shrink-0 mt-0.5 text-xs px-2 py-0.5 rounded-full font-medium ${TOPIC_COLORS[q.topic]}`}
                  >
                    {TOPIC_LABELS[q.topic]}
                  </span>
                  <span className="text-sm text-slate-700 leading-relaxed">{q.question}</span>
                </div>
                <span className="shrink-0 text-slate-400 text-lg leading-none mt-0.5">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-3 space-y-3 border-t border-slate-100">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 mb-1.5">正解</p>
                    <p className="text-sm font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                      {q.options[q.correctAnswer]}
                    </p>
                  </div>
                  {q.keywords && q.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {q.keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full px-2.5 py-1 font-medium"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-slate-600 leading-relaxed">{q.explanation}</p>
                  <button
                    onClick={() => handleMaster(q.id)}
                    className="w-full py-2 border-2 border-green-400 text-green-700 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
                  >
                    ✓ 克服した（リストから削除）
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
