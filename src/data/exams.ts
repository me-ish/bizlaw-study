export interface ExamMeta {
  id: string;
  name: string;
  shortName: string;
  description: string;
  available: boolean;
  passingScore: string;
  topicCount: number;
}

export const EXAM_LIST: ExamMeta[] = [
  {
    id: "bizlaw",
    name: "ビジネス実務法務検定2級",
    shortName: "ビジ法2級",
    description: "民法・会社法・商取引法など7分野のビジネス法務知識を問う実務検定",
    available: true,
    passingScore: "70点以上",
    topicCount: 7,
  },
  {
    id: "fp",
    name: "ファイナンシャルプランナー3級",
    shortName: "FP3級",
    description: "ライフプランニング・税務・不動産・相続など6分野の生活に密着した金融知識",
    available: false,
    passingScore: "60%以上",
    topicCount: 6,
  },
  {
    id: "bookkeeping",
    name: "日商簿記3級",
    shortName: "簿記3級",
    description: "商業簿記の基礎。仕訳・帳簿・財務諸表の作成を体系的に学ぶ",
    available: false,
    passingScore: "70点以上",
    topicCount: 5,
  },
  {
    id: "itpassport",
    name: "ITパスポート",
    shortName: "ITパス",
    description: "IT・経営・技術の3分野から出題。社会人・学生の基礎ITリテラシー検定",
    available: false,
    passingScore: "600点以上",
    topicCount: 3,
  },
];

export function getExamMeta(examId: string): ExamMeta | undefined {
  return EXAM_LIST.find((e) => e.id === examId);
}
