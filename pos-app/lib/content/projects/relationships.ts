import type { ProjectTemplate } from "../types";

/**
 * 2 long-term relationship journeys, category: "social". Phrasing avoids
 * assuming a specific family structure (marital status, children, living
 * parents) — consistent with habits/social.ts and routines conventions.
 */
export const relationshipsProjects: ProjectTemplate[] = [
  {
    id: "project_deepening_parents_relationship",
    title_ar: "مشروع تعميق العلاقة مع الوالدين",
    title_en: "Deepening the Relationship with Parents Project",
    description_ar: "رحلة 60 يومًا للانتقال من التواصل الروتيني مع الوالدين إلى علاقة أعمق وأكثر صدقًا، إن كانا على قيد الحياة",
    description_en: "A 60-day journey moving from routine contact with parents to a deeper, more genuine relationship, when they are living",
    category: "social",
    difficulty: "intermediate",
    minLevel: 15,
    durationDays: 60,
    dailyCommitmentMinutes: 15,
    milestones: [
      { day: 15, title_ar: "أول محادثة عميقة تتجاوز الأسئلة الروتينية", title_en: "The first deep conversation going beyond routine questions", reward: { xp: 40, badge: "بداية العمق" } },
      { day: 30, title_ar: "نصف الرحلة مع تواصل أكثر صدقًا وانتظامًا", title_en: "Halfway through, with more honest and regular contact", reward: { xp: 50, badge: "تواصل صادق" } },
      { day: 45, title_ar: "فهم أعمق لتجارب الوالدين وقصصهما", title_en: "A deeper understanding of parents' experiences and stories", reward: { xp: 55, badge: "فهم متجذر" } },
      { day: 60, title_ar: "ستون يومًا من العلاقة العميقة المتجددة", title_en: "Sixty days of a renewed, deeper relationship", reward: { xp: 70, badge: "علاقة متجذرة" } },
    ],
    finalReward: { xp: 195, badge: "🏅 صاحب العلاقة العميقة مع الوالدين", title_ar: "البارّ" },
    icon: "💛",
    successStories: [
      "من سأل والديه عن قصص لم يسألهما عنها من قبل، اكتشف جوانب منهما لم يكن يعرفها",
      "التواصل العميق المنتظم غيّر طبيعة العلاقة من واجب إلى رغبة حقيقية",
    ],
  },
  {
    id: "project_supportive_social_circle",
    title_ar: "مشروع بناء دائرة اجتماعية داعمة",
    title_en: "Building a Supportive Social Circle Project",
    description_ar: "رحلة 90 يومًا لبناء وتعميق دائرة علاقات صادقة وداعمة، بعيدًا عن العلاقات السطحية الكثيرة",
    description_en: "A 90-day journey building and deepening a circle of genuine, supportive relationships, away from many shallow connections",
    category: "social",
    difficulty: "advanced",
    minLevel: 35,
    durationDays: 90,
    dailyCommitmentMinutes: 20,
    milestones: [
      { day: 20, title_ar: "الدائرة الاجتماعية الحالية تم تقييمها بصدق", title_en: "The current social circle honestly evaluated", reward: { xp: 50, badge: "تقييم صادق" } },
      { day: 45, title_ar: "نصف الرحلة مع علاقات أعمق قيد البناء", title_en: "Halfway through, with deeper relationships being built", reward: { xp: 60, badge: "بناء متصاعد" } },
      { day: 70, title_ar: "دعم متبادل حقيقي أصبح ملموسًا في الدائرة", title_en: "Genuine mutual support now tangible within the circle", reward: { xp: 65, badge: "دعم متبادل" } },
      { day: 90, title_ar: "تسعون يومًا من بناء دائرة اجتماعية داعمة وصادقة", title_en: "Ninety days building a supportive, genuine social circle", reward: { xp: 85, badge: "دائرة راسخة" } },
    ],
    finalReward: { xp: 235, badge: "🏅 صاحب الدائرة الاجتماعية الداعمة", title_ar: "المتصل" },
    icon: "🕸️",
    successStories: [
      "من ركّز على تعميق علاقات قليلة بدل توسيع عدد كبير سطحي، وجد دعمًا حقيقيًا وقت الحاجة",
      "الاستثمار الواعي في علاقات مختارة بعناية أثمر ثقة لم تمنحها معارف كثيرة عابرة",
    ],
  },
];
