import type { RoutineTemplate } from "../types";

/**
 * 15 evening routines across 4 difficulty tiers. Unlike morning.ts (energy,
 * focus, momentum), the evening register is winding down, reflection,
 * gratitude, and preparation for sleep — routines end by ~22:30-23:00 to
 * support healthy sleep. Family-time steps are phrased as optional
 * ("إن أمكن") rather than assuming a specific household composition.
 *
 * As in morning.ts: warmup/completion framing is kept as comments (not
 * object fields) since RoutineTemplate doesn't declare those properties;
 * every linkedHabitId below is verified against the real habits/*.ts files.
 */
export const eveningRoutines: RoutineTemplate[] = [
  // ===== Beginner (minLevel 1, 10-20 min) =====

  // warmup: "اختم يومك بامتنان، لا بإرهاق"
  // completion: "أغلقت يومك بهدوء — نوم أعمق ينتظرك"
  {
    id: "routine_calm_evening",
    title_ar: "روتين المساء الهادئ",
    title_en: "The Calm Evening Routine",
    description_ar: "استرخاء بسيط وأذكار مسائية تُهيّئ الجسم والقلب للنوم",
    description_en: "Simple relaxation and evening remembrance that prepare body and heart for sleep",
    category: "spiritual",
    difficulty: "beginner",
    minLevel: 1,
    totalMinutes: 15,
    steps: [
      { time: "21:30", durationMinutes: 15, action_ar: "أذكار المساء", action_en: "Evening remembrance", linkedHabitId: "spiritual_evening_azkar" },
    ],
    bestFor: ["من يبدأ للتو", "يبحث عن ختام بسيط لليوم"],
    icon: "🌆",
    xpReward: 20,
  },

  // warmup: "المساء وقت الحصاد والتأمل، لا الإنجاز الجديد"
  // completion: "أغلقت اليوم بوعي — خطوة بسيطة لنوم أفضل"
  {
    id: "routine_simple_day_closure",
    title_ar: "روتين إغلاق اليوم البسيط",
    title_en: "The Simple Day Closure Routine",
    description_ar: "خطوات قليلة لإنهاء اليوم بوضوح قبل الانتقال لوضع الراحة",
    description_en: "A few steps to close out the day clearly before shifting into rest mode",
    category: "work",
    difficulty: "beginner",
    minLevel: 1,
    totalMinutes: 12,
    steps: [
      { time: "22:00", durationMinutes: 5, action_ar: "تدوين إنجاز واحد قبل النوم", action_en: "Note one win before sleep", linkedHabitId: "work_one_win_before_sleep" },
      { time: "22:05", durationMinutes: 7, action_ar: "ترتيب قائمة مهام الغد", action_en: "Prepare tomorrow's to-do list", linkedHabitId: "work_tomorrow_todo" },
    ],
    bestFor: ["يريد إغلاقًا سريعًا وواضحًا لليوم", "لا يفضّل طقوسًا طويلة"],
    icon: "✅",
    xpReward: 18,
  },

  // warmup: "من أغلق يومه بوعي، استيقظ أخف روحًا"
  // completion: "استعد جسمك للنوم — بقي أن يستريح الآن"
  {
    id: "routine_healthy_sleep",
    title_ar: "روتين النوم الصحي",
    title_en: "The Healthy Sleep Routine",
    description_ar: "خطوات بسيطة تُهيّئ الجسم لنوم عميق: تقليل الشاشات، الوضوء، ودعاء النوم",
    description_en: "Simple steps preparing the body for deep sleep: reducing screens, ablution, and bedtime supplication",
    category: "health",
    difficulty: "beginner",
    minLevel: 1,
    totalMinutes: 18,
    steps: [
      { time: "21:45", durationMinutes: 10, action_ar: "تقليل الشاشات قبل النوم", action_en: "Reducing screen time before bed", linkedHabitId: "health_reduce_screen_before_bed" },
      { time: "21:55", durationMinutes: 5, action_ar: "الوضوء قبل النوم", action_en: "Ablution before sleep", linkedHabitId: "spiritual_wudu_before_sleep" },
      { time: "22:00", durationMinutes: 3, action_ar: "دعاء قبل النوم", action_en: "Bedtime supplication", linkedHabitId: "spiritual_night_dua" },
    ],
    bestFor: ["يعاني من صعوبة النوم", "يقضي وقتًا طويلًا على الشاشة مساءً"],
    icon: "🛌",
    xpReward: 20,
  },

  // warmup: "دقائق قليلة من المراجعة، توفر ساعات من التخبط غدًا"
  // completion: "راجعت يومك — درس بسيط يستحق أن يُحمَل للغد"
  {
    id: "routine_short_review",
    title_ar: "روتين المراجعة القصيرة",
    title_en: "The Short Review Routine",
    description_ar: "وقفة قصيرة لمراجعة أبرز أحداث اليوم واستخلاص درس بسيط منه",
    description_en: "A brief pause to review the day's highlights and draw one simple lesson from it",
    category: "learning",
    difficulty: "beginner",
    minLevel: 1,
    totalMinutes: 15,
    steps: [
      { time: "21:00", durationMinutes: 10, action_ar: "تدوين الدروس المستفادة", action_en: "Log lessons learned", linkedHabitId: "work_lessons_learned_log" },
      { time: "21:10", durationMinutes: 5, action_ar: "الاستغفار", action_en: "Seeking forgiveness", linkedHabitId: "spiritual_istighfar" },
    ],
    bestFor: ["يبحث عن تأمل يومي بسيط", "يريد إنهاء يومه بوعي لا بنسيان"],
    icon: "📔",
    xpReward: 18,
  },

  // ===== Intermediate (minLevel 15, 20-40 min) =====

  // warmup: "الوقت العائلي (إن أمكن) استثمار لا يُعوَّض بشيء آخر"
  // completion: "منحت مساءك لمن يستحقه — يوم انتهى بدفء"
  {
    id: "routine_family_evening",
    title_ar: "روتين المساء العائلي",
    title_en: "The Family Evening Routine",
    description_ar: "مساء يخصّص وقتًا حقيقيًا لمن حولك، إن كان لديك وقت عائلي متاح، مع ختام روحاني هادئ",
    description_en: "An evening dedicating real time to those around you, when family time is available, closing with a calm spiritual note",
    category: "social",
    difficulty: "intermediate",
    minLevel: 15,
    totalMinutes: 35,
    steps: [
      { time: "20:00", durationMinutes: 20, action_ar: "وقت جودة مع من تربّيهم أو تعيش معهم (إن أمكن)", action_en: "Quality time with those you live with or raise, when possible", linkedHabitId: "social_daily_quality_time_children" },
      { time: "20:20", durationMinutes: 15, action_ar: "أذكار المساء", action_en: "Evening remembrance", linkedHabitId: "spiritual_evening_azkar" },
    ],
    bestFor: ["لديه وقت عائلي متاح مساءً", "يريد موازنة الحضور العائلي مع الروحاني"],
    icon: "👨‍👩‍👧",
    xpReward: 30,
  },

  // warmup: "دقائق تخطيط الليلة، صباح أوضح غدًا"
  // completion: "دخلت النوم وغدك مُرتَّب بالفعل — راحة ذهنية حقيقية"
  {
    id: "routine_review_and_plan",
    title_ar: "روتين المراجعة والتخطيط",
    title_en: "The Review and Planning Routine",
    description_ar: "مساء يجمع بين تقييم اليوم المنتهي والتحضير الواعي لليوم القادم",
    description_en: "An evening combining evaluation of the finished day with mindful preparation for the coming one",
    category: "work",
    difficulty: "intermediate",
    minLevel: 15,
    totalMinutes: 25,
    steps: [
      { time: "21:00", durationMinutes: 10, action_ar: "تدوين الدروس المستفادة", action_en: "Log lessons learned", linkedHabitId: "work_lessons_learned_log" },
      { time: "21:10", durationMinutes: 7, action_ar: "ترتيب قائمة مهام الغد", action_en: "Prepare tomorrow's to-do list", linkedHabitId: "work_tomorrow_todo" },
      { time: "21:17", durationMinutes: 5, action_ar: "تدوين إنجاز واحد قبل النوم", action_en: "Note one win before sleep", linkedHabitId: "work_one_win_before_sleep" },
      { time: "21:22", durationMinutes: 3, action_ar: "دعاء قبل النوم", action_en: "Bedtime supplication", linkedHabitId: "spiritual_night_dua" },
    ],
    bestFor: ["يحب الدخول للغد بخطة جاهزة", "يعاني من فوضى صباحية بسبب قلة التخطيط"],
    icon: "🗒️",
    xpReward: 28,
  },

  // warmup: "الاسترخاء العميق ليس كسلًا — إنه صيانة ضرورية"
  // completion: "أفرغت توتر اليوم قبل أن يتراكم — جسمك سيشكرك غدًا"
  {
    id: "routine_deep_relaxation",
    title_ar: "روتين الاسترخاء العميق",
    title_en: "The Deep Relaxation Routine",
    description_ar: "مساء يمنح الجسم والذهن مساحة حقيقية للتعافي من ضغط اليوم",
    description_en: "An evening giving body and mind genuine space to recover from the day's pressure",
    category: "health",
    difficulty: "intermediate",
    minLevel: 15,
    totalMinutes: 25,
    steps: [
      { time: "20:30", durationMinutes: 10, action_ar: "جلسة استرخاء أو تأمل", action_en: "Relaxation or meditation session", linkedHabitId: "health_ten_min_relaxation" },
      { time: "20:40", durationMinutes: 10, action_ar: "تقليل الشاشات قبل النوم", action_en: "Reducing screen time before bed", linkedHabitId: "health_reduce_screen_before_bed" },
      { time: "20:50", durationMinutes: 5, action_ar: "دعاء قبل النوم", action_en: "Bedtime supplication", linkedHabitId: "spiritual_night_dua" },
    ],
    bestFor: ["يعيش يومًا مضغوطًا باستمرار", "يبحث عن مساحة حقيقية للتعافي"],
    icon: "🌿",
    xpReward: 26,
  },

  // warmup: "آخر ما تقرأه، قد يكون أول ما يفكر فيه عقلك غدًا"
  // completion: "أنهيت يومك بمعرفة، لا بتصفح بلا هدف"
  {
    id: "routine_evening_learner",
    title_ar: "روتين المتعلم المسائي",
    title_en: "The Evening Learner Routine",
    description_ar: "مساء يستثمر آخر ساعة قبل النوم في قراءة هادفة ومراجعة واعية",
    description_en: "An evening investing the last pre-sleep hour in purposeful reading and mindful review",
    category: "learning",
    difficulty: "intermediate",
    minLevel: 15,
    totalMinutes: 30,
    steps: [
      { time: "21:15", durationMinutes: 10, action_ar: "تلخيص ما قرأته اليوم", action_en: "Summarizing what you read today", linkedHabitId: "learning_summarize_reading" },
      { time: "21:25", durationMinutes: 15, action_ar: "القراءة قبل النوم", action_en: "Reading before sleep", linkedHabitId: "learning_reading_before_sleep" },
      { time: "21:40", durationMinutes: 5, action_ar: "مراجعة الملاحظات اليومية", action_en: "Reviewing daily notes", linkedHabitId: "learning_review_notes" },
    ],
    bestFor: ["يفضّل القراءة على الشاشات مساءً", "طالب أو باحث يريد تثبيت ما تعلمه"],
    icon: "📖",
    xpReward: 28,
  },

  // ===== Advanced (minLevel 35, 40-60 min) =====

  // warmup: "المساء الكامل ليس رفاهية — إنه استثمار في نوعية نومك وغدك"
  // completion: "أذكار، مراجعة، قراءة، وخطة للغد — مساء مكتمل بحق"
  {
    id: "routine_full_evening",
    title_ar: "روتين المساء الكامل",
    title_en: "The Complete Evening Routine",
    description_ar: "مساء متكامل يجمع الذكر والمراجعة والقراءة والتخطيط للغد في تسلسل هادئ",
    description_en: "A well-rounded evening combining remembrance, review, reading, and next-day planning in a calm sequence",
    category: "spiritual",
    difficulty: "advanced",
    minLevel: 35,
    totalMinutes: 50,
    steps: [
      { time: "20:30", durationMinutes: 15, action_ar: "أذكار المساء", action_en: "Evening remembrance", linkedHabitId: "spiritual_evening_azkar" },
      { time: "20:45", durationMinutes: 10, action_ar: "تدوين الدروس المستفادة", action_en: "Log lessons learned", linkedHabitId: "work_lessons_learned_log" },
      { time: "20:55", durationMinutes: 15, action_ar: "القراءة قبل النوم", action_en: "Reading before sleep", linkedHabitId: "learning_reading_before_sleep" },
      { time: "21:10", durationMinutes: 10, action_ar: "ترتيب قائمة مهام الغد", action_en: "Prepare tomorrow's to-do list", linkedHabitId: "work_tomorrow_todo" },
    ],
    bestFor: ["يريد ختامًا متكاملًا لا مجتزأً", "لديه وقت مسائي مستقر"],
    icon: "🌙",
    xpReward: 42,
  },

  // warmup: "أغلق دفاتر العمل قبل أن تغلق عينيك — لا تحمل القلق للسرير"
  // completion: "أنهيت يوم العمل فعليًا، لا فقط جسديًا — نوم بلا أعباء معلّقة"
  {
    id: "routine_business_evening_closure",
    title_ar: "روتين رجل الأعمال المسائي",
    title_en: "The Business Owner's Evening Closure",
    description_ar: "إغلاق واعٍ ليوم العمل: مراجعة التقدم، تدوين الدروس، وتخطيط الغد، قبل الانفصال الذهني الكامل",
    description_en: "A mindful close to the work day: reviewing progress, logging lessons, and planning tomorrow, before fully disconnecting",
    category: "work",
    difficulty: "advanced",
    minLevel: 35,
    totalMinutes: 45,
    steps: [
      { time: "20:00", durationMinutes: 20, action_ar: "كتابة تقرير تقدم (مختصر لهذا الروتين)", action_en: "Writing a progress report (shortened for this routine)", linkedHabitId: "work_weekly_progress_report" },
      { time: "20:20", durationMinutes: 10, action_ar: "تدوين الدروس المستفادة", action_en: "Log lessons learned", linkedHabitId: "work_lessons_learned_log" },
      { time: "20:30", durationMinutes: 10, action_ar: "ترتيب قائمة مهام الغد", action_en: "Prepare tomorrow's to-do list", linkedHabitId: "work_tomorrow_todo" },
      { time: "20:40", durationMinutes: 5, action_ar: "دعاء قبل النوم", action_en: "Bedtime supplication", linkedHabitId: "spiritual_night_dua" },
    ],
    bestFor: ["صاحب مشروع يحمل هموم العمل للبيت", "يحتاج فصلًا واضحًا بين العمل والراحة"],
    icon: "💼",
    xpReward: 40,
  },

  // warmup: "أفكار اليوم تستحق التقاطًا قبل أن يبتلعها النوم"
  // completion: "حفظت إبداع اليوم، وهدّأت ذهنك للغد"
  {
    id: "routine_creative_evening",
    title_ar: "روتين المبدع المسائي",
    title_en: "The Creative Evening Routine",
    description_ar: "مساء يراجع فيه المبدع عمله، يدوّن أفكاره، ويهدئ ذهنه المشحون بالإبداع",
    description_en: "An evening where a creative reviews their work, logs ideas, and calms a mind full of creative energy",
    category: "learning",
    difficulty: "advanced",
    minLevel: 35,
    totalMinutes: 45,
    steps: [
      { time: "21:00", durationMinutes: 10, action_ar: "تلخيص ما قرأته أو أنتجته اليوم", action_en: "Summarizing what you read or produced today", linkedHabitId: "learning_summarize_reading" },
      { time: "21:10", durationMinutes: 15, action_ar: "مراجعة عمل إبداعي أنجزته اليوم", action_en: "Reviewing a creative work completed today" },
      { time: "21:25", durationMinutes: 10, action_ar: "كتابة يومية", action_en: "Journaling", linkedHabitId: "learning_daily_journaling" },
      { time: "21:35", durationMinutes: 10, action_ar: "جلسة استرخاء", action_en: "Relaxation session", linkedHabitId: "health_ten_min_relaxation" },
    ],
    bestFor: ["كاتب أو مصمم أو صانع محتوى", "ذهنه لا يتوقف عن الإبداع مساءً"],
    icon: "🎨",
    xpReward: 40,
  },

  // warmup: "الصبر والشكر معًا، ميزان يومك قبل أن ينتهي"
  // completion: "تأملت في يومك بصدق — سكينة تستحقها قبل النوم"
  {
    id: "routine_contemplative",
    title_ar: "روتين المُتأمل",
    title_en: "The Contemplative Routine",
    description_ar: "مساء يخصَّص للتأمل العميق في اليوم: صبره، نعمه، وسكونه الأخير قبل النوم",
    description_en: "An evening dedicated to deep reflection on the day: its patience, its blessings, and its final stillness before sleep",
    category: "spiritual",
    difficulty: "advanced",
    minLevel: 35,
    totalMinutes: 50,
    steps: [
      { time: "21:00", durationMinutes: 15, action_ar: "أذكار المساء", action_en: "Evening remembrance", linkedHabitId: "spiritual_evening_azkar" },
      { time: "21:15", durationMinutes: 10, action_ar: "تأمل الصبر والشكر في يومك", action_en: "Reflecting on patience and gratitude in your day", linkedHabitId: "spiritual_patience_with_gratitude" },
      { time: "21:25", durationMinutes: 10, action_ar: "جلسة استرخاء", action_en: "Relaxation session", linkedHabitId: "health_ten_min_relaxation" },
      { time: "21:35", durationMinutes: 15, action_ar: "تأمل صامت بلا هدف محدد", action_en: "Silent reflection with no fixed agenda" },
    ],
    bestFor: ["يبحث عن عمق روحاني في مساءاته", "يميل للتأمل الهادئ لا الأنشطة الكثيرة"],
    icon: "🕯️",
    xpReward: 44,
  },

  // ===== Expert (minLevel 60, 60-90 min) =====

  // warmup: "الإغلاق الاحترافي ليس رفاهية — إنه ما يفصل بين يوم منظم وآخر فوضوي"
  // completion: "أغلقت كل خيوط يومك بإحكام — غدك يبدأ من هذه اللحظة"
  {
    id: "routine_professional_closure",
    title_ar: "روتين الإغلاق الاحترافي الشامل",
    title_en: "The Comprehensive Professional Closure Routine",
    description_ar: "مساء شامل يراجع الأسبوع، ينظّم المعرفة، ويحضّر ليوم غدٍ بوضوح تام",
    description_en: "A comprehensive evening reviewing the week, organizing knowledge, and preparing for tomorrow with full clarity",
    category: "work",
    difficulty: "expert",
    minLevel: 60,
    totalMinutes: 75,
    steps: [
      { time: "20:00", durationMinutes: 20, action_ar: "كتابة تقرير تقدم (مختصر لهذا الروتين)", action_en: "Writing a progress report (shortened for this routine)", linkedHabitId: "work_weekly_progress_report" },
      { time: "20:20", durationMinutes: 15, action_ar: "تدوين الدروس المستفادة", action_en: "Log lessons learned", linkedHabitId: "work_lessons_learned_log" },
      { time: "20:35", durationMinutes: 15, action_ar: "تنظيم ملاحظات (مختصر لهذا الروتين)", action_en: "Organizing notes (shortened for this routine)", linkedHabitId: "learning_organized_note_system" },
      { time: "20:50", durationMinutes: 10, action_ar: "ترتيب قائمة مهام الغد", action_en: "Prepare tomorrow's to-do list", linkedHabitId: "work_tomorrow_todo" },
      { time: "21:00", durationMinutes: 15, action_ar: "أذكار المساء", action_en: "Evening remembrance", linkedHabitId: "spiritual_evening_azkar" },
    ],
    bestFor: ["مسؤول عن فريق أو مشروع كبير", "ملتزم بمساء منظّم ومستقر"],
    icon: "🗂️",
    xpReward: 68,
  },

  // warmup: "الحكمة لا تأتي من الحركة الكثيرة، بل من التأمل العميق قبل السكون"
  // completion: "قمت، تأملت، وكتبت — مساء يليق بمن يبني حياة لا يومًا فقط"
  {
    id: "routine_wise_evening",
    title_ar: "روتين الحكيم المسائي",
    title_en: "The Wise One's Evening Routine",
    description_ar: "مساء يجمع قيامًا خفيفًا، مراجعة عميقة، وكتابة تأملية قبل النوم",
    description_en: "An evening combining light night prayer, deep review, and reflective writing before sleep",
    category: "spiritual",
    difficulty: "expert",
    minLevel: 60,
    totalMinutes: 65,
    steps: [
      { time: "21:30", durationMinutes: 20, action_ar: "قيام ليل خفيف (مختصر لهذا الروتين)", action_en: "Light night prayer (shortened for this routine)", linkedHabitId: "spiritual_nightly_qiyam" },
      { time: "21:50", durationMinutes: 15, action_ar: "تدوين الدروس المستفادة", action_en: "Log lessons learned", linkedHabitId: "work_lessons_learned_log" },
      { time: "22:05", durationMinutes: 15, action_ar: "كتابة يومية تأملية (مختصرة لهذا الروتين)", action_en: "Reflective journaling (shortened for this routine)", linkedHabitId: "learning_daily_journaling" },
      { time: "22:20", durationMinutes: 10, action_ar: "يوميات شكر لله", action_en: "Gratitude journal to God", linkedHabitId: "spiritual_gratitude_journal" },
      { time: "22:30", durationMinutes: 5, action_ar: "دعاء قبل النوم", action_en: "Bedtime supplication", linkedHabitId: "spiritual_night_dua" },
    ],
    bestFor: ["يميل للعمق الروحاني والفكري معًا", "مستعد لمساء طويل ومتأنٍّ"],
    icon: "🦉",
    xpReward: 60,
  },

  // warmup: "التوازن المسائي يعني ألا تُهمل نفسك من أجل الآخرين، ولا العكس"
  // completion: "لمست روحك، جسمك، عقلك، ومن تحب — مساء متوازن نادر"
  {
    id: "routine_evening_balance",
    title_ar: "روتين التوازن المسائي",
    title_en: "The Evening Balance Routine",
    description_ar: "مساء يوزّع الوقت بحكمة بين الذكر، الوقت العائلي (إن أمكن)، القراءة، والراحة، قبل تخطيط الغد",
    description_en: "An evening wisely distributing time between remembrance, family time when possible, reading, and rest, before planning tomorrow",
    category: "social",
    difficulty: "expert",
    minLevel: 60,
    totalMinutes: 70,
    steps: [
      { time: "20:00", durationMinutes: 15, action_ar: "أذكار المساء", action_en: "Evening remembrance", linkedHabitId: "spiritual_evening_azkar" },
      { time: "20:15", durationMinutes: 15, action_ar: "وقت جودة مع من تربّيهم أو تعيش معهم (إن أمكن)", action_en: "Quality time with those you live with or raise, when possible", linkedHabitId: "social_daily_quality_time_children" },
      { time: "20:30", durationMinutes: 15, action_ar: "القراءة قبل النوم", action_en: "Reading before sleep", linkedHabitId: "learning_reading_before_sleep" },
      { time: "20:45", durationMinutes: 10, action_ar: "جلسة استرخاء", action_en: "Relaxation session", linkedHabitId: "health_ten_min_relaxation" },
      { time: "20:55", durationMinutes: 10, action_ar: "ترتيب قائمة مهام الغد", action_en: "Prepare tomorrow's to-do list", linkedHabitId: "work_tomorrow_todo" },
      { time: "21:05", durationMinutes: 5, action_ar: "دعاء قبل النوم", action_en: "Bedtime supplication", linkedHabitId: "spiritual_night_dua" },
    ],
    bestFor: ["يريد توازنًا مسائيًا شاملًا لا تركيزًا أحاديًا", "لديه وقت مسائي واسع"],
    icon: "⚖️",
    xpReward: 64,
  },
];
