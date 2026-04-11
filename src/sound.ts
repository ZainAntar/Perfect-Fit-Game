export const playSound = (type: 'pass' | 'perfect' | 'fail' | 'click') => {
  const state = (window as any).useGameStore?.getState();
  if (state && !state.sound) return;

  try {
    const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!(window as any).__pf_audio_ctx) {
      (window as any).__pf_audio_ctx = new AudioContextClass();
    }
    const ctx = (window as any).__pf_audio_ctx as AudioContext;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    if (type === 'pass') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'perfect') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.1);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
      
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1320, now + 0.1);
      osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.2);
      gain2.gain.setValueAtTime(0, now + 0.1);
      gain2.gain.linearRampToValueAtTime(0.1, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.3);
    } else if (type === 'fail') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(250, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.4);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch (e) {
    console.error('Audio playback failed', e);
  }
};
