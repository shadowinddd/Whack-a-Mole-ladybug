// Simple audio synthesizer using Web Audio API

const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
let audioCtx: AudioContext | null = null;
let bgmTimer: number | null = null;
let isMuted = false;

// Cheerful Melody Data (Frequency and Duration)
const MELODY = [
    { freq: 261.63, dur: 0.2 }, // C4
    { freq: 329.63, dur: 0.2 }, // E4
    { freq: 392.00, dur: 0.2 }, // G4
    { freq: 523.25, dur: 0.4 }, // C5
    { freq: 392.00, dur: 0.2 }, // G4
    { freq: 329.63, dur: 0.4 }, // E4
    
    { freq: 261.63, dur: 0.2 }, // C4
    { freq: 329.63, dur: 0.2 }, // E4
    { freq: 392.00, dur: 0.2 }, // G4
    { freq: 493.88, dur: 0.4 }, // B4
    { freq: 392.00, dur: 0.2 }, // G4
    { freq: 349.23, dur: 0.4 }, // F4
];
let noteIdx = 0;
let nextNoteTime = 0;

function getContext(): AudioContext | null {
  if (!AudioContextClass) return null;
  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  return audioCtx;
}

export const initAudio = () => {
  const ctx = getContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(e => console.error("Audio resume failed", e));
  }
};

export const startBGM = () => {
    const ctx = getContext();
    if (!ctx || bgmTimer) return;
    
    // Reset scheduling cursor to now
    nextNoteTime = ctx.currentTime + 0.1;
    noteIdx = 0;

    const schedule = () => {
        if (isMuted) return;
        const t = ctx.currentTime;
        
        // If we fell behind significantly, reset (e.g. tab inactive)
        if (nextNoteTime < t - 0.5) nextNoteTime = t;

        // Schedule ahead by 0.5 seconds
        while (nextNoteTime < t + 0.5) {
             const note = MELODY[noteIdx];
             const osc = ctx.createOscillator();
             const gain = ctx.createGain();
             
             osc.type = 'triangle';
             osc.frequency.value = note.freq;
             
             // Soft envelope
             gain.gain.setValueAtTime(0.0, nextNoteTime);
             gain.gain.linearRampToValueAtTime(0.04, nextNoteTime + 0.05); // Attack
             gain.gain.linearRampToValueAtTime(0, nextNoteTime + note.dur - 0.05); // Release
             
             osc.connect(gain);
             gain.connect(ctx.destination);
             
             osc.start(nextNoteTime);
             osc.stop(nextNoteTime + note.dur);
             
             nextNoteTime += note.dur;
             noteIdx = (noteIdx + 1) % MELODY.length;
        }
    };

    // Initial call
    schedule();
    // Loop
    bgmTimer = window.setInterval(schedule, 200);
}

export const stopBGM = () => {
    if (bgmTimer) {
        clearInterval(bgmTimer);
        bgmTimer = null;
    }
}

export const toggleMute = () => {
    isMuted = !isMuted;
    if (isMuted) {
        stopBGM();
    } else {
        startBGM();
    }
    return isMuted;
}

export const playClickSound = () => {
    if (isMuted) return;
    const ctx = getContext();
    if (!ctx) return;
    try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
        
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    } catch(e) {}
}

export const playScoreSound = () => {
  if (isMuted) return;
  const ctx = getContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Cute "ding" sound: pitch bends up slightly
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.error("Audio play failed", e);
  }
};

export const playHitSound = () => {
  if (isMuted) return;
  const ctx = getContext();
  if (!ctx) return;

  try {
    const t = ctx.currentTime;

    // 1. Noise Burst (The "Pa" / Slap)
    const bufferSize = ctx.sampleRate * 0.1; // 100ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(1200, t); // Dull pop sound

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.8, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(t);

    // 2. Short Low Frequency Thud (Impact body)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.1);
    
    oscGain.gain.setValueAtTime(0.5, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);

  } catch (e) {
    console.error("Audio play failed", e);
  }
};

export const playErrorSound = () => {
  if (isMuted) return;
  const ctx = getContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    // "Buzz" sound
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch (e) {
    console.error("Audio play failed", e);
  }
};

export const playGameOverSound = () => {
  if (isMuted) return;
  const ctx = getContext();
  if (!ctx) return;

  try {
    const t = ctx.currentTime;
    
    // Sad melody: G4 -> E4 -> C4 (approx)
    
    // Note 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(392, t); // G4
    gain1.gain.setValueAtTime(0.2, t);
    gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.3);

    // Note 2
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(329.63, t + 0.3); // E4
    gain2.gain.setValueAtTime(0.2, t + 0.3);
    gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(t + 0.3);
    osc2.stop(t + 0.6);

    // Note 3 (Long slide down)
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(261.63, t + 0.6); // C4
    osc3.frequency.linearRampToValueAtTime(130, t + 1.2);
    gain3.gain.setValueAtTime(0.2, t + 0.6);
    gain3.gain.linearRampToValueAtTime(0.01, t + 1.2);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(t + 0.6);
    osc3.stop(t + 1.2);
  } catch (e) {
    console.error("Audio play failed", e);
  }
};