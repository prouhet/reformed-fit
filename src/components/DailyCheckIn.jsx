// ============================================
// Daily Check-In Component  
// Location: src/components/DailyCheckIn.jsx
//
// DAYS 1-30: Main check-in screen with backfill logic
// ============================================

import React, { useState, useEffect } from 'react';

// 30 Educational Tips Per Level
const WALKING_TIPS = {
  beginner: [
    "Start with a 5-minute walk around your neighborhood. Every journey begins with a single step!",
    "Walk at a comfortable pace where you can still hold a conversation. This is your sweet spot.",
    "Wear comfortable, supportive shoes. Your feet will thank you later!",
    "Morning walks help you wake up naturally and set a positive tone for your day.",
    "Try walking during your lunch break. It's a great way to reset and digest.",
    "Walking after meals can help lower blood sugar levels naturally.",
    "Focus on posture: shoulders back, head up, core engaged. You'll feel stronger!",
    "Set a daily reminder on your phone. Consistency builds habits faster than intensity.",
    "Walk with a friend or family member. Social support doubles your success rate.",
    "Track your steps with your phone. Seeing progress is incredibly motivating!",
    "If it's cold outside, try mall walking. Climate control keeps you consistent.",
    "Start adding hills to your route. Even gentle inclines build strength.",
    "Swing your arms naturally. It burns more calories and feels great!",
    "Walk during TV commercials. Those 2-3 minutes add up quickly!",
    "Listen to your favorite music or podcast. Make walking enjoyable, not a chore.",
    "Park farther away from store entrances. Bonus steps throughout your day.",
    "Take the stairs instead of elevators when possible. Your heart will strengthen.",
    "Walk barefoot on grass when you can. It's grounding and strengthens foot muscles.",
    "Stretch for 2 minutes after walking. It prevents soreness and improves flexibility.",
    "Celebrate small wins. You're building a habit that will last a lifetime!",
    "Walk in nature when possible. Studies show it reduces stress more than city walking.",
    "Vary your routes. New scenery keeps your brain engaged and prevents boredom.",
    "Walk slower if you're tired. Showing up matters more than pace.",
    "Drink water before and after your walk. Hydration makes everything work better.",
    "Notice your breathing. Deep breaths activate your calming nervous system.",
    "Walk with intention. This is YOUR time for movement and mental clarity.",
    "Bad weather? Walk indoors around your house. Movement counts everywhere!",
    "Your body is adapting to this new habit. Be patient and proud of yourself.",
    "Walking improves sleep quality. You're investing in better rest tonight!",
    "You've walked for a month! You're no longer a beginner - you're a walker."
  ],
  intermediate: [
    "Increase your pace slightly this week. Challenge yourself without overdoing it.",
    "Try interval walking: 2 minutes fast, 2 minutes normal. It boosts fitness quickly.",
    "Add 5 minutes to one walk this week. Your endurance is building!",
    "Walking uphill burns 50% more calories than flat ground. Seek out those hills!",
    "Your heart rate should be elevated but you can still talk in full sentences.",
    "Track your distance. Aim to gradually increase it each week.",
    "Cross-training is smart. Walk different surfaces: trails, sand, grass, pavement.",
    "Walking 15-20 minutes daily reduces heart disease risk by 30%. You're investing in health!",
    "Focus on pushing off with your toes. This engages your calf muscles more effectively.",
    "Walk before breakfast occasionally. Fasted cardio can boost fat burning.",
    "Your cardiovascular system is getting stronger. Notice how much easier this feels!",
    "Add light hand weights (1-2 lbs) on some walks. Build upper body strength too.",
    "Walk faster for the last 5 minutes. Finish strong and build mental toughness.",
    "Explore new neighborhoods or trails. Adventure keeps motivation high!",
    "Your metabolism stays elevated for hours after walking. You're burning calories all day.",
    "Practice power walking: pump your arms, quicken your step. Feel that heart rate climb!",
    "Walk 30 minutes after dinner. It aids digestion and improves blood sugar control.",
    "Take a 20-minute walk before stressful events. It clears your mind amazingly well.",
    "Challenge yourself with stairs. They're functional strength training in disguise.",
    "Walking in groups? Keep pace with someone slightly faster. Healthy competition helps!",
    "Your resting heart rate is likely lower now. That's a sign of improved fitness!",
    "Aim for 150 minutes total walking this week. Break it into manageable chunks.",
    "Walk backwards for 30 seconds during your walk. It strengthens different muscles!",
    "Notice how your mood improves after walking. Exercise is medicine for mental health.",
    "Your body is burning more fat as fuel now. Metabolic adaptation is real!",
    "Walk at different times of day. Morning, lunch, evening - vary it to stay consistent.",
    "Push yourself one day, take it easy the next. Smart training prevents burnout.",
    "You're in the intermediate zone now. Your body is capable of more than you think!",
    "Walking 30 minutes daily can reduce dementia risk by 40%. You're protecting your brain!",
    "You've built real fitness! You can now walk 30 minutes without struggle. That's huge!"
  ],
  advanced: [
    "Time to push! Walk for 45 minutes without stopping. You're ready for this challenge.",
    "Try Nordic walking with poles. It engages 90% of your muscles and burns 20% more calories.",
    "Walk hills with purpose. Power up them to build serious leg strength.",
    "Your aerobic base is strong. Consider adding short jogging intervals to some walks.",
    "Walk-run intervals: 3 min walk, 1 min jog. Bridge the gap to running if interested.",
    "Aim for 10,000+ steps daily. You have the endurance for this now.",
    "Walk fast enough that conversation becomes challenging. This is your cardio zone.",
    "Add a weighted vest (5-10% of body weight). Level up your strength training.",
    "Walk in sand or on trails. Unstable surfaces engage stabilizer muscles.",
    "Your VO2 max is likely significantly improved. Your cells use oxygen more efficiently!",
    "Incorporate lunges or squats during your walks. Functional fitness = real-world strength.",
    "Walk 5K (3.1 miles) this week. Test your endurance - you've got this!",
    "Try fasted morning walks. Your body becomes efficient at burning stored fat.",
    "Walk a new challenging route. Physical novelty creates mental resilience.",
    "Your mitochondria (cell power plants) have increased. You have more energy naturally!",
    "Walk with a heart rate monitor. Aim for 60-70% of max heart rate for fat burning.",
    "Consider entering a charity walk. Community events amplify motivation.",
    "Walk hills in reverse. Backward walking strengthens quads and improves balance.",
    "Your resting metabolism is higher now. Muscle is metabolically active tissue!",
    "Add sprint intervals: 30 sec fast walk, 90 sec recovery. Build explosive power.",
    "Walk after weight training. It flushes lactic acid and speeds recovery.",
    "Your cardiovascular system is now highly efficient. Resting heart rate under 60? Athlete status!",
    "Walk different terrains weekly: beach, forest, hills. Variety challenges body and mind.",
    "Consider a walking vacation or hiking trip. You have the fitness for it now!",
    "Your bone density has likely improved. Weight-bearing exercise strengthens bones.",
    "Walk with intention and purpose. You're an athlete maintaining peak fitness.",
    "Try a 10K walk (6.2 miles). It's a serious achievement - challenge yourself!",
    "Your mental clarity from walking is peak. Exercise grows new brain cells!",
    "You've transformed your health. 45 minutes of walking is now routine for you.",
    "You completed 30 days at an advanced level! You're in the top 5% of fitness commitment. Incredible!"
  ]
};

function DailyCheckIn({ onComplete, onViewRoadmap, onSettings }) {
  const [challenge, setChallenge] = useState(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [todayGoal, setTodayGoal] = useState(5);
  const [checkedIn, setCheckedIn] = useState(false);
  const [showBackfill, setShowBackfill] = useState(false);
  const [yesterdayAnswer, setYesterdayAnswer] = useState(false); // Default NO
  const [todayAnswer, setTodayAnswer] = useState(null);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [tip, setTip] = useState('');

  useEffect(() => {
    loadChallengeData();
  }, []);

const loadChallengeData = () => {
  const saved = localStorage.getItem('walk_challenge');
  if (!saved) return;

  const data = JSON.parse(saved);
  
  // Calculate current day based on start date
  const startDate = new Date(data.startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
  const day = Math.max(1, Math.min(30, daysDiff));
  
  console.log('=== DAILY CHECK-IN DAY CALCULATION ===');
  console.log('Start Date:', startDate);
  console.log('Today:', today);
  console.log('Days Diff:', daysDiff);
  console.log('Calculated Day:', day);
  console.log('====================================');
    
    // Determine current week and goal
    let goal;
    if (day <= 7) goal = data.goals.week1;
    else if (day <= 14) goal = data.goals.week2;
    else if (day <= 21) goal = data.goals.week3;
    else goal = data.goals.week4;

    // Check if already checked in today
    const todayCheckIn = data.checkIns.find(c => c.day === day);
    const alreadyCheckedIn = !!todayCheckIn;

    // Check if missed yesterday AND streak is 0
    const yesterdayCheckIn = data.checkIns.find(c => c.day === day - 1);
    const shouldShowBackfill = !yesterdayCheckIn && day > 1 && data.currentStreak === 0;

    setChallenge(data);
    setCurrentDay(day);
    setTodayGoal(goal);
    setCheckedIn(alreadyCheckedIn);
    setShowBackfill(shouldShowBackfill);

    // Set tip for today
    const tipIndex = day - 1;
    const levelTips = WALKING_TIPS[data.level] || WALKING_TIPS.beginner;
    setTip(levelTips[tipIndex] || levelTips[0]);

    // If already checked in, show post-submit view
    if (alreadyCheckedIn) {
      setPointsEarned(todayCheckIn.points);
    }
  };

  const handleAnswer = (answer) => {
    // Auto-submit on button click
    if (showBackfill && yesterdayAnswer !== null) {
      // Have both answers, submit
      submitCheckIn(yesterdayAnswer, answer);
    } else if (!showBackfill) {
      // Just today, submit immediately
      submitCheckIn(null, answer);
    } else {
      // Store today's answer, wait for yesterday
      setTodayAnswer(answer);
      if (yesterdayAnswer !== null) {
        submitCheckIn(yesterdayAnswer, answer);
      }
    }
  };

  const handleYesterdayAnswer = (answer) => {
    setYesterdayAnswer(answer);
    // If today is also answered, submit
    if (todayAnswer !== null) {
      submitCheckIn(answer, todayAnswer);
    }
  };

  const submitCheckIn = (yesterday, today) => {
    let points = 0;
    let newStreak = challenge.currentStreak;
    const newCheckIns = [...challenge.checkIns];

    // Process yesterday if provided
    if (yesterday !== null && showBackfill) {
      points += yesterday ? 1 : 0;
      newCheckIns.push({
        day: currentDay - 1,
        completed: yesterday,
        points: yesterday ? 1 : 0,
        isLate: true,
        timestamp: new Date().toISOString()
      });
      if (!yesterday) newStreak = 0;
    }

    // Process today
    points += today ? 2 : 0;
    newCheckIns.push({
      day: currentDay,
      completed: today,
      points: today ? 2 : 0,
      isLate: false,
      timestamp: new Date().toISOString()
    });

    // Update streak
    if (today) {
      if (yesterday === false || (showBackfill && !yesterday)) {
        newStreak = 1; // Reset to 1 (just today)
      } else {
        newStreak++; // Continue streak
      }
    } else {
      newStreak = 0; // Broken streak
    }

    // Update challenge data
    const updatedChallenge = {
      ...challenge,
      checkIns: newCheckIns,
      totalPoints: challenge.totalPoints + points,
      currentStreak: newStreak,
      currentDay: currentDay
    };

    // Check if challenge complete
    if (currentDay >= 30) {
      if (updatedChallenge.totalPoints >= 50) {
        updatedChallenge.status = 'completed';
        onComplete('success');
      } else {
        updatedChallenge.status = 'incomplete';
        onComplete('incomplete');
      }
    }

    localStorage.setItem('walk_challenge', JSON.stringify(updatedChallenge));
    
    setChallenge(updatedChallenge);
    setPointsEarned(points);
    setCheckedIn(true);
  };

  if (!challenge) {
    return <div>Loading...</div>;
  }

// ADD THIS - Lock Day 0
if (currentDay === 0) {
  return (
    <div className="screen-container">
      <div className="screen-card">
        <div className="logo">REFORMED.FIT × PREMIER U</div>
        
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔒</div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2d3748', marginBottom: '12px' }}>
            Challenge Starts Tomorrow!
          </h2>
          <p style={{ fontSize: '16px', color: '#718096', marginBottom: '24px' }}>
            Your Day 1 begins tomorrow. Come back then to start checking in!
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="submit-button"
            style={{ maxWidth: '300px', margin: '0 auto' }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

 
  // POST-SUBMIT VIEW
  if (checkedIn) {
    const getTomorrowGoal = () => {
      if (currentDay >= 30) return null;
      const nextDay = currentDay + 1;
      if (nextDay <= 7) return challenge.goals.week1;
      if (nextDay <= 14) return challenge.goals.week2;
      if (nextDay <= 21) return challenge.goals.week3;
      return challenge.goals.week4;
    };

    const tomorrowGoal = getTomorrowGoal();

    return (
      <div className="screen-container">
        <div className="screen-card">
          <div className="logo">STUDIO STRONG × PREMIER U</div>

          {/* Success Message */}
          <div className="success-header">
            <div className="success-icon">✅</div>
            <h2 className="success-title">Great work!</h2>
            <div className="points-earned-badge">
              You earned {pointsEarned} point{pointsEarned !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Your Points</div>
              <div className="stat-value">{challenge.totalPoints}/60</div>
              <div className="stat-subtext">Need 50 to graduate</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(challenge.totalPoints / 60) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Current Streak</div>
              <div className="stat-value">🔥 {challenge.currentStreak}</div>
              <div className="stat-subtext">
                {challenge.currentStreak > 0 ? 'Keep it going!' : 'Start fresh tomorrow!'}
              </div>
            </div>
          </div>

          {/* Tomorrow's Goal */}
          {tomorrowGoal && (
            <div className="tomorrow-card">
              <div className="tomorrow-label">Tomorrow's Goal</div>
              <div className="tomorrow-goal">Walk {tomorrowGoal} minutes</div>
            </div>
          )}

          {/* Educational Tip */}
          <div className="education-card">
            <div className="education-title">💡 Did You Know?</div>
            <div className="education-text">{tip}</div>
          </div>

          {/* Accountability CTA */}
          <div className="cta-box">
            <div className="cta-title">Want daily accountability?</div>
            <div className="cta-text">
              Get text check-ins + trainer support for $49/month
            </div>
            <button className="cta-button">Learn More</button>
          </div>

          {/* Navigation */}
          <div className="nav-buttons">
            <button 
              className="nav-button"
              onClick={() => onNavigate('dashboard')}
            >
              Back to Dashboard
            </button>
           <button 
  className="nav-button"
  onClick={() => onViewRoadmap && onViewRoadmap()}
>
  View Roadmap
</button>
<button 
  className="nav-button"
  onClick={() => onSettings && onSettings()}
>
  Settings
</button>
          </div>
        </div>

        <style jsx>{`
          .success-header {
            text-align: center;
            margin-bottom: 30px;
          }

          .success-icon {
            font-size: 64px;
            margin-bottom: 12px;
          }

          .success-title {
            font-size: 28px;
            font-weight: 800;
            color: #2d3748;
            margin-bottom: 12px;
          }

          .points-earned-badge {
            display: inline-block;
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
            color: white;
            padding: 8px 20px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 16px;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 24px;
          }

          .stat-card {
            background: white;
            border: 2px solid #e2e8f0;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
          }

          .stat-label {
            font-size: 12px;
            color: #718096;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
          }

          .stat-value {
            font-size: 32px;
            font-weight: 800;
            color: #2d3748;
            margin-bottom: 4px;
          }

          .stat-subtext {
            font-size: 12px;
            color: #718096;
            margin-bottom: 12px;
          }

          .progress-bar {
            width: 100%;
            height: 8px;
            background: #e2e8f0;
            border-radius: 4px;
            overflow: hidden;
          }

          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            transition: width 0.3s ease;
          }

          .tomorrow-card {
            background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
            border: 2px solid #3b82f6;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 24px;
          }

          .tomorrow-label {
            font-size: 13px;
            color: #1e40af;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
          }

          .tomorrow-goal {
            font-size: 24px;
            font-weight: 800;
            color: #1e3a8a;
          }

          .education-card {
            background: #f7fafc;
            border: 2px solid #e2e8f0;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 24px;
          }

          .education-title {
            font-size: 16px;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 12px;
          }

          .education-text {
            font-size: 14px;
            color: #4a5568;
            line-height: 1.6;
          }

          .cta-box {
            background: linear-gradient(135deg, #fef5e7 0%, #fff3cd 100%);
            border: 2px solid #f59e0b;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 24px;
          }

          .cta-title {
            font-size: 16px;
            font-weight: 700;
            color: #92400e;
            margin-bottom: 8px;
          }

          .cta-text {
            font-size: 14px;
            color: #92400e;
            margin-bottom: 14px;
          }

          .cta-button {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-weight: 700;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(245, 158, 11, 0.3);
          }

          .nav-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .nav-button {
            padding: 14px;
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 10px;
            color: #4a5568;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .nav-button:hover {
            border-color: #667eea;
            color: #667eea;
          }

          @media (max-width: 600px) {
            .stats-grid {
              grid-template-columns: 1fr;
            }

            .nav-buttons {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    );
  }

  // PRE-SUBMIT VIEW (Check-in input)
  return (
    <div className="screen-container">
      <div className="screen-card">
        <div className="logo">STUDIO STRONG × PREMIER U</div>

        {/* Day Header */}
        <div className="day-header">
          <div className="day-count">DAY {currentDay} OF 30</div>
          <div className="challenge-name">Walk Challenge</div>
        </div>

        {/* Current Stats */}
        <div className="current-stats">
          <div className="stat-item">
            <span className="stat-number">{challenge.totalPoints}/60</span>
            <span className="stat-label">Points</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">🔥 {challenge.currentStreak}</span>
            <span className="stat-label">Streak</span>
          </div>
        </div>

        {/* Backfill Yesterday (if needed) */}
        {showBackfill && (
          <div className="backfill-section">
            <div className="backfill-warning">⚠️ You missed Day {currentDay - 1}</div>
            <div className="check-in-question">
              Did you walk {todayGoal} minutes yesterday?
            </div>
            <div className="check-in-subtext">(You'll earn 1 point if yes)</div>
            <div className="button-group">
              <button
                className={`answer-button yes ${yesterdayAnswer === true ? 'selected' : ''}`}
                onClick={() => handleYesterdayAnswer(true)}
              >
                YES
              </button>
              <button
                className={`answer-button no ${yesterdayAnswer === false ? 'selected' : ''}`}
                onClick={() => handleYesterdayAnswer(false)}
              >
                NO
              </button>
            </div>
          </div>
        )}

        {/* Today's Check-in */}
        <div className="checkin-section">
          <div className="check-in-question">
            Did you walk {todayGoal} minutes today?
          </div>
          <div className="check-in-subtext">(You'll earn 2 points if yes)</div>
          <div className="button-group">
            <button
              className="answer-button yes"
              onClick={() => handleAnswer(true)}
            >
              YES
            </button>
            <button
              className="answer-button no"
              onClick={() => handleAnswer(false)}
            >
              NO
            </button>
          </div>
        </div>

        {/* Accountability CTA */}
        <div className="cta-box">
          <div className="cta-title">Need daily accountability?</div>
          <div className="cta-text">Get text reminders + trainer support for $49/month</div>
          <button className="cta-button">Learn More</button>
        </div>
      </div>

      <style jsx>{`
        .day-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .day-count {
          font-size: 14px;
          font-weight: 700;
          color: #667eea;
          letter-spacing: 2px;
          margin-bottom: 8px;
        }

        .challenge-name {
          font-size: 24px;
          font-weight: 800;
          color: #2d3748;
        }

        .current-stats {
          display: flex;
          justify-content: space-around;
          background: #f7fafc;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 30px;
          border: 2px solid #e2e8f0;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 28px;
          font-weight: 800;
          color: #2d3748;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          color: #718096;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .backfill-section {
          background: linear-gradient(135deg, #fff3cd 0%, #fef5e7 100%);
          border: 2px solid #f59e0b;
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .backfill-warning {
          text-align: center;
          font-size: 16px;
          font-weight: 700;
          color: #92400e;
          margin-bottom: 16px;
        }

        .checkin-section {
          background: white;
          border: 2px solid #e2e8f0;
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 24px;
        }

        .check-in-question {
          text-align: center;
          font-size: 20px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 8px;
        }

        .check-in-subtext {
          text-align: center;
          font-size: 14px;
          color: #718096;
          margin-bottom: 20px;
        }

        .button-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .answer-button {
          padding: 20px;
          font-size: 20px;
          font-weight: 700;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          border: 3px solid;
        }

        .answer-button.yes {
          background: white;
          color: #48bb78;
          border-color: #48bb78;
        }

        .answer-button.yes:hover {
          background: #48bb78;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(72, 187, 120, 0.3);
        }

        .answer-button.yes.selected {
          background: #48bb78;
          color: white;
        }

        .answer-button.no {
          background: white;
          color: #f56565;
          border-color: #f56565;
        }

        .answer-button.no:hover {
          background: #f56565;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(245, 101, 101, 0.3);
        }

        .answer-button.no.selected {
          background: #f56565;
          color: white;
        }

        .cta-box {
          background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
          border: 2px solid #3b82f6;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
        }

        .cta-title {
          font-size: 16px;
          font-weight: 700;
          color: #1e40af;
          margin-bottom: 8px;
        }

        .cta-text {
          font-size: 13px;
          color: #1e40af;
          margin-bottom: 14px;
        }

        .cta-button {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.3);
        }

        @media (max-width: 600px) {
          .button-group {
            grid-template-columns: 1fr;
          }

          .check-in-question {
            font-size: 18px;
          }

          .answer-button {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
}

export default DailyCheckIn;
