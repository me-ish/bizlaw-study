"use client";
import { useState } from "react";
import { notes } from "@/data/notes";
import { TOPIC_COLORS, TOPIC_LABELS } from "@/data/questions";

export default function NotesPage() {
  const [activeId, setActiveId] = useState<number>(1);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const current = notes.find((n) => n.id === activeId) ?? notes[0];

  function toggleSection(key: string) {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function expandAll() {
    const all: Record<string, boolean> = {};
    current.sections.forEach((_, i) => {
      all[`${current.id}-${i}`] = true;
    });
    setOpenSections((prev) => ({ ...prev, ...all }));
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
      <h1 className="text-xl font-bold text-slate-700">まとめノート</h1>

      {/* Topic tabs */}
      <div className="flex flex-wrap gap-2">
        {notes.map((n) => (
          <button
            key={n.id}
            onClick={() => setActiveId(n.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeId === n.id
                ? "bg-teal-600 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-700"
            }`}
          >
            {TOPIC_LABELS[n.topic]}
          </button>
        ))}
      </div>

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
                <div className="px-5 pb-4 space-y-2">
                  {sec.points.map((pt, j) => (
                    <PointItem key={j} text={pt} />
                  ))}
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
  // Bold text inside 【 】 brackets
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
