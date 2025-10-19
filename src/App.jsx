// ============================================
// SCREEN 7: DAILY CHECK-IN
// ============================================
function DailyCheckInScreen({ onComplete, onNavigate }) {
  const [challenge, setChallenge] = useState(null);
  const [minutes, setMinutes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedChallenge = localStorage.getItem('walk_challenge');
    if (savedChallenge) {
      const data = JSON.parse(savedChallenge);
      setChallenge(data);
    }
  }, []);

  const getCurrentWeekGoal = () => {
    if (!challenge) return 0;
    const day = challenge.currentDay;
    if (day <= 7) return challenge.goals.week1;
    if (day <= 14) return challenge.goals.week2;
    if (day <= 21) return challenge.goals.week3;
    return challenge.goals.week4;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const walkMinutes = parseInt(minutes);
    const goal = getCurrentWeekGoal();
    const pointsEarned = walkMinutes >= goal ? 2 : 1;

    const updatedChallenge = {
      ...challenge,
      currentDay: challenge.currentDay + 1,
      totalPoints: challenge.totalPoints + pointsEarned,
      currentStreak: walkMinutes >= goal ? challenge.currentStreak + 1 : 0,
      checkIns: [...challenge.checkIns, {
        day: challenge.currentDay + 1,
        minutes: walkMinutes,
        goal: goal,
        points: pointsEarned,
        date: new Date().toISOString()
      }]
    };

    if (updatedChallenge.currentDay >= 30) {
      updatedChallenge.status = updatedChallenge.totalPoints >= 50 ? 'completed' : 'incomplete';
      localStorage.setItem('walk_challenge', JSON.stringify(updatedChallenge));
      setTimeout(() => {
        onComplete(updatedChallenge.status === 'completed' ? 'success' : 'incomplete');
      }, 500);
    } else {
      localStorage.setItem('walk_challenge', JSON.stringify(updatedChallenge));
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  if (!challenge) {
    return <div>Loading...</div>;
  }

  return (
    <div className="screen-container">
      <div className="screen-card" style={{ maxWidth: '500px' }}>
        <div className="logo">STUDIO STRONG × PREMIER U</div>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🚶‍♂️</div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#2d3748', marginBottom: '8px' }}>Day {challenge.currentDay + 1} Check-In</h1>
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>
            {challenge.level.toUpperCase()} LEVEL
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          <div style={{ background: '#f7fafc', padding: '16px', borderRadius: '10px', textAlign: 'center', border: '2px solid #e2e8f0' }}>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#2d3748' }}>{challenge.totalPoints}</div>
            <div style={{ fontSize: '12px', color: '#718096', fontWeight: '600' }}>POINTS</div>
          </div>
          <div style={{ background: '#f7fafc', padding: '16px', borderRadius: '10px', textAlign: 'center', border: '2px solid #e2e8f0' }}>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#2d3748' }}>{challenge.currentStreak}</div>
            <div style={{ fontSize: '12px', color: '#718096', fontWeight: '600' }}>STREAK</div>
          </div>
          <div style={{ background: '#f7fafc', padding: '16px', borderRadius: '10px', textAlign: 'center', border: '2px solid #e2e8f0' }}>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#2d3748' }}>{challenge.currentDay}/30</div>
            <div style={{ fontSize: '12px', color: '#718096', fontWeight: '600' }}>DAYS</div>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: 'white', padding: '20px', borderRadius: '12px', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', opacity: 0.9 }}>TODAY'S GOAL</div>
          <div style={{ fontSize: '36px', fontWeight: '800' }}>{getCurrentWeekGoal()} minutes</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '16px', fontWeight: '600', color: '#2d3748', marginBottom: '12px' }}>
              How many minutes did you walk today?
            </label>
            <input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              min="0"
              max="240"
              required
              autoFocus
              style={{ width: '100%', padding: '16px', fontSize: '24px', fontWeight: '700', textAlign: 'center', border: '3px solid #e2e8f0', borderRadius: '12px', background: 'white' }}
              placeholder="0"
            />
            <p style={{ marginTop: '8px', fontSize: '13px', color: '#718096', textAlign: 'center' }}>Enter the actual time you walked</p>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{ width: '100%', padding: '18px', fontSize: '18px', fontWeight: '700', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Check-In'}
          </button>
        </form>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
          <button onClick={() => onNavigate('roadmap')} style={{ padding: '14px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', color: '#4a5568', fontWeight: '600', fontSize: '15px', cursor: 'pointer' }}>
            View Roadmap
          </button>
          <button onClick={() => onNavigate('settings')} style={{ padding: '14px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', color: '#4a5568', fontWeight: '600', fontSize: '15px', cursor: 'pointer' }}>
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SCREEN 8: COMPLETION SUCCESS
// ============================================
function CompletionSuccessScreen({ onSelectNextChallenge }) {
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    const savedChallenge = localStorage.getItem('walk_challenge');
    if (savedChallenge) {
      const data = JSON.parse(savedChallenge);
      setChallenge(data);
    }
  }, []);

  if (!challenge) {
    return <div>Loading...</div>;
  }

  return (
    <div className="screen-container">
      <div className="screen-card" style={{ maxWidth: '500px' }}>
        <div className="logo">STUDIO STRONG × PREMIER U</div>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>🎉</div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#2d3748', marginBottom: '12px' }}>Challenge Complete!</h1>
          <p style={{ fontSize: '16px', color: '#718096' }}>You've earned your achievement sticker!</p>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #fef5e7 0%, #fff3cd 100%)', border: '3px solid #f59e0b', padding: '30px', borderRadius: '16px', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '64px', marginBottom: '12px' }}>🏆</div>
          <div style={{ fontSize: '22px', fontWeight: '700', color: '#92400e', marginBottom: '12px' }}>30-Day Walk Challenge</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#92400e' }}>{challenge.totalPoints} / 60 Points</div>
        </div>

        <div style={{ background: '#f7fafc', padding: '20px', borderRadius: '12px', marginBottom: '24px', border: '2px solid #e2e8f0' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#2d3748', marginBottom: '16px', textAlign: 'center' }}>📊 Your Stats</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'white', borderRadius: '8px' }}>
              <span style={{ color: '#718096' }}>Total Days Completed</span>
              <span style={{ fontWeight: '700', color: '#2d3748' }}>30</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'white', borderRadius: '8px' }}>
              <span style={{ color: '#718096' }}>Points Earned</span>
              <span style={{ fontWeight: '700', color: '#2d3748' }}>{challenge.totalPoints}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'white', borderRadius: '8px' }}>
              <span style={{ color: '#718096' }}>Longest Streak</span>
              <span style={{ fontWeight: '700', color: '#2d3748' }}>{Math.max(...challenge.checkIns.map((_, i) => {
                let streak = 0;
                for (let j = i; j < challenge.checkIns.length; j++) {
                  if (challenge.checkIns[j].points === 2) streak++;
                  else break;
                }
                return streak;
              }))} days</span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#2d3748', marginBottom: '16px', textAlign: 'center' }}>Ready for your next challenge?</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={() => onSelectNextChallenge('protein')} style={{ padding: '16px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
              🥩 Start Protein Challenge
            </button>
            <button onClick={() => onSelectNextChallenge('walk')} style={{ padding: '16px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '10px', color: '#4a5568', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
              🚶‍♂️ Do Walk Challenge Again
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '14px', color: '#718096' }}>Your sticker will be mailed to you within 2 weeks! 📬</p>
      </div>
    </div>
  );
}

// ============================================
// SCREEN 9: COMPLETION INCOMPLETE
// ============================================
function CompletionIncompleteScreen({ onTryAgain, onSelectDifferent }) {
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    const savedChallenge = localStorage.getItem('walk_challenge');
    if (savedChallenge) {
      const data = JSON.parse(savedChallenge);
      setChallenge(data);
    }
  }, []);

  if (!challenge) {
    return <div>Loading...</div>;
  }

  return (
    <div className="screen-container">
      <div className="screen-card" style={{ maxWidth: '500px' }}>
        <div className="logo">STUDIO STRONG × PREMIER U</div>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>💪</div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#2d3748', marginBottom: '12px' }}>Challenge Complete</h1>
          <p style={{ fontSize: '16px', color: '#718096' }}>You finished 30 days, but didn't quite reach the goal</p>
        </div>

        <div style={{ background: '#fef5e7', border: '2px solid #f59e0b', padding: '24px', borderRadius: '12px', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📊</div>
          <div style={{ fontSize: '18px', color: '#92400e', marginBottom: '12px' }}>You earned</div>
          <div style={{ fontSize: '36px', fontWeight: '800', color: '#92400e', marginBottom: '8px' }}>{challenge.totalPoints} / 60 Points</div>
          <div style={{ fontSize: '14px', color: '#92400e' }}>Need 50 points to earn sticker</div>
        </div>

        <div style={{ background: '#f7fafc', padding: '20px', borderRadius: '12px', marginBottom: '24px', border: '2px solid #e2e8f0' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#2d3748', marginBottom: '12px' }}>💡 What happened?</div>
          <p style={{ fontSize: '14px', color: '#4a5568', lineHeight: '1.6', marginBottom: '16px' }}>
            Building new habits is tough! You showed up for 30 days, which is already an achievement. The points system rewards consistency and meeting your goals.
          </p>
          <div style={{ background: 'white', padding: '12px', borderRadius: '8px', fontSize: '14px', color: '#4a5568', lineHeight: '1.6' }}>
            <strong>Remember:</strong> Check in on time = 2 points, 1 day late = 1 point. Meeting your walk goal each day helps maximize points!
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          <button onClick={onTryAgain} style={{ padding: '18px', background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>
            🔄 Try Walk Challenge Again
          </button>
          <button onClick={onSelectDifferent} style={{ padding: '18px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '12px', color: '#4a5568', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
            Choose Different Challenge
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#718096', lineHeight: '1.5' }}>
          Every step forward is progress. We're proud of you for completing 30 days! 💚
        </p>
      </div>
    </div>
  );
}

// ============================================
// SCREEN 10: ROADMAP
// ============================================
function RoadmapScreen({ onBack }) {
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    const savedChallenge = localStorage.getItem('walk_challenge');
    if (savedChallenge) {
      const data = JSON.parse(savedChallenge);
      setChallenge(data);
    }
  }, []);

  if (!challenge) {
    return <div>Loading...</div>;
  }

  const getWeekGoal = (week) => {
    if (week === 1) return challenge.goals.week1;
    if (week === 2) return challenge.goals.week2;
    if (week === 3) return challenge.goals.week3;
    return challenge.goals.week4;
  };

  const getDayStatus = (day) => {
    if (day > challenge.currentDay) return 'locked';
    const checkIn = challenge.checkIns.find(c => c.day === day);
    if (!checkIn) return 'missed';
    return checkIn.points === 2 ? 'complete' : 'partial';
  };

  return (
    <div className="screen-container">
      <div className="screen-card" style={{ maxWidth: '600px' }}>
        <button onClick={onBack} style={{ marginBottom: '20px', padding: '10px 20px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '8px', color: '#4a5568', fontWeight: '600', cursor: 'pointer' }}>
          ← Back
        </button>

        <div className="logo">STUDIO STRONG × PREMIER U</div>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🗺️</div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#2d3748', marginBottom: '8px' }}>30-Day Roadmap</h1>
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '1px' }}>
            {challenge.level.toUpperCase()} LEVEL
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          {[1, 2, 3, 4].map(week => (
            <div key={week} style={{ marginBottom: '24px', background: '#f7fafc', padding: '20px', borderRadius: '12px', border: '2px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#2d3748' }}>Week {week}</h3>
                <span style={{ background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontWeight: '700', fontSize: '14px' }}>
                  {getWeekGoal(week)} min/day
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                {Array.from({ length: 7 }, (_, i) => {
                  const day = (week - 1) * 7 + i + 1;
                  const status = getDayStatus(day);
                  return (
                    <div 
                      key={day}
                      style={{
                        aspectRatio: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: status === 'complete' ? '#48bb78' : status === 'partial' ? '#f59e0b' : status === 'missed' ? '#ef4444' : 'white',
                        color: status === 'locked' ? '#a0aec0' : 'white',
                        border: `2px solid ${status === 'locked' ? '#e2e8f0' : 'transparent'}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '700'
                      }}
                    >
                      {status === 'locked' ? '🔒' : day}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '2px solid #e2e8f0' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#2d3748', marginBottom: '12px' }}>Legend</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', background: '#48bb78', borderRadius: '6px' }}></div>
              <span style={{ fontSize: '14px', color: '#4a5568' }}>Completed on time (2 pts)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', background: '#f59e0b', borderRadius: '6px' }}></div>
              <span style={{ fontSize: '14px', color: '#4a5568' }}>Completed late (1 pt)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', background: '#ef4444', borderRadius: '6px' }}></div>
              <span style={{ fontSize: '14px', color: '#4a5568' }}>Missed (0 pts)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔒</div>
              <span style={{ fontSize: '14px', color: '#4a5568' }}>Not yet available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SCREEN 11: SETTINGS
// ============================================
function SettingsScreen({ onBack }) {
  const [userData, setUserData] = useState(null);
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user_data');
    const savedChallenge = localStorage.getItem('walk_challenge');
    
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
    }
    if (savedChallenge) {
      setChallenge(JSON.parse(savedChallenge));
    }
  }, []);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your challenge? This cannot be undone.')) {
      localStorage.removeItem('walk_challenge');
      window.location.href = '/';
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="screen-container">
      <div className="screen-card" style={{ maxWidth: '500px' }}>
        <button onClick={onBack} style={{ marginBottom: '20px', padding: '10px 20px', background: 'white', border: '2px solid #e2e8f0', borderRadius: '8px', color: '#4a5568', fontWeight: '600', cursor: 'pointer' }}>
          ← Back
        </button>

        <div className="logo">STUDIO STRONG × PREMIER U</div>
        
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#2d3748', marginBottom: '30px', textAlign: 'center' }}>Settings</h1>

        <div style={{ background: '#f7fafc', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '2px solid #e2e8f0' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#2d3748', marginBottom: '16px' }}>Account Information</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#718096', fontWeight: '600', marginBottom: '4px' }}>Patient ID</div>
              <div style={{ fontSize: '15px', color: '#2d3748', fontWeight: '600' }}>{userData.puid}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#718096', fontWeight: '600', marginBottom: '4px' }}>Name</div>
              <div style={{ fontSize: '15px', color: '#2d3748' }}>{userData.name}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#718096', fontWeight: '600', marginBottom: '4px' }}>Email</div>
              <div style={{ fontSize: '15px', color: '#2d3748' }}>{userData.email}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#718096', fontWeight: '600', marginBottom: '4px' }}>Phone</div>
              <div style={{ fontSize: '15px', color: '#2d3748' }}>{userData.phone}</div>
            </div>
          </div>
        </div>

        {challenge && (
          <div style={{ background: '#f7fafc', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '2px solid #e2e8f0' }}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#2d3748', marginBottom: '16px' }}>Current Challenge</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#718096', fontWeight: '600', marginBottom: '4px' }}>Challenge</div>
                <div style={{ fontSize: '15px', color: '#2d3748' }}>🚶‍♂️ Walk Challenge ({challenge.level})</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#718096', fontWeight: '600', marginBottom: '4px' }}>Progress</div>
                <div style={{ fontSize: '15px', color: '#2d3748' }}>Day {challenge.currentDay} of 30</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#718096', fontWeight: '600', marginBottom: '4px' }}>Points</div>
                <div style={{ fontSize: '15px', color: '#2d3748' }}>{challenge.totalPoints} / 60</div>
              </div>
            </div>
          </div>
        )}

        <div style={{ background: '#fff5f5', padding: '20px', borderRadius: '12px', border: '2px solid #fc8181' }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#c53030', marginBottom: '12px' }}>⚠️ Danger Zone</div>
          <p style={{ fontSize: '14px', color: '#742a2a', marginBottom: '16px', lineHeight: '1.5' }}>
            Resetting will permanently delete your current challenge progress. This action cannot be undone.
          </p>
          <button onClick={handleReset} style={{ width: '100%', padding: '14px', background: '#c53030', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
            Reset Challenge
          </button>
        </div>

        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#718096' }}>
          Need help? Email support@reformed.fit
        </p>
      </div>
    </div>
  );
}

export default App;
