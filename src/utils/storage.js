// ============================================
// Storage Utility - LocalStorage Abstraction
// Location: src/utils/storage.js
// 
// For DEV: Uses LocalStorage
// For PROD: Uses Supabase (via api.js)
// ============================================

const STORAGE_KEYS = {
  CURRENT_USER: 'studio_strong_current_user',
  ACTIVE_CHALLENGE: 'studio_strong_active_challenge',
  CHECKINS: 'studio_strong_checkins',
  ASSESSMENT_DATA: 'studio_strong_assessment',
};

// ============================================
// USER DATA
// ============================================

export const saveCurrentUser = (userData) => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userData));
};

export const getCurrentUser = () => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

export const clearCurrentUser = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

// ============================================
// CHALLENGE DATA
// ============================================

export const saveActiveChallenge = (challengeData) => {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_CHALLENGE, JSON.stringify(challengeData));
};

export const getActiveChallenge = () => {
  const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_CHALLENGE);
  return data ? JSON.parse(data) : null;
};

export const updateChallengeProgress = (updates) => {
  const current = getActiveChallenge();
  if (!current) return null;
  
  const updated = { ...current, ...updates };
  saveActiveChallenge(updated);
  return updated;
};

export const clearActiveChallenge = () => {
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_CHALLENGE);
};

// ============================================
// CHECK-IN DATA
// ============================================

export const saveCheckIn = (checkInData) => {
  const allCheckIns = getAllCheckIns();
  allCheckIns.push(checkInData);
  localStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(allCheckIns));
};

export const getAllCheckIns = () => {
  const data = localStorage.getItem(STORAGE_KEYS.CHECKINS);
  return data ? JSON.parse(data) : [];
};

export const getCheckInForDay = (challengeDay) => {
  const allCheckIns = getAllCheckIns();
  return allCheckIns.find(c => c.challenge_day === challengeDay);
};

export const hasCheckInForDay = (challengeDay) => {
  return getCheckInForDay(challengeDay) !== undefined;
};

export const clearCheckIns = () => {
  localStorage.removeItem(STORAGE_KEYS.CHECKINS);
};

// ============================================
// ASSESSMENT DATA (Temporary during onboarding)
// ============================================

export const saveAssessmentData = (assessmentData) => {
  localStorage.setItem(STORAGE_KEYS.ASSESSMENT_DATA, JSON.stringify(assessmentData));
};

export const getAssessmentData = () => {
  const data = localStorage.getItem(STORAGE_KEYS.ASSESSMENT_DATA);
  return data ? JSON.parse(data) : null;
};

export const clearAssessmentData = () => {
  localStorage.removeItem(STORAGE_KEYS.ASSESSMENT_DATA);
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Clear all app data (logout)
 */
export const clearAllData = () => {
  clearCurrentUser();
  clearActiveChallenge();
  clearCheckIns();
  clearAssessmentData();
};

/**
 * Calculate current streak from check-ins
 */
export const calculateCurrentStreak = () => {
  const challenge = getActiveChallenge();
  if (!challenge) return 0;
  
  const allCheckIns = getAllCheckIns()
    .filter(c => c.completed === true)
    .sort((a, b) => b.challenge_day - a.challenge_day); // Newest first
  
  if (allCheckIns.length === 0) return 0;
  
  let streak = 0;
  let expectedDay = challenge.current_day - 1;
  
  for (const checkIn of allCheckIns) {
    if (checkIn.challenge_day === expectedDay) {
      streak++;
      expectedDay--;
    } else {
      break;
    }
  }
  
  return streak;
};

/**
 * Calculate total points earned
 */
export const calculateTotalPoints = () => {
  const allCheckIns = getAllCheckIns();
  return allCheckIns.reduce((total, checkIn) => total + checkIn.points_earned, 0);
};

/**
 * Get days completed (any check-in, even if answered NO)
 */
export const getDaysCompleted = () => {
  return getAllCheckIns().length;
};

/**
 * Get days where they actually did the activity (answered YES)
 */
export const getDaysSuccessful = () => {
  return getAllCheckIns().filter(c => c.completed === true).length;
};

// ============================================
// Export all functions
// ============================================
export default {
  // User
  saveCurrentUser,
  getCurrentUser,
  clearCurrentUser,
  
  // Challenge
  saveActiveChallenge,
  getActiveChallenge,
  updateChallengeProgress,
  clearActiveChallenge,
  
  // Check-ins
  saveCheckIn,
  getAllCheckIns,
  getCheckInForDay,
  hasCheckInForDay,
  clearCheckIns,
  
  // Assessment
  saveAssessmentData,
  getAssessmentData,
  clearAssessmentData,
  
  // Utilities
  clearAllData,
  calculateCurrentStreak,
  calculateTotalPoints,
  getDaysCompleted,
  getDaysSuccessful,
};