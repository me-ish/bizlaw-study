"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { key: "", label: "ホーム" },
  { key: "schedule", label: "スケジュール" },
  { key: "notes", label: "まとめノート" },
  { key: "quiz", label: "模擬テスト" },
  { key: "flashcards", label: "単語帳" },
  { key: "quick", label: "一問一答" },
  { key: "glossary", label: "用語集" },
  { key: "review", label: "直前チェック" },
];

interface NavbarProps {
  examId: string;
  examName: string;
}

export default function Navbar({ examId, examName }: NavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = NAV_ITEMS.map((item) => ({
    href: item.key === "" ? `/${examId}` : `/${examId}/${item.key}`,
    label: item.label,
  }));

  return (
    <header className="bg-indigo-700 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link href="/" className="text-indigo-300 hover:text-white text-xs transition-colors whitespace-nowrap">
            ← 資格一覧
          </Link>
          <span className="text-indigo-500">|</span>
          <Link href={`/${examId}`} className="font-bold text-sm tracking-tight whitespace-nowrap">
            {examName}
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex gap-1 overflow-x-auto">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1 rounded text-sm font-medium whitespace-nowrap transition-colors ${
                pathname === l.href
                  ? "bg-white text-indigo-700"
                  : "hover:bg-indigo-600"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="メニュー"
        >
          <span className={`block h-0.5 w-5 bg-white transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-0.5 w-5 bg-white transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 bg-white transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-indigo-600 bg-indigo-700">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-2.5 text-sm font-medium border-b border-indigo-600 transition-colors ${
                pathname === l.href
                  ? "bg-white text-indigo-700"
                  : "hover:bg-indigo-600"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
