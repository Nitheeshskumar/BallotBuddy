import React, { useState, useEffect } from 'react';
import ElectionRoadmap from './components/ElectionRoadmap';
import BallotSimulator from './components/BallotSimulator';
import CivicQuest from './components/CivicQuest';
import MythBusterChat from './components/MythBusterChat';
import { Flag } from 'lucide-react';

function App() {
  const [progress, setProgress] = useState([]);

  // Load progress from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('civic_quest_progress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  const handleProgressUpdate = (taskId) => {
    setProgress((prev) => {
      if (!prev.includes(taskId)) {
        const newProgress = [...prev, taskId];
        localStorage.setItem('civic_quest_progress', JSON.stringify(newProgress));
        return newProgress;
      }
      return prev;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-700">
            <Flag size={28} className="fill-indigo-700" />
            <h1 className="text-2xl font-black tracking-tight">BallotBuddy</h1>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <a href="#roadmap" className="hover:text-indigo-600 transition-colors">Roadmap</a>
            <a href="#simulator" className="hover:text-indigo-600 transition-colors">Simulator</a>
            <a href="#quest" className="hover:text-indigo-600 transition-colors">Civic Quest</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Navigate the election process with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">confidence.</span>
          </h2>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Your interactive guide to voting. Find your polling location, practice casting your ballot, and get your questions answered by AI.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column: Roadmap & Simulator */}
          <div className="lg:col-span-8 space-y-8">
            <section id="roadmap">
              <ElectionRoadmap onProgressUpdate={handleProgressUpdate} />
            </section>
            
            <section id="simulator">
              <BallotSimulator onProgressUpdate={handleProgressUpdate} />
            </section>
          </div>

          {/* Right Column: Civic Quest & Chat */}
          <div className="lg:col-span-4 space-y-8">
            <section id="quest">
              <CivicQuest progress={progress} />
            </section>

            <section id="chat" className="sticky top-24">
              <MythBusterChat onProgressUpdate={handleProgressUpdate} />
            </section>
          </div>

        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} BallotBuddy. Built for educational purposes.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
