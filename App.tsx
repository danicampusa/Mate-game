import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Difficulty, Problem, Operation, Feedback } from './types';
import { GAME_DURATION, NUMBER_RANGES } from './constants';

// --- SVG Icon Components ---
const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.05 10.1c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.95-.69L11.049 2.927z" />
  </svg>
);

const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M17.625 3.375a2.25 2.25 0 00-2.25-2.25H8.625a2.25 2.25 0 00-2.25 2.25v.375c0 .355.07.701.206 1.026l.461 1.154a.75.75 0 001.32-.524V4.5a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v.88l1.32.527a.75.75 0 001.32-.527v-1.15a2.25 2.25 0 00-.206-1.026V3.375z" clipRule="evenodd" />
        <path d="M4.502 6.375a.75.75 0 01.75-.75h13.5a.75.75 0 01.75.75v1.125a.75.75 0 01-.75.75H5.252a.75.75 0 01-.75-.75V6.375z" />
        <path fillRule="evenodd" d="M5.632 9.75a.75.75 0 01.75-.75h2.751a.75.75 0 010 1.5H7.132v5.062a3.75 3.75 0 003.75 3.75h2.236a3.75 3.75 0 003.75-3.75V10.5h-1.001a.75.75 0 010-1.5h2.751a.75.75 0 01.75.75v5.25a5.25 5.25 0 01-5.25 5.25h-2.236a5.25 5.25 0 01-5.25-5.25v-4.5z" clipRule="evenodd" />
    </svg>
);


// --- UI Components ---
interface StartScreenProps {
  onStart: (difficulty: Difficulty) => void;
}
const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');

  const difficulties: { id: Difficulty; label: string; color: string }[] = [
    { id: 'easy', label: 'Fácil', color: 'bg-green-500 hover:bg-green-600' },
    { id: 'medium', label: 'Medio', color: 'bg-yellow-500 hover:bg-yellow-600' },
    { id: 'hard', label: 'Difícil', color: 'bg-red-500 hover:bg-red-600' },
  ];

  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">Juego de Matemáticas</h1>
      <p className="text-xl text-gray-600 mb-8">¡Practica sumas y restas!</p>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Elige la dificultad:</h2>
        <div className="flex justify-center gap-4">
          {difficulties.map(({ id, label, color }) => (
            <button
              key={id}
              onClick={() => setSelectedDifficulty(id)}
              className={`px-6 py-3 rounded-lg text-white font-semibold transition-all duration-300 ${selectedDifficulty === id ? 'ring-4 ring-offset-2 ring-blue-500' : ''} ${color}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={() => onStart(selectedDifficulty)}
        className="w-full max-w-xs px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 text-2xl"
      >
        Empezar
      </button>
    </div>
  );
};

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
}
const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart }) => (
  <div className="text-center">
    <TrophyIcon className="w-24 h-24 text-yellow-400 mx-auto mb-4" />
    <h1 className="text-5xl font-bold text-gray-800 mb-2">¡Juego Terminado!</h1>
    <p className="text-2xl text-gray-600 mb-8">Tu puntuación final es:</p>
    <p className="text-7xl font-bold text-blue-600 mb-10">{score}</p>
    <button
      onClick={onRestart}
      className="w-full max-w-xs px-8 py-4 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-300 text-2xl"
    >
      Jugar de Nuevo
    </button>
  </div>
);

interface GameUIProps {
    score: number;
    timeLeft: number;
    problem: Problem | null;
    userAnswer: string;
    onAnswerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    feedback: Feedback;
}
const GameUI: React.FC<GameUIProps> = ({ score, timeLeft, problem, userAnswer, onAnswerChange, onSubmit, feedback }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, [problem]);

    const getBorderColor = () => {
        switch (feedback) {
            case 'correct': return 'border-green-500';
            case 'incorrect': return 'border-red-500';
            default: return 'border-gray-300';
        }
    };
    
    if (!problem) return <div className="text-center text-xl">Cargando...</div>;

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-6 text-2xl font-semibold">
                <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
                    <StarIcon className="w-7 h-7" />
                    <span>{score}</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                    <ClockIcon className="w-7 h-7" />
                    <span>{timeLeft}s</span>
                </div>
            </div>

            <div className="bg-gray-100 p-8 rounded-xl shadow-inner mb-6">
                <p className="text-6xl text-center font-bold text-gray-700 tracking-wider">
                    {problem.num1} {problem.operation} {problem.num2}
                </p>
            </div>

            <form onSubmit={onSubmit}>
                <input
                    ref={inputRef}
                    type="number"
                    value={userAnswer}
                    onChange={onAnswerChange}
                    className={`w-full text-center text-4xl p-4 border-4 ${getBorderColor()} rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300`}
                    placeholder="?"
                    autoFocus
                />
            </form>
        </div>
    );
};


// --- Main App Component ---
export default function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<Feedback>('idle');

  const generateProblem = useCallback(() => {
    const maxNumber = NUMBER_RANGES[difficulty];
    const operation: Operation = Math.random() > 0.5 ? '+' : '-';
    
    let num1 = Math.floor(Math.random() * (maxNumber + 1));
    let num2 = Math.floor(Math.random() * (maxNumber + 1));

    if (operation === '-') {
      if (num1 < num2) {
        [num1, num2] = [num2, num1]; // Swap to ensure positive result
      }
    }

    const answer = operation === '+' ? num1 + num2 : num1 - num2;
    setCurrentProblem({ num1, num2, operation, answer });
  }, [difficulty]);

  useEffect(() => {
    if (gameState === 'playing') {
      generateProblem();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]); // Only run when game starts

  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
      setGameState('gameOver');
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [gameState, timeLeft]);
  
  const handleStartGame = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setScore(0);
    setTimeLeft(GAME_DURATION[selectedDifficulty]);
    setUserAnswer('');
    setFeedback('idle');
    setGameState('playing');
  };

  const handleRestart = () => {
    setGameState('start');
  };

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer) return;

    const answerNumber = parseInt(userAnswer, 10);
    if (answerNumber === currentProblem?.answer) {
      setScore(prev => prev + 1);
      setFeedback('correct');
      generateProblem();
      setUserAnswer('');
    } else {
      setFeedback('incorrect');
    }

    setTimeout(() => setFeedback('idle'), 1000);
  };
  
  const renderContent = () => {
    switch (gameState) {
      case 'start':
        return <StartScreen onStart={handleStartGame} />;
      case 'playing':
        return <GameUI 
                    score={score}
                    timeLeft={timeLeft}
                    problem={currentProblem}
                    userAnswer={userAnswer}
                    onAnswerChange={(e) => setUserAnswer(e.target.value)}
                    onSubmit={handleAnswerSubmit}
                    feedback={feedback}
                />;
      case 'gameOver':
        return <GameOverScreen score={score} onRestart={handleRestart} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 to-blue-500 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-10 transition-all duration-500">
        {renderContent()}
      </div>
    </div>
  );
}