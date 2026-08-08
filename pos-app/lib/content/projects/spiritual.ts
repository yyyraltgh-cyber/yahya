import type { ProjectTemplate } from "../types";

/**
 * 6 long-term spiritual journeys (durationDays ranging 21-90), each with
 * progressive milestones and a final reward. Milestone days are strictly
 * increasing and fall within durationDays; badges are deterministic
 * completion markers (not randomized), consistent with the project's
 * earlier rejection of any chance-based reward mechanic.
 * successStories are generic, unattributed motivational vignettes — not
 * claims about real individuals.
 */
export const spiritualProjects: ProjectTemplate[] = [
  {
    id: "project_juz_amma_memorization",
    title_ar: "مشروع حفظ جزء عمّ",
    title_en: "Juz Amma Memorization Project",
    description_ar: "رحلة 30 يومًا لحفظ جزء عمّ كاملاً، بوتيرة يومية هادئة ومراجعة منتظمة",
    description_en: "A 30-day journey to fully memorize Juz Amma, at a calm daily pace with regular review",
    category: "spiritual",
    difficulty: "beginner",
    minLevel: 1,
    durationDays: 30,
    dailyCommitmentMinutes: 20,
    milestones: [
      { day: 7, title_ar: "حفظ أول خمس سور قصار", title_en: "Memorized the first five short surahs", reward: { xp: 30, badge: "بداية الحفظ" } },
      { day: 14, title_ar: "منتصف الجزء محفوظ", title_en: "Halfway through the juz", targetValue: 50, reward: { xp: 40, badge: "نصف الطريق" } },
      { day: 22, title_ar: "معظم الجزء محفوظ مع مراجعة ثابتة", title_en: "Most of the juz memorized with steady review", reward: { xp: 45, badge: "قارب الإتمام" } },
      { day: 30, title_ar: "حفظ جزء عمّ كاملاً", title_en: "Complete Juz Amma memorized", targetValue: 100, reward: { xp: 60, badge: "حافظ جزء عمّ" } },
    ],
    finalReward: { xp: 150, badge: "🏅 حافظ جزء عمّ", title_ar: "حافظ" },
    icon: "📗",
    successStories: [
      "بدأ أحدهم بسورة واحدة يوميًا فقط، وأنهى الجزء كاملاً قبل نهاية الشهر بيومين",
      "من حافظ على المراجعة اليومية رغم انشغاله، وجد الحفظ يثبت أسرع مما توقع",
    ],
  },
  {
    id: "project_first_full_quran_read",
    title_ar: "مشروع الختمة الأولى",
    title_en: "First Complete Qur'an Read Project",
    description_ar: "رحلة 60 يومًا لختم القرآن الكريم كاملاً بقراءة يومية منتظمة",
    description_en: "A 60-day journey to complete a full reading of the Qur'an through steady daily reading",
    category: "spiritual",
    difficulty: "intermediate",
    minLevel: 15,
    durationDays: 60,
    dailyCommitmentMinutes: 25,
    milestones: [
      { day: 15, title_ar: "ربع القرآن قراءة", title_en: "A quarter of the Qur'an read", targetValue: 25, reward: { xp: 40, badge: "ربع الختمة" } },
      { day: 30, title_ar: "نصف القرآن قراءة", title_en: "Half the Qur'an read", targetValue: 50, reward: { xp: 50, badge: "نصف الختمة" } },
      { day: 45, title_ar: "ثلاثة أرباع القرآن قراءة", title_en: "Three quarters of the Qur'an read", targetValue: 75, reward: { xp: 55, badge: "قارب الختم" } },
      { day: 60, title_ar: "ختم القرآن الكريم كاملاً", title_en: "Completed a full reading of the Qur'an", targetValue: 100, reward: { xp: 80, badge: "ختمة كاملة" } },
    ],
    finalReward: { xp: 200, badge: "🏅 صاحب الختمة الأولى", title_ar: "خاتم" },
    icon: "📖",
    successStories: [
      "من التزم بصفحتين يوميًا فقط، وجد نفسه يختم القرآن لأول مرة في حياته",
      "الانتظام البطيء تفوق على محاولات سابقة سريعة انقطعت خلال أيام",
    ],
  },
  {
    id: "project_forty_days_qiyam",
    title_ar: "مشروع أربعين يومًا من قيام الليل",
    title_en: "Forty Days of Night Prayer Project",
    description_ar: "تحدٍ روحاني لمدة 40 يومًا للمحافظة على قيام الليل، ولو بركعات قليلة كل ليلة",
    description_en: "A 40-day spiritual challenge to maintain night prayer, even with just a few rak'ahs each night",
    category: "spiritual",
    difficulty: "advanced",
    minLevel: 35,
    durationDays: 40,
    dailyCommitmentMinutes: 20,
    milestones: [
      { day: 10, title_ar: "عشرة أيام متتالية من القيام", title_en: "Ten consecutive nights of prayer", reward: { xp: 45, badge: "بداية ثابتة" } },
      { day: 20, title_ar: "نصف الرحلة بثبات", title_en: "Halfway through, staying consistent", reward: { xp: 55, badge: "نصف الرحلة" } },
      { day: 30, title_ar: "ثلاثون ليلة من القيام", title_en: "Thirty nights of night prayer", reward: { xp: 60, badge: "عزيمة راسخة" } },
      { day: 40, title_ar: "أربعون يومًا كاملة من القيام", title_en: "Forty complete days of night prayer", reward: { xp: 75, badge: "قائم الليل" } },
    ],
    finalReward: { xp: 220, badge: "🏅 قائم الليل الأربعيني", title_ar: "قائم الليل" },
    icon: "🌌",
    successStories: [
      "من بدأ بركعتين فقط، وجد نفسه بعد أسابيع يتطلع لهذا الوقت الهادئ كل ليلة",
      "الأيام الأصعب كانت في المنتصف — من صبر فيها، وجد الثبات بعدها أسهل بكثير",
    ],
  },
  {
    id: "project_ninety_day_charity_habit",
    title_ar: "مشروع بناء عادة الصدقة",
    title_en: "Building a Charity Habit Project",
    description_ar: "رحلة 90 يومًا لترسيخ عادة الصدقة اليومية، ولو كانت يسيرة، حتى تصبح جزءًا من الطبع",
    description_en: "A 90-day journey to establish a daily charity habit, however small, until it becomes second nature",
    category: "spiritual",
    difficulty: "beginner",
    minLevel: 1,
    durationDays: 90,
    dailyCommitmentMinutes: 5,
    milestones: [
      { day: 21, title_ar: "ثلاثة أسابيع من الصدقة اليومية", title_en: "Three weeks of daily charity", reward: { xp: 30, badge: "بداية العطاء" } },
      { day: 45, title_ar: "نصف الرحلة بعطاء منتظم", title_en: "Halfway through with regular giving", reward: { xp: 40, badge: "عطاء متجذر" } },
      { day: 70, title_ar: "أغلب الرحلة اكتملت بثبات", title_en: "Most of the journey completed steadily", reward: { xp: 45, badge: "قريب من الهدف" } },
      { day: 90, title_ar: "تسعون يومًا من الصدقة المتواصلة", title_en: "Ninety days of continuous charity", reward: { xp: 60, badge: "صاحب عادة العطاء" } },
    ],
    finalReward: { xp: 175, badge: "🏅 صاحب عادة العطاء الدائمة", title_ar: "المعطاء" },
    icon: "🪙",
    successStories: [
      "من بدأ بمبلغ رمزي يوميًا، وجد العطاء يصبح جزءًا طبيعيًا من روتينه دون تفكير",
      "التغيير لم يكن في المبلغ، بل في الانتظام — هذا ما صنع الفرق فعليًا",
    ],
  },
  {
    id: "project_names_of_god_journey",
    title_ar: "رحلة تدبر أسماء الله الحسنى",
    title_en: "Reflecting on the Names of God Journey",
    description_ar: "رحلة 50 يومًا للتأمل العميق في أسماء الله الحسنى، اسمين كل يومين، وربط معانيها بالحياة اليومية",
    description_en: "A 50-day journey reflecting deeply on the beautiful names of God, two names every two days, connecting their meanings to daily life",
    category: "spiritual",
    difficulty: "intermediate",
    minLevel: 15,
    durationDays: 50,
    dailyCommitmentMinutes: 15,
    milestones: [
      { day: 12, title_ar: "تدبر أول اثني عشر اسمًا", title_en: "Reflected on the first twelve names", reward: { xp: 35, badge: "بداية التدبر" } },
      { day: 25, title_ar: "نصف الأسماء الحسنى تم تدبرها", title_en: "Half of the beautiful names reflected upon", reward: { xp: 45, badge: "نصف الرحلة" } },
      { day: 38, title_ar: "معظم الأسماء الحسنى تم تدبرها", title_en: "Most of the beautiful names reflected upon", reward: { xp: 50, badge: "قارب الإتمام" } },
      { day: 50, title_ar: "تدبر جميع أسماء الله الحسنى", title_en: "Reflected on all the beautiful names of God", reward: { xp: 70, badge: "متدبر الأسماء الحسنى" } },
    ],
    finalReward: { xp: 190, badge: "🏅 متدبر الأسماء الحسنى", title_ar: "المتدبر" },
    icon: "✨",
    successStories: [
      "من خصص عشر دقائق فقط لكل اسمين، وجد نظرته لله ولحياته تتغير تدريجيًا",
      "التدبر البطيء ترك أثرًا أعمق من قراءة الأسماء كلها دفعة واحدة في السابق",
    ],
  },
  {
    id: "project_comprehensive_self_purification",
    title_ar: "رحلة تزكية النفس الشاملة",
    title_en: "Comprehensive Self-Purification Journey",
    description_ar: "رحلة 90 يومًا متكاملة تجمع القرآن، القيام، الصدقة، وتزكية الأخلاق في مسار واحد عميق",
    description_en: "A comprehensive 90-day journey combining Qur'an, night prayer, charity, and character refinement in one deep path",
    category: "spiritual",
    difficulty: "expert",
    minLevel: 60,
    durationDays: 90,
    dailyCommitmentMinutes: 45,
    milestones: [
      { day: 20, title_ar: "عشرون يومًا من الالتزام المتكامل", title_en: "Twenty days of integrated commitment", reward: { xp: 55, badge: "أساس متين" } },
      { day: 45, title_ar: "نصف الرحلة، وتحول ملموس في الروتين اليومي", title_en: "Halfway through, with a tangible shift in daily routine", reward: { xp: 70, badge: "تحول حقيقي" } },
      { day: 70, title_ar: "معظم الرحلة اكتملت، والعادات أصبحت طبعًا", title_en: "Most of the journey complete, habits becoming second nature", reward: { xp: 80, badge: "قرب الاكتمال" } },
      { day: 90, title_ar: "رحلة تزكية شاملة اكتملت بتكامل نادر", title_en: "A comprehensive purification journey completed with rare integration", reward: { xp: 100, badge: "المزكّي" } },
    ],
    finalReward: { xp: 280, badge: "🏅 صاحب رحلة التزكية الشاملة", title_ar: "المزكّي الشامل" },
    icon: "🕋",
    successStories: [
      "من التزم بالمسار المتكامل رغم صعوبته، وجد أثرًا لا يقارَن بأي مسار جزئي سابق",
      "التكامل بين الجوانب المختلفة هو ما صنع الفرق — لا التركيز على جانب واحد فقط",
    ],
  },
];
