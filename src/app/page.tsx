"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getQuizProgress, getFlashcardProgress, resetQuizProgress, resetFlashcardProgress } from "@/lib/progress";
import { questions } from "@/data/questions";
import { flashcards } from "@/data/flashcards";

export default function HomePage() {
  const [quizPct, setQuizPct] = useState(0);
  const [cardPct, setCardPct] = useState(0);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  useEffect(() => {
    const qp = getQuizProgress();
    const fp = getFlashcardProgress();
    setQuizPct(Math.round((qp.answered / questions.length) * 100));
    setCardPct(Math.round((fp.masteredIds.length / flashcards.length) * 100));
    if (qp.answered > 0) {
      setAccuracy(Math.round((qp.correct / qp.answered) * 100));
    }
  }, []);

  function handleReset() {
    if (!confirm("学習進捗をリセットしますか？")) return;
    resetQuizProgress();
    resetFlashcardProgress();
    setQuizPct(0);
    setCardPct(0);
    setAccuracy(null);
  }

  const sections = [
    {
      href: "/quiz",
      emoji: "📝",
      title: "模擬テスト",
      desc: `全${questions.length}問・7分野の択一式問題。解説付き。`,
      color: "border-indigo-400 hover:border-indigo-500",
      badge: `${quizPct}% 完了`,
      badgeColor: quizPct === 100 ? "bg-green-100 text-green-700" : "bg-indigo-100 text-indigo-700",
    },
    {
      href: "/flashcards",
      emoji: "🃏",
      title: "単語帳",
      desc: `全${flashcards.length}枚・重要法律用語をフラッシュカード形式で暗記。`,
      color: "border-violet-400 hover:border-violet-500",
      badge: `${cardPct}% マスター`,
      badgeColor: cardPct === 100 ? "bg-green-100 text-green-700" : "bg-violet-100 text-violet-700",
    },
    {
      href: "/notes",
      emoji: "📖",
      title: "まとめノート",
      desc: "7分野の重要ポイントを整理。試験直前の確認に。",
      color: "border-teal-400 hover:border-teal-500",
      badge: "7分野",
      badgeColor: "bg-teal-100 text-teal-700",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 text-white">
        <h1 className="text-2xl font-bold mb-1">ビジネス実務法務検定 2級</h1>
        <p className="text-indigo-200 text-sm mb-6">合格を目指す学習サイト — 模擬テスト・単語帳・まとめノート</p>

        <div className="grid grid-cols-3 gap-4 text-center">
          <StatBox label="問題数" value={`${questions.length}問`} />
          <StatBox label="単語カード" value={`${flashcards.length}枚`} />
          <StatBox label="分野数" value="7分野" />
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-700">学習進捗</h2>
          <button
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-red-500 transition-colors"
          >
            リセット
          </button>
        </div>
        <div className="space-y-3">
          <ProgressRow label="模擬テスト" pct={quizPct} color="bg-indigo-500" />
          <ProgressRow label="単語帳マスター" pct={cardPct} color="bg-violet-500" />
          {accuracy !== null && (
            <p className="text-sm text-slate-500 pt-1">
              正答率: <span className="font-semibold text-slate-700">{accuracy}%</span>
            </p>
          )}
        </div>
      </div>

      {/* Section cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {sections.map((s) => (
          <Link key={s.href} href={s.href}>
            <div className={`bg-white rounded-xl border-2 ${s.color} p-5 h-full transition-all hover:shadow-md cursor-pointer`}>
              <div className="text-3xl mb-2">{s.emoji}</div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-slate-700">{s.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${s.badgeColor}`}>
                  {s.badge}
                </span>
              </div>
              <p className="text-sm text-slate-500">{s.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h3 className="font-bold text-amber-800 mb-3">合格のための学習法</h3>
        <ol className="space-y-1 text-sm text-amber-700 list-decimal list-inside">
          <li>まず<strong>まとめノート</strong>で各分野の全体像を把握する</li>
          <li><strong>単語帳</strong>で法律用語・条文番号を暗記する</li>
          <li><strong>模擬テスト</strong>で知識を確認し、間違えた問題を繰り返す</li>
          <li>苦手分野のノートに戻って復習する</li>
        </ol>
        <p className="text-xs text-amber-600 mt-3">2級の目標合格点：約70点（100点満点）</p>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/20 rounded-lg p-3">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-indigo-200">{label}</div>
    </div>
  );
}

function ProgressRow({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium text-slate-700">{pct}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
