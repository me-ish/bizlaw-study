import Link from "next/link";
import { EXAM_LIST } from "@/data/exams";

export default function TopPage() {
  const available = EXAM_LIST.filter((e) => e.available);
  const coming = EXAM_LIST.filter((e) => !e.available);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-indigo-700 text-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center">
          <h1 className="font-bold text-base">資格合格道場</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-1">資格を選んで学習スタート</h2>
          <p className="text-sm text-slate-500">まとめノート・単語帳・模擬テストで合格を目指す</p>
        </div>

        {/* Available exams */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">学習できる資格</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {available.map((exam) => (
              <Link key={exam.id} href={`/${exam.id}`}>
                <div className="bg-white rounded-xl border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-md p-5 transition-all cursor-pointer">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-bold text-slate-800 text-sm leading-snug">{exam.name}</h4>
                    <span className="shrink-0 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                      学習可
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3">{exam.description}</p>
                  <div className="flex gap-3 text-xs text-slate-400">
                    <span>{exam.topicCount}分野</span>
                    <span>合格基準: {exam.passingScore}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Coming soon */}
        {coming.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">準備中の資格</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {coming.map((exam) => (
                <div key={exam.id} className="bg-white rounded-xl border border-slate-200 p-5 opacity-60">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-bold text-slate-700 text-sm leading-snug">{exam.name}</h4>
                    <span className="shrink-0 text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                      準備中
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">{exam.description}</p>
                  <div className="flex gap-3 text-xs text-slate-300">
                    <span>{exam.topicCount}分野</span>
                    <span>合格基準: {exam.passingScore}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-xs text-slate-400">
            本サイトはAIを活用して作成された非公式の学習支援サイトです。情報の正確性を保証するものではありません。
          </p>
        </div>
      </footer>
    </div>
  );
}
