import type { RoutineTemplate } from "../types";

/**
 * 15 morning routines, spanning 4 difficulty tiers. Each routine mixes
 * direct actions (action_ar only) with steps linked to real habit ids from
 * the 200-habit library (linkedHabitId) — every linked id below is verified
 * against the actual habits/*.ts files, not invented.
 *
 * RoutineTemplate does not yet declare warmup/completion message fields,
 * so per-routine motivational framing is kept as a comment directly above
 * each object rather than as an object property, to avoid a TypeScript
 * excess-property error until (if) the type is deliberately extended.
 * `bestFor` (already part of RoutineTemplate) covers target-audience needs.
 */
export const morningRoutines: RoutineTemplate[] = [
  // ===== Beginner (minLevel 1, 10-20 min) =====

  // warmup: "خطوة صغيرة الآن، تصنع فرقًا كبيرًا في يومك"
  // completion: "بدأت يومك بثبات — هذا أهم من الكمال"
  {
    id: "routine_simple_fajr",
    title_ar: "روتين الفجر البسيط",
    title_en: "Simple Fajr Routine",
    description_ar: "خطوات قليلة وواضحة بعد صلاة الفجر، بلا تعقيد، لمن يبدأ للتو",
    description_en: "A few clear steps after Fajr prayer, uncomplicated, for someone just starting out",
    category: "spiritual",
    difficulty: "beginner",
    minLevel: 1,
    totalMinutes: 15,
    steps: [
      { time: "05:30", durationMinutes: 15, action_ar: "أذكار الصباح", action_en: "Morning remembrance", linkedHabitId: "spiritual_morning_azkar" },
    ],
    bestFor: ["من يبدأ للتو", "يبحث عن بساطة"],
    icon: "🌅",
    xpReward: 20,
  },

  // warmup: "لا داعي للاستعجال — صباح هادئ يستحق وقته"
  // completion: "امتلأ يومك بالهدوء قبل أن يبدأ الازدحام"
  {
    id: "routine_calm_morning",
    title_ar: "روتين الصباح الهادئ",
    title_en: "Calm Morning Routine",
    description_ar: "بداية هادئة تمنح الجسم والعقل لحظة صفاء قبل انطلاق اليوم",
    description_en: "A calm start giving body and mind a moment of clarity before the day begins",
    category: "health",
    difficulty: "beginner",
    minLevel: 1,
    totalMinutes: 12,
    steps: [
      { time: "07:00", durationMinutes: 2, action_ar: "شرب كوب ماء عند الاستيقاظ", action_en: "Drink water upon waking", linkedHabitId: "health_water_on_waking" },
      { time: "07:02", durationMinutes: 5, action_ar: "تمارين تمدد خفيفة", action_en: "Light stretching", linkedHabitId: "health_five_min_stretch" },
      { time: "07:07", durationMinutes: 5, action_ar: "جلوس هادئ مع نفس عميق بلا هاتف", action_en: "Quiet sitting with deep breathing, phone-free" },
    ],
    bestFor: ["يبحث عن هدوء", "متعب من الصباحات المزدحمة"],
    icon: "🌤️",
    xpReward: 18,
  },

  // warmup: "أول ساعة تحدد نمط بقية يومك — ابدأها بوعي"
  // completion: "استيقظت بتدرج، لا بصدمة — هذا يصنع فرقًا"
  {
    id: "routine_gradual_wakeup",
    title_ar: "روتين الاستيقاظ المتدرج",
    title_en: "Gradual Wake-Up Routine",
    description_ar: "استيقاظ تدريجي بلا هاتف فور الفتح، مع خطوات بسيطة تُرتّب اليوم قبل انطلاقه",
    description_en: "A gradual wake-up without immediately reaching for the phone, with simple steps to organize the day before it starts",
    category: "work",
    difficulty: "beginner",
    minLevel: 1,
    totalMinutes: 13,
    steps: [
      { time: "07:00", durationMinutes: 1, action_ar: "عدم فتح الهاتف فور الاستيقاظ", action_en: "Avoid the phone immediately upon waking", linkedHabitId: "work_no_phone_first_hour" },
      { time: "07:01", durationMinutes: 2, action_ar: "شرب كوب ماء", action_en: "Drink a glass of water", linkedHabitId: "health_water_on_waking" },
      { time: "07:03", durationMinutes: 5, action_ar: "تمدد خفيف لإيقاظ الجسم", action_en: "Light stretching to wake the body", linkedHabitId: "health_five_min_stretch" },
      { time: "07:08", durationMinutes: 5, action_ar: "كتابة ثلاث أولويات لليوم", action_en: "Write three priorities for the day", linkedHabitId: "work_three_priorities" },
    ],
    bestFor: ["يبدأ يومه بالهاتف كثيرًا", "يبحث عن نظام صباحي بسيط"],
    icon: "🌄",
    xpReward: 20,
  },

  // warmup: "بعد الفجر، ساعة بركة — لا تُضيّعها بلا وعي"
  // completion: "استثمرت وقت البركة — يومك بدأ بخير حقيقي"
  {
    id: "routine_post_fajr",
    title_ar: "روتين ما بعد الفجر",
    title_en: "Post-Fajr Routine",
    description_ar: "الاستفادة من الوقت المبارك بعد صلاة الفجر بأذكار وقراءة قصيرة من القرآن",
    description_en: "Making use of the blessed time after Fajr with remembrance and a short Qur'an reading",
    category: "spiritual",
    difficulty: "beginner",
    minLevel: 1,
    totalMinutes: 20,
    steps: [
      { time: "05:30", durationMinutes: 15, action_ar: "أذكار الصباح", action_en: "Morning remembrance", linkedHabitId: "spiritual_morning_azkar" },
      { time: "05:45", durationMinutes: 5, action_ar: "قراءة صفحة من القرآن", action_en: "Read a page of the Qur'an", linkedHabitId: "spiritual_daily_quran_page" },
    ],
    bestFor: ["يصلي الفجر ويريد استثمار الوقت بعده", "يبحث عن بداية روحانية بسيطة"],
    icon: "🕌",
    xpReward: 22,
  },

  // ===== Intermediate (minLevel 15, 20-40 min) =====

  // warmup: "ساعة تركيز مبكرة تساوي أربع ساعات مشتتة لاحقًا"
  // completion: "أنجزت أهم مهمة في يومك قبل أن يبدأ الزحام"
  {
    id: "routine_productive_deep_work",
    title_ar: "الروتين المنتج الصباحي",
    title_en: "The Productive Morning Routine",
    description_ar: "بداية تجمع بين التركيز الذهني العميق والتخطيط الواعي قبل انشغال اليوم",
    description_en: "A start combining deep mental focus and mindful planning before the day's busyness sets in",
    category: "work",
    difficulty: "intermediate",
    minLevel: 15,
    totalMinutes: 35,
    steps: [
      { time: "06:30", durationMinutes: 5, action_ar: "التخطيط لليوم قبل بدئه", action_en: "Plan the day before starting it", linkedHabitId: "work_plan_before_starting" },
      { time: "06:35", durationMinutes: 5, action_ar: "كتابة ثلاث أولويات لليوم", action_en: "Write three priorities for the day", linkedHabitId: "work_three_priorities" },
      { time: "06:40", durationMinutes: 25, action_ar: "ساعة عمل عميق مبكرة (مختصرة لهذا الروتين)", action_en: "An early deep-work block (shortened for this routine)", linkedHabitId: "work_daily_deep_work_hour" },
    ],
    bestFor: ["مهني يريد إنجاز الأهم أولًا", "يعمل بتركيز أفضل صباحًا"],
    icon: "🎯",
    xpReward: 32,
  },

  // warmup: "المذاكرة الصباحية أثبت من مذاكرة منتصف الليل"
  // completion: "راجعت وخططت قبل أن يبدأ اليوم الدراسي — تقدّم حقيقي"
  {
    id: "routine_excelling_student",
    title_ar: "روتين الطالب المتفوق",
    title_en: "The Excelling Student Routine",
    description_ar: "مراجعة وقراءة وتخطيط صباحي يهيئ الذهن لاستيعاب أفضل خلال اليوم الدراسي",
    description_en: "Morning review, reading, and planning that prepares the mind for better retention during the school day",
    category: "learning",
    difficulty: "intermediate",
    minLevel: 15,
    totalMinutes: 30,
    steps: [
      { time: "06:00", durationMinutes: 2, action_ar: "شرب كوب ماء عند الاستيقاظ", action_en: "Drink water upon waking", linkedHabitId: "health_water_on_waking" },
      { time: "06:02", durationMinutes: 15, action_ar: "قراءة 10 صفحات", action_en: "Read 10 pages", linkedHabitId: "learning_ten_pages_daily" },
      { time: "06:17", durationMinutes: 8, action_ar: "مراجعة الملاحظات اليومية", action_en: "Review daily notes", linkedHabitId: "learning_review_notes" },
      { time: "06:25", durationMinutes: 5, action_ar: "كتابة ثلاث أولويات لليوم الدراسي", action_en: "Write three priorities for the school day", linkedHabitId: "work_three_priorities" },
    ],
    bestFor: ["طالب", "يستعد لامتحانات أو دراسة مكثفة"],
    icon: "🎓",
    xpReward: 30,
  },

  // warmup: "جسمك النشيط صباحًا، يخدم ذهنك طوال اليوم"
  // completion: "بدأت يومك بالحركة — أثرها سيلازمك حتى المساء"
  {
    id: "routine_athletic_morning",
    title_ar: "الروتين الرياضي الصباحي",
    title_en: "The Athletic Morning Routine",
    description_ar: "بداية نشيطة تجمع الترطيب والحركة والتغذية المتوازنة",
    description_en: "An energetic start combining hydration, movement, and balanced nutrition",
    category: "health",
    difficulty: "intermediate",
    minLevel: 15,
    totalMinutes: 40,
    steps: [
      { time: "06:00", durationMinutes: 2, action_ar: "شرب كوب ماء عند الاستيقاظ", action_en: "Drink water upon waking", linkedHabitId: "health_water_on_waking" },
      { time: "06:02", durationMinutes: 5, action_ar: "تمدد قبل الحركة", action_en: "Stretch before activity", linkedHabitId: "health_five_min_stretch" },
      { time: "06:07", durationMinutes: 18, action_ar: "المشي أو نشاط بدني (مختصر لهذا الروتين)", action_en: "Walking or physical activity (shortened for this routine)", linkedHabitId: "health_ten_min_walk" },
      { time: "06:25", durationMinutes: 15, action_ar: "إفطار متوازن", action_en: "Balanced breakfast", linkedHabitId: "health_balanced_breakfast" },
    ],
    bestFor: ["نشيط بدنيًا", "يريد بدء يومه بالطاقة"],
    icon: "🏃",
    xpReward: 34,
  },

  // warmup: "دقائق تخطيط الآن توفر ساعات تخبط لاحقًا"
  // completion: "دخلت يومك المهني بخطة واضحة، لا بتردد"
  {
    id: "routine_busy_professional",
    title_ar: "الروتين المهني السريع",
    title_en: "The Busy Professional Routine",
    description_ar: "روتين مكثف وفعّال لمن لديه وقت صباحي محدود لكنه يريد بداية منظمة",
    description_en: "A tight, effective routine for someone with limited morning time who still wants an organized start",
    category: "work",
    difficulty: "intermediate",
    minLevel: 15,
    totalMinutes: 22,
    steps: [
      { time: "06:45", durationMinutes: 2, action_ar: "شرب كوب ماء عند الاستيقاظ", action_en: "Drink water upon waking", linkedHabitId: "health_water_on_waking" },
      { time: "06:47", durationMinutes: 5, action_ar: "التخطيط لليوم قبل بدئه", action_en: "Plan the day before starting it", linkedHabitId: "work_plan_before_starting" },
      { time: "06:52", durationMinutes: 15, action_ar: "إفطار سريع ومتوازن", action_en: "A quick, balanced breakfast", linkedHabitId: "health_balanced_breakfast" },
    ],
    bestFor: ["وقت صباحي محدود", "جدول مزدحم"],
    icon: "⏱️",
    xpReward: 26,
  },

  // ===== Advanced (minLevel 35, 40-60 min) =====

  // warmup: "الفجر الكامل ليس عبئًا — إنه استثمار في بقية يومك"
  // completion: "جمعت الروح والجسد والعقل في ساعة واحدة — بداية متكاملة"
  {
    id: "routine_full_fajr",
    title_ar: "روتين الفجر الكامل",
    title_en: "The Complete Fajr Routine",
    description_ar: "بداية متكاملة تجمع الذكر والقرآن والحركة والتخطيط بعد صلاة الفجر",
    description_en: "A well-rounded start combining remembrance, Qur'an, movement, and planning after Fajr",
    category: "spiritual",
    difficulty: "advanced",
    minLevel: 35,
    totalMinutes: 55,
    steps: [
      { time: "05:30", durationMinutes: 15, action_ar: "أذكار الصباح", action_en: "Morning remembrance", linkedHabitId: "spiritual_morning_azkar" },
      { time: "05:45", durationMinutes: 10, action_ar: "صلاة الضحى", action_en: "Duha prayer", linkedHabitId: "spiritual_duha_prayer" },
      { time: "05:55", durationMinutes: 10, action_ar: "تلاوة بتدبر (مختصرة لهذا الروتين)", action_en: "Reflective recitation (shortened for this routine)", linkedHabitId: "spiritual_tadabbur_session" },
      { time: "06:05", durationMinutes: 10, action_ar: "المشي أو حركة بدنية", action_en: "Walking or physical movement", linkedHabitId: "health_ten_min_walk" },
      { time: "06:15", durationMinutes: 10, action_ar: "التخطيط لليوم قبل بدئه", action_en: "Plan the day before starting it", linkedHabitId: "work_plan_before_starting" },
    ],
    bestFor: ["يريد بداية متكاملة روحيًا وجسديًا وعمليًا", "لديه وقت صباحي مرن"],
    icon: "🕋",
    xpReward: 46,
  },

  // warmup: "القرار الأول في يومك يحدد جودة كل قرار بعده"
  // completion: "دخلت يومك بوضوح استراتيجي، لا بردود أفعال"
  {
    id: "routine_business_leader",
    title_ar: "روتين صاحب المشروع",
    title_en: "The Business Owner Routine",
    description_ar: "بداية تجمع التخطيط والتركيز العميق مع لحظة مراجعة سريعة للأولويات المالية أو الإدارية",
    description_en: "A start combining planning and deep focus with a quick review of financial or managerial priorities",
    category: "work",
    difficulty: "advanced",
    minLevel: 35,
    totalMinutes: 50,
    steps: [
      { time: "06:00", durationMinutes: 5, action_ar: "التخطيط لليوم قبل بدئه", action_en: "Plan the day before starting it", linkedHabitId: "work_plan_before_starting" },
      { time: "06:05", durationMinutes: 5, action_ar: "كتابة ثلاث أولويات لليوم", action_en: "Write three priorities for the day", linkedHabitId: "work_three_priorities" },
      { time: "06:10", durationMinutes: 30, action_ar: "عمل عميق مبكر على القرار الأهم", action_en: "Early deep work on the most important decision", linkedHabitId: "work_daily_deep_work_hour" },
      { time: "06:40", durationMinutes: 10, action_ar: "مراجعة سريعة للأرقام أو المهام المعلّقة", action_en: "A quick review of numbers or pending tasks" },
    ],
    bestFor: ["صاحب مشروع أو مدير", "يحتاج وضوحًا قبل مواجهة يوم مزدحم"],
    icon: "💼",
    xpReward: 44,
  },

  // warmup: "الإبداع يزور من يستقبله بذهن صافٍ، لا من يستعجله"
  // completion: "أطلقت أفكارك قبل أن يزدحم يومك بأصوات أخرى"
  {
    id: "routine_creative",
    title_ar: "روتين المبدع",
    title_en: "The Creative Routine",
    description_ar: "بداية تُخصَّص للقراءة والكتابة الحرة وتدوين الأفكار قبل أن يشتت اليوم الانتباه",
    description_en: "A start dedicated to reading, free writing, and idea logging before the day scatters your attention",
    category: "learning",
    difficulty: "advanced",
    minLevel: 35,
    totalMinutes: 45,
    steps: [
      { time: "06:15", durationMinutes: 15, action_ar: "قراءة صباحية ملهمة", action_en: "Inspiring morning reading", linkedHabitId: "learning_ten_pages_daily" },
      { time: "06:30", durationMinutes: 20, action_ar: "كتابة إبداعية حرة", action_en: "Free creative writing" },
      { time: "06:50", durationMinutes: 5, action_ar: "تدوين فكرة إبداعية", action_en: "Logging a creative idea", linkedHabitId: "learning_creative_idea_log" },
      { time: "06:55", durationMinutes: 5, action_ar: "كتابة يومية سريعة", action_en: "A quick journaling entry", linkedHabitId: "learning_daily_journaling" },
    ],
    bestFor: ["كاتب أو مصمم أو صاحب مشروع إبداعي", "يجد أفضل أفكاره في الصباح"],
    icon: "🎨",
    xpReward: 42,
  },

  // warmup: "مهارتك اليوم، فرصتك غدًا — استثمر فيها كل صباح"
  // completion: "طوّرت نفسك ومهنتك قبل أن يبدأ زحام العمل"
  {
    id: "routine_professional_specialist",
    title_ar: "روتين المتخصص المهني",
    title_en: "The Professional Specialist Routine",
    description_ar: "بداية توازن بين تطوير المهارات، العمل المركّز، وبناء العلاقات المهنية",
    description_en: "A start balancing skill development, focused work, and professional relationship building",
    category: "work",
    difficulty: "advanced",
    minLevel: 35,
    totalMinutes: 50,
    steps: [
      { time: "06:00", durationMinutes: 2, action_ar: "شرب كوب ماء عند الاستيقاظ", action_en: "Drink water upon waking", linkedHabitId: "health_water_on_waking" },
      { time: "06:02", durationMinutes: 30, action_ar: "تطوير مهارة مهنية (مختصر لهذا الروتين)", action_en: "Professional skill development (shortened for this routine)", linkedHabitId: "work_regular_skill_development" },
      { time: "06:32", durationMinutes: 15, action_ar: "عمل عميق مبكر", action_en: "Early deep work", linkedHabitId: "work_daily_deep_work_hour" },
      { time: "06:47", durationMinutes: 3, action_ar: "رسالة تواصل مهني سريعة", action_en: "A quick professional networking message" },
    ],
    bestFor: ["متخصص يريد التطور المستمر", "يوازن بين التعلم والإنجاز"],
    icon: "🛠️",
    xpReward: 44,
  },

  // ===== Expert (minLevel 60, 60-90 min) =====

  // warmup: "تسعون دقيقة موزّعة بحكمة، لا مكدّسة بلا نَفَس"
  // completion: "قُدت يومك بالروح والعقل والجسد معًا — قيادة حقيقية تبدأ من الداخل"
  {
    id: "routine_complete_leader",
    title_ar: "روتين القائد الشامل",
    title_en: "The Complete Leader Routine",
    description_ar: "بداية موزّعة بتوازن بين التهجد والذكر والتدبر والحركة والقرار الاستراتيجي، بلا استعجال",
    description_en: "A balanced start distributed across night prayer, remembrance, reflection, movement, and strategic decision-making, without rushing",
    category: "spiritual",
    difficulty: "expert",
    minLevel: 60,
    totalMinutes: 90,
    steps: [
      { time: "04:45", durationMinutes: 30, action_ar: "تهجد ممتد قبل الفجر (مختصر لهذا الروتين)", action_en: "Extended pre-dawn night prayer (shortened for this routine)", linkedHabitId: "spiritual_extended_tahajjud" },
      { time: "05:30", durationMinutes: 15, action_ar: "أذكار الصباح", action_en: "Morning remembrance", linkedHabitId: "spiritual_morning_azkar" },
      { time: "05:45", durationMinutes: 15, action_ar: "تلاوة بتدبر (مختصرة لهذا الروتين)", action_en: "Reflective recitation (shortened for this routine)", linkedHabitId: "spiritual_tadabbur_session" },
      { time: "06:00", durationMinutes: 15, action_ar: "تمارين مقاومة أو حركة بدنية (مختصرة لهذا الروتين)", action_en: "Resistance training or physical movement (shortened for this routine)", linkedHabitId: "health_resistance_training_4days" },
      { time: "06:15", durationMinutes: 15, action_ar: "اتخاذ قرار استراتيجي مدروس ليومك (مختصر لهذا الروتين)", action_en: "Making a well-considered strategic decision for your day (shortened for this routine)", linkedHabitId: "work_strategic_decision_making" },
    ],
    bestFor: ["قائد أو صاحب مسؤولية كبيرة", "ملتزم بروتين صباحي طويل ومستقر"],
    icon: "👑",
    xpReward: 78,
  },

  // warmup: "العقل الباحث يحتاج صباحًا هادئًا قبل ضجيج اليوم"
  // completion: "بحثت وكتبت ونظّمت قبل أن يبدأ الآخرون يومهم"
  {
    id: "routine_scholar_researcher",
    title_ar: "روتين الأستاذ والباحث",
    title_en: "The Scholar/Researcher Routine",
    description_ar: "بداية تجمع البحث والكتابة وتنظيم المعرفة والتحضير للتدريس في كتلة صباحية هادئة",
    description_en: "A start combining research, writing, knowledge organization, and teaching preparation in one quiet morning block",
    category: "learning",
    difficulty: "expert",
    minLevel: 60,
    totalMinutes: 75,
    steps: [
      { time: "06:00", durationMinutes: 25, action_ar: "بحث وكتابة ملخص بحثي (مختصر لهذا الروتين)", action_en: "Research and summary writing (shortened for this routine)", linkedHabitId: "learning_monthly_research_summary" },
      { time: "06:25", durationMinutes: 20, action_ar: "تحديث نظام المعرفة الشخصي (مختصر لهذا الروتين)", action_en: "Updating the personal knowledge system (shortened for this routine)", linkedHabitId: "learning_build_second_brain" },
      { time: "06:45", durationMinutes: 15, action_ar: "تنظيم ملاحظات (مختصر لهذا الروتين)", action_en: "Organizing notes (shortened for this routine)", linkedHabitId: "learning_organized_note_system" },
      { time: "07:00", durationMinutes: 15, action_ar: "تحضير مادة الدرس أو المحاضرة القادمة", action_en: "Preparing the next lesson or lecture material" },
    ],
    bestFor: ["أكاديمي أو باحث أو مدرّس", "يحتاج صباحًا مخصصًا للعمل الفكري العميق"],
    icon: "🔬",
    xpReward: 68,
  },

  // warmup: "التوازن ليس رفاهية — إنه أساس استمرارك على المدى الطويل"
  // completion: "لمست كل محاور حياتك في صباح واحد — توازن نادر يستحق الاستمرار"
  {
    id: "routine_balanced_life",
    title_ar: "روتين الحياة المتوازنة",
    title_en: "The Balanced Life Routine",
    description_ar: "بداية تلمس المحاور الخمسة كلها بجرعات معتدلة: روحاني، صحي، معرفي، اجتماعي، وعملي",
    description_en: "A start touching all five life domains in moderate doses: spiritual, physical, intellectual, social, and practical",
    category: "spiritual",
    difficulty: "expert",
    minLevel: 60,
    totalMinutes: 80,
    steps: [
      { time: "05:45", durationMinutes: 15, action_ar: "أذكار الصباح", action_en: "Morning remembrance", linkedHabitId: "spiritual_morning_azkar" },
      { time: "06:00", durationMinutes: 10, action_ar: "تمدد وحركة بدنية خفيفة (ممتدة قليلًا لهذا الروتين)", action_en: "Light stretching and movement (slightly extended for this routine)", linkedHabitId: "health_five_min_stretch" },
      { time: "06:10", durationMinutes: 10, action_ar: "قراءة صفحة من القرآن", action_en: "Reading a page of the Qur'an", linkedHabitId: "spiritual_daily_quran_page" },
      { time: "06:20", durationMinutes: 15, action_ar: "قراءة تطويرية", action_en: "Developmental reading", linkedHabitId: "learning_ten_pages_daily" },
      { time: "06:35", durationMinutes: 10, action_ar: "التواصل مع الوالدين", action_en: "Connecting with parents", linkedHabitId: "social_daily_parents_call" },
      { time: "06:45", durationMinutes: 10, action_ar: "التخطيط لليوم قبل بدئه", action_en: "Plan the day before starting it", linkedHabitId: "work_plan_before_starting" },
      { time: "06:55", durationMinutes: 10, action_ar: "لحظة صمت وتأمل بلا هدف محدد", action_en: "A moment of silence and reflection with no fixed agenda" },
    ],
    bestFor: ["يريد توازنًا حقيقيًا لا تركيزًا أحاديًا", "لديه وقت صباحي واسع ومستقر"],
    icon: "⚖️",
    xpReward: 72,
  },
];
