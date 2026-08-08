import type { ProjectTemplate } from "../types";

/**
 * 5 long-term financial-discipline journeys. Maps to category: "work"
 * (Category has no separate "financial" value). Deliberately scoped to
 * general financial habits and literacy (budgeting awareness, saving
 * consistency, debt-reduction discipline) rather than specific investment
 * recommendations, target percentages, or return promises — this is
 * habit-building content, not financial advice.
 */
export const financialProjects: ProjectTemplate[] = [
  {
    id: "project_emergency_fund_habit",
    title_ar: "مشروع بناء صندوق الطوارئ",
    title_en: "Building an Emergency Fund Project",
    // Safety: مبالغ الادخار ونسبته تُترك بالكامل لتقدير المستخدم حسب دخله وظروفه
    description_ar: "رحلة 45 يومًا لترسيخ عادة الادخار المنتظم لصندوق طوارئ، بمبلغ يحدده المستخدم حسب دخله",
    description_en: "A 45-day journey establishing a regular saving habit for an emergency fund, with an amount the user determines based on their own income",
    category: "work",
    difficulty: "beginner",
    minLevel: 1,
    durationDays: 45,
    dailyCommitmentMinutes: 10,
    milestones: [
      { day: 10, title_ar: "أول عشرة أيام من الادخار المنتظم", title_en: "The first ten days of regular saving", reward: { xp: 30, badge: "بداية الادخار" } },
      { day: 22, title_ar: "نصف الرحلة مع عادة ادخار متجذرة", title_en: "Halfway through with a rooted saving habit", reward: { xp: 40, badge: "عادة متجذرة" } },
      { day: 35, title_ar: "صندوق الطوارئ ينمو بثبات ملحوظ", title_en: "The emergency fund growing with noticeable steadiness", reward: { xp: 45, badge: "نمو ثابت" } },
      { day: 45, title_ar: "خمسة وأربعون يومًا من الادخار المنتظم", title_en: "Forty-five days of regular saving", reward: { xp: 55, badge: "صاحب صندوق طوارئ" } },
    ],
    finalReward: { xp: 145, badge: "🏅 صاحب صندوق الطوارئ", title_ar: "المدَّخِر" },
    icon: "💰",
    successStories: [
      "من ادّخر مبلغًا بسيطًا بانتظام، فوجئ بحجم ما تراكم خلال أسابيع قليلة",
      "الانتظام في الادخار كان أهم من حجم المبلغ نفسه في بناء العادة",
    ],
  },
  {
    id: "project_mindful_monthly_budget",
    title_ar: "مشروع الميزانية الشهرية الواعية",
    title_en: "Mindful Monthly Budget Project",
    description_ar: "رحلة 45 يومًا لبناء وعي كامل بمصاريف شهرك وتصنيفها بوضوح دون تقييد صارم",
    description_en: "A 45-day journey building full awareness of your monthly expenses and clearly categorizing them without strict restriction",
    category: "work",
    difficulty: "beginner",
    minLevel: 1,
    durationDays: 45,
    dailyCommitmentMinutes: 10,
    milestones: [
      { day: 10, title_ar: "تسجيل المصاريف اليومية أصبح عادة", title_en: "Daily expense tracking has become a habit", reward: { xp: 30, badge: "تتبع واعٍ" } },
      { day: 22, title_ar: "نصف الرحلة مع صورة واضحة لأنماط الإنفاق", title_en: "Halfway through with a clear picture of spending patterns", reward: { xp: 40, badge: "وضوح مالي" } },
      { day: 35, title_ar: "أول تعديل واعٍ على نمط الإنفاق", title_en: "The first mindful adjustment to spending patterns", reward: { xp: 45, badge: "تعديل واعٍ" } },
      { day: 45, title_ar: "خمسة وأربعون يومًا من الوعي المالي المستمر", title_en: "Forty-five days of continuous financial awareness", reward: { xp: 55, badge: "واعٍ ماليًا" } },
    ],
    finalReward: { xp: 145, badge: "🏅 صاحب الوعي المالي الشهري", title_ar: "الواعي" },
    icon: "📊",
    successStories: [
      "من تتبع مصاريفه بصدق دون حكم على نفسه، اكتشف أنماطًا لم يكن يعرف بوجودها",
      "الوعي وحده، قبل أي تقييد، غيّر قراراته المالية اليومية بشكل ملحوظ",
    ],
  },
  {
    id: "project_debt_reduction_discipline",
    title_ar: "مشروع الانضباط في تقليل الديون",
    title_en: "Debt Reduction Discipline Project",
    // Safety: خطة السداد التفصيلية تُترك للمستخدم أو لاستشارة مالية مختصة عند الحاجة
    description_ar: "رحلة 90 يومًا لبناء انضباط منتظم في تقليل الديون، بخطة يضعها المستخدم حسب وضعه الخاص",
    description_en: "A 90-day journey building regular discipline in reducing debt, with a plan the user sets based on their own situation",
    category: "work",
    difficulty: "intermediate",
    minLevel: 15,
    durationDays: 90,
    dailyCommitmentMinutes: 10,
    milestones: [
      { day: 20, title_ar: "خطة سداد واضحة تم وضعها", title_en: "A clear repayment plan established", reward: { xp: 40, badge: "خطة واضحة" } },
      { day: 45, title_ar: "نصف الرحلة مع التزام ثابت بالخطة", title_en: "Halfway through with steady commitment to the plan", reward: { xp: 55, badge: "التزام ثابت" } },
      { day: 70, title_ar: "تقدم ملموس في تقليل الدين", title_en: "Tangible progress in reducing debt", reward: { xp: 60, badge: "تقدم ملموس" } },
      { day: 90, title_ar: "تسعون يومًا من الانضباط المالي المستمر", title_en: "Ninety days of continuous financial discipline", reward: { xp: 75, badge: "منضبط ماليًا" } },
    ],
    finalReward: { xp: 210, badge: "🏅 صاحب الانضباط في تقليل الديون", title_ar: "المتحرر" },
    icon: "⛓️‍💥",
    successStories: [
      "من التزم بخطة سداد واقعية بدل محاولة التخلص من كل الدين دفعة واحدة، استمر ولم يستسلم",
      "الانتظام في السداد الشهري منحه شعورًا بالتقدم كان يفتقده في محاولات سابقة متذبذبة",
    ],
  },
  {
    id: "project_financial_literacy",
    title_ar: "مشروع الثقافة المالية",
    title_en: "Financial Literacy Project",
    description_ar: "رحلة 60 يومًا لبناء فهم أساسي وحقيقي لإدارة المال، الادخار، والتخطيط المالي طويل الأمد",
    description_en: "A 60-day journey building a genuine foundational understanding of money management, saving, and long-term financial planning",
    category: "work",
    difficulty: "intermediate",
    minLevel: 15,
    durationDays: 60,
    dailyCommitmentMinutes: 20,
    milestones: [
      { day: 15, title_ar: "المفاهيم المالية الأساسية تم فهمها", title_en: "Basic financial concepts understood", reward: { xp: 40, badge: "أساس معرفي" } },
      { day: 30, title_ar: "نصف الرحلة مع تطبيق عملي لما تم تعلمه", title_en: "Halfway through, applying what's been learned", reward: { xp: 50, badge: "تطبيق عملي" } },
      { day: 45, title_ar: "قرارات مالية أكثر وعيًا في الحياة اليومية", title_en: "More conscious financial decisions in daily life", reward: { xp: 55, badge: "قرارات واعية" } },
      { day: 60, title_ar: "ستون يومًا من بناء الثقافة المالية", title_en: "Sixty days building financial literacy", reward: { xp: 70, badge: "مثقف ماليًا" } },
    ],
    finalReward: { xp: 195, badge: "🏅 صاحب الثقافة المالية الراسخة", title_ar: "المثقف ماليًا" },
    icon: "📘",
    successStories: [
      "من تعلم المفاهيم الأساسية أولاً، اتخذ قرارات أكثر ثقة بدل الاعتماد على نصائح متضاربة",
      "الفهم البسيط لكيفية عمل المال غيّر علاقته الكاملة بقراراته اليومية الصغيرة",
    ],
  },
  {
    id: "project_long_term_financial_independence_habits",
    title_ar: "مشروع عادات الاستقلال المالي طويل الأمد",
    title_en: "Long-Term Financial Independence Habits Project",
    // Safety: هذا مشروع بناء عادات مالية عامة، وليس نصيحة استثمارية أو توصية بمنتج مالي معين
    description_ar: "رحلة 90 يومًا لترسيخ عادات مالية شاملة تدعم استقلالًا ماليًا طويل الأمد، دون توصية باستثمار معين",
    description_en: "A 90-day journey establishing comprehensive financial habits supporting long-term independence, without recommending any specific investment",
    category: "work",
    difficulty: "expert",
    minLevel: 60,
    durationDays: 90,
    dailyCommitmentMinutes: 25,
    milestones: [
      { day: 20, title_ar: "الأسس المالية الشاملة تم إرساؤها", title_en: "Comprehensive financial foundations established", reward: { xp: 55, badge: "أساس شامل" } },
      { day: 45, title_ar: "نصف الرحلة مع نظام مالي شخصي متكامل", title_en: "Halfway through, with an integrated personal financial system", reward: { xp: 70, badge: "نظام متكامل" } },
      { day: 70, title_ar: "عادات مالية طويلة الأمد أصبحت راسخة", title_en: "Long-term financial habits now firmly rooted", reward: { xp: 80, badge: "عادات راسخة" } },
      { day: 90, title_ar: "تسعون يومًا من بناء الاستقلال المالي التدريجي", title_en: "Ninety days of gradual progress toward financial independence", reward: { xp: 95, badge: "على طريق الاستقلال" } },
    ],
    finalReward: { xp: 255, badge: "🏅 صاحب رحلة الاستقلال المالي", title_ar: "المستقل ماليًا" },
    icon: "🏛️",
    successStories: [
      "من بنى نظامًا ماليًا شاملاً بدل التركيز على قرار واحد كبير، شعر بتحكم حقيقي في مستقبله",
      "الصبر على العادات الصغيرة المتراكمة كان أجدى من انتظار حل مالي سريع لم يأتِ أبدًا",
    ],
  },
];
