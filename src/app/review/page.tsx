"use client";
import { useState } from "react";
import { TOPIC_COLORS, TOPIC_LABELS, type Topic } from "@/data/questions";

interface ReviewItem {
  text: string;
  tag?: "頻出" | "暗記" | "混同注意";
}

interface ReviewSection {
  topic: Topic;
  items: ReviewItem[];
}

const reviewData: ReviewSection[] = [
  {
    topic: "civil",
    items: [
      { text: "錯誤（95条）：2020年改正で「無効→取消」に変更。重大な過失のある表意者は原則取消不可。", tag: "頻出" },
      { text: "詐欺取消：善意無過失の第三者に対抗不可。強迫取消：第三者にも対抗可（詐欺と逆！）。", tag: "混同注意" },
      { text: "消滅時効：知った時から5年 or 行使できる時から10年（早い方）。", tag: "暗記" },
      { text: "表見代理の3類型：①授与表示（109条）②権限外行為（110条）③代理権消滅後（112条）。", tag: "頻出" },
      { text: "危険負担：2020年改正で「特定物は債権者主義→廃止・債務者主義に統一」。", tag: "頻出" },
      { text: "連帯保証：催告・検索の抗弁権なし・分別の利益なし（普通保証との違い）。", tag: "混同注意" },
      { text: "留置権：占有継続が要件、優先弁済権はない。抵当権：占有移転不要、優先弁済権あり。", tag: "混同注意" },
      { text: "時効の完成猶予・更新：催告→6ヶ月猶予のみ（更新はしない）。確定判決→更新。", tag: "暗記" },
      { text: "相殺：自働債権の弁済期到来が必要。悪意の不法行為から生じた債務には相殺できない（509条）。", tag: "頻出" },
      { text: "解除の催告：相当期間を定めて催告→未履行で解除可。一定事由（履行不能等）は無催告解除可。", tag: "暗記" },
    ],
  },
  {
    topic: "corporate",
    items: [
      { text: "大会社の判断基準：資本金5億円以上「または」負債200億円以上（どちらか一方で大会社）。", tag: "暗記" },
      { text: "特別決議：「議決権過半数の株主出席」＋「出席者の2/3以上」の賛成。定款変更・合併等。", tag: "頻出" },
      { text: "取締役の第三者責任（429条）：任務懈怠に悪意または重過失が必要（軽過失では不法行為のみ）。", tag: "頻出" },
      { text: "競業取引の承認：取締役会設置会社→取締役会、非設置会社→株主総会。事後の報告義務もあり。", tag: "混同注意" },
      { text: "株主代表訴訟：6ヶ月保有（公開会社）。勝訴の損害賠償は会社に帰属（個人ではない）。", tag: "暗記" },
      { text: "略式合併：90%以上支配で株主総会決議省略可。簡易合併：取得資産が純資産の20%以下で省略可。", tag: "混同注意" },
      { text: "自己株式：議決権なし・配当なし。取得には分配可能額の制限あり（財源規制）。", tag: "暗記" },
      { text: "監査役：業務の「適法性」監査が中心（妥当性監査は原則なし）。取締役会で議決権なし。", tag: "頻出" },
    ],
  },
  {
    topic: "commercial",
    items: [
      { text: "クーリングオフ期間：訪問販売・電話勧誘＝8日、連鎖販売・業務提供誘引＝20日。通信販売は規定なし。", tag: "暗記" },
      { text: "クーリングオフの効果：損害賠償・違約金の請求不可。役務提供済分の対価請求不可。", tag: "頻出" },
      { text: "消費者契約法：BtoCのみ適用。BtoBには不適用（事業者間取引には適用されない）。", tag: "混同注意" },
      { text: "電子消費者契約法：確認画面なければ消費者の重大過失主張不可（操作ミスで錯誤取消可）。", tag: "頻出" },
      { text: "商人間売買の検査通知義務（526条）：受領後遅滞なく検査・直ちに通知。未通知→解除・損賠不可。", tag: "頻出" },
      { text: "抗弁の接続（割賦販売法）：商品の瑕疵をクレジット会社への支払い拒絶に使える。", tag: "暗記" },
      { text: "商業登記：登記前→善意の第三者に対抗不可。登記後→知らなくても対抗可（積極的公示力）。", tag: "暗記" },
    ],
  },
  {
    topic: "ip",
    items: [
      { text: "著作権は登録不要・自動発生（無方式主義）。特許・商標は登録が必要。", tag: "頻出" },
      { text: "著作権の保護期間：著作者の死後70年（2018年改正後）。映画は公表後70年。", tag: "暗記" },
      { text: "著作者人格権：公表権・氏名表示権・同一性保持権。譲渡不可・一身専属。", tag: "暗記" },
      { text: "職務著作：法人の指揮命令下で従業員が作成し法人名義で公表→法人が著作者。", tag: "頻出" },
      { text: "職務発明（特許）は原則「発明者（従業員）」に帰属。職務著作（著作権）は「法人」に帰属。逆！", tag: "混同注意" },
      { text: "特許の存続期間：出願日から20年（医薬品は最大5年延長）。商標は登録日から10年（更新可）。", tag: "暗記" },
      { text: "営業秘密の3要件：①秘密管理性②有用性③非公知性。全て必要。", tag: "頻出" },
      { text: "著名表示冒用：混同不要。周知表示混同惹起：混同が必要。著名＞周知の知名度。", tag: "混同注意" },
    ],
  },
  {
    topic: "labor",
    items: [
      { text: "解雇権濫用法理（労契法16条）：「客観的合理的な理由」＋「社会通念上相当」がなければ無効。", tag: "頻出" },
      { text: "整理解雇の4要素：①経営上の必要性②解雇回避努力③人選の合理性④手続の妥当性（総合判断）。", tag: "頻出" },
      { text: "解雇予告：原則30日前。または30日分の平均賃金（解雇予告手当）の支払いで代替可。", tag: "暗記" },
      { text: "解雇禁止：業務上傷病療養中＋30日間、産前産後休業中＋30日間は解雇禁止。", tag: "暗記" },
      { text: "割増賃金率：時間外25%（月60時間超は50%）、深夜25%、休日35%。重複する場合は加算。", tag: "暗記" },
      { text: "就業規則の不利益変更：原則個別同意が必要（9条）。合理性＋周知で例外的有効（10条）。", tag: "頻出" },
      { text: "無期転換ルール（18条）：通算5年超→無期転換申込権。使用者は拒絶不可。3年ではない。", tag: "混同注意" },
      { text: "労働審判：3回以内・地裁・労働審判官＋審判員2名。異議申立で訴訟に移行。", tag: "暗記" },
    ],
  },
  {
    topic: "economic",
    items: [
      { text: "独禁法3本柱：①私的独占（3条前段）②不当な取引制限（3条後段・カルテル）③不公正な取引方法（19条）。", tag: "暗記" },
      { text: "カルテルの制裁：民事無効＋排除措置命令＋課徴金（最大10%）＋刑事罰（5年以下懲役）。", tag: "頻出" },
      { text: "リニエンシー：調査前1位→全額免除、2位→50%、3位以降→30%。調査後は減額率下がる。", tag: "暗記" },
      { text: "優越的地位の濫用：2019年改正で課徴金対象になった点が重要。", tag: "頻出" },
      { text: "確約手続（2019年改正）：違反認定なしに自主是正計画で排除措置命令・課徴金を回避できる。", tag: "暗記" },
      { text: "カルテルvs私的独占：カルテル＝複数事業者の合意、私的独占＝排除・支配行為（単独も可）。", tag: "混同注意" },
    ],
  },
  {
    topic: "international",
    items: [
      { text: "当事者自治の原則（通則法7条）：契約当事者は合意で準拠法を自由に選択可。明示・黙示いずれも可。", tag: "頻出" },
      { text: "選択なき場合（通則法8条）：最密接関係地法。特徴的給付の債務者の常居所地法と推定。", tag: "暗記" },
      { text: "CISGの適用：異なる締約国に営業所を持つ当事者間の商業的物品売買。消費者売買は除外。", tag: "頻出" },
      { text: "CISGの適用排除：当事者が合意で排除可能（6条）。実務では排除条項を明記することが多い。", tag: "暗記" },
      { text: "仲裁の特徴：①非公開②終局性（控訴なし）③専門家③拘束力あり。調停とは異なる（調停は拘束力なし）。", tag: "混同注意" },
      { text: "ニューヨーク条約：外国仲裁判断の承認・執行を締約国に義務付け。国際仲裁の実効性の基盤。", tag: "暗記" },
      { text: "FOB：本船積込時に危険・費用移転。CIF：本船積込時に危険移転、でも売主が運賃・保険料を負担。", tag: "混同注意" },
    ],
  },
];

const tagStyles: Record<string, string> = {
  頻出: "bg-rose-100 text-rose-700 border border-rose-200",
  暗記: "bg-blue-100 text-blue-700 border border-blue-200",
  混同注意: "bg-amber-100 text-amber-700 border border-amber-200",
};

export default function ReviewPage() {
  const [activeTopics, setActiveTopics] = useState<Set<Topic>>(new Set());
  const [tagFilter, setTagFilter] = useState<"all" | "頻出" | "暗記" | "混同注意">("all");

  const toggleTopic = (topic: Topic) => {
    setActiveTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) next.delete(topic);
      else next.add(topic);
      return next;
    });
  };

  const filteredData = reviewData.filter(
    (s) => activeTopics.size === 0 || activeTopics.has(s.topic)
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-500 to-orange-500 rounded-2xl p-5 text-white">
        <h1 className="text-xl font-bold mb-1">直前チェック</h1>
        <p className="text-rose-100 text-sm">
          試験直前に確認すべき重要ポイントを凝縮。全{reviewData.reduce((s, r) => s + r.items.length, 0)}項目。
        </p>
      </div>

      {/* Filter controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div>
          <p className="text-xs text-slate-500 mb-2 font-medium">分野フィルタ</p>
          <div className="flex flex-wrap gap-2">
            {reviewData.map((s) => (
              <button
                key={s.topic}
                onClick={() => toggleTopic(s.topic)}
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all border ${
                  activeTopics.has(s.topic)
                    ? TOPIC_COLORS[s.topic]
                    : "border-slate-200 text-slate-500 bg-white hover:bg-slate-50"
                }`}
              >
                {TOPIC_LABELS[s.topic]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-2 font-medium">タグフィルタ</p>
          <div className="flex gap-2">
            {(["all", "頻出", "暗記", "混同注意"] as const).map((tag) => (
              <button
                key={tag}
                onClick={() => setTagFilter(tag)}
                className={`text-xs px-2.5 py-1 rounded-full font-medium border transition-all ${
                  tagFilter === tag
                    ? tag === "all"
                      ? "bg-slate-700 text-white border-slate-700"
                      : tagStyles[tag]
                    : "border-slate-200 text-slate-500 bg-white hover:bg-slate-50"
                }`}
              >
                {tag === "all" ? "すべて" : tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {filteredData.map((section) => {
          const filtered = section.items.filter(
            (item) => tagFilter === "all" || item.tag === tagFilter
          );
          if (filtered.length === 0) return null;
          return (
            <div key={section.topic} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className={`px-4 py-2.5 border-b border-slate-100 ${TOPIC_COLORS[section.topic]}`}>
                <span className="font-bold text-sm">{TOPIC_LABELS[section.topic]}</span>
                <span className="ml-2 text-xs opacity-70">{filtered.length}項目</span>
              </div>
              <div className="divide-y divide-slate-50">
                {filtered.map((item, i) => (
                  <div key={i} className="flex gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                    {item.tag && (
                      <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium h-fit mt-0.5 ${tagStyles[item.tag]}`}>
                        {item.tag}
                      </span>
                    )}
                    <p className="text-sm text-slate-700 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer tip */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800">
          <strong>試験直前のポイント：</strong>
          「混同注意」項目は選択肢の引っかけとして頻出です。対比して覚えるとミスが減ります。
        </p>
      </div>
    </div>
  );
}
