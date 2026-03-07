import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "資格合格道場",
  description: "ビジネス法務・FP・簿記などの資格試験対策学習サイト",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-slate-50 text-slate-800">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
