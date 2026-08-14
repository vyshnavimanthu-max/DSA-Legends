/**
 * AAA-Quality Web Audio API Synth Engine & Background Music Sequencer
 * Generates dynamic electronic cyber-soundscapes and high-tech SFX in real-time.
 * Features a custom-scheduled ambient synth arpeggiator (BGM) and low-latency SFX nodes.
 */

class PremiumAudioManager {
  private static instance: PremiumAudioManager;
  private ctx: AudioContext | null = null;
  private masterVolume: GainNode | null = null;
  private musicVolumeNode: GainNode | null = null;
  private sfxVolumeNode: GainNode | null = null;
  
  // Music Sequencer States
  private bgmIntervalId: any = null;
  private currentStep = 0;
  private isBgmPlaying = false;
  private scale = [110, 123.47, 130.81, 146.83, 164.81, 196.00, 220, 246.94, 261.63, 293.66, 329.63, 392.00, 440]; // Cyber Minor Pentatonic/Aeolian Scale
  private chordProgression = [
    [110, 164.81, 220], // Am
    [130.81, 196.00, 261.63], // C
    [146.83, 220, 293.66], // Dm
    [123.47, 164.81, 246.94] // Em
  ];
  private currentChordIndex = 0;

  private settings = {
    musicVolume: 1.0,
    sfxVolume: 0.6,
    isMuted: false,
  };

  private constructor() {
    // Lazy initialized on first user gesture
  }

  public static getInstance(): PremiumAudioManager {
    if (!PremiumAudioManager.instance) {
      PremiumAudioManager.instance = new PremiumAudioManager();
    }
    return PremiumAudioManager.instance;
  }

  public init() {
    if (this.ctx) return;

    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Build master and submix nodes
      this.masterVolume = this.ctx.createGain();
      this.musicVolumeNode = this.ctx.createGain();
      this.sfxVolumeNode = this.ctx.createGain();

      this.musicVolumeNode.connect(this.masterVolume);
      this.sfxVolumeNode.connect(this.masterVolume);
      this.masterVolume.connect(this.ctx.destination);

      // Apply initial volumes
      this.updateVolumes(this.settings.musicVolume, this.settings.sfxVolume);
      
      console.log("[PremiumAudioManager] AudioContext initialized successfully.");
    } catch (e) {
      console.error("[PremiumAudioManager] Web Audio API initialization blocked or failed:", e);
    }
  }

  public updateVolumes(musicVol: number, sfxVol: number) {
    this.settings.musicVolume = musicVol;
    this.settings.sfxVolume = sfxVol;

    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    if (this.musicVolumeNode) {
      this.musicVolumeNode.gain.linearRampToValueAtTime(this.settings.isMuted ? 0 : musicVol * 1.5, now + 0.1);
    }
    if (this.sfxVolumeNode) {
      this.sfxVolumeNode.gain.linearRampToValueAtTime(this.settings.isMuted ? 0 : sfxVol * 0.5, now + 0.1);
    }
  }

  public setMute(muted: boolean) {
    this.settings.isMuted = muted;
    this.updateVolumes(this.settings.musicVolume, this.settings.sfxVolume);
  }

  public toggleMute(): boolean {
    this.setMute(!this.settings.isMuted);
    return this.settings.isMuted;
  }

  public getMutedState(): boolean {
    return this.settings.isMuted;
  }

  /**
   * Play dynamic premium SFX
   */
  public playSFX(type: 'hover' | 'click' | 'transition' | 'swap' | 'win' | 'error' | 'ability' | 'powerdown') {
    this.init();
    if (!this.ctx || this.settings.isMuted) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const sfxNode = this.sfxVolumeNode!;

    switch (type) {
      case 'hover': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(sfxNode);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }
      case 'click': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(sfxNode);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(150, now + 0.05);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.start(now);
        osc.stop(now + 0.08);
        break;
      }
      case 'transition': {
        // Double-voice cyber synth sweep
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(sfxNode);

        osc1.type = 'sawtooth';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(150, now);
        osc2.frequency.setValueAtTime(152, now);
        osc1.frequency.exponentialRampToValueAtTime(600, now + 0.45);
        osc2.frequency.exponentialRampToValueAtTime(604, now + 0.45);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, now);
        filter.frequency.exponentialRampToValueAtTime(2000, now + 0.45);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.45);
        osc2.stop(now + 0.45);
        break;
      }
      case 'swap': {
        // High quality data-swap slide
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(sfxNode);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.2);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }
      case 'win': {
        // AAA Game level victory cascade
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.connect(gain);
          gain.connect(sfxNode);

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);

          gain.gain.setValueAtTime(0.0, now);
          gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.08 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.4);
        });
        break;
      }
      case 'error': {
        // Dissonant digital failure pulse
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(sfxNode);

        osc1.type = 'sawtooth';
        osc2.type = 'sawtooth';
        osc1.frequency.setValueAtTime(130, now);
        osc2.frequency.setValueAtTime(135, now); // Dissonant beating

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.3);
        osc2.stop(now + 0.3);
        break;
      }
      case 'ability': {
        // Massive ambient magical sweep with delay
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        const delay = this.ctx.createDelay();
        const delayGain = this.ctx.createGain();

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(sfxNode);
        
        // Setup simple feedback delay
        gain.connect(delay);
        delay.connect(delayGain);
        delayGain.connect(sfxNode);
        delayGain.connect(delay);

        delay.delayTime.setValueAtTime(0.15, now);
        delayGain.gain.setValueAtTime(0.3, now);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.6);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(200, now);
        filter.frequency.exponentialRampToValueAtTime(1500, now + 0.6);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        osc.start(now);
        osc.stop(now + 0.7);
        break;
      }
      case 'powerdown': {
        // Descending low-frequency engine shutdown
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(sfxNode);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.75);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

        osc.start(now);
        osc.stop(now + 0.75);
        break;
      }
    }
  }

  /**
   * Start generative background music sequencer (Synth Arpeggios & Chords)
   */
  public startMusic() {
    this.init();
    if (!this.ctx || this.isBgmPlaying) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isBgmPlaying = true;
    this.currentStep = 0;
    
    // Low-frequency heartbeat pad synth
    const padOsc1 = this.ctx.createOscillator();
    const padOsc2 = this.ctx.createOscillator();
    const padGain = this.ctx.createGain();
    const padFilter = this.ctx.createBiquadFilter();

    padOsc1.type = 'sawtooth';
    padOsc2.type = 'triangle';
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 250;

    padOsc1.connect(padFilter);
    padOsc2.connect(padFilter);
    padFilter.connect(padGain);
    padGain.connect(this.musicVolumeNode!);

    // Start background sequencer tick
    const tickTime = 200; // 200ms per step (300 BPM)
    this.bgmIntervalId = setInterval(() => {
      this.playSequencerStep();
    }, tickTime);

    console.log("[PremiumAudioManager] Background Music Sequencer active.");
  }

  /**
   * Stop background music
   */
  public stopMusic() {
    if (this.bgmIntervalId) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
    this.isBgmPlaying = false;
    console.log("[PremiumAudioManager] Background Music Sequencer stopped.");
  }

  public getIsBgmPlaying(): boolean {
    return this.isBgmPlaying;
  }

  /**
   * Internal scheduler that plays one step of our dynamic background sequence
   */
  private playSequencerStep() {
    if (!this.ctx || this.settings.isMuted) return;
    const now = this.ctx.currentTime;
    const musicNode = this.musicVolumeNode!;

    // Step rhythm calculations
    const beat = this.currentStep % 16;
    
    // Every 16 steps, switch the chord progression
    if (beat === 0) {
      this.currentChordIndex = (this.currentChordIndex + 1) % this.chordProgression.length;
    }

    const currentChord = this.chordProgression[this.currentChordIndex];

    // Trigger base drone chords (soft background pad) on step 0 and 8
    if (beat === 0 || beat === 8) {
      currentChord.forEach((rootFreq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const filter = this.ctx!.createBiquadFilter();

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(musicNode);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(rootFreq / 2, now); // Bass octave

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(150, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.22, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

        osc.start(now);
        osc.stop(now + 2.5);
      });
    }

    // Play crisp retro cyber arpeggiator notes on specific rhythmic steps (e.g., 0, 3, 6, 8, 11, 14)
    const rhythmSteps = [0, 3, 6, 8, 11, 14];
    if (rhythmSteps.includes(beat)) {
      // Choose an elegant frequency from our pentatonic scale influenced by current chord root
      const scaleDegree = (this.currentStep * 3 + Math.floor(beat * 1.5)) % this.scale.length;
      const baseFreq = this.scale[scaleDegree];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const delay = this.ctx.createDelay();
      const feedback = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(musicNode);

      // Connect simple delay for space depth
      gain.connect(delay);
      delay.connect(feedback);
      feedback.connect(musicNode);
      feedback.connect(delay);

      delay.delayTime.setValueAtTime(0.12, now);
      feedback.gain.setValueAtTime(0.25, now);

      osc.type = beat === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.start(now);
      osc.stop(now + 0.22);
    }

    this.currentStep++;
  }
}

export default PremiumAudioManager;
