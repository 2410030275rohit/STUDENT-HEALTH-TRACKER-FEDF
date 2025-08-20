import React, { useState } from 'react';
import { Heart, Activity, Droplets, Moon, MessageCircle, Send, Bot, User, TrendingUp, Calendar, Settings, BarChart3, Play, Zap, Target } from 'lucide-react';

// --- Timer Modal Component ---
const TimerModal = ({ onClose }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  React.useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const handleReset = () => {
    setSeconds(0);
    setIsActive(false);
  };

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center w-80 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Workout Timer</h2>
        <div className="text-5xl font-mono mb-6 text-indigo-700">{formatTime(seconds)}</div>
        <div className="flex justify-center gap-3">
          <button
            className={`px-4 py-2 rounded bg-green-600 text-white font-semibold ${isActive ? 'opacity-60' : ''}`}
            onClick={() => setIsActive(true)}
            disabled={isActive}
          >
            Start
          </button>
          <button
            className="px-4 py-2 rounded bg-yellow-500 text-white font-semibold"
            onClick={() => setIsActive(false)}
            disabled={!isActive}
          >
            Pause
          </button>
          <button
            className="px-4 py-2 rounded bg-gray-400 text-white font-semibold"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

// Login Screen Component
const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl shadow-indigo-800/40">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-4 mb-2">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 21C12 21 4 13.5 4 8.5C4 5.5 6.5 3 9.5 3C11.04 3 12.5 4.04 13 5.09C13.5 4.04 14.96 3 16.5 3C19.5 3 22 5.5 22 8.5C22 13.5 12 21 12 21Z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">VitalSync Pro</h1>
          <p className="text-sm text-gray-500">Advanced Health Intelligence</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Your password"
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} VitalSync Pro. All rights reserved.
        </div>
      </div>
    </div>
  );
};

const VitalSyncApp = () => {
  // Login state
  const [loggedIn, setLoggedIn] = useState(false);

  // Loading State
  const [isLoading, setIsLoading] = useState(true);

  // Timer Modal State
  const [showTimer, setShowTimer] = useState(false);

  // AI Assistant State
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: "Hello! I'm your AI Health Assistant. I can analyze your health data, provide personalized recommendations, and answer any health questions. How can I help you today?"
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Loading screen timer
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds loading

    return () => clearTimeout(timer);
  }, []);

  // Health data from your original design
  const healthData = {
    heartRate: { current: 72, target: 80, unit: 'BPM' },
    steps: { current: 8247, target: 10000, unit: 'Steps Today' },
    calories: { current: 1856, target: 2200, unit: 'Calories Burned' },
    hydration: { current: 1.8, target: 2.5, unit: 'L' },
    distance: { current: 6.2, unit: 'km' },
    activeTime: { current: 127, unit: 'min' },
    sleep: { current: 7.5, unit: 'h' }
  };

  // Real AI Assistant Logic
  const generateAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    const insights = [];
    if (healthData.heartRate.current < 75) insights.push("excellent resting heart rate");
    if (healthData.steps.current < healthData.steps.target) insights.push(`${healthData.steps.target - healthData.steps.current} steps needed for goal`);
    if (healthData.hydration.current < healthData.hydration.target) insights.push("hydration below optimal level");
    if (healthData.sleep.current >= 7) insights.push("good sleep duration");

    if (message.includes('heart') || message.includes('cardio')) {
      return `Your heart rate of ${healthData.heartRate.current} BPM is excellent! For cardiovascular health: 1) Continue your current ${healthData.activeTime.current} min/day activity 2) Aim for 150 min moderate exercise weekly 3) Monitor heart rate variability 4) Consider interval training to improve cardiac efficiency.`;
    }

    if (message.includes('sleep') || message.includes('tired')) {
      return `Great sleep duration at ${healthData.sleep.current}h! To optimize sleep quality: 1) Maintain consistent bedtime 2) Room temperature 65-68°F 3) No screens 1h before bed 4) Track sleep stages for deeper insights. Your current sleep supports your ${healthData.activeTime.current} min daily activity well.`;
    }

    if (message.includes('water') || message.includes('hydration')) {
      return `You've had ${healthData.hydration.current}L today, need ${(healthData.hydration.target - healthData.hydration.current).toFixed(1)}L more. Based on your ${healthData.calories.current} calories burned, increase intake by 500ml post-workout. Set reminders every 2 hours. Proper hydration improves performance by 12%.`;
    }

    if (message.includes('steps') || message.includes('walk') || message.includes('exercise')) {
      return `${healthData.steps.current} steps completed! You're ${((healthData.steps.current/healthData.steps.target)*100).toFixed(0)}% to goal. With ${healthData.distance.current}km covered, your pace is excellent. To reach 10k: take stairs, 10-min walks after meals, or evening stroll. This will boost your ${healthData.calories.current} calorie burn.`;
    }

    if (message.includes('weight') || message.includes('calories') || message.includes('diet')) {
      return `${healthData.calories.current} calories burned is strong! For optimal metabolism: 1) Protein intake 0.8g per kg body weight 2) Eat within 30 min post-workout 3) Balance macros: 50% carbs, 25% protein, 25% fats 4) Your ${healthData.activeTime.current} min activity supports healthy weight management.`;
    }

    if (message.includes('analyze') || message.includes('summary') || message.includes('overall')) {
      return `Health Analysis: ✅ Heart rate excellent (${healthData.heartRate.current} BPM) ✅ Sleep optimal (${healthData.sleep.current}h) ⚠️ Steps at ${((healthData.steps.current/healthData.steps.target)*100).toFixed(0)}% of goal ⚠️ Hydration needs ${(healthData.hydration.target - healthData.hydration.current).toFixed(1)}L more. Priority: Increase daily movement and water intake. Overall health score: 8/10`;
    }

    return `Based on your data: ${insights.slice(0, 2).join(', ')}. I can help with specific advice on heart health, sleep optimization, hydration strategies, fitness goals, or nutrition planning. What would you like to focus on?`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage);
      setMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
      setIsTyping(false);
    }, 1200);
  };

  // Show login screen if not logged in
  if (!loggedIn) {
    return <LoginScreen onLogin={(email, pass) => {
      console.log("Login attempt:", email, pass);
      setLoggedIn(true); // On success, show main app
    }} />
  }

  // Show loading screen if loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-4 animate-pulse">
              <Heart className="w-12 h-12 text-white animate-bounce" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-ping"></div>
          </div>

          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            VitalSync Pro
          </h1>
          <p className="text-lg opacity-80 mb-8">Advanced Health Intelligence</p>

          <div className="w-64 mx-auto mb-6">
            <div className="flex justify-between text-sm mb-2 opacity-70">
              <span>Loading your health data...</span>
              <span>AI Ready</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
            </div>
          </div>

          <div className="space-y-3 text-sm opacity-80">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Syncing health metrics</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <span>Initializing AI assistant</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              <span>Preparing dashboard</span>
            </div>
          </div>

          <div className="mt-8">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Original app dashboard UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
      {/* Timer Modal */}
      {showTimer && <TimerModal onClose={() => setShowTimer(false)} />}
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div>
          <h1 className="text-2xl font-bold">VitalSync Pro</h1>
          <p className="text-sm opacity-70">Advanced Health Intelligence</p>
        </div>
        <div className="text-sm">12:07 PM</div>
      </div>

      <div className="px-6">
        {/* AI Health Insights */}
        <div className="bg-blue-600/20 rounded-2xl p-4 mb-6 border border-blue-400/30">
          <div className="flex items-center space-x-2 mb-2">
            <Bot className="w-5 h-5" />
            <span className="font-semibold">AI Health Insights</span>
          </div>
          <p className="text-sm">Excellent cardiovascular progress! Your resting heart rate improved by 8% this week. Recommendation: Increase hydration by 15% and add 10min meditation for optimal recovery.</p>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span>Recovery: 92%</span>
            <span>Wellness Score: 8.7/10</span>
          </div>
        </div>

        {/* Health Cards Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Heart Rate Card */}
          <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-4 relative overflow-hidden">
            <Heart className="absolute top-4 right-4 w-6 h-6 opacity-60" />
            <div className="text-3xl font-bold mb-1">72</div>
            <div className="text-sm opacity-80 mb-3">Heart Rate BPM</div>
            <div className="text-xs opacity-70">Resting: 68 BPM</div>
            <div className="w-full bg-white/20 rounded-full h-1 mt-2">
              <div className="bg-white rounded-full h-1 w-4/5"></div>
            </div>
          </div>

          {/* Steps Card */}
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-4 relative overflow-hidden">
            <TrendingUp className="absolute top-4 right-4 w-6 h-6 opacity-60" />
            <div className="text-3xl font-bold mb-1">8,247</div>
            <div className="text-sm opacity-80 mb-3">Steps Today</div>
            <div className="text-xs opacity-70">Goal: 10,000 steps</div>
            <div className="w-full bg-white/20 rounded-full h-1 mt-2">
              <div className="bg-white rounded-full h-1 w-4/5"></div>
            </div>
          </div>

          {/* Calories Card */}
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-4 relative overflow-hidden">
            <Zap className="absolute top-4 right-4 w-6 h-6 opacity-60" />
            <div className="text-3xl font-bold mb-1">1856</div>
            <div className="text-sm opacity-80 mb-3">Calories Burned</div>
            <div className="text-xs opacity-70">Goal: 2,200 cal</div>
            <div className="w-full bg-white/20 rounded-full h-1 mt-2">
              <div className="bg-white rounded-full h-1 w-3/4"></div>
            </div>
          </div>

          {/* Hydration Card */}
          <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl p-4 relative overflow-hidden">
            <Droplets className="absolute top-4 right-4 w-6 h-6 opacity-60" />
            <div className="text-3xl font-bold mb-1">1.8L</div>
            <div className="text-sm opacity-80 mb-3">Hydration</div>
            <div className="text-xs opacity-70">Goal: 2.5L daily</div>
            <div className="w-full bg-white/20 rounded-full h-1 mt-2">
              <div className="bg-white rounded-full h-1 w-3/5"></div>
            </div>
          </div>
        </div>

        {/* Today's Achievement */}
        <div className="bg-white/10 rounded-2xl p-4 mb-6">
          <h3 className="font-semibold mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Today's Achievement
          </h3>
          <div className="flex justify-between">
            <div className="text-center">
              <div className="text-2xl font-bold">6.2km</div>
              <div className="text-xs opacity-70">Distance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">127min</div>
              <div className="text-xs opacity-70">Active Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">7.5h</div>
              <div className="text-xs opacity-70">Sleep</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-4 gap-3">
            <button
              className="bg-green-600 p-3 rounded-xl text-xs font-medium flex items-center justify-center"
              onClick={() => setShowTimer(true)}
            >
              <Play className="w-4 h-4 mr-1" />
              Workout
            </button>
            <button className="bg-purple-600 p-3 rounded-xl text-xs font-medium">
              🍓Track Meal
            </button>
            <button className="bg-blue-600 p-3 rounded-xl text-xs font-medium">
              🦾Meditate
            </button>
            <button className="bg-orange-600 p-3 rounded-xl text-xs font-medium">
              💧Track H₂O
            </button>
          </div>
        </div>

        {/* Advanced Features */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3">Advanced Features</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-pink-600 p-4 rounded-xl text-left">
              <div className="text-sm font-medium">Health Insights</div>
              <div className="text-xs opacity-70">AI analysis</div>
            </button>
            <button className="bg-cyan-600 p-4 rounded-xl text-left">
              <div className="text-sm font-medium">Sleep Tracker</div>
              <div className="text-xs opacity-70">7.5h last night</div>
            </button>
            <button className="bg-purple-600 p-4 rounded-xl text-left">
              <div className="text-sm font-medium">Analytics</div>
              <div className="text-xs opacity-70">Weekly report</div>
            </button>
            <button className="bg-green-600 p-4 rounded-xl text-left">
              <div className="text-sm font-medium">Smart Goals</div>
              <div className="text-xs opacity-70">3 active goals</div>
            </button>
          </div>
        </div>

        {/* REAL AI ASSISTANT */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden mb-6">
          <div className="p-4 border-b border-white/20 flex items-center space-x-3">
            <Bot className="w-6 h-6 text-blue-400" />
            <h3 className="font-semibold">AI Health Assistant</h3>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs opacity-60">Real AI • Online</span>
          </div>

          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex items-start space-x-3 ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${msg.type === 'ai' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                  {msg.type === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div className={`max-w-\[70%] px-3 py-2 rounded-2xl text-sm ${msg.type === 'ai' ? 'bg-white/15' : 'bg-purple-600/50'}`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white/15 px-3 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/20">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about your health data..."
                className="flex-1 bg-white/10 border border-white/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 placeholder-white/50"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 p-2 rounded-xl transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <button
                onClick={() => setInputMessage("Analyze my health data")}
                className="px-2 py-1 bg-white/10 rounded-full text-xs hover:bg-white/20"
              >
                Health Analysis
              </button>
              <button
                onClick={() => setInputMessage("Sleep optimization tips")}
                className="px-2 py-1 bg-white/10 rounded-full text-xs hover:bg-white/20"
              >
                Sleep Tips
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-around py-4">
          <button className="flex flex-col items-center space-y-1">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            <span className="text-xs">Dashboard</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <Activity className="w-6 h-6 opacity-60" />
            <span className="text-xs opacity-60">Workout</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <Calendar className="w-6 h-6 opacity-60" />
            <span className="text-xs opacity-60">Goals</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <MessageCircle className="w-6 h-6 opacity-60" />
            <span className="text-xs opacity-60">Meditation</span>
          </button>
          <button className="flex flex-col items-center space-y-1">
            <User className="w-6 h-6 opacity-60" />
            <span className="text-xs opacity-60">More</span>
          </button>
        </div>
      </div>
      </div>
  );
};

export default VitalSyncApp;