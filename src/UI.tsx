import { useState, useEffect } from 'react';
import { useGameStore, Theme, Trail } from './store';
import { motion, AnimatePresence } from 'framer-motion';
import { Diamond, Trophy, Play, RotateCcw, Settings, ShoppingCart, X, Check, Video, ArrowUp, ArrowDown, Home } from 'lucide-react';
import { playSound } from './sound';
import { getTranslation } from './translations';

function ToggleRow({ label, value, onClick }: { label: string, value: boolean, onClick: () => void }) {
  return (
    <div className="flex justify-between items-center p-4 bg-io-bg rounded-2xl cursor-pointer hover:bg-slate-200 transition-colors" onClick={() => { playSound('click'); onClick(); }}>
      <span className="font-bold text-io-dark">{label}</span>
      <div className={`w-14 h-7 rounded-full relative transition-colors ${value ? 'bg-io-green' : 'bg-slate-300'}`}>
        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${value ? 'right-1' : 'left-1'}`} />
      </div>
    </div>
  );
}

function SelectRow({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (val: string) => void }) {
  return (
    <div className="flex justify-between items-center p-4 bg-io-bg rounded-2xl">
      <span className="font-bold text-io-dark">{label}</span>
      <select 
        value={value} 
        onChange={(e) => { playSound('click'); onChange(e.target.value); }}
        className="bg-white border-2 border-slate-200 rounded-xl px-3 py-2 text-io-dark font-bold outline-none focus:border-io-blue"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function SliderRow({ label, value, min, max, onChange }: { label: string, value: number, min: number, max: number, onChange: (val: number) => void }) {
  return (
    <div className="flex flex-col p-4 bg-io-bg rounded-2xl">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-io-dark">{label}</span>
        <span className="font-bold text-io-blue">{value}%</span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        value={value} 
        onChange={(e) => { playSound('click'); onChange(Number(e.target.value)); }}
        className="w-full h-3 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-io-blue"
      />
    </div>
  );
}

export function UI() {
  const { 
    status, score, bestScore, diamonds, showPerfect, flyingDiamonds, setStatus, resetGame, continueGame,
    theme, trail, unlockedThemes, unlockedTrails, buyTheme, buyTrail, setTheme, setTrail,
    sound, haptics, effectsLevel, cameraShake, feverEffects, language, hasSeenTutorial, hasContinued,
    controlMode, sensitivity, playerSizeIndex,
    toggleSound, toggleHaptics, setEffectsLevel, toggleCameraShake, toggleFeverEffects, setLanguage, setHasSeenTutorial,
    setControlMode, setSensitivity, setPlayerSizeIndex,
    removeFlyingDiamond, addDiamonds
  } = useGameStore();

  const [diamondPop, setDiamondPop] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [continueTimer, setContinueTimer] = useState(7);
  
  useEffect(() => {
    if (showSplash) {
      const t = setTimeout(() => setShowSplash(false), 2000);
      return () => clearTimeout(t);
    }
  }, [showSplash]);

  useEffect(() => {
    if (status === 'continue') {
      setContinueTimer(7);
    }
  }, [status]);

  useEffect(() => {
    if (status === 'continue' && continueTimer > 0) {
      const t = setTimeout(() => setContinueTimer(c => c - 1), 1000);
      return () => clearTimeout(t);
    } else if (status === 'continue' && continueTimer === 0) {
      setStatus('gameover');
    }
  }, [status, continueTimer, setStatus]);

  useEffect(() => {
    if (diamonds > 0) {
      setDiamondPop(true);
      const t = setTimeout(() => setDiamondPop(false), 300);
      return () => clearTimeout(t);
    }
  }, [diamonds]);

  const handleSoundClick = () => {
    playSound('click');
  };

  const themes: { id: Theme; name: string; cost: number; color: string }[] = [
    { id: 'light', name: 'Classic Light', cost: 0, color: '#f0f4f8' },
    { id: 'city', name: 'City Night', cost: 50, color: '#2c3e50' },
    { id: 'lava', name: 'Lava Land', cost: 100, color: '#ffb347' },
    { id: 'beach', name: 'Tropical Beach', cost: 200, color: '#87CEEB' },
    { id: 'forest', name: 'Deep Forest', cost: 300, color: '#a8e6cf' },
    { id: 'ice', name: 'Arctic Ice', cost: 400, color: '#d4f1f9' },
    { id: 'desert', name: 'Golden Desert', cost: 500, color: '#f5d0a9' },
    { id: 'candy', name: 'Candy Land', cost: 600, color: '#ffb7b2' },
  ];

  const trails: { id: Trail; name: string; cost: number }[] = [
    { id: 'none', name: 'None', cost: 0 },
    { id: 'neon', name: 'Neon', cost: 50 },
    { id: 'fire', name: 'Fire', cost: 150 },
    { id: 'water', name: 'Water', cost: 250 },
    { id: 'jelly', name: 'Jelly', cost: 350 },
    { id: 'vines', name: 'Vines', cost: 450 },
    { id: 'ice', name: 'Ice', cost: 550 },
    { id: 'sand', name: 'Sand', cost: 650 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden font-sans select-none text-io-dark">
      <AnimatePresence>
        {showSplash && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-[100] bg-io-bg flex flex-col items-center justify-center pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-io-blue text-5xl font-black tracking-tighter mt-32"
            >
              PERFECT FIT
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {status === 'playing' && (
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10 pointer-events-none">
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => {
                useGameStore.setState({ hasContinued: false });
                setStatus('menu');
              }} 
              className="w-14 h-14 bg-white/80 rounded-2xl flex items-center justify-center backdrop-blur-md pointer-events-auto shadow-lg hover:bg-white transition-colors"
            >
              <Home size={24} className="text-io-dark" />
            </button>
            <div className="text-io-dark text-6xl font-black tracking-tighter">
              {score}
            </div>
          </div>
          <motion.div 
            animate={diamondPop ? { scale: [1, 1.2, 1] } : {}}
            className="flex items-center gap-2 text-io-orange font-bold bg-white/80 px-6 py-3 rounded-full backdrop-blur-md shadow-lg pointer-events-auto"
          >
            <Diamond size={20} className="fill-io-orange" />
            <span className="text-xl font-bold">{diamonds}</span>
          </motion.div>
        </div>
      )}

      {status === 'playing' && controlMode === 'buttons' && (
        <div className="absolute bottom-10 left-0 right-0 flex justify-between px-10 pointer-events-auto">
          <button 
            onClick={(e) => { e.stopPropagation(); playSound('click'); setPlayerSizeIndex(Math.max(0, playerSizeIndex - 1)); }}
            className="w-20 h-20 bg-white/80 dark:bg-black/50 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg hover:bg-white dark:hover:bg-black/70 transition-colors pointer-events-auto"
          >
            <ArrowDown size={40} className="text-slate-800 dark:text-white" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); playSound('click'); setPlayerSizeIndex(Math.min(4, playerSizeIndex + 1)); }}
            className="w-20 h-20 bg-white/80 dark:bg-black/50 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg hover:bg-white dark:hover:bg-black/70 transition-colors pointer-events-auto"
          >
            <ArrowUp size={40} className="text-slate-800 dark:text-white" />
          </button>
        </div>
      )}

      <AnimatePresence>
        {flyingDiamonds.map(d => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, scale: 0, x: '-50%', y: '-50%', left: '50%', top: '50%' }}
            animate={{ opacity: 1, scale: 1.5, x: '40vw', y: '-40vh' }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.6, ease: "easeIn" }}
            onAnimationComplete={() => {
              removeFlyingDiamond(d.id);
            }}
            className="absolute z-50 pointer-events-none"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
            >
              <Diamond size={32} className="fill-yellow-400 text-yellow-500 drop-shadow-lg" />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {showPerfect && status === 'playing' && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 pointer-events-none"
          >
            <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-orange-500 drop-shadow-xl italic tracking-widest">
              {getTranslation(language, 'perfect')}
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 text-3xl font-black text-yellow-400 mt-2 drop-shadow-lg"
            >
              <Diamond className="fill-yellow-400" size={32} />
              +5
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {status === 'menu' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-between py-20 pointer-events-auto bg-io-bg/0"
          >
            <div className="absolute top-6 right-6 flex gap-4">
              <button onClick={() => { handleSoundClick(); setStatus('settings'); }} className="p-4 bg-white rounded-2xl text-io-dark shadow-lg hover:bg-white/80 transition-colors">
                <Settings size={24} />
              </button>
            </div>

            <div className="text-center mt-10">
              <h1 
                className="text-7xl font-black text-io-blue mb-4 tracking-tighter"
              >
                PERFECT<br/>FIT
              </h1>
              <div className="flex items-center justify-center gap-3 text-io-dark font-bold text-lg bg-white px-8 py-4 rounded-full shadow-lg mx-auto w-max">
                <Trophy size={20} className="text-io-orange" />
                <span>{getTranslation(language, 'best')}: {bestScore}</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 items-center w-full max-w-xs">
              <motion.button
                onClick={() => { handleSoundClick(); setStatus('playing'); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-io-green text-white px-12 py-6 rounded-full font-black text-2xl flex items-center justify-center gap-3 shadow-lg hover:bg-green-600 transition-colors"
              >
                <Play fill="currentColor" size={28} />
                {getTranslation(language, 'play')}
              </motion.button>
              <motion.button
                onClick={() => { handleSoundClick(); setStatus('shop'); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-white text-io-dark px-12 py-5 rounded-full font-black text-xl flex items-center justify-center gap-3 hover:bg-white/80 transition-colors shadow-lg"
              >
                <ShoppingCart size={24} />
                {getTranslation(language, 'store')}
              </motion.button>
            </div>
          </motion.div>
        )}

        {status === 'shop' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute inset-0 bg-io-bg flex flex-col p-6 pointer-events-auto overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-black text-io-dark">{getTranslation(language, 'store').toUpperCase()}</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-io-orange font-bold bg-white px-4 py-2 rounded-full shadow-lg">
                  <Diamond size={18} className="fill-io-orange" />
                  <span className="text-lg font-bold">{diamonds}</span>
                </div>
                <button onClick={() => { handleSoundClick(); setStatus('menu'); }} className="p-2 bg-white rounded-full shadow-lg text-io-dark">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="space-y-8 max-w-md mx-auto w-full pb-20">
              <div>
                <h3 className="text-xl font-bold text-io-dark/60 mb-4 uppercase tracking-wider">{getTranslation(language, 'themes')}</h3>
                <div className="grid grid-cols-1 gap-4">
                  {themes.map((t) => {
                    const isUnlocked = unlockedThemes.includes(t.id);
                    const isSelected = theme === t.id;
                    return (
                      <div key={t.id} className={`p-4 rounded-2xl border-2 flex justify-between items-center ${isSelected ? 'border-io-blue bg-blue-50' : 'border-white bg-white shadow-lg'}`}>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full border border-io-dark/10" style={{ backgroundColor: t.color }} />
                          <span className="font-bold text-lg text-io-dark">{t.name}</span>
                        </div>
                        {isSelected ? (
                          <div className="text-io-blue flex items-center gap-1 font-bold"><Check size={20} /> {getTranslation(language, 'equipped')}</div>
                        ) : isUnlocked ? (
                          <button onClick={() => { handleSoundClick(); setTheme(t.id); }} className="px-6 py-2 bg-io-bg text-io-dark rounded-full font-bold">{getTranslation(language, 'equip')}</button>
                        ) : (
                          <button onClick={() => { handleSoundClick(); buyTheme(t.id, t.cost); }} className={`px-6 py-2 rounded-full font-bold flex items-center gap-1 ${diamonds >= t.cost ? 'bg-io-orange text-white' : 'bg-io-bg text-io-dark/50'}`}>
                            <Diamond size={16} className={diamonds >= t.cost ? 'fill-white' : 'fill-io-dark/50'} />
                            {t.cost}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-io-dark/60 mb-4 uppercase tracking-wider">{getTranslation(language, 'effects')}</h3>
                <div className="grid grid-cols-1 gap-4">
                  {trails.map((t) => {
                    const isUnlocked = unlockedTrails.includes(t.id);
                    const isSelected = trail === t.id;
                    return (
                      <div key={t.id} className={`p-4 rounded-2xl border-2 flex justify-between items-center ${isSelected ? 'border-io-blue bg-blue-50' : 'border-white bg-white shadow-lg'}`}>
                        <span className="font-bold text-lg text-io-dark">{t.name}</span>
                        {isSelected ? (
                          <div className="text-io-blue flex items-center gap-1 font-bold"><Check size={20} /> {getTranslation(language, 'equipped')}</div>
                        ) : isUnlocked ? (
                          <button onClick={() => { handleSoundClick(); setTrail(t.id); }} className="px-6 py-2 bg-io-bg text-io-dark rounded-full font-bold">{getTranslation(language, 'equip')}</button>
                        ) : (
                          <button onClick={() => { handleSoundClick(); buyTrail(t.id, t.cost); }} className={`px-6 py-2 rounded-full font-bold flex items-center gap-1 ${diamonds >= t.cost ? 'bg-io-orange text-white' : 'bg-io-bg text-io-dark/50'}`}>
                            <Diamond size={16} className={diamonds >= t.cost ? 'fill-white' : 'fill-io-dark/50'} />
                            {t.cost}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {status === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute inset-0 bg-io-bg flex flex-col pointer-events-auto"
          >
            {/* Sticky Header */}
            <div className="flex justify-between items-center p-6 bg-white shrink-0 shadow-sm z-10">
              <h2 className="text-3xl font-black text-io-dark">{getTranslation(language, 'settings').toUpperCase()}</h2>
              <button onClick={() => { handleSoundClick(); setStatus('menu'); }} className="p-2 bg-io-bg rounded-full text-io-dark">
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4 max-w-md mx-auto">
                <SelectRow label={getTranslation(language, 'controlMode')} value={controlMode} options={['swipe', 'buttons']} onChange={(val) => setControlMode(val as any)} />
                <SliderRow label={getTranslation(language, 'sensitivity')} value={sensitivity} min={50} max={200} onChange={setSensitivity} />
                <ToggleRow label={getTranslation(language, 'sound')} value={sound} onClick={toggleSound} />
                <ToggleRow label={getTranslation(language, 'vibration')} value={haptics} onClick={toggleHaptics} />
                <SelectRow label={getTranslation(language, 'effects')} value={effectsLevel} options={['Low', 'Normal', 'High']} onChange={(val) => setEffectsLevel(val as any)} />
                <ToggleRow label={getTranslation(language, 'cameraShake')} value={cameraShake} onClick={toggleCameraShake} />
                <ToggleRow label={getTranslation(language, 'feverEffects')} value={feverEffects} onClick={toggleFeverEffects} />
                <SelectRow label={getTranslation(language, 'language')} value={language} options={['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Japanese', 'Korean', 'Chinese']} onChange={setLanguage} />
                
                <div className="pt-4 border-t border-slate-200">
                  <button 
                    onClick={() => { 
                      handleSoundClick(); 
                      window.open('https://github.com/zainantar08/Perfect-Fit-Game/blob/main/privacy.md', '_blank');
                    }}
                    className="w-full py-4 bg-white text-io-dark font-bold rounded-2xl mb-3 shadow-md hover:bg-slate-50 transition-colors"
                  >
                    {getTranslation(language, 'privacyTerms')}
                  </button>
                  <button 
                    onClick={() => {
                      handleSoundClick();
                      useGameStore.setState({ hasContinued: false });
                      setStatus('menu');
                    }} 
                    className="w-full py-4 bg-red-50 text-red-500 font-bold rounded-2xl hover:bg-red-100 transition-colors"
                  >
                    {getTranslation(language, 'exit')}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}



        {status === 'continue' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-cream/90 backdrop-blur-md flex flex-col items-center justify-center pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="flex flex-col items-center text-center max-w-sm w-full mx-4"
            >
              <h2 className="text-3xl font-serif text-deep-charcoal mb-2">{getTranslation(language, 'continue')}?</h2>
              
              <div className="relative w-32 h-32 my-8 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-deep-charcoal/20" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke="currentColor" 
                    className="text-muted-gold" 
                    strokeWidth="8" 
                    strokeDasharray={283}
                    strokeDashoffset={0}
                    style={{
                      animation: 'countdown 7s linear forwards'
                    }}
                  />
                </svg>
                <span className="text-5xl font-sans text-deep-charcoal">{continueTimer}</span>
              </div>

              <button
                onClick={() => {
                  handleSoundClick();
                  setTimeout(() => {
                    continueGame();
                  }, 1000);
                }}
                className="w-full bg-deep-charcoal text-cream py-4 font-sans text-xl flex items-center justify-center gap-2 hover:bg-muted-gold transition-all mb-4"
              >
                <Video size={24} />
                {getTranslation(language, 'watchAd')}
              </button>

              <AnimatePresence>
                {continueTimer <= 5 && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => { handleSoundClick(); resetGame(); }}
                    className="text-deep-charcoal/60 font-sans font-bold py-2 px-4 hover:text-deep-charcoal transition-colors"
                  >
                    {getTranslation(language, 'noThanks')}
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}

        {status === 'gameover' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-io-bg/90 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="flex flex-col items-center text-center max-w-sm w-full mx-4 bg-white p-8 rounded-3xl shadow-2xl"
            >
              <h2 className="text-4xl font-black text-io-dark mb-2">{getTranslation(language, 'crashed')}</h2>
              
              <div className="w-full bg-io-bg p-6 my-8 rounded-2xl">
                <div className="text-sm text-io-dark/60 uppercase tracking-widest font-bold mb-1">{getTranslation(language, 'score')}</div>
                <div className="text-7xl font-black text-io-blue mb-4">{score}</div>
                <div className="h-px w-full bg-io-dark/10 my-4" />
                <div className="flex justify-between items-center px-2">
                  <div className="text-io-dark/60 font-bold">{getTranslation(language, 'best')}</div>
                  <div className="text-io-dark font-black text-xl flex items-center gap-1">
                    <Trophy size={18} className="text-io-orange" />
                    {bestScore}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 w-full">
                <button
                  onClick={() => {
                    handleSoundClick();
                    useGameStore.setState({ hasContinued: false });
                    setStatus('menu');
                  }}
                  className="flex-1 bg-io-bg text-io-dark py-4 rounded-xl font-bold text-lg hover:bg-slate-200 transition-colors"
                >
                  {getTranslation(language, 'menu')}
                </button>
                <button
                  onClick={() => { handleSoundClick(); resetGame(); }}
                  className="flex-[2] bg-io-green text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
                >
                  <RotateCcw size={20} />
                  {getTranslation(language, 'playAgain')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
