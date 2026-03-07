import { notFound } from "next/navigation";
import { EXAM_LIST } from "@/data/exams";
import Navbar from "@/components/Navbar";

export default async function ExamLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ examId: string }>;
}) {
  const { examId } = await params;
  const exam = EXAM_LIST.find((e) => e.id === examId);
  if (!exam) notFound();

  return (
    <>
      <Navbar examId={examId} examName={exam.shortName} />
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-3">
          <p className="text-xs text-slate-500 leading-relaxed">
            本サイトは学習を支援することを目的とした非公式の学習サイトです。
            掲載内容はAIを活用して作成されており、情報の正確性・完全性を保証するものではありません。
          </p>
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} 資格合格道場 — 当サイトは各試験実施機関とは無関係の非公式サイトです。
          </p>
        </div>
      </footer>
    </>
  );
}
