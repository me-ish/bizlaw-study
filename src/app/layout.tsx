import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "ビジ法2級 合格道場",
  description: "ビジネス実務法務検定2級 合格のための学習サイト",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-slate-50 text-slate-800">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <footer className="border-t border-slate-200 bg-white mt-12">
          <div className="max-w-5xl mx-auto px-4 py-6 space-y-3">
            <p className="text-xs text-slate-500 leading-relaxed">
              本サイトは、ビジネス実務法務検定2級の学習を支援することを目的とした非公式の学習サイトです。
              掲載内容はAIを活用して作成されており、情報の正確性・完全性を保証するものではありません。
              法改正等により実際の法令と異なる場合があります。
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              本サイトの内容は学習・情報提供を目的としたものであり、法律的助言・法律事務に該当するものではありません。
              本サイトの利用および試験結果については、利用者自身の責任においてご判断ください。
            </p>
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} ビジ法2級 合格道場 — 当サイトは東京商工会議所とは無関係の非公式サイトです。
            </p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
