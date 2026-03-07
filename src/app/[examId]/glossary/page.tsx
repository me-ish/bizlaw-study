"use client";
import { useState, useMemo } from "react";
import { flashcards } from "@/data/flashcards";
import { TOPIC_COLORS, TOPIC_LABELS, type Topic } from "@/data/questions";

export default function GlossaryPage() {
  const [query, setQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState<Topic | "all">("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return flashcards.filter((card) => {
      const matchesTopic = topicFilter === "all" || card.topic === topicFilter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        q === "" ||
        card.term.toLowerCase().includes(q) ||
        card.reading.toLowerCase().includes(q) ||
        card.definition.toLowerCase().includes(q);
      return matchesTopic && matchesQuery;
    });
  }, [query, topicFilter]);

  const topics = Object.keys(TOPIC_LABELS) as Topic[];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-700">用語集</h1>
        <p className="text-sm text-slate-500 mt-0.5">全{flashcards.length}用語。キーワード検索・分野フィルタが使えます。</p>
      </div>

      {/* Search & filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="用語・読み方・説明を検索..."
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTopicFilter("all")}
            className={`text-xs px-2.5 py-1 rounded-full font-medium border transition-all ${
              topicFilter === "all"
                ? "bg-slate-700 text-white border-slate-700"
                : "border-slate-200 text-slate-500 bg-white hover:bg-slate-50"
            }`}
          >
            すべて
          </button>
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => setTopicFilter(topic)}
              className={`text-xs px-2.5 py-1 rounded-full font-medium border transition-all ${
                topicFilter === topic
                  ? TOPIC_COLORS[topic]
                  : "border-slate-200 text-slate-500 bg-white hover:bg-slate-50"
              }`}
            >
              {TOPIC_LABELS[topic]}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-slate-400">
        {filtered.length}件の用語が見つかりました
        {query && <span>（「{query}」で検索中）</span>}
      </p>

      {/* Glossary list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p className="text-lg mb-1">用語が見つかりません</p>
          <p className="text-sm">検索条件を変えてみてください</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((card) => {
            const isExpanded = expandedId === card.id;
            return (
              <div
                key={card.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
              >
                <button
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : card.id)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${TOPIC_COLORS[card.topic]}`}>
                        {TOPIC_LABELS[card.topic]}
                      </span>
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-800 text-sm">{card.term}</span>
                        <span className="text-slate-400 text-xs ml-1.5">（{card.reading}）</span>
                      </div>
                    </div>
                    <span className="text-slate-400 shrink-0">{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-2 border-t border-slate-100">
                    <p className="text-sm text-slate-700 leading-relaxed pt-3">{card.definition}</p>
                    {card.example && (
                      <div className="bg-teal-50 border border-teal-100 rounded-lg px-3 py-2">
                        <p className="text-xs text-teal-600 font-medium mb-0.5">例</p>
                        <p className="text-xs text-teal-800 leading-relaxed">{card.example}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
