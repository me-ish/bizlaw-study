"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getQuizProgress, getFlashcardProgress, getNotesProgress } from "@/lib/progress";
import { questions } from "@/data/questions";
import { flashcards } from "@/data/flashcards";
import { notes } from "@/data/notes";

// EXAM_DATE_KEY is defined dynamically per exam below

type Phase = "note" | "flashcard" | "quiz" | "review";

interface DayPlan {
  phase: Phase;
  label: string;
  icon: string;
  color: string;
  tasks: { href: string; label: string; desc: string }[];
}

function getPhase(daysLeft: number, examId: string): DayPlan {
  if (daysLeft > 30) {
    return {
      phase: "note",
      label: "インプットフェーズ",
      icon: "📖",
      color: "teal",
      tasks: [
        { href: `/${examId}/notes`, label: "まとめノートを読む", desc: "全7分野の概要を把握する。頻出マーカーに注目。" },
        { href: `/${examId}/flashcards`, label: "単語帳で用語を確認", desc: "各分野の重要用語を流し見する。" },
      ],
    };
  }
  if (daysLeft > 14) {
    return {
      phase: "flashcard",
      label: "暗記フェーズ",
      icon: "🃏",
      color: "violet",
      tasks: [
        { href: `/${examId}/flashcards`, label: "単語帳をマスターする", desc: "まだマスターしていないカードを集中的に覚える。" },
        { href: `/${examId}/quick`, label: "一問一答で高速チェック", desc: "問題を見て即答できるか確認する。" },
      ],
    };
  }
  if (daysLeft > 3) {
    return {
      phase: "quiz",
      label: "演習フェーズ",
      icon: "📝",
      color: "indigo",
      tasks: [
        { href: `/${examId}/quiz`, label: "模擬テストを解く", desc: "苦手分野を中心に繰り返し解く。目標70%以上。" },
        { href: `/${examId}/quiz`, label: "苦手問題だけ復習", desc: "間違えた問題をもう一度解き直す。" },
      ],
    };
  }
  return {
    phase: "review",
    label: "直前フェーズ",
    icon: "⚡",
    color: "rose",
    tasks: [
      { href: `/${examId}/review`, label: "直前チェックで総確認", desc: "頻出・混同注意・暗記項目を最終確認。" },
      { href: `/${examId}/quick`, label: "一問一答で最終仕上げ", desc: "全分野を一気に流して記憶を定着させる。" },
    ],
  };
}

const phaseOrder: Phase[] = ["note", "flashcard", "quiz", "review"];

const phaseTimeline = [
  { phase: "note" as Phase, label: "インプット", range: "30日前〜", icon: "📖" },
  { phase: "flashcard" as Phase, label: "暗記", range: "14〜30日前", icon: "🃏" },
  { phase: "quiz" as Phase, label: "演習", range: "3〜14日前", icon: "📝" },
  { phase: "review" as Phase, label: "直前", range: "3日前〜", icon: "⚡" },
];

export default function SchedulePage() {
  const params = useParams();
  const examId = params.examId as string;
  const EXAM_DATE_KEY = `${examId}_exam_date`;
  const [examDate, setExamDate] = useState<string>("");
  const [inputDate, setInputDate] = useState<string>("");
  const [quizPct, setQuizPct] = useState(0);
  const [cardPct, setCardPct] = useState(0);
  const [readCount, setReadCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(EXAM_DATE_KEY);
    if (saved) { setExamDate(saved); setInputDate(saved); }
    const qp = getQuizProgress(examId);
    const fp = getFlashcardProgress(examId);
    const np = getNotesProgress(examId);
    setQuizPct(Math.round((qp.answered / questions.length) * 100));
    setCardPct(Math.round((fp.masteredIds.length / flashcards.length) * 100));
    setReadCount(np.readTopics.length);
  }, []);

  function saveDate() {
    if (!inputDate) return;
    localStorage.setItem(EXAM_DATE_KEY, inputDate);
    setExamDate(inputDate);
  }

  function clearDate() {
    localStorage.removeItem(EXAM_DATE_KEY);
    setExamDate("");
    setInputDate("");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysLeft = examDate
    ? Math.ceil((new Date(examDate).getTime() - today.getTime()) / 86400000)
    : null;

  const plan = daysLeft !== null && daysLeft >= 0 ? getPhase(daysLeft, examId) : null;
  const currentPhaseIdx = plan ? phaseOrder.indexOf(plan.phase) : -1;

  const colorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
    teal:   { bg: "bg-teal-50",   border: "border-teal-300",  text: "text-teal-800",  badge: "bg-teal-100 text-teal-700" },
    violet: { bg: "bg-violet-50", border: "border-violet-300",text: "text-violet-800",badge: "bg-violet-100 text-violet-700" },
    indigo: { bg: "bg-indigo-50", border: "border-indigo-300",text: "text-indigo-800",badge: "bg-indigo-100 text-indigo-700" },
    rose:   { bg: "bg-rose-50",   border: "border-rose-300",  text: "text-rose-800",  badge: "bg-rose-100 text-rose-700" },
  };

  const onTrack = daysLeft !== null && plan
    ? (() => {
        if (plan.phase === "note") return readCount >= 2;
        if (plan.phase === "flashcard") return cardPct >= 30;
        if (plan.phase === "quiz") return quizPct >= 50;
        return quizPct >= 80 || cardPct >= 80;
      })()
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-700">学習スケジュール</h1>
        <p className="text-sm text-slate-500 mt-0.5">試験日を登録して、今日やるべきことを確認する</p>
      </div>

      {/* Exam date input */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h2 className="font-semibold text-slate-600 mb-3 text-sm">試験日を登録</h2>
        <div className="flex gap-2 items-center">
          <input
            type="date"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-400"
          />
          <button
            onClick={saveDate}
            disabled={!inputDate}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 transition-colors"
          >
            登録
          </button>
          {examDate && (
            <button onClick={clearDate} className="text-xs text-slate-400 hover:text-rose-400 transition-colors">
              クリア
            </button>
          )}
        </div>
      </div>

      {/* Days remaining */}
      {daysLeft !== null && (
        <div className={`rounded-xl border-2 p-6 text-center ${
          daysLeft === 0 ? "bg-amber-50 border-amber-300" :
          daysLeft < 0  ? "bg-slate-50 border-slate-200" :
          plan          ? `${colorMap[plan.color].bg} ${colorMap[plan.color].border}` : ""
        }`}>
          {daysLeft < 0 ? (
            <p className="text-slate-500 font-medium">試験日が過ぎています。お疲れさまでした！</p>
          ) : daysLeft === 0 ? (
            <>
              <div className="text-4xl font-bold text-amber-600 mb-1">試験当日！</div>
              <p className="text-amber-700 text-sm">実力を出し切ってください。</p>
            </>
          ) : (
            <>
              <div className={`text-5xl font-bold mb-1 ${plan ? colorMap[plan.color].text : ""}`}>
                {daysLeft}<span className="text-2xl ml-1">日</span>
              </div>
              <p className="text-slate-500 text-sm">試験まで残り</p>
              {plan && (
                <span className={`inline-block mt-2 text-xs px-3 py-1 rounded-full font-medium ${colorMap[plan.color].badge}`}>
                  {plan.icon} {plan.label}
                </span>
              )}
            </>
          )}
        </div>
      )}

      {/* Today's tasks */}
      {plan && daysLeft !== null && daysLeft > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-700 text-sm">今日のおすすめ</h2>
            {onTrack !== null && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${onTrack ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                {onTrack ? "順調です ✓" : "ペースアップを"}
              </span>
            )}
          </div>
          <div className="space-y-2">
            {plan.tasks.map((task, i) => (
              <Link key={i} href={task.href}>
                <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{task.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{task.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Progress snapshot */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h2 className="font-semibold text-slate-700 text-sm mb-3">現在の進捗</h2>
        <div className="space-y-3">
          <ProgressRow label="まとめノート既読" pct={Math.round((readCount / notes.length) * 100)} color="bg-teal-500" note={`${readCount}/${notes.length}分野`} />
          <ProgressRow label="単語帳マスター" pct={cardPct} color="bg-violet-500" note={`${cardPct}%`} />
          <ProgressRow label="模擬テスト完了" pct={quizPct} color="bg-indigo-500" note={`${quizPct}%`} />
        </div>
      </div>

      {/* Phase timeline */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h2 className="font-semibold text-slate-700 text-sm mb-4">推奨学習フロー</h2>
        <div className="flex items-start gap-0">
          {phaseTimeline.map((p, i) => {
            const isActive = i === currentPhaseIdx;
            const isDone = i < currentPhaseIdx;
            return (
              <div key={p.phase} className="flex-1 relative">
                {/* connector line */}
                {i < phaseTimeline.length - 1 && (
                  <div className={`absolute top-4 left-1/2 w-full h-0.5 ${isDone || isActive ? "bg-indigo-400" : "bg-slate-200"}`} />
                )}
                <div className="flex flex-col items-center text-center px-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm z-10 relative border-2 ${
                    isActive ? "bg-indigo-600 border-indigo-600 text-white" :
                    isDone   ? "bg-indigo-100 border-indigo-400 text-indigo-700" :
                               "bg-white border-slate-200 text-slate-400"
                  }`}>
                    {isDone ? "✓" : p.icon}
                  </div>
                  <p className={`text-xs font-medium mt-1.5 ${isActive ? "text-indigo-700" : isDone ? "text-indigo-500" : "text-slate-400"}`}>
                    {p.label}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-tight">{p.range}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!examDate && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-800">
            試験日を登録すると、残り日数に合わせた学習タスクが表示されます。
          </p>
        </div>
      )}
    </div>
  );
}

function ProgressRow({ label, pct, color, note }: { label: string; pct: number; color: string; note: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium text-slate-500">{note}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
