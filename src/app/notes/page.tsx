"use client";
import { useState, useEffect } from "react";
import { notes } from "@/data/notes";
import { TOPIC_COLORS, TOPIC_LABELS } from "@/data/questions";
import { getNotesProgress, saveNotesProgress } from "@/lib/progress";

export default function NotesPage() {
  const [activeId, setActiveId] = useState<number>(1);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [readTopics, setReadTopics] = useState<Set<string>>(new Set());

  const current = notes.find((n) => n.id === activeId) ?? notes[0];

  useEffect(() => {
    const np = getNotesProgress();
    setReadTopics(new Set(np.readTopics));
  }, []);

  function markAsRead(topic: string) {
    setReadTopics((prev) => {
      const next = new Set(prev);
      next.add(topic);
      saveNotesProgress({ readTopics: Array.from(next) });
      return next;
    });
  }

  function toggleSection(key: string) {
    setOpenSections((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      // 全セクションが開いていたら既読扱い
      const allOpen = current.sections.every((_, i) => next[`${current.id}-${i}`] !== false);
      if (allOpen) markAsRead(current.topic);
      return next;
    });
  }

  function expandAll() {
    const all: Record<string, boolean> = {};
    current.sections.forEach((_, i) => {
      all[`${current.id}-${i}`] = true;
    });
    setOpenSections((prev) => ({ ...prev, ...all }));
    // 全展開したら既読扱い
    markAsRead(current.topic);
  }

  function collapseAll() {
    const all: Record<string, boolean> = {};
    current.sections.forEach((_, i) => {
      all[`${current.id}-${i}`] = false;
    });
    setOpenSections((prev) => ({ ...prev, ...all }));
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-700">まとめノート</h1>
        <div className="flex gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-rose-400" />頻出
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />混同注意
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-400" />暗記
          </span>
        </div>
      </div>

      {/* Topic tabs */}
      <div className="flex flex-wrap gap-2">
        {notes.map((n) => {
          const isRead = readTopics.has(n.topic);
          return (
            <button
              key={n.id}
              onClick={() => setActiveId(n.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeId === n.id
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-700"
              }`}
            >
              {TOPIC_LABELS[n.topic]}
              {isRead && (
                <span className={`text-xs ${activeId === n.id ? "text-teal-200" : "text-teal-500"}`}>✓</span>
              )}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-slate-400">
        {readTopics.size}/{notes.length} 分野 既読
        {readTopics.size > 0 && (
          <button
            className="ml-2 text-slate-300 hover:text-rose-400 transition-colors"
            onClick={() => {
              setReadTopics(new Set());
              saveNotesProgress({ readTopics: [] });
            }}
          >
            リセット
          </button>
        )}
      </p>

      {/* Note header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TOPIC_COLORS[current.topic]}`}>
              {TOPIC_LABELS[current.topic]}
            </span>
            <h2 className="text-lg font-bold text-slate-800 mt-1">{current.title}</h2>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={expandAll} className="text-xs text-teal-600 hover:underline">
              全展開
            </button>
            <span className="text-slate-300">|</span>
            <button onClick={collapseAll} className="text-xs text-slate-400 hover:underline">
              全閉じ
            </button>
          </div>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed">{current.overview}</p>
      </div>

      {/* Sections */}
      <div className="space-y-2">
        {current.sections.map((sec, i) => {
          const key = `${current.id}-${i}`;
          const isOpen = openSections[key] ?? true;
          return (
            <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors"
                onClick={() => toggleSection(key)}
              >
                <span className="font-semibold text-slate-700 text-sm">{sec.title}</span>
                <span className="text-slate-400 text-lg">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && (
                <div className="px-5 pb-4 space-y-1.5">
                  {sec.points.map((pt, j) => (
                    <PointItem key={j} text={pt} />
                  ))}
                  {sec.examTips && sec.examTips.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {sec.examTips.map((tip, k) => (
                        <ExamTip key={k} text={tip} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Key articles */}
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-5">
        <h3 className="font-bold text-teal-800 mb-3 text-sm">重要条文・根拠</h3>
        <div className="flex flex-wrap gap-2">
          {current.keyArticles.map((a, i) => (
            <span
              key={i}
              className="bg-white border border-teal-200 text-teal-700 text-xs px-3 py-1 rounded-full font-medium"
            >
              {a}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function PointItem({ text }: { text: string }) {
  const parts = text.split(/(【[^】]*】)/g);
  return (
    <div className="flex gap-2 text-sm text-slate-700 leading-relaxed">
      <span className="text-teal-400 mt-0.5 shrink-0">▸</span>
      <p>
        {parts.map((part, i) =>
          part.startsWith("【") ? (
            <strong key={i} className="text-teal-700 font-semibold">{part}</strong>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </p>
    </div>
  );
}

function ExamTip({ text }: { text: string }) {
  const isFrequent = text.includes("【頻出】");
  const isConfuse = text.includes("【混同注意】");
  const isMemorize = text.includes("【暗記】");

  let bgColor = "bg-slate-50 border-slate-200";
  let dotColor = "bg-slate-400";
  let label = "";

  if (isFrequent) {
    bgColor = "bg-rose-50 border-rose-200";
    dotColor = "bg-rose-400";
    label = "頻出";
  } else if (isConfuse) {
    bgColor = "bg-amber-50 border-amber-200";
    dotColor = "bg-amber-400";
    label = "混同注意";
  } else if (isMemorize) {
    bgColor = "bg-blue-50 border-blue-200";
    dotColor = "bg-blue-400";
    label = "暗記";
  }

  const cleanText = text
    .replace("【頻出】", "")
    .replace("【混同注意】", "")
    .replace("【暗記】", "");

  return (
    <div className={`flex gap-2 text-xs rounded-lg border px-3 py-2 ${bgColor}`}>
      <span className={`mt-0.5 shrink-0 w-2 h-2 rounded-full ${dotColor} inline-block`} />
      <div>
        {label && (
          <span className="font-bold mr-1 text-slate-600">[{label}]</span>
        )}
        <span className="text-slate-700">{cleanText}</span>
      </div>
    </div>
  );
}
