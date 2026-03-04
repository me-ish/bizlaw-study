"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "ホーム" },
  { href: "/quiz", label: "模擬テスト" },
  { href: "/flashcards", label: "単語帳" },
  { href: "/notes", label: "まとめノート" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="bg-indigo-700 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-6 h-14">
        <span className="font-bold text-lg tracking-tight whitespace-nowrap">
          ビジ法2級 合格道場
        </span>
        <nav className="flex gap-1 overflow-x-auto">
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
      </div>
    </header>
  );
}
