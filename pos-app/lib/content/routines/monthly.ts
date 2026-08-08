import type { RoutineTemplate } from "../types";

/**
 * 10 monthly routines across 4 difficulty tiers — the least frequent, most
 * reflective layer of the routine library: monthly checkpoints, deeper
 * relationship maintenance, medical/financial review, and longer periods
 * of spiritual or intellectual intensification. `time` fields use a
 * suggested day-of-month + time string since exact weekday doesn't apply
 * monthly the way it does weekly.
 *
 * Same conventions as morning/evening/weekly.ts: warmup/completion framing
 * as comments only, every linkedHabitId verified against the real
 * habits/*.ts files, cultural sensitivity in family-related steps.
 * Tier breakdown (3/3/2/2) matches weekly.ts, scaled to 10 items.
 */
export const monthlyRoutines: RoutineTemplate[] = [
  // ===== Beginner (minLevel 1, 30-50 min) =====

  // warmup: "شهر بلا نظرة شاملة، شهر يتكرر دون أن يتطور"
  // completion: "نظرت لشهرك من الأعلى — وضوح لا يمنحه الانشغال اليومي"
  {
    id: "routine_simple_monthly_review",
    title_ar: "المراجعة الشهرية البسيطة",
    title_en: "The Simple Monthly Review",
    description_ar: "وقفة شهرية قصيرة لمراجعة الأداء العام وتحديد نقطة تحسين واحدة للشهر القادم",
    description_en: "A short monthly pause to review overall performance and identify one improvement point for next month",
    category: "work",
    difficulty: "beginner",
    minLevel: 1,
    totalMinutes: 35,
    steps: [
      { time: "اليوم الأخير من الشهر 20:00", durationMinutes: 35, action_ar: "مراجعة الأداء الشهرية (مختصرة لهذا الروتين)", action_en: "Monthly performance review (shortened for this routine)", linkedHabitId: "work_monthly_performance_review" },
    ],
    bestFor: ["يبدأ للتو مع المراجعات الشهرية", "يفضّل البساطة"],
    icon: "📅",
    xpReward: 34,
  },

  // warmup: "الأقارب البعيدون يستحقون تذكرًا شهريًا، لا نسيانًا سنويًا"
  // completion: "وصلت رحمًا كانت تنتظر خطوة منك"
  {
    id: "routine_monthly_family_visit",
    title_ar: "زيارة الأقارب الشهرية",
    title_en: "The Monthly Relative Visit Routine",
    description_ar: "خطوة شهرية للتواصل مع قريب لا يتم التواصل معه كثيرًا، حفاظًا على الرحم",
    description_en: "A monthly step to connect with a relative you don't often reach out to, maintaining family ties",
    category: "social",
    difficulty: "beginner",
    minLevel: 1,
    totalMinutes: 45,
    steps: [
      { time: "أول سبت من الشهر 16:00", durationMinutes: 45, action_ar: "زيارة قريب شهريًا", action_en: "Monthly relative visit", linkedHabitId: "social_monthly_relative_visit" },
    ],
    bestFor: ["لديه أقارب لا يلتقيهم بانتظام", "يريد خطوة بسيطة شهريًا لصلة الرحم"],
    icon: "👨‍👩‍👧",
    xpReward: 32,
  },

  // warmup: "كتاب واحد كل شهر، اثنا عشر عالمًا جديدًا كل عام"
  // completion: "أنهيت كتابًا هذا الشهر — رصيد معرفي يتراكم بهدوء"
  {
    id: "routine_monthly_book",
    title_ar: "روتين الكتاب الشهري",
    title_en: "The Monthly Book Routine",
    description_ar: "وقت شهري ثابت لمراجعة تقدمك في قراءة كتاب الشهر واختيار كتاب الشهر القادم",
    description_en: "Fixed monthly time to review your progress on this month's book and choose next month's",
    category: "learning",
    difficulty: "beginner",
    minLevel: 1,
    totalMinutes: 30,
    steps: [
      { time: "اليوم الأخير من الشهر 21:00", durationMinutes: 30, action_ar: "إنهاء كتاب كامل شهريًا (مراجعة وتلخيص)", action_en: "Finishing one full book monthly (review and summarize)", linkedHabitId: "learning_one_book_monthly" },
    ],
    bestFor: ["يقرأ بوتيرة كتاب شهري", "يحب تتبع تقدمه القرائي"],
    icon: "📚",
    xpReward: 30,
  },

  // ===== Intermediate (minLevel 15, 50-80 min) =====

  // warmup: "صحتك لا تنتظر أن تشعر بألم لتهتم بها"
  // completion: "اطمأننت على صحتك هذا الشهر — استثمار هادئ في مستقبلك"
  {
    id: "routine_monthly_health_checkin",
    title_ar: "الفحص الشهري الصحي",
    title_en: "The Monthly Health Check-In Routine",
    description_ar: "وقفة شهرية للاطمئنان على الصحة عمومًا وتقييم العادات الصحية الأخيرة",
    description_en: "A monthly pause to check in on overall health and evaluate recent health habits",
    category: "health",
    difficulty: "intermediate",
    minLevel: 15,
    totalMinutes: 60,
    steps: [
      { time: "أول أحد من الشهر 10:00", durationMinutes: 40, action_ar: "فحص طبي دوري روتيني (أو مراجعة صحية ذاتية إن لم يحن موعد الفحص)", action_en: "Routine medical checkup, or a self health review if no appointment is due", linkedHabitId: "health_routine_medical_checkup" },
      { time: "أول أحد من الشهر 10:40", durationMinutes: 20, action_ar: "متابعة أسبوعية للطاقة والمزاج (مراجعة شهرية للنمط)", action_en: "Reviewing the month's energy/mood patterns" },
    ],
    bestFor: ["يريد متابعة صحته بانتظام دون قلق مفرط", "لديه مواعيد فحص دورية"],
    icon: "🩺",
    xpReward: 52,
  },

  // warmup: "التطوع الشهري يمنحك أثرًا خارج دائرتك المعتادة"
  // completion: "منحت وقتك لقضية تؤمن بها — أثر يمتد بعد انتهاء الشهر"
  {
    id: "routine_monthly_volunteering",
    title_ar: "روتين التطوع الشهري",
    title_en: "The Monthly Volunteering Routine",
    description_ar: "يوم شهري مخصص للعمل التطوعي مع جهة أو قضية تؤمن بها",
    description_en: "A dedicated monthly day for volunteer work with a cause or organization you believe in",
    category: "social",
    difficulty: "intermediate",
    minLevel: 15,
    totalMinutes: 75,
    steps: [
      { time: "ثاني سبت من الشهر 09:00", durationMinutes: 75, action_ar: "عمل تطوعي شهري", action_en: "Monthly volunteer work", linkedHabitId: "social_monthly_volunteer_work" },
    ],
    bestFor: ["يريد أثرًا اجتماعيًا منتظمًا", "لديه يوم فراغ شهري يمكن تخصيصه"],
    icon: "🤲",
    xpReward: 56,
  },

  // warmup: "التقدم المهني الحقيقي يحتاج تقييمًا شهريًا، لا انتظارًا سنويًا"
  // completion: "قيّمت أداءك واستكشفت مجالًا جديدًا — نمو مزدوج هذا الشهر"
  {
    id: "routine_monthly_performance_and_growth",
    title_ar: "روتين التقييم والنمو الشهري",
    title_en: "The Monthly Performance and Growth Routine",
    description_ar: "جلسة شهرية تجمع تقييم الأداء المهني مع استكشاف مجال معرفي جديد",
    description_en: "A monthly session combining professional performance evaluation with exploring a new knowledge field",
    category: "work",
    difficulty: "intermediate",
    minLevel: 15,
    totalMinutes: 70,
    steps: [
      { time: "اليوم الأخير من الشهر 19:00", durationMinutes: 40, action_ar: "مراجعة الأداء الشهرية", action_en: "Monthly performance review", linkedHabitId: "work_monthly_performance_review" },
      { time: "اليوم الأخير من الشهر 19:40", durationMinutes: 30, action_ar: "استكشاف مجال معرفي جديد (مختصر لهذا الروتين)", action_en: "Exploring a new knowledge field (shortened for this routine)", linkedHabitId: "learning_monthly_new_field" },
    ],
    bestFor: ["يريد ربط تقييم العمل بتطور معرفي مستمر", "لا يكتفي بالتقييم بلا فعل بعده"],
    icon: "📈",
    xpReward: 58,
  },

  // ===== Advanced (minLevel 35, 80-110 min) =====

  // warmup: "ثلاثة أيام شهريًا تكفي لتذكير النفس بمعنى الصبر"
  // completion: "أنهيت شهرك بصيام وصدقة — ميزان روحاني متجدد كل شهر"
  {
    id: "routine_monthly_spiritual_renewal",
    title_ar: "روتين التجديد الروحي الشهري",
    title_en: "The Monthly Spiritual Renewal Routine",
    description_ar: "شهر يُختم بصيام السنة المؤكدة، ختم جزء من القرآن، ومراجعة الصدقة الجارية",
    description_en: "A month closed with the confirmed sunnah fasting days, completing a portion of Qur'an, and reviewing ongoing charity",
    category: "spiritual",
    difficulty: "advanced",
    minLevel: 35,
    totalMinutes: 95,
    steps: [
      { time: "أيام البيض من الشهر", durationMinutes: 5, action_ar: "نية صيام ثلاثة أيام من الشهر", action_en: "Setting intention to fast three days of the month", linkedHabitId: "spiritual_three_days_monthly_fasting" },
      { time: "اليوم الأخير من الشهر 20:00", durationMinutes: 45, action_ar: "ختم القرآن شهريًا (مراجعة تقدم الختمة)", action_en: "Monthly Qur'an completion (reviewing khatm progress)", linkedHabitId: "spiritual_monthly_full_quran" },
      { time: "اليوم الأخير من الشهر 20:45", durationMinutes: 45, action_ar: "مراجعة الصدقة الجارية ومتابعتها", action_en: "Reviewing and following up on ongoing charity", linkedHabitId: "spiritual_ongoing_charity" },
    ],
    bestFor: ["ملتزم بختمة شهرية للقرآن", "يريد شهرًا روحانيًا مكثفًا"],
    icon: "🕋",
    xpReward: 74,
  },

  // warmup: "الكفاءة والتعلم شهريًا، يبنيان تفوقًا لا يُلحق به من يقف مكانه"
  // completion: "حسّنت نظامك وتعلمت جديدًا — شهر لم يمر بلا أثر"
  {
    id: "routine_monthly_efficiency_and_learning",
    title_ar: "روتين الكفاءة والتعلم الشهري",
    title_en: "The Monthly Efficiency and Learning Routine",
    description_ar: "شهر يجمع أتمتة عملية عمل وحضور ورشة تطوّر مهاراتك",
    description_en: "A month combining automating one work process and attending a workshop that develops your skills",
    category: "work",
    difficulty: "advanced",
    minLevel: 35,
    totalMinutes: 105,
    steps: [
      { time: "منتصف الشهر 09:00", durationMinutes: 60, action_ar: "أتمتة عملية عمل شهريًا", action_en: "Automate one work process monthly", linkedHabitId: "work_monthly_process_automation" },
      { time: "منتصف الشهر 10:00", durationMinutes: 45, action_ar: "حضور ورشة عمل أو ندوة (مختصرة لهذا الروتين)", action_en: "Attending a workshop or seminar (shortened for this routine)", linkedHabitId: "learning_monthly_workshop" },
    ],
    bestFor: ["يريد تحسين كفاءته المهنية باستمرار", "يستثمر في التطوير المهني المنتظم"],
    icon: "⚙️",
    xpReward: 82,
  },

  // ===== Expert (minLevel 60, 110-160 min) =====

  // warmup: "القائد الذي يراجع شهره بعمق، يقود بثقة لا بتخمين"
  // completion: "شهر كامل من القيادة روجع بعمق — استعداد حقيقي لما بعده"
  {
    id: "routine_leader_monthly_deep_review",
    title_ar: "المراجعة الشهرية الشاملة للقائد",
    title_en: "The Leader's Comprehensive Monthly Review",
    description_ar: "جلسة شهرية موسّعة تجمع تقييم الأداء، تقرير التقدم، وبحثًا معرفيًا يخدم القرارات القادمة",
    description_en: "An extended monthly session combining performance evaluation, progress reporting, and knowledge research to inform upcoming decisions",
    category: "work",
    difficulty: "expert",
    minLevel: 60,
    totalMinutes: 130,
    steps: [
      { time: "اليوم الأخير من الشهر 08:00", durationMinutes: 50, action_ar: "مراجعة الأداء الشهرية", action_en: "Monthly performance review", linkedHabitId: "work_monthly_performance_review" },
      { time: "اليوم الأخير من الشهر 08:50", durationMinutes: 40, action_ar: "كتابة تقرير تقدم (مختصر لهذا الروتين)", action_en: "Writing a progress report (shortened for this routine)", linkedHabitId: "work_weekly_progress_report" },
      { time: "اليوم الأخير من الشهر 09:30", durationMinutes: 40, action_ar: "كتابة ملخص بحثي شهري (مختصر لهذا الروتين)", action_en: "Monthly research summary writing (shortened for this routine)", linkedHabitId: "learning_monthly_research_summary" },
    ],
    bestFor: ["قائد فريق أو مؤسسة", "يتخذ قرارات استراتيجية شهرية مبنية على بيانات"],
    icon: "🧭",
    xpReward: 96,
  },

  // warmup: "شهر تجديد شامل، لا يقتصر على محور واحد من حياتك"
  // completion: "جدّدت روحك، معرفتك، وعلاقاتك في شهر واحد — نادر ويستحق التكرار"
  {
    id: "routine_monthly_renewal_all_domains",
    title_ar: "شهر التجديد الشامل",
    title_en: "The Complete Renewal Month Routine",
    description_ar: "جلسة شهرية موسّعة تلمس التجديد الروحي، المعرفي، والاجتماعي معًا",
    description_en: "An extended monthly session touching spiritual, intellectual, and social renewal together",
    category: "spiritual",
    difficulty: "expert",
    minLevel: 60,
    totalMinutes: 140,
    steps: [
      { time: "اليوم الأخير من الشهر 08:00", durationMinutes: 45, action_ar: "ختم القرآن شهريًا (مراجعة تقدم الختمة)", action_en: "Monthly Qur'an completion (reviewing khatm progress)", linkedHabitId: "spiritual_monthly_full_quran" },
      { time: "اليوم الأخير من الشهر 08:45", durationMinutes: 40, action_ar: "قراءة كتابين شهريًا (مراجعة وتلخيص)", action_en: "Reading two books monthly (review and summarize)", linkedHabitId: "learning_two_books_monthly" },
      { time: "اليوم الأخير من الشهر 09:25", durationMinutes: 30, action_ar: "التواصل الشامل مع الأقارب البعيدين", action_en: "Comprehensive outreach to distant relatives", linkedHabitId: "social_far_relatives_effort" },
      { time: "اليوم الأخير من الشهر 09:55", durationMinutes: 25, action_ar: "حضور مناسبة اجتماعية شهرية (إن أمكن)", action_en: "Attending a monthly social gathering, when possible", linkedHabitId: "social_monthly_social_gathering" },
    ],
    bestFor: ["يريد شهرًا متكاملًا لا محورًا واحدًا فقط", "لديه يوم كامل يمكن تخصيصه لهذا التجديد"],
    icon: "🌟",
    xpReward: 108,
  },
];
