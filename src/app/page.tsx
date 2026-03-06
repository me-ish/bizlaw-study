"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getQuizProgress, getFlashcardProgress, resetQuizProgress, resetFlashcardProgress, resetNotesProgress, type TopicStat } from "@/lib/progress";
import { questions, TOPIC_LABELS, TOPIC_COLORS, type Topic } from "@/data/questions";
import { flashcards } from "@/data/flashcards";

export default function HomePage() {
  const [quizPct, setQuizPct] = useState(0);
  const [cardPct, setCardPct] = useState(0);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [topicStats, setTopicStats] = useState<Record<string, TopicStat>>({});

  useEffect(() => {
    const qp = getQuizProgress();
    const fp = getFlashcardProgress();
    setQuizPct(Math.round((qp.answered / questions.length) * 100));
    setCardPct(Math.round((fp.masteredIds.length / flashcards.length) * 100));
    if (qp.answered > 0) {
      setAccuracy(Math.round((qp.correct / qp.answered) * 100));
    }
    setTopicStats(qp.topicStats ?? {});
  }, []);

  function handleReset() {
    if (!confirm("学習進捗をリセットしますか？")) return;
    resetQuizProgress();
    resetFlashcardProgress();
    resetNotesProgress();
    setQuizPct(0);
    setCardPct(0);
    setAccuracy(null);
    setTopicStats({});
  }

  const topicList = Object.keys(TOPIC_LABELS) as Topic[];

  const studySteps = [
    { step: 1, icon: "📖", label: "まとめノート", href: "/notes", desc: "各分野の全体像と重要論点を把握" },
    { step: 2, icon: "🃏", label: "単語帳", href: "/flashcards", desc: "重要用語を暗記・定着" },
    { step: 3, icon: "📝", label: "模擬テスト", href: "/quiz", desc: "知識を問題で確認・弱点発見" },
    { step: 4, icon: "⚡", label: "直前チェック", href: "/review", desc: "試験直前に要点を一気に復習" },
  ];

  const quickLinks = [
    {
      href: "/quiz",
      emoji: "📝",
      title: "模擬テスト",
      desc: `全${questions.length}問・7分野の択一式問題。解説付き。`,
      color: "border-indigo-300 hover:border-indigo-400",
      badge: `${quizPct}% 完了`,
      badgeColor: quizPct >= 100 ? "bg-green-100 text-green-700" : "bg-indigo-100 text-indigo-700",
    },
    {
      href: "/flashcards",
      emoji: "🃏",
      title: "単語帳",
      desc: `全${flashcards.length}枚・重要法律用語をフラッシュカード形式で暗記。`,
      color: "border-violet-300 hover:border-violet-400",
      badge: `${cardPct}% マスター`,
      badgeColor: cardPct >= 100 ? "bg-green-100 text-green-700" : "bg-violet-100 text-violet-700",
    },
    {
      href: "/notes",
      emoji: "📖",
      title: "まとめノート",
      desc: "7分野の重要ポイントを整理。頻出・混同注意・暗記マーカー付き。",
      color: "border-teal-300 hover:border-teal-400",
      badge: "7分野",
      badgeColor: "bg-teal-100 text-teal-700",
    },
    {
      href: "/glossary",
      emoji: "📚",
      title: "用語集",
      desc: `全${flashcards.length}用語。検索・分野フィルタ対応。`,
      color: "border-emerald-300 hover:border-emerald-400",
      badge: `${flashcards.length}用語`,
      badgeColor: "bg-emerald-100 text-emerald-700",
    },
    {
      href: "/review",
      emoji: "⚡",
      title: "直前チェック",
      desc: "頻出・混同注意・暗記項目を凝縮。試験前日の最終確認に。",
      color: "border-rose-300 hover:border-rose-400",
      badge: "直前対策",
      badgeColor: "bg-rose-100 text-rose-700",
    },
    {
      href: "/quick",
      emoji: "🎯",
      title: "一問一答",
      desc: `全${questions.length}問・問題を見て○×で高速自己採点。大量インプットに最適。`,
      color: "border-orange-300 hover:border-orange-400",
      badge: "高速演習",
      badgeColor: "bg-orange-100 text-orange-700",
    },
  ];

  return (
    <div className="space-y-7">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-1">ビジネス実務法務検定 2級</h1>
        <p className="text-indigo-200 text-sm mb-5">このサイトで合格を目指す — 全機能一覧</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <StatBox label="問題数" value={`${questions.length}問`} />
          <StatBox label="単語カード" value={`${flashcards.length}枚`} />
          <StatBox label="分野数" value="7分野" />
          <StatBox label="合格ライン" value="70点以上" />
        </div>
      </div>

      {/* 学習フロー */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h2 className="font-bold text-slate-700 mb-4 text-sm">おすすめ学習ルート</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {studySteps.map((s) => (
            <Link key={s.href} href={s.href}>
              <div className="text-center p-3 rounded-xl border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer h-full">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center mx-auto mb-1.5">
                  {s.step}
                </div>
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="text-xs font-semibold text-slate-700">{s.label}</div>
                <div className="text-xs text-slate-400 mt-0.5 leading-tight">{s.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-700 text-sm">学習進捗</h2>
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
            <div className="flex items-center gap-2 pt-1">
              <span className="text-sm text-slate-500">正答率:</span>
              <span className={`font-bold text-sm ${accuracy >= 70 ? "text-green-600" : "text-rose-500"}`}>
                {accuracy}%
              </span>
              {accuracy >= 70 ? (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">合格ライン✓</span>
              ) : (
                <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">目標70%まであと{70 - accuracy}%</span>
              )}
            </div>
          )}
          {Object.keys(topicStats).length > 0 && (
            <div className="pt-2 space-y-1.5">
              <p className="text-xs text-slate-400 font-medium">分野別正答率</p>
              {(Object.keys(TOPIC_LABELS) as Topic[]).map((topic) => {
                const stat = topicStats[topic];
                if (!stat || stat.answered === 0) return null;
                const pct = Math.round((stat.correct / stat.answered) * 100);
                return (
                  <div key={topic}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${TOPIC_COLORS[topic]}`}>
                        {TOPIC_LABELS[topic]}
                      </span>
                      <span className={`font-medium ${pct >= 70 ? "text-green-600" : "text-rose-500"}`}>
                        {pct}% ({stat.correct}/{stat.answered})
                      </span>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${pct >= 70 ? "bg-green-400" : pct >= 50 ? "bg-amber-400" : "bg-rose-400"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick links grid */}
      <div>
        <h2 className="font-bold text-slate-700 text-sm mb-3">学習ツール</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map((s) => (
            <Link key={s.href} href={s.href}>
              <div className={`bg-white rounded-xl border-2 ${s.color} p-4 h-full transition-all hover:shadow-md cursor-pointer`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{s.emoji}</span>
                    <h3 className="font-bold text-slate-700 text-sm">{s.title}</h3>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${s.badgeColor}`}>
                    {s.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Exam overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h2 className="font-bold text-slate-700 text-sm mb-3">7分野の出題傾向</h2>
        <div className="space-y-1.5">
          {topicList.map((topic) => {
            const qCount = questions.filter((q) => q.topic === topic).length;
            const cardCount = flashcards.filter((f) => f.topic === topic).length;
            return (
              <div key={topic} className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${TOPIC_COLORS[topic]}`}>
                  {TOPIC_LABELS[topic]}
                </span>
                <span className="text-xs text-slate-400">{qCount}問 / {cardCount}用語</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h3 className="font-bold text-amber-800 mb-3 text-sm">合格のための学習法</h3>
        <ol className="space-y-1.5 text-sm text-amber-700 list-decimal list-inside">
          <li>まず<strong>まとめノート</strong>で各分野の全体像を把握する（頻出・混同注意マーカーに注目）</li>
          <li><strong>単語帳</strong>で法律用語・条文番号を暗記する</li>
          <li><strong>模擬テスト</strong>で知識を確認し、間違えた問題を繰り返す</li>
          <li>苦手分野のノートに戻り復習。試験前は<strong>直前チェック</strong>で総確認</li>
        </ol>
        <p className="text-xs text-amber-600 mt-3">2級の合格基準：約70点以上（100点満点）</p>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/20 rounded-lg p-2.5">
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs text-indigo-200">{label}</div>
    </div>
  );
}

function ProgressRow({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
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
