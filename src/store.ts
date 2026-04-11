import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'lava' | 'beach' | 'forest' | 'ice' | 'desert' | 'city' | 'candy';
export type Trail = 'none' | 'fire' | 'water' | 'jelly' | 'vines' | 'ice' | 'sand' | 'neon';

interface GameState {
  status: 'menu' | 'playing' | 'gameover' | 'continue' | 'shop' | 'settings';
  score: number;
  bestScore: number;
  diamonds: number;
  speed: number;
  wallIndex: number;
  currentLevelIndex: number;
  theme: Theme;
  trail: Trail;
  unlockedThemes: Theme[];
  unlockedTrails: Trail[];
  showPerfect: boolean;
  flyingDiamonds: { id: number }[];
  sound: boolean;
  haptics: boolean;
  effectsLevel: 'Low' | 'Normal' | 'High';
  cameraShake: boolean;
  feverEffects: boolean;
  language: string;
  hasSeenTutorial: boolean;
  tutorialStep: number;
  hasContinued: boolean;
  controlMode: 'swipe' | 'buttons';
  sensitivity: number;
  playerSizeIndex: number;
  combo: number;
  setStatus: (status: GameState['status']) => void;
  addScore: (points: number) => void;
  addDiamonds: (amount: number) => void;
  incrementWallIndex: () => void;
  nextLevel: () => void;
  resetGame: () => void;
  continueGame: () => void;
  increaseSpeed: () => void;
  buyTheme: (t: Theme, cost: number) => void;
  buyTrail: (t: Trail, cost: number) => void;
  setTheme: (t: Theme) => void;
  setTrail: (t: Trail) => void;
  triggerPerfect: () => void;
  addFlyingDiamond: () => void;
  removeFlyingDiamond: (id: number) => void;
  toggleSound: () => void;
  toggleHaptics: () => void;
  setEffectsLevel: (level: 'Low' | 'Normal' | 'High') => void;
  toggleCameraShake: () => void;
  toggleFeverEffects: () => void;
  setLanguage: (lang: string) => void;
  setHasSeenTutorial: () => void;
  setTutorialStep: (step: number) => void;
  resetTutorial: () => void;
  setControlMode: (mode: 'swipe' | 'buttons') => void;
  setSensitivity: (sensitivity: number) => void;
  setPlayerSizeIndex: (index: number) => void;
  incrementCombo: () => void;
  resetCombo: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      status: 'menu',
      score: 0,
      bestScore: 0,
      diamonds: 0,
      speed: 20,
      wallIndex: 0,
      currentLevelIndex: 0,
      theme: 'light',
      trail: 'none',
      unlockedThemes: ['light'],
      unlockedTrails: ['none'],
      showPerfect: false,
      flyingDiamonds: [],
      sound: true,
      haptics: true,
      effectsLevel: 'Normal',
      cameraShake: true,
      feverEffects: true,
      language: 'English',
      hasSeenTutorial: false,
      tutorialStep: 0,
      hasContinued: false,
      controlMode: 'swipe',
      sensitivity: 100,
      playerSizeIndex: 2,
      combo: 0,
      setStatus: (status) => set({ status }),
      addScore: (points) =>
        set((state) => {
          const newScore = state.score + 10;
          return {
            score: newScore,
            bestScore: Math.max(state.bestScore, newScore),
          };
        }),
      addDiamonds: (amount) => set((state) => ({ diamonds: state.diamonds + amount })),
      incrementWallIndex: () => set((state) => ({ wallIndex: state.wallIndex + 1 })),
      nextLevel: () => set((state) => ({ currentLevelIndex: state.currentLevelIndex + 1 })),
      resetGame: () => set({ status: 'playing', score: 0, speed: 20, wallIndex: 0, currentLevelIndex: 0, hasContinued: false, hasSeenTutorial: false }),
      continueGame: () => set({ status: 'playing', hasContinued: true }),
      increaseSpeed: () => set((state) => ({ speed: Math.min(45, state.speed + 0.2) })),
      buyTheme: (t, cost) => set((state) => {
        if (state.diamonds >= cost && !state.unlockedThemes.includes(t)) {
          return { diamonds: state.diamonds - cost, unlockedThemes: [...state.unlockedThemes, t], theme: t };
        }
        return state;
      }),
      buyTrail: (t, cost) => set((state) => {
        if (state.diamonds >= cost && !state.unlockedTrails.includes(t)) {
          return { diamonds: state.diamonds - cost, unlockedTrails: [...state.unlockedTrails, t], trail: t };
        }
        return state;
      }),
      setTheme: (theme) => set({ theme }),
      setTrail: (trail) => set({ trail }),
      triggerPerfect: () => {
        set({ showPerfect: true, diamonds: useGameStore.getState().diamonds + 5 });
        setTimeout(() => set({ showPerfect: false }), 1000);
      },
      addFlyingDiamond: () => set((state) => ({ flyingDiamonds: [...state.flyingDiamonds, { id: Date.now() + Math.random() }] })),
      removeFlyingDiamond: (id) => set((state) => ({ flyingDiamonds: state.flyingDiamonds.filter(d => d.id !== id) })),
      toggleSound: () => set((state) => ({ sound: !state.sound })),
      toggleHaptics: () => set((state) => ({ haptics: !state.haptics })),
      setEffectsLevel: (level) => set({ effectsLevel: level }),
      toggleCameraShake: () => set((state) => ({ cameraShake: !state.cameraShake })),
      toggleFeverEffects: () => set((state) => ({ feverEffects: !state.feverEffects })),
      setLanguage: (lang) => set({ language: lang }),
      setHasSeenTutorial: () => set({ hasSeenTutorial: true }),
      setTutorialStep: (step) => set({ tutorialStep: step }),
      resetTutorial: () => set({ tutorialStep: 0 }),
      setControlMode: (controlMode) => set({ controlMode }),
      setSensitivity: (sensitivity) => set({ sensitivity }),
      setPlayerSizeIndex: (playerSizeIndex) => set({ playerSizeIndex }),
      incrementCombo: () => set((state) => ({ combo: state.combo + 1 })),
      resetCombo: () => set({ combo: 0 }),
    }),
    {
      name: 'perfect-fit-v5',
      partialize: (state) => ({
        bestScore: state.bestScore,
        diamonds: state.diamonds,
        unlockedThemes: state.unlockedThemes,
        unlockedTrails: state.unlockedTrails,
        theme: state.theme,
        trail: state.trail,
        sound: state.sound,
        haptics: state.haptics,
        effectsLevel: state.effectsLevel,
        cameraShake: state.cameraShake,
        feverEffects: state.feverEffects,
        language: state.language,
        hasSeenTutorial: state.hasSeenTutorial,
        controlMode: state.controlMode,
        sensitivity: state.sensitivity,
        playerSizeIndex: state.playerSizeIndex,
        combo: state.combo,
      }),
    }
  )
);
