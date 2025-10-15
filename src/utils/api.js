// ============================================
// Supabase API Client
// Location: src/utils/api.js
// ============================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we're in development mode
const isDevelopment = import.meta.env.VITE_ENVIRONMENT === 'development';

// Create Supabase client (or null for local dev)
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ============================================
// Helper: Check if using Supabase or LocalStorage
// ============================================
export const isUsingSupabase = () => {
  return supabase !== null && !isDevelopment;
};

// ============================================
// USER OPERATIONS
// ============================================

/**
 * Create a new user account
 */
export const createUser = async (userData) => {
  if (!isUsingSupabase()) {
    // Local dev: use localStorage (handled by storage.js)
    return { success: true, data: userData };
  }

  const { data, error } = await supabase
    .from('users')
    .insert([{
      pu_id: userData.pu_id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      pin_hash: userData.pin_hash,
    }])
    .select()
    .single();

  if (error) throw error;
  return { success: true, data };
};

/**
 * Get user by PU ID
 */
export const getUserByPUID = async (pu_id) => {
  if (!isUsingSupabase()) {
    return null; // LocalStorage handled separately
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('pu_id', pu_id)
    .single();

  if (error) return null;
  return data;
};

/**
 * Verify PIN
 */
export const verifyPIN = async (pu_id, pin) => {
  // In production, this would hash the PIN and compare
  // For now, simplified for demo
  const user = await getUserByPUID(pu_id);
  return user && user.pin_hash === pin;
};

// ============================================
// CHALLENGE OPERATIONS
// ============================================

/**
 * Get all available challenges
 */
export const getChallenges = async () => {
  if (!isUsingSupabase()) {
    return [
      { id: '1', name: 'Walk Challenge', slug: 'walk', icon: '🚶‍♂️' },
      { id: '2', name: 'Protein Challenge', slug: 'protein', icon: '🥩' }
    ];
  }

  const { data, error } = await supabase
    .from('challenges_master')
    .select('*')
    .eq('active', true);

  if (error) throw error;
  return data;
};

/**
 * Create a user challenge
 */
export const createUserChallenge = async (challengeData) => {
  if (!isUsingSupabase()) {
    return { success: true, data: challengeData };
  }

  const { data, error } = await supabase
    .from('user_challenges')
    .insert([challengeData])
    .select()
    .single();

  if (error) throw error;
  return { success: true, data };
};

/**
 * Get user's active challenges
 */
export const getUserChallenges = async (userId) => {
  if (!isUsingSupabase()) {
    return [];
  }

  const { data, error } = await supabase
    .from('user_challenges')
    .select(`
      *,
      challenges_master (*)
    `)
    .eq('user_id', userId)
    .in('status', ['pending', 'active']);

  if (error) throw error;
  return data;
};

/**
 * Update challenge progress
 */
export const updateChallengeProgress = async (challengeId, updates) => {
  if (!isUsingSupabase()) {
    return { success: true };
  }

  const { data, error } = await supabase
    .from('user_challenges')
    .update(updates)
    .eq('id', challengeId)
    .select()
    .single();

  if (error) throw error;
  return { success: true, data };
};

// ============================================
// CHECK-IN OPERATIONS
// ============================================

/**
 * Create a daily check-in
 */
export const createCheckIn = async (checkInData) => {
  if (!isUsingSupabase()) {
    return { success: true, data: checkInData };
  }

  const { data, error } = await supabase
    .from('daily_checkins')
    .insert([checkInData])
    .select()
    .single();

  if (error) throw error;
  return { success: true, data };
};

/**
 * Get check-ins for a challenge
 */
export const getCheckIns = async (userChallengeId) => {
  if (!isUsingSupabase()) {
    return [];
  }

  const { data, error } = await supabase
    .from('daily_checkins')
    .select('*')
    .eq('user_challenge_id', userChallengeId)
    .order('challenge_day', { ascending: true });

  if (error) throw error;
  return data;
};

/**
 * Check if a specific day has a check-in
 */
export const hasCheckInForDay = async (userChallengeId, challengeDay) => {
  if (!isUsingSupabase()) {
    return false;
  }

  const { data, error } = await supabase
    .from('daily_checkins')
    .select('id')
    .eq('user_challenge_id', userChallengeId)
    .eq('challenge_day', challengeDay)
    .single();

  return !error && data !== null;
};

// ============================================
// Export default for convenience
// ============================================
export default {
  supabase,
  isUsingSupabase,
  createUser,
  getUserByPUID,
  verifyPIN,
  getChallenges,
  createUserChallenge,
  getUserChallenges,
  updateChallengeProgress,
  createCheckIn,
  getCheckIns,
  hasCheckInForDay,
};