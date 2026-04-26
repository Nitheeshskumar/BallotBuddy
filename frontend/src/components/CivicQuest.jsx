import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Shield } from 'lucide-react';

const TASKS = [
  { id: 'roadmap_viewed', label: 'Check Election Roadmap', points: 25 },
  { id: 'ballot_simulated', label: 'Practice with Ballot Simulator', points: 35 },
  { id: 'chat_used', label: 'Ask Myth-Buster AI a question', points: 40 },
];

const CivicQuest = ({ progress }) => {
  const [level, setLevel] = useState(1);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    let points = 0;
    TASKS.forEach(task => {
      if (progress.includes(task.id)) {
        points += task.points;
      }
    });
    setTotalPoints(points);
    
    if (points >= 100) setLevel(3);
    else if (points >= 50) setLevel(2);
    else setLevel(1);
    
  }, [progress]);

  const getRankName = () => {
    switch(level) {
      case 3: return 'Democracy Defender';
      case 2: return 'Informed Voter';
      default: return 'Civic Novice';
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -right-10 -top-10 opacity-10">
        <Shield size={160} />
      </div>

      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-indigo-100">
          <Trophy className="text-yellow-400" />
          Civic Quest
        </h2>

        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle cx="48" cy="48" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-700" />
              <motion.circle 
                cx="48" cy="48" r="36" 
                stroke="currentColor" 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray="226" 
                initial={{ strokeDashoffset: 226 }}
                animate={{ strokeDashoffset: 226 - (226 * (totalPoints / 100)) }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-indigo-400" 
              />
            </svg>
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
              <span className="text-sm text-indigo-200">Level</span>
              <span className="text-2xl font-bold">{level}</span>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{getRankName()}</h3>
            <p className="text-indigo-200 mt-1">{totalPoints} / 100 Points</p>
          </div>
        </div>

        <div className="space-y-3">
          {TASKS.map(task => {
            const isCompleted = progress.includes(task.id);
            return (
              <div 
                key={task.id} 
                className={`flex items-center justify-between p-3 rounded-lg border ${isCompleted ? 'bg-indigo-800/50 border-indigo-500/50' : 'bg-slate-800/50 border-slate-700'} transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-500'}`}>
                    {isCompleted ? <CheckCircle size={14} /> : <div className="w-2 h-2 rounded-full bg-slate-500" />}
                  </div>
                  <span className={isCompleted ? 'text-indigo-100' : 'text-slate-400'}>{task.label}</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-yellow-400">
                  <Star size={14} />
                  <span>{task.points}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Extracted simple check icon for this component
const CheckCircle = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);

export default CivicQuest;
