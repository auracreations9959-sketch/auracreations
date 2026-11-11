import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface SignatureIntroProps {
  onComplete: () => void;
  forceShow?: boolean;
}

export const SignatureIntro: React.FC<SignatureIntroProps> = ({ onComplete, forceShow = false }) => {
  const [isVisible, setIsVisible] = useState(true);
  // Default sound enabled per client request
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [letterStep, setLetterStep] = useState(0); // 0 to 4
  const [showCreations, setShowCreations] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Rich luxury cinematic audio synthesizer (Web Audio API)
  const playCinematicSound = (type: 'intro' | 'creations' | 'tagline' = 'intro') => {
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;

      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioCtxClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      if (type === 'intro') {
        // Deep sub-bass cinematic rumble swell
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(55, now);
        subOsc.frequency.exponentialRampToValueAtTime(110, now + 1.8);
        subGain.gain.setValueAtTime(0.001, now);
        subGain.gain.exponentialRampToValueAtTime(0.08, now + 0.4);
        subGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + 2.6);

        // Cascading Pentatonic Chimes for the 4 AURA Letters (E4, A4, C#5, E5)
        const chimeFreqs = [329.63, 440.0, 554.37, 659.25];
        chimeFreqs.forEach((freq, idx) => {
          const startTime = now + idx * 0.42 + 0.15;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.001, startTime);
          gain.gain.exponentialRampToValueAtTime(0.06, startTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 1.3);
        });
      } else if (type === 'creations') {
        // Shimmering chord for CREATIONS reveal
        const chordFreqs = [554.37, 659.25, 880.0];
        chordFreqs.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.exponentialRampToValueAtTime(0.045, now + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 1.9);
        });
      } else if (type === 'tagline') {
        // Golden harmonic resolution chime for tagline
        const chime = ctx.createOscillator();
        const gain = ctx.createGain();
        chime.type = 'triangle';
        chime.frequency.setValueAtTime(880, now);
        chime.frequency.exponentialRampToValueAtTime(1108.73, now + 0.25);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.05, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);
        chime.connect(gain);
        gain.connect(ctx.destination);
        chime.start(now);
        chime.stop(now + 2.3);
      }
    } catch {
      // Audio autoplay policy fallback
    }
  };

  useEffect(() => {
    // Session check: play once per session unless explicitly forced
    if (!forceShow && sessionStorage.getItem('aura_intro_shown') === 'true') {
      setIsVisible(false);
      onComplete();
      return;
    }

    // Attempt default audio playback on mount
    if (soundEnabled) {
      playCinematicSound('intro');
    }

    // In case browser autoplay policy suspends AudioContext until first interaction,
    // register an automatic one-time unlock listener
    const unlockAudio = () => {
      if (soundEnabled) {
        playCinematicSound('intro');
      }
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });

    // Step sequence for the 4 AURA letters:
    const tA1 = setTimeout(() => setLetterStep(1), 250);
    const tU = setTimeout(() => setLetterStep(2), 650);
    const tR = setTimeout(() => setLetterStep(3), 1050);
    const tA2 = setTimeout(() => setLetterStep(4), 1450);

    // Step: CREATIONS bar reveal
    const timerCreations = setTimeout(() => {
      setShowCreations(true);
      if (soundEnabled) playCinematicSound('creations');
    }, 1900);

    // Step: Tagline reveal
    const timerTagline = setTimeout(() => {
      setShowTagline(true);
      if (soundEnabled) playCinematicSound('tagline');
    }, 2600);

    // Step: Transition smoothly to homepage
    const timerComplete = setTimeout(() => {
      handleComplete();
    }, 4800);

    return () => {
      clearTimeout(tA1);
      clearTimeout(tU);
      clearTimeout(tR);
      clearTimeout(tA2);
      clearTimeout(timerCreations);
      clearTimeout(timerTagline);
      clearTimeout(timerComplete);
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, [forceShow]);

  const handleComplete = () => {
    sessionStorage.setItem('aura_intro_shown', 'true');
    setIsVisible(false);
    setTimeout(onComplete, 650);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.03, filter: 'blur(10px)' }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030206] overflow-hidden select-none"
      >
        {/* Subtle, Clean Cinematic Ambient Lighting */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Magenta radial bloom on left */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0.2, 0.45, 0.3], scale: [0.9, 1.15, 1.05] }}
            transition={{ duration: 3.5, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[500px] bg-fuchsia-600/25 blur-[150px] rounded-full"
          />

          {/* Deep violet/navy ambient glow on right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0.15, 0.35, 0.25], scale: [0.95, 1.2, 1.1] }}
            transition={{ duration: 4, delay: 0.5, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute top-1/2 right-1/3 translate-x-1/2 -translate-y-1/2 w-[650px] h-[500px] bg-indigo-700/25 blur-[160px] rounded-full"
          />

          {/* Minimalist fine grid overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff07_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
        </div>

        {/* Top Control Bar with Sound Toggle and Skip Intro */}
        <div className="absolute top-6 left-0 right-0 px-6 sm:px-12 flex items-center justify-between z-20">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 text-xs tracking-widest text-slate-400 uppercase font-mono"
          >
            <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-ping inline-block" />
            <span className="hidden sm:inline">Signature Cinematic Brand Intro</span>
          </motion.div>

          <div className="flex items-center gap-3">
            {/* Sound Toggle (Default ON) */}
            <button
              onClick={() => {
                const nextState = !soundEnabled;
                setSoundEnabled(nextState);
                if (nextState) playCinematicSound('intro');
              }}
              className={`px-3.5 py-1.5 rounded-full border text-xs transition-all flex items-center gap-1.5 backdrop-blur-md cursor-pointer ${
                soundEnabled
                  ? 'bg-fuchsia-950/60 border-fuchsia-500/50 text-fuchsia-200 shadow-md shadow-fuchsia-950/50'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
              }`}
              title={soundEnabled ? 'Sound is ON (Click to Mute)' : 'Sound is OFF (Click to Enable)'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
              <span className="text-[11px] font-semibold">{soundEnabled ? 'Sound ON' : 'Sound OFF'}</span>
            </button>

            {/* Skip Intro */}
            <button
              onClick={handleComplete}
              className="px-4 py-1.5 rounded-full bg-white/10 border border-fuchsia-500/30 hover:border-fuchsia-400 hover:bg-fuchsia-500/20 text-xs font-semibold text-slate-100 transition-all flex items-center gap-1.5 backdrop-blur-md cursor-pointer group shadow-lg shadow-fuchsia-950/40"
            >
              <span>Skip Intro</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* CENTER COMPOSITION: THE AUTHENTIC AURA LETTERS CINEMATIC REVEAL */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full max-w-4xl mx-auto">
          
          {/* Eyebrow Category */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-950/70 border border-fuchsia-500/30 text-[10px] sm:text-xs font-semibold text-fuchsia-300 uppercase tracking-widest mb-6"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>DESIGN • PRINT • BRAND</span>
          </motion.div>

          {/* ========================================================================= */}
          {/* 1. THE 4 AUTHENTIC "AURA" LETTERS (ANIMATED IN SIGNATURE SEQUENCE)        */}
          {/* ========================================================================= */}
          <div className="relative flex items-center justify-center gap-2 sm:gap-4 md:gap-6 py-2 px-4 max-w-2xl mx-auto">
            
            {/* Luminous laser scan line sweeping across */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: [0, 1, 1], opacity: [0, 0.8, 0] }}
              transition={{ duration: 1.8, delay: 0.2, ease: 'easeInOut' }}
              className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-fuchsia-500 via-purple-400 to-indigo-500 origin-left"
            />

            {/* Letter 1: First A (with center dot & magenta glow) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: 20, filter: 'blur(10px)' }}
              animate={letterStep >= 1 ? { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center group"
            >
              <img
                src="/images/logo/aura-intro-a1-hd.png"
                alt="A"
                className="h-16 sm:h-24 md:h-32 w-auto object-contain filter drop-shadow-[0_0_25px_rgba(217,70,239,0.7)]"
              />
            </motion.div>

            {/* Letter 2: U (with magenta-to-purple gradient glow) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: 20, filter: 'blur(10px)' }}
              animate={letterStep >= 2 ? { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center group"
            >
              <img
                src="/images/logo/aura-intro-u-hd.png"
                alt="U"
                className="h-16 sm:h-24 md:h-32 w-auto object-contain filter drop-shadow-[0_0_25px_rgba(192,38,211,0.7)]"
              />
            </motion.div>

            {/* Letter 3: R (with modern flat top & purple glow) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: 20, filter: 'blur(10px)' }}
              animate={letterStep >= 3 ? { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center group"
            >
              <img
                src="/images/logo/aura-intro-r-hd.png"
                alt="R"
                className="h-16 sm:h-24 md:h-32 w-auto object-contain filter drop-shadow-[0_0_25px_rgba(147,51,234,0.7)]"
              />
            </motion.div>

            {/* Letter 4: Second A (with center dot & indigo glow) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: 20, filter: 'blur(10px)' }}
              animate={letterStep >= 4 ? { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center group"
            >
              <img
                src="/images/logo/aura-intro-a2-hd.png"
                alt="A"
                className="h-16 sm:h-24 md:h-32 w-auto object-contain filter drop-shadow-[0_0_25px_rgba(79,70,229,0.7)]"
              />
            </motion.div>

          </div>

          {/* ========================================================================= */}
          {/* 2. THE "— CREATIONS —" FLANKED BAR REVEAL                                  */}
          {/* ========================================================================= */}
          <div className="relative mt-2 sm:mt-3 flex items-center justify-center w-full max-w-lg">
            <AnimatePresence>
              {showCreations && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0.7, y: 10 }}
                  animate={{ opacity: 1, scaleY: 1, y: 0 }}
                  transition={{
                    duration: 0.65,
                    type: 'spring',
                    damping: 22,
                    stiffness: 260,
                  }}
                  className="w-full flex items-center justify-center"
                >
                  <img
                    src="/images/logo/aura-intro-creations-hd.png"
                    alt="CREATIONS"
                    className="w-full max-w-[320px] sm:max-w-[440px] md:max-w-[500px] h-auto object-contain filter drop-shadow-[0_0_18px_rgba(168,85,247,0.55)]"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ========================================================================= */}
          {/* 3. SIGNATURE HANDWRITTEN TAGLINE REVEAL                                   */}
          {/* ========================================================================= */}
          <div className="h-16 mt-6 flex items-center justify-center">
            <AnimatePresence>
              {showTagline && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65 }}
                  className="flex flex-col items-center"
                >
                  <p className="font-signature text-3xl sm:text-4xl text-white font-bold tracking-wide select-none drop-shadow-[0_2px_12px_rgba(255,255,255,0.45)] transform -rotate-1">
                    Ideas that create impact
                  </p>
                  {/* Calligraphic Underline Swoop Matching Reference */}
                  <svg
                    className="w-52 sm:w-68 md:w-80 h-3.5 text-white -mt-0.5 overflow-visible"
                    viewBox="0 0 280 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M 5 12 C 70 5, 170 4, 275 14"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Bottom Studio Geographic Tag */}
        <div className="absolute bottom-6 text-center z-10">
          <p className="text-[10px] sm:text-[11px] text-slate-500 tracking-widest uppercase font-mono">
            Aura Creations • Guntur, Andhra Pradesh
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
