import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BugType, GameState } from './types';
import { RenderBug, HammerIcon, CrossIcon, PauseIcon, PlayIcon, HomeIcon, VolumeIcon, MuteIcon } from './components/BugIcons';
import { initAudio, playScoreSound, playErrorSound, playGameOverSound, playClickSound, startBGM, stopBGM, toggleMute, playHitSound } from './audio';

// --- Constants ---
const GRID_SIZE = 9;
const GAME_DURATION = 60; // seconds
const BUG_STAY_DURATION = 2000; // ms (bugs stay up for 2 seconds)
const SPAWN_INTERVAL = 1000; // ms (try to spawn new bugs every second)

// Define character pools
const SHERIFF_CANDIDATES = [
  BugType.LADYBUG,
  BugType.BLACK_ANT,
  BugType.SPIDER,
  BugType.CATERPILLAR
];

const MOLE_CANDIDATES = [
  BugType.FLY,
  BugType.BEE,
  BugType.RED_ANT,
  BugType.DRAGONFLY,
  BugType.LOCUST
];

// Combined list for logic that needs everything
const ALL_GAME_BUGS = [...SHERIFF_CANDIDATES, ...MOLE_CANDIDATES];

const BUG_NAMES: Record<BugType, string> = {
  [BugType.LADYBUG]: '瓢虫',
  [BugType.SPIDER]: '蜘蛛',
  [BugType.FLY]: '苍蝇',
  [BugType.BEE]: '蜜蜂',
  [BugType.CATERPILLAR]: '毛毛虫',
  [BugType.BLACK_ANT]: '黑色蚂蚁',
  [BugType.RED_ANT]: '红色蚂蚁',
  [BugType.DRAGONFLY]: '蜻蜓',
  [BugType.LOCUST]: '蝗虫',
  [BugType.NONE]: '',
};

// --- Components ---

// 1. Custom Cursor Component
const CustomCursor = ({ bugType }: { bugType: BugType }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 transition-transform duration-75 hidden md:block"
      style={{
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) scale(${isClicking ? 0.8 : 1}) rotate(-15deg)`,
      }}
    >
      <div className="relative">
        <RenderBug type={bugType} className="w-16 h-16 drop-shadow-2xl filter" />
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-xs font-bold px-2 py-0.5 rounded-full border border-black shadow">
          警长
        </div>
      </div>
    </div>
  );
};

// 2. The Game Hole Component
interface HoleProps {
  index: number;
  bugType: BugType;
  onWhack: (index: number) => void;
  effect: 'CAUGHT' | 'WRONG' | null;
}

const Hole: React.FC<HoleProps> = ({ index, bugType, onWhack, effect }) => {
  return (
    <div className="relative w-full aspect-square flex flex-col justify-end items-center mb-4">
      
      {/* 1. Back part of the Dirt Mound (Behind Bug) */}
      <div className="absolute bottom-[10%] w-[90%] h-[35%] bg-[#8B4513] rounded-full transform scale-x-110"></div>
      
      {/* 2. The Hole (Darkness) */}
      <div className="absolute bottom-[18%] w-[80%] h-[25%] bg-[#3E2723] rounded-full shadow-[inset_0_5px_15px_rgba(0,0,0,0.8)]"></div>

      {/* 3. The Bug - Positioned to animate out of hole */}
      <div 
        className={`absolute z-10 bottom-[15%] w-[65%] h-[120%] transition-transform duration-300 cubic-bezier(0.34, 1.56, 0.64, 1) cursor-pointer flex items-end justify-center pb-[10%]
          ${bugType !== BugType.NONE ? 'translate-y-0' : 'translate-y-[60%]'}
        `}
        style={{
             // Ensure the bug is hidden when retracted (by being behind the front mound or masked)
        }}
        onClick={() => {
           if (bugType !== BugType.NONE && !effect) {
               onWhack(index);
           }
        }}
        onTouchStart={(e) => {
            if (bugType !== BugType.NONE && !effect) {
                e.preventDefault();
                onWhack(index);
            }
        }}
      >
        <div className={`w-full relative ${bugType !== BugType.NONE && effect !== 'CAUGHT' ? 'animate-bounce-small' : ''}`}>
             <RenderBug 
                type={bugType} 
                className={`w-full drop-shadow-xl ${effect === 'CAUGHT' ? 'animate-shake' : ''}`} 
                isDizzy={effect === 'CAUGHT'}
             />
        </div>
      </div>

      {/* 4. Front part of the Dirt Mound (In front of Bug) - The "Donut" Front */}
      <div className="absolute bottom-[5%] w-[90%] h-[30%] bg-[#8B4513] rounded-full z-20 flex items-center justify-center shadow-lg">
           {/* Inner lighter dirt detail */}
           <div className="w-[90%] h-[80%] bg-[#A0522D] rounded-full opacity-30 blur-[1px]"></div>
           {/* Stones for detail */}
           <div className="absolute bottom-2 left-4 w-3 h-2 bg-stone-400 rounded-full shadow border-b border-stone-600"></div>
           <div className="absolute bottom-3 right-8 w-2 h-2 bg-stone-300 rounded-full shadow border-b border-stone-500"></div>
           <div className="absolute bottom-1 right-12 w-4 h-3 bg-stone-500 rounded-full shadow border-b border-stone-700"></div>
           {/* Grass tufts */}
           <div className="absolute -bottom-1 -left-2 w-4 h-4 bg-green-600 rotate-45 rounded-tr-lg"></div>
           <div className="absolute -bottom-1 -right-2 w-3 h-5 bg-green-500 -rotate-12 rounded-tl-lg"></div>
      </div>
      
      {/* 5. Masking layer for bottom of hole (hides bug when fully retracted) */}
      <div className="absolute bottom-0 w-full h-[15%] bg-transparent z-10 overflow-hidden">
         {/* This is just a spacer/helper, the Z-ordering above handles most masking */}
      </div>

      {/* Effects */}
      {effect === 'CAUGHT' && (
         <div className="absolute bottom-[30%] -right-[15%] z-40 w-[120%] animate-hammer-hit pointer-events-none origin-bottom-right">
             <HammerIcon className="w-full drop-shadow-2xl" />
         </div>
      )}

      {effect === 'WRONG' && (
         <div className="absolute -top-4 z-30 w-2/3 animate-bounce-in pointer-events-none">
             <CrossIcon className="w-full drop-shadow-lg" />
         </div>
      )}

      <style>{`
          @keyframes bounce-small {
              0%, 100% { transform: translateY(0) scaleY(1); }
              50% { transform: translateY(-5%) scaleY(1.05); }
          }
          @keyframes hammer-hit {
              0% { transform: rotate(45deg) scale(0.8); opacity: 0; }
              20% { transform: rotate(45deg) scale(1.1); opacity: 1; }
              50% { transform: rotate(-45deg) scale(1); }
              100% { transform: rotate(-45deg) scale(1); opacity: 0; }
          }
          @keyframes shake {
              0%, 100% { transform: translateX(0); }
              25% { transform: translateX(-5px) rotate(-5deg); }
              75% { transform: translateX(5px) rotate(5deg); }
          }
          .animate-bounce-small {
              animation: bounce-small 2s infinite ease-in-out;
          }
          .animate-hammer-hit {
              animation: hammer-hit 0.4s ease-out forwards;
          }
          .animate-shake {
              animation: shake 0.3s ease-in-out infinite;
          }
      `}</style>
    </div>
  );
};

// 3. Garden Background Component
const GardenBackground = () => (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none bg-[#8BC34A]">
      {/* Grass Texture Pattern */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `
            radial-gradient(circle at 10% 20%, #7CB342 2px, transparent 2.5px),
            radial-gradient(circle at 90% 80%, #7CB342 2px, transparent 2.5px),
            radial-gradient(circle at 50% 50%, #689F38 3px, transparent 3.5px),
            radial-gradient(circle at 30% 70%, #AED581 2px, transparent 2.5px)
        `,
        backgroundSize: '60px 60px'
      }}></div>

      {/* Sunflower */}
      <div className="absolute -bottom-8 -left-8 md:-bottom-12 md:-left-12 w-[180px] h-[280px] md:w-[300px] md:h-[450px] origin-bottom animate-sway">
          <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl opacity-90">
              {/* Stem */}
              <path d="M100 300 Q110 200 100 100" stroke="#558b2f" strokeWidth="12" strokeLinecap="round"/>
              {/* Leaves */}
              <path d="M100 220 Q40 200 30 180 Q50 240 100 240" fill="#7cb342" stroke="#558b2f" strokeWidth="2" />
              <path d="M100 180 Q160 160 170 140 Q150 200 100 200" fill="#7cb342" stroke="#558b2f" strokeWidth="2" />
  
              {/* Petals */}
              <g transform="translate(100, 100)">
                   {[...Array(12)].map((_, i) => (
                      <ellipse 
                        key={i} 
                        cx="0" cy="-60" rx="14" ry="40" 
                        fill="#fdd835" 
                        stroke="#fbc02d" 
                        strokeWidth="2" 
                        transform={`rotate(${i * 30})`} 
                      />
                   ))}
              </g>
               {/* Center */}
              <circle cx="100" cy="100" r="38" fill="#5d4037" stroke="#3e2723" strokeWidth="3" />
               {/* Face */}
               <g opacity="0.8">
                <circle cx="88" cy="90" r="4" fill="white" />
                <circle cx="112" cy="90" r="4" fill="white" />
                <circle cx="88" cy="90" r="2" fill="#3e2723" />
                <circle cx="112" cy="90" r="2" fill="#3e2723" />
                <path d="M92 110 Q100 115 108 110" stroke="white" strokeWidth="2" strokeLinecap="round" />
               </g>
          </svg>
      </div>

      <style>{`
        @keyframes sway {
            0%, 100% { transform: rotate(-3deg); }
            50% { transform: rotate(3deg); }
        }
        .animate-sway {
            animation: sway 6s ease-in-out infinite;
        }
      `}</style>

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.1)_100%)]"></div>
    </div>
  );

// --- Main App ---

export default function App() {
  const [gameState, setGameState] = useState<GameState>('MENU');
  
  // Settings
  const [sheriffBug, setSheriffBug] = useState<BugType>(BugType.LADYBUG);
  const [moleBugs, setMoleBugs] = useState<BugType[]>([BugType.FLY, BugType.BEE, BugType.LOCUST]);
  
  // Audio State
  const [isMuted, setIsMuted] = useState(false);

  // Game State
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [grid, setGrid] = useState<BugType[]>(Array(GRID_SIZE).fill(BugType.NONE));
  // Track visual effects per hole: index -> 'CAUGHT' or 'WRONG'
  const [holeEffects, setHoleEffects] = useState<Record<number, 'CAUGHT' | 'WRONG'>>({});
  
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('ladybug_highscore');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [hitFeedback, setHitFeedback] = useState<{id: number, x: number, y: number, text: string, color: string}[]>([]);

  // Loop Management
  const timerRef = useRef<number | null>(null);
  const spawnIntervalRef = useRef<number | null>(null);
  // Store timeout IDs for each hole to cancel them if whacked or game ends
  const holeTimeoutsRef = useRef<Record<number, number>>({});
  
  // Keep a ref to the grid state so the interval can read the latest without being in dependency array
  const gridRef = useRef(grid);
  useEffect(() => { gridRef.current = grid; }, [grid]);

  // --- Logic ---

  // Generate a new batch of bugs
  const spawnBugs = useCallback(() => {
    // 1. Identify empty holes using the latest grid from ref
    const currentGrid = gridRef.current;
    const emptyIndices = currentGrid.map((b, i) => b === BugType.NONE ? i : -1).filter(i => i !== -1);
    
    if (emptyIndices.length === 0) return;

    // 2. Decide how many to spawn (1 to 3, but not more than available)
    const count = Math.min(Math.floor(Math.random() * 3) + 1, emptyIndices.length);

    // 3. Select random unique holes
    const selectedIndices: number[] = [];
    const pool = [...emptyIndices];
    for(let i=0; i<count; i++) {
        const randIndex = Math.floor(Math.random() * pool.length);
        selectedIndices.push(pool[randIndex]);
        pool.splice(randIndex, 1);
    }

    // 4. Update Grid and Set Individual Timeouts
    const possibleBugs = ALL_GAME_BUGS.filter(b => b !== sheriffBug);
    
    setGrid(prev => {
        const next = [...prev];
        selectedIndices.forEach(idx => {
             const randomBug = possibleBugs[Math.floor(Math.random() * possibleBugs.length)];
             next[idx] = randomBug;
             
             // Safety: Clear any existing timeout for this hole (should be none if it was empty)
             if (holeTimeoutsRef.current[idx]) clearTimeout(holeTimeoutsRef.current[idx]);

             // Set auto-retract timeout
             const timeoutId = window.setTimeout(() => {
                 setGrid(g => {
                     const gNext = [...g];
                     // Only clear if it hasn't been whacked (still has a bug)
                     if (gNext[idx] !== BugType.NONE) {
                         gNext[idx] = BugType.NONE;
                     }
                     return gNext;
                 });
                 delete holeTimeoutsRef.current[idx];
             }, BUG_STAY_DURATION); 
             
             holeTimeoutsRef.current[idx] = timeoutId;
        });
        return next;
    });

  }, [sheriffBug]);


  // Game Loop and Timer
  useEffect(() => {
    if (gameState === 'PLAYING') {
      // Main Countdown Timer
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState('GAME_OVER');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Spawn Loop
      spawnIntervalRef.current = window.setInterval(spawnBugs, SPAWN_INTERVAL);

      // Initial spawn
      spawnBugs();

    } else {
      // Cleanup when not playing
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
      
      // Clear individual hole timeouts
      Object.values(holeTimeoutsRef.current).forEach(id => clearTimeout(id as number));
      holeTimeoutsRef.current = {};
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
    };
  }, [gameState, spawnBugs]);

  // Handle Game Over Sound
  useEffect(() => {
      if (gameState === 'GAME_OVER') {
          playGameOverSound();
          stopBGM(); // Stop music on game over or keep it? Maybe keep it for vibe, but typical to stop or change. Let's stop to emphasize game over sound.
      }
  }, [gameState]);

  // High Score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('ladybug_highscore', score.toString());
    }
  }, [score, highScore]);


  const handleStartGame = () => {
      playClickSound();
      initAudio(); // Essential for mobile/first interaction
      setGameState('SETUP');
      // Start BGM early for fun
      startBGM();
  };

  const handleReallyStartGame = () => {
      playClickSound();
      setScore(0);
      setTimeLeft(GAME_DURATION);
      setGrid(Array(GRID_SIZE).fill(BugType.NONE));
      setHoleEffects({});
      setGameState('PLAYING');
      startBGM(); // Ensure it's running
  };
  
  const pauseGame = () => {
      playClickSound();
      if (gameState === 'PLAYING') {
          setGameState('PAUSED');
      }
  };
  
  const resumeGame = () => {
      playClickSound();
      if (gameState === 'PAUSED') {
          setGameState('PLAYING');
      }
  };
  
  const quitToMenu = () => {
      playClickSound();
      setGameState('MENU');
      setHitFeedback([]);
      // Maybe stop music if we consider MENU "silent" or keep it. Let's keep it.
  };

  const handleToggleMute = () => {
      const muted = toggleMute();
      setIsMuted(muted);
      if (!muted) playClickSound();
  };

  const handleWhack = (index: number) => {
    if (gameState !== 'PLAYING') return;
    const bug = grid[index];
    if (bug === BugType.NONE) return;
    
    // Prevent double clicking while animation is playing
    if (holeEffects[index]) return;

    // IMPORTANT: Clear the auto-retract timeout for this hole immediately
    if (holeTimeoutsRef.current[index]) {
        clearTimeout(holeTimeoutsRef.current[index] as number);
        delete holeTimeoutsRef.current[index];
    }

    // Feedback Helper
    const showFeedback = (text: string, color: string) => {
        const element = document.getElementById(`hole-${index}`);
        if (element) {
            const rect = element.getBoundingClientRect();
            const id = Date.now();
            setHitFeedback(prev => [...prev, {
                id,
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
                text,
                color
            }]);
            setTimeout(() => setHitFeedback(prev => prev.filter(item => item.id !== id)), 800);
        }
    };

    if (moleBugs.includes(bug)) {
        // HIT CORRECT MOLE
        setScore(prev => prev + 10);
        playScoreSound();
        playHitSound();
        
        // Trigger Hammer Animation & Dizzy State
        setHoleEffects(prev => ({ ...prev, [index]: 'CAUGHT' }));
        showFeedback("+10", "text-yellow-400");
        
        // Clear effect and bug after animation
        setTimeout(() => {
            // Only clear if the game is still running (or paused), to avoid race conditions with game over
            // And if the effect is still this one
            setHoleEffects(prev => {
                const next = { ...prev };
                delete next[index];
                return next;
            });
             setGrid(prev => {
                 const next = [...prev];
                 // Remove bug
                 if (next[index] !== BugType.NONE) {
                    next[index] = BugType.NONE;
                 }
                 return next;
             });
        }, 600); // 600ms to allow hammer hit + dizzy look

    } else {
        // HIT WRONG TARGET
        setScore(prev => Math.max(0, prev - 5)); // Deduct 5 points, but min 0
        playErrorSound();
        setHoleEffects(prev => ({ ...prev, [index]: 'WRONG' }));
        showFeedback("-5", "text-red-500");
        
        setTimeout(() => {
            setHoleEffects(prev => {
                const next = { ...prev };
                delete next[index];
                return next;
            });
             setGrid(prev => {
                const next = [...prev];
                if (next[index] !== BugType.NONE) {
                   next[index] = BugType.NONE;
                }
                return next;
            });
        }, 800);
    }
  };

  const toggleMole = (bug: BugType) => {
    playClickSound();
    setMoleBugs(prev => {
        if (prev.includes(bug)) {
            // Prevent removing the last mole (must have at least 1)
            if (prev.length === 1) return prev;
            return prev.filter(b => b !== bug);
        } else {
            return [...prev, bug];
        }
    });
  };

  const selectSheriff = (bug: BugType) => {
      playClickSound();
      setSheriffBug(bug);
  };

  return (
    <div className="min-h-screen bg-green-200 flex flex-col items-center select-none overflow-hidden relative font-sans">
      <GardenBackground />
      <CustomCursor bugType={sheriffBug} />
      
      {/* Global Mute Button */}
      <button 
        onClick={handleToggleMute}
        className="fixed top-4 left-4 z-50 bg-white/80 p-2 rounded-full border-2 border-slate-400 shadow hover:bg-white active:scale-95 transition-all"
        aria-label="Toggle Mute"
      >
        {isMuted ? (
            <MuteIcon className="w-8 h-8 text-slate-500" />
        ) : (
            <VolumeIcon className="w-8 h-8 text-slate-700" />
        )}
      </button>
      
      {/* --- HUD (Only in Game) --- */}
      {(gameState === 'PLAYING' || gameState === 'PAUSED') && (
        <header className="w-full max-w-2xl flex justify-between items-center p-4 z-20 mt-2 relative">
            {/* Pause Button */}
            {gameState === 'PLAYING' && (
                <button 
                    onClick={pauseGame}
                    className="absolute -top-2 right-4 md:right-0 bg-white/80 p-2 rounded-full border-2 border-slate-400 shadow-lg hover:bg-white active:scale-95 transition-all z-50"
                    aria-label="Pause Game"
                >
                    <PauseIcon className="w-8 h-8 text-slate-700" />
                </button>
            )}

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 border-2 border-sky-500 shadow-lg transform -rotate-2">
                <span className="text-sky-800 font-bold text-lg md:text-xl block text-center">得分</span>
                <span className="text-3xl md:text-4xl font-black text-sky-600 block text-center">{score}</span>
            </div>

            <div className="relative">
                <div className="bg-white/90 backdrop-blur rounded-full w-24 h-24 flex items-center justify-center border-4 border-yellow-400 shadow-xl z-10">
                    <span className={`text-4xl font-black ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-slate-700'}`}>
                        {timeLeft}
                    </span>
                </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2 border-2 border-amber-500 shadow-lg transform rotate-2">
                <span className="text-amber-800 font-bold text-lg md:text-xl block text-center">最高分</span>
                <span className="text-3xl md:text-4xl font-black text-amber-600 block text-center">{highScore}</span>
            </div>
        </header>
      )}

      {/* --- Main Game Area --- */}
      <main className="flex-1 w-full max-w-md md:max-w-2xl p-4 flex flex-col justify-center z-10">
        {(gameState === 'PLAYING' || gameState === 'PAUSED') && (
            <div className={`grid grid-cols-3 gap-6 md:gap-12 p-4 transition-opacity duration-300 ${gameState === 'PAUSED' ? 'opacity-50 grayscale' : 'opacity-100'}`}>
            {grid.map((bug, i) => (
                <div key={i} id={`hole-${i}`}>
                    <Hole 
                        index={i} 
                        bugType={bug} 
                        onWhack={handleWhack} 
                        effect={holeEffects[i] || null}
                    />
                </div>
            ))}
            </div>
        )}
      </main>

      {/* --- Visual Hit Feedback --- */}
      {hitFeedback.map(fb => (
          <div 
            key={fb.id}
            className={`fixed pointer-events-none z-50 text-4xl font-black drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] animate-[pop-up_0.5s_ease-out_forwards] ${fb.color}`}
            style={{ left: fb.x, top: fb.y }}
          >
              {fb.text}
          </div>
      ))}

      {/* --- MENU Screen --- */}
      {gameState === 'MENU' && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border-8 border-sky-400 shadow-2xl animate-pop">
            <div className="flex justify-center mb-6">
                <RenderBug type={BugType.LADYBUG} className="w-32 h-32 animate-bounce" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-2 tracking-tight">
                <span className="text-red-500">瓢虫警长</span>大作战
            </h1>
            <p className="text-slate-500 mb-8 text-lg font-medium">
                抓住坏蛋，保护森林！
            </p>
            <button 
                onClick={handleStartGame}
                className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white text-3xl font-black py-4 rounded-2xl shadow-[0_6px_0_#15803d] active:shadow-none active:translate-y-[6px] transition-all transform hover:scale-105"
            >
                开始游戏!
            </button>
          </div>
        </div>
      )}

      {/* --- PAUSE Overlay --- */}
      {gameState === 'PAUSED' && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center border-8 border-amber-400 shadow-2xl animate-pop">
            <h2 className="text-4xl font-black text-slate-800 mb-6">游戏暂停</h2>
            <div className="flex flex-col gap-4">
                <button 
                    onClick={resumeGame}
                    className="w-full bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-3 rounded-xl shadow-[0_4px_0_#15803d] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center gap-2"
                >
                    <PlayIcon className="w-8 h-8" /> 继续游戏
                </button>
                <button 
                    onClick={quitToMenu}
                    className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 text-xl font-bold py-3 rounded-xl shadow-[0_4px_0_#94a3b8] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center gap-2"
                >
                    <HomeIcon className="w-6 h-6" /> 返回主页
                </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SETUP Screen --- */}
      {gameState === 'SETUP' && (
         <div className="absolute inset-0 bg-sky-100/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4 overflow-y-auto">
             <div className="bg-white/95 rounded-3xl p-6 w-full max-w-2xl border-4 border-sky-300 shadow-xl">
                 <h2 className="text-3xl font-black text-center text-slate-800 mb-6">角色选择</h2>
                 
                 {/* Step 1: Sheriff */}
                 <div className="mb-8">
                     <div className="flex items-center gap-2 mb-4">
                         <div className="bg-yellow-400 rounded-full p-2">
                            <svg className="w-6 h-6 text-yellow-900" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                         </div>
                         <h3 className="text-xl font-bold text-slate-700">第一步：谁是警长? <span className="text-sm font-normal text-slate-500">(玩家)</span></h3>
                     </div>
                     <div className="flex justify-center gap-4 flex-wrap">
                         {SHERIFF_CANDIDATES.map(bug => (
                             <button
                                key={bug}
                                onClick={() => selectSheriff(bug)}
                                className={`relative w-20 h-20 p-2 rounded-2xl transition-all transform hover:scale-110 
                                    ${sheriffBug === bug 
                                        ? 'bg-yellow-100 border-4 border-yellow-400 shadow-lg scale-110 ring-4 ring-yellow-200' 
                                        : 'bg-slate-100 border-2 border-slate-200 opacity-60 hover:opacity-100'}`}
                             >
                                 <RenderBug type={bug} className="w-full h-full" />
                                 <div className="text-xs font-bold text-center mt-1 text-slate-600">{BUG_NAMES[bug]}</div>
                                 {sheriffBug === bug && (
                                     <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow border border-yellow-600">
                                         我来抓!
                                     </div>
                                 )}
                             </button>
                         ))}
                     </div>
                 </div>

                 {/* Step 2: Moles */}
                 <div className="mb-8">
                     <div className="flex items-center gap-2 mb-4">
                        <div className="bg-red-400 rounded-full p-2">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                         </div>
                         <h3 className="text-xl font-bold text-slate-700">第二步：谁是捣蛋鬼? <span className="text-sm font-normal text-slate-500">(抓这些得分)</span></h3>
                     </div>
                     <div className="flex justify-center gap-4 flex-wrap">
                         {MOLE_CANDIDATES.map(bug => {
                             const isMole = moleBugs.includes(bug);
                             return (
                                <button
                                    key={bug}
                                    onClick={() => toggleMole(bug)}
                                    className={`relative w-20 h-20 p-2 rounded-2xl transition-all transform hover:scale-105 
                                        ${isMole 
                                            ? 'bg-red-50 border-4 border-red-500 shadow-md' 
                                            : 'bg-green-50 border-4 border-green-400 opacity-80'}`}
                                >
                                    <RenderBug type={bug} className="w-full h-full" />
                                    <div className="text-xs font-bold text-center mt-1 text-slate-600">{BUG_NAMES[bug]}</div>
                                    {isMole ? (
                                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded shadow">悬赏</div>
                                    ) : (
                                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded shadow">良民</div>
                                    )}
                                </button>
                             );
                         })}
                     </div>
                     <p className="text-center text-sm text-slate-400 mt-2">注意：打中良民不得分哦！</p>
                 </div>

                 <button 
                    onClick={handleReallyStartGame}
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white text-2xl font-bold py-4 rounded-xl shadow-[0_4px_0_#0369a1] active:shadow-none active:translate-y-[4px] transition-all"
                >
                    准备好了，出发!
                </button>
             </div>
         </div>
      )}

      {/* --- GAME OVER --- */}
      {gameState === 'GAME_OVER' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center border-8 border-red-400 shadow-2xl animate-pop">
            <h2 className="text-4xl font-black text-slate-800 mb-2">时间到!</h2>
            
            {/* New Result Text */}
            <div className="text-2xl md:text-3xl font-black mb-4">
                {score < 100 ? (
                    <span className="text-slate-500">抓捕行动失败 😞</span>
                ) : score <= 200 ? (
                    <span className="text-green-500">抓捕行动成功 👮</span>
                ) : (
                    <span className="text-amber-500">行动非常成功，Good！ 🌟</span>
                )}
            </div>

            <div className="my-6">
                <div className="text-lg text-slate-500 font-bold uppercase mb-1">最终得分</div>
                <div className="text-6xl font-black text-amber-500 drop-shadow-sm">{score}</div>
            </div>
            
            {score >= highScore && score > 0 && (
                 <div className="mb-6 bg-yellow-100 border-2 border-yellow-400 text-yellow-700 px-4 py-2 rounded-xl font-bold animate-pulse">
                     🏆 新纪录! 太棒了!
                 </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => { playClickSound(); setGameState('SETUP'); }}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 rounded-xl shadow-[0_4px_0_#94a3b8] active:shadow-none active:translate-y-[4px] transition-all"
                >
                    重新设置
                </button>
                <button 
                    onClick={handleReallyStartGame}
                    className="bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-500 hover:to-blue-700 text-white font-bold py-3 rounded-xl shadow-[0_4px_0_#1d4ed8] active:shadow-none active:translate-y-[4px] transition-all"
                >
                    再玩一次
                </button>
            </div>
          </div>
        </div>
      )}

      <footer className="absolute bottom-2 text-green-800/50 text-xs font-semibold">
          专为 3-12 岁小朋友设计 🐞
      </footer>
    </div>
  );
}