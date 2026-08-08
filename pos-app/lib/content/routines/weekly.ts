import type { RoutineTemplate } from "../types";

/**
 * 10 weekly routines across 4 difficulty tiers. These are longer, once-a-
 * week sessions (review, maintenance, deeper connection) rather than daily
 * blocks — so `time` fields use a suggested day+time string instead of a
 * strict daily clock time, and durations run longer (20-150 min) since
 * they're not repeated every day.
 *
 * Same conventions as morning.ts/evening.ts: warmup/completion framing as
 * comments (RoutineTemplate has no such fields yet), every linkedHabitId
 * verified against the real habits/*.ts files, cultural sensitivity in
 * family-related steps ("إن أمكن" rather than assuming a household shape).
 *
 * Tier breakdown (3/3/2/2 across beginner/intermediate/advanced/expert)
 * follows the same ratio used in morning.ts/evening.ts, scaled to 10 items.
 */
export const weeklyRoutines: RoutineTemplate[] = [
  // ===== Beginner (minLevel 1, 20-40 min) =====

  // warmup: "أسبوع بلا مراجعة، أسبوع يمر دون أن تتعلم منه"
  // completion: "نظرت لأسبوعك بوضوح — استعداد حقيقي للقادم"
  {
    id: "routine_simple_weekly_review",
    title_ar: "المراجعة الأسبوعية البسيطة",
    title_en: "The Simple Weekly Review",
    description_ar: "وقفة أسبوعية قصيرة لمراجعة الأهداف وتعديل الخطة عند الحاجة",
    description_en: "A short weekly pause to review goals and adjust the plan as needed",
    category: "work",
    difficulty: "beginner",
    minLevel: 1,
    totalMinutes: 30,
    steps: [
      { time: "الجمعة 20:00", durationMinutes: 30, action_ar: "مراجعة أسبوعية للأهداف", action_en: "Weekly goals review", linkedHabitId: "work_weekly_goals_review" },
    ],
    bestFor: ["يبدأ للتو مع المراجعات الأسبوعية", "يفضّل البساطة"],
    icon: "🗓️",
    xpReward: 28,
  },

  // warmup: "مساحة مرتبة أسبوعيًا، ذهن أقل فوضى يوميًا"
  // completion: "أنهيت الأسبوع بمساحة أخف — بداية نظيفة للقادم"
  {
    id: "routine_light_weekly_cleanup",
    title_ar: "الترتيب الأسبوعي الخفيف",
    title_en: "The Light Weekly Tidy-Up",
    description_ar: "جلسة أسبوعية قصيرة لتصفير صندوق الوارد وترتيب المهام المتراكمة",
    description_en: "A short weekly session to clear the inbox and tidy up accumulated tasks",
    category: "work",
    difficulty: "beginner",
    minLevel: 1,
    totalMinutes: 30,
    steps: [
      { time: "السبت 10:00", durationMinutes: 30, action_ar: "تصفير صندوق الوارد أسبوعيًا", action_en: "Weekly inbox zero", linkedHabitId: "work_weekly_inbox_zero" },
    ],
    bestFor: ["يتراكم عنده البريد والمهام", "يحب بداية أسبوع نظيفة"],
    icon: "📭",
    xpReward: 26,
  },

  // warmup: "أسبوع بلا تواصل حقيقي، أسبوع أفقر مما يبدو"
  // completion: "أعدت الاتصال بمن يهمك أمرهم — أسبوع أدفأ بقليل"
  {
    id: "routine_weekly_connection",
    title_ar: "التواصل الأسبوعي",
    title_en: "The Weekly Connection Routine",
    description_ar: "وقت أسبوعي مخصص للتواصل مع الأهل والأصدقاء، إن كان ذلك متاحًا",
    description_en: "Dedicated weekly time to connect with family and friends, when possible",
    category: "social",
    difficulty: "beginner",
    minLevel: 1,
    totalMinutes: 25,
    steps: [
      { time: "الخميس 19:00", durationMinutes: 15, action_ar: "الاتصال بالأهل أسبوعيًا (إن أمكن)", action_en: "Weekly family call, when possible", linkedHabitId: "spiritual_weekly_family_call" },
      { time: "الخميس 19:15", durationMinutes: 10, action_ar: "التواصل مع جار", action_en: "Neighbor check-in", linkedHabitId: "social_weekly_neighbor_check" },
    ],
    bestFor: ["يريد الحفاظ على علاقاته دون جهد كبير", "منشغل خلال الأسبوع"],
    icon: "📞",
    xpReward: 24,
  },

  // ===== Intermediate (minLevel 15, 40-70 min) =====

  // warmup: "المراجعة الشاملة تكشف نمطًا لا تراه في يوم واحد"
  // completion: "رأيت أسبوعك كاملًا — أهدافك، عاداتك، ونعمك"
  {
    id: "routine_comprehensive_weekly_review",
    title_ar: "المراجعة الأسبوعية الشاملة",
    title_en: "The Comprehensive Weekly Review",
    description_ar: "مراجعة أعمق تجمع الأهداف والامتنان والتخطيط في جلسة أسبوعية واحدة",
    description_en: "A deeper review combining goals, gratitude, and planning in one weekly session",
    category: "work",
    difficulty: "intermediate",
    minLevel: 15,
    totalMinutes: 55,
    steps: [
      { time: "الجمعة 21:00", durationMinutes: 30, action_ar: "مراجعة أسبوعية للأهداف", action_en: "Weekly goals review", linkedHabitId: "work_weekly_goals_review" },
      { time: "الجمعة 21:30", durationMinutes: 15, action_ar: "متابعة أسبوعية للطاقة والمزاج", action_en: "Weekly energy and mood tracking", linkedHabitId: "health_weekly_mood_journal" },
      { time: "الجمعة 21:45", durationMinutes: 10, action_ar: "تصفير صندوق الوارد", action_en: "Inbox zero", linkedHabitId: "work_weekly_inbox_zero" },
    ],
    bestFor: ["يريد فهمًا أعمق لنمط أسبوعه", "ملتزم بمراجعة منتظمة"],
    icon: "📊",
    xpReward: 44,
  },

  // warmup: "التحضير المسبق يجعل الأسبوع كله أسهل"
  // completion: "أسبوعك القادم جاهز من ناحية الطعام — قرار أقل يوميًا"
  {
    id: "routine_weekly_meal_and_home",
    title_ar: "روتين تحضير الأسبوع",
    title_en: "The Weekly Preparation Routine",
    description_ar: "جلسة أسبوعية لتحضير الوجبات وترتيب المنزل استعدادًا للأسبوع القادم",
    description_en: "A weekly session preparing meals and organizing the home ahead of the coming week",
    category: "health",
    difficulty: "intermediate",
    minLevel: 15,
    totalMinutes: 70,
    steps: [
      { time: "السبت 16:00", durationMinutes: 60, action_ar: "تحضير وجبات صحية أسبوعيًا", action_en: "Weekly healthy meal preparation", linkedHabitId: "health_weekly_meal_prep" },
      { time: "السبت 17:00", durationMinutes: 10, action_ar: "تمدد عميق بعد الوقوف الطويل", action_en: "Deep stretch after prolonged standing", linkedHabitId: "health_weekly_deep_stretch" },
    ],
    bestFor: ["يطبخ لنفسه أو لأسرته", "يريد تقليل قرارات الطعام اليومية"],
    icon: "🥘",
    xpReward: 48,
  },

  // warmup: "ساعة تعلم مركزة أسبوعيًا تتفوق على تصفح متقطع كل يوم"
  // completion: "استثمرت في نفسك هذا الأسبوع — عائد يمتد لسنوات"
  {
    id: "routine_weekly_deep_learning",
    title_ar: "جلسة التعلم الأسبوعية",
    title_en: "The Weekly Deep Learning Session",
    description_ar: "جلسة أسبوعية مركزة للتفكير النقدي والمهارات العملية والنقاش الفكري",
    description_en: "A focused weekly session for critical thinking, practical skills, and intellectual discussion",
    category: "learning",
    difficulty: "intermediate",
    minLevel: 15,
    totalMinutes: 60,
    steps: [
      { time: "الأحد 19:00", durationMinutes: 30, action_ar: "جلسة تفكير نقدي أسبوعية", action_en: "Weekly critical thinking session", linkedHabitId: "learning_weekly_critical_thinking" },
      { time: "الأحد 19:30", durationMinutes: 30, action_ar: "تعلم مهارة عملية جديدة", action_en: "Learning a new practical skill", linkedHabitId: "learning_weekly_practical_skill" },
    ],
    bestFor: ["يريد تعلمًا منظمًا لا عشوائيًا", "لديه وقت أسبوعي مخصص للتطور"],
    icon: "🧩",
    xpReward: 46,
  },

  // ===== Advanced (minLevel 35, 70-100 min) =====

  // warmup: "الأعمال تحتاج نظرة أسبوعية من الأعلى، لا فقط تفاصيل يومية"
  // completion: "رأيت مشروعك من زاوية أوسع — قرارات هذا الأسبوع كانت أوضح"
  {
    id: "routine_weekly_business_review",
    title_ar: "المراجعة الأسبوعية للأعمال",
    title_en: "The Weekly Business Review",
    description_ar: "جلسة أسبوعية لمراجعة تقدم المشروع، تفويض المهام، وبناء شبكة العلاقات",
    description_en: "A weekly session reviewing project progress, delegating tasks, and building professional networks",
    category: "work",
    difficulty: "advanced",
    minLevel: 35,
    totalMinutes: 75,
    steps: [
      { time: "السبت 09:00", durationMinutes: 30, action_ar: "مراجعة أسبوعية للأهداف", action_en: "Weekly goals review", linkedHabitId: "work_weekly_goals_review" },
      { time: "السبت 09:30", durationMinutes: 15, action_ar: "تفويض مهمة واحدة أسبوعيًا", action_en: "Delegate one task weekly", linkedHabitId: "work_weekly_delegate_task" },
      { time: "السبت 09:45", durationMinutes: 30, action_ar: "بناء شبكة علاقات مهنية", action_en: "Weekly professional networking", linkedHabitId: "work_weekly_networking" },
    ],
    bestFor: ["صاحب مشروع أو قائد فريق", "يحتاج نظرة أسبوعية استراتيجية"],
    icon: "📈",
    xpReward: 62,
  },

  // warmup: "يوم الجمعة فرصة أسبوعية لتكثيف ما تفرقه الأيام"
  // completion: "أسبوعك الروحاني اكتمل بختام يليق به"
  {
    id: "routine_spiritual_friday",
    title_ar: "يوم الجمعة الروحاني",
    title_en: "The Spiritual Friday Routine",
    description_ar: "تكثيف أسبوعي للعبادة والعلم وصلة الرحم في يوم الجمعة المبارك",
    description_en: "A weekly intensification of worship, learning, and family ties on the blessed day of Friday",
    category: "spiritual",
    difficulty: "advanced",
    minLevel: 35,
    totalMinutes: 80,
    steps: [
      { time: "الجمعة 08:00", durationMinutes: 30, action_ar: "ختم جزء من القرآن أسبوعيًا (مختصر لهذا الروتين)", action_en: "Weekly juz completion (shortened for this routine)", linkedHabitId: "spiritual_weekly_juz_completion" },
      { time: "الجمعة 16:00", durationMinutes: 30, action_ar: "مجلس علم أسبوعي", action_en: "Weekly knowledge circle", linkedHabitId: "spiritual_weekly_knowledge_circle" },
      { time: "الجمعة 18:00", durationMinutes: 20, action_ar: "الاتصال بالأهل أسبوعيًا (إن أمكن)", action_en: "Weekly family call, when possible", linkedHabitId: "spiritual_weekly_family_call" },
    ],
    bestFor: ["يريد استثمار يوم الجمعة بعمق", "لديه وقت فراغ أوسع في نهاية الأسبوع"],
    icon: "🕌",
    xpReward: 66,
  },

  // ===== Expert (minLevel 60, 100-150 min) =====

  // warmup: "القائد الذي لا يراجع أسبوعه، يقود بالتخمين لا بالوعي"
  // completion: "أسبوع كامل من القيادة تمت مراجعته بعمق — استعداد حقيقي لما بعده"
  {
    id: "routine_leader_weekly_deep_dive",
    title_ar: "المراجعة الأسبوعية الشاملة للقائد",
    title_en: "The Leader's Comprehensive Weekly Deep Dive",
    description_ar: "جلسة أسبوعية موسّعة تجمع أداء العمل، التوجيه، وأتمتة العمليات في مراجعة قيادية شاملة",
    description_en: "An extended weekly session combining work performance, mentoring, and process automation in a comprehensive leadership review",
    category: "work",
    difficulty: "expert",
    minLevel: 60,
    totalMinutes: 120,
    steps: [
      { time: "السبت 08:00", durationMinutes: 45, action_ar: "مراجعة الأداء الشهرية (مختصرة أسبوعيًا لهذا الروتين)", action_en: "Monthly performance review (weekly-shortened for this routine)", linkedHabitId: "work_monthly_performance_review" },
      { time: "السبت 08:45", durationMinutes: 45, action_ar: "توجيه شخص أسبوعيًا", action_en: "Weekly mentoring of a person", linkedHabitId: "work_weekly_mentoring" },
      { time: "السبت 09:30", durationMinutes: 30, action_ar: "أتمتة عملية عمل (مختصرة أسبوعيًا لهذا الروتين)", action_en: "Process automation (weekly-shortened for this routine)", linkedHabitId: "work_monthly_process_automation" },
    ],
    bestFor: ["قائد فريق أو مؤسسة", "ملتزم بمراجعة قيادية عميقة ومنتظمة"],
    icon: "🧭",
    xpReward: 88,
  },

  // warmup: "أسبوع التوازن ليس رفاهية القادرين — إنه ضرورة المستمرين"
  // completion: "لمست كل محاور حياتك في أسبوع واحد — توازن نادر يستحق التكرار"
  {
    id: "routine_full_balance_week",
    title_ar: "أسبوع التوازن الكامل",
    title_en: "The Complete Balance Week Routine",
    description_ar: "جلسة أسبوعية موسّعة تلمس المحاور الخمسة كلها: روحاني، معرفي، اجتماعي، صحي، وعملي",
    description_en: "An extended weekly session touching all five life domains: spiritual, intellectual, social, physical, and practical",
    category: "spiritual",
    difficulty: "expert",
    minLevel: 60,
    totalMinutes: 130,
    steps: [
      { time: "الجمعة 08:00", durationMinutes: 30, action_ar: "مجلس علم أسبوعي", action_en: "Weekly knowledge circle", linkedHabitId: "spiritual_weekly_knowledge_circle" },
      { time: "الجمعة 16:00", durationMinutes: 30, action_ar: "نقاش فكري أسبوعي", action_en: "Weekly intellectual discussion", linkedHabitId: "learning_weekly_intellectual_discussion" },
      { time: "الجمعة 19:00", durationMinutes: 30, action_ar: "عشاء عائلي أسبوعي (إن أمكن)", action_en: "Weekly family dinner, when possible", linkedHabitId: "social_weekly_family_dinner" },
      { time: "السبت 10:00", durationMinutes: 20, action_ar: "ممارسة هواية مريحة أسبوعيًا", action_en: "Weekly relaxing hobby time", linkedHabitId: "health_weekly_relaxing_hobby" },
      { time: "السبت 11:00", durationMinutes: 20, action_ar: "مراجعة أسبوعية للأهداف", action_en: "Weekly goals review", linkedHabitId: "work_weekly_goals_review" },
    ],
    bestFor: ["يرفض التركيز الأحادي في حياته", "لديه عطلة أسبوعية واسعة نسبيًا"],
    icon: "🌈",
    xpReward: 94,
  },
];
