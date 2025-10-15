// ============================================
// Challenge Business Logic
// Location: src/utils/challengeLogic.js
//
// All the math and rules for challenges
// ============================================

// ============================================
// WALK CHALLENGE LOGIC
// ============================================

/**
 * Generate personalized walk plan based on assessment answers
 * 
 * @param {Object} answers - { frequency, duration }
 * @returns {Object} - { level, plan: { week1, week2, week3, week4 } }
 */
export const generateWalkPlan = (answers) => {
  // Score frequency (0-3)
  const frequencyScore = {
    'never': 0,
    '1-2': 1,
    '3-4': 2,
    '5+': 3
  }[answers.frequency] || 0;
  
  // Score duration (0-3)
  const durationScore = {
    '<10': 0,
    '10-20': 1,
    '20-30': 2,
    '30+': 3
  }[answers.duration] || 0;
  
  // Total score (0-6)
  const totalScore = frequencyScore + durationScore;
  
  // Determine level
  let level, plan;
  
  if (totalScore <= 2) {
    // Beginner
    level = 'beginner';
    plan = {
      week1: 5,
      week2: 10,
      week3: 15,
      week4: 20
    };
  } else if (totalScore <= 4) {
    // Intermediate
    level = 'intermediate';
    plan = {
      week1: 10,
      week2: 15,
      week3: 20,
      week4: 30
    };
  } else {
    // Advanced
    level = 'advanced';
    plan = {
      week1: 15,
      week2: 20,
      week3: 30,
      week4: 45
    };
  }
  
  return { level, plan };
};

/**
 * Get goal for a specific day
 */
export const getGoalForDay = (plan, day) => {
  if (day <= 7) return plan.week1;
  if (day <= 14) return plan.week2;
  if (day <= 21) return plan.week3;
  return plan.week4;
};

// ============================================
// DATE & DAY CALCULATIONS
// ============================================

/**
 * Calculate what day of challenge it is
 * 
 * @param {Date} startDate - Challenge start date
 * @returns {number} - Current day (1-30+)
 */
export const calculateCurrentDay = (startDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const diffTime = today - start;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays + 1; // Day 1, not Day 0
};

/**
 * Check if challenge has started yet
 */
export const hasStarted = (startDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  return today >= start;
};

/**
 * Get tomorrow's date (for "starts tomorrow" logic)
 */
export const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD
};

/**
 * Format date for display
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
};

// ============================================
// POINTS CALCULATION
// ============================================

/**
 * Calculate points for a check-in
 * 
 * @param {boolean} isOnTime - Is this check-in on time?
 * @param {boolean} isLate - Is this a late (yesterday) check-in?
 * @returns {number} - Points earned (0, 1, or 2)
 */
export const calculatePoints = (completed, isLate) => {
  if (!completed) return 0; // Answered NO = 0 points
  if (isLate) return 1;      // Late YES = 1 point
  return 2;                  // On-time YES = 2 points
};

/**
 * Check if user has graduated (50+ points)
 */
export const hasGraduated = (totalPoints) => {
  return totalPoints >= 50;
};

/**
 * Calculate points needed to graduate
 */
export const pointsNeededToGraduate = (totalPoints) => {
  return Math.max(0, 50 - totalPoints);
};

// ============================================
// BACKFILL LOGIC
// ============================================

/**
 * Determine if user can backfill yesterday
 * Rule: Can ONLY backfill if current streak is 0
 * 
 * @param {number} currentStreak - Current streak count
 * @param {number} currentDay - What day are we on?
 * @param {Function} hasCheckInFn - Function to check if day has check-in
 * @returns {boolean}
 */
export const canBackfillYesterday = (currentStreak, currentDay, hasCheckInFn) => {
  // Must be at least Day 2 (can't backfill before Day 1)
  if (currentDay < 2) return false;
  
  // Streak must be 0 (lost streak = get recovery chance)
  if (currentStreak !== 0) return false;
  
  // Yesterday must not already have a check-in
  const yesterday = currentDay - 1;
  if (hasCheckInFn(yesterday)) return false;
  
  return true;
};

// ============================================
// STREAK CALCULATION
// ============================================

/**
 * Calculate current streak from check-in history
 * 
 * @param {Array} checkIns - Array of check-in objects
 * @param {number} currentDay - Current day of challenge
 * @returns {number} - Current streak
 */
export const calculateStreak = (checkIns, currentDay) => {
  if (checkIns.length === 0) return 0;
  
  // Filter only completed (YES) check-ins
  const completedCheckIns = checkIns
    .filter(c => c.completed === true)
    .sort((a, b) => b.challenge_day - a.challenge_day); // Newest first
  
  if (completedCheckIns.length === 0) return 0;
  
  let streak = 0;
  let expectedDay = currentDay - 1; // Start from yesterday
  
  for (const checkIn of completedCheckIns) {
    if (checkIn.challenge_day === expectedDay) {
      streak++;
      expectedDay--;
    } else {
      // Gap found, streak ends
      break;
    }
  }
  
  return streak;
};

// ============================================
// COMPLETION STATUS
// ============================================

/**
 * Determine challenge status
 */
export const getChallengeStatus = (currentDay, totalPoints) => {
  if (currentDay <= 30) {
    return 'active';
  } else if (currentDay > 30 && totalPoints >= 50) {
    return 'completed';
  } else {
    return 'incomplete';
  }
};

/**
 * Generate final stats for completion
 */
export const generateFinalStats = (checkIns, totalPoints, startDate) => {
  const daysCompleted = checkIns.length;
  const daysSuccessful = checkIns.filter(c => c.completed).length;
  
  // Calculate longest streak
  let longestStreak = 0;
  let currentStreakCount = 0;
  
  const sortedCheckIns = [...checkIns].sort((a, b) => a.challenge_day - b.challenge_day);
  
  for (let i = 0; i < sortedCheckIns.length; i++) {
    if (sortedCheckIns[i].completed) {
      currentStreakCount++;
      longestStreak = Math.max(longestStreak, currentStreakCount);
    } else {
      currentStreakCount = 0;
    }
  }
  
  return {
    total_points: totalPoints,
    days_checked_in: daysCompleted,
    days_successful: daysSuccessful,
    longest_streak: longestStreak,
    graduated: totalPoints >= 50,
    completion_date: new Date().toISOString()
  };
};

// ============================================
// EDUCATIONAL TIPS (30 unique tips)
// ============================================

const WALK_TIPS = [
  "Walking after meals helps lower blood sugar levels and aids digestion.",
  "Morning walks expose you to natural light, which helps regulate your sleep cycle.",
  "Aim for a pace where you can talk but not sing - that's the perfect intensity.",
  "Walking on varied terrain (hills, grass, sand) engages more muscles.",
  "Swing your arms naturally to increase calorie burn by up to 10%.",
  "Walking backwards for short periods can strengthen different muscle groups.",
  "Stay hydrated - even mild dehydration can make walking feel harder.",
  "Good posture matters: keep your chin up and shoulders back.",
  "Walking in nature has been shown to reduce stress more than urban walking.",
  "Breaking your walk into 2-3 shorter sessions is just as beneficial as one long walk.",
  "Walking speed naturally increases as you get fitter - celebrate the progress!",
  "Comfortable, supportive shoes are your most important investment.",
  "Walking with a friend makes you 95% more likely to stick with it.",
  "Cold weather walking burns more calories as your body works to stay warm.",
  "Walking uphill builds more leg strength and endurance.",
  "Taking the stairs whenever possible adds to your daily walking goal.",
  "Walking helps maintain bone density, especially important as we age.",
  "Your breathing should feel slightly elevated but not gasping.",
  "Walking can be as effective as running for heart health.",
  "Track your steps - seeing progress is highly motivating!",
  "Walking reduces the risk of chronic diseases like diabetes and heart disease.",
  "Even a slow walk is better than sitting - any movement counts.",
  "Walking improves mood by releasing endorphins.",
  "Consistency matters more than intensity - show up every day.",
  "Walking strengthens your immune system.",
  "It's okay to start slow - you'll naturally speed up over time.",
  "Walking with proper form prevents injury and maximizes benefits.",
  "Music or podcasts can make walks more enjoyable.",
  "Walking outdoors provides vitamin D from sunlight.",
  "Celebrate every completed walk - you're building a lifelong habit!"
];

/**
 * Get tip for specific day
 */
export const getTipForDay = (day) => {
  const index = (day - 1) % WALK_TIPS.length;
  return WALK_TIPS[index];
};

// ============================================
// Export all functions
// ============================================
export default {
  // Walk-specific
  generateWalkPlan,
  getGoalForDay,
  getTipForDay,
  
  // Date calculations
  calculateCurrentDay,
  hasStarted,
  getTomorrowDate,
  formatDate,
  
  // Points
  calculatePoints,
  hasGraduated,
  pointsNeededToGraduate,
  
  // Backfill
  canBackfillYesterday,
  
  // Streak
  calculateStreak,
  
  // Status
  getChallengeStatus,
  generateFinalStats,
};
