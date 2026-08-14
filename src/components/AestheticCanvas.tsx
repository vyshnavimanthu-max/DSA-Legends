import React, { useRef, useEffect, useState } from 'react';
import { CloudRain, Flame, CloudSnow, Zap, Activity, Info } from 'lucide-react';
import PremiumAudioManager from '../lib/audioManager';

// Define the interface for a particle object managed in our high-performance object pool
interface PooledParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  char?: string; // Used for matrix rain
  life: number;
  maxLife: number;
  rotation?: number;
  rotSpeed?: number;
  active: boolean; // Flag indicating if checked out
}

/**
 * High-Performance Object Pool for managing particles without garbage collection overhead.
 */
class ParticlePool {
  private pool: PooledParticle[] = [];
  private nextId = 0;

  constructor(initialSize = 300) {
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createNewParticle(false));
    }
  }

  private createNewParticle(active = false): PooledParticle {
    return {
      id: this.nextId++,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      size: 1,
      alpha: 1,
      color: '#fff',
      life: 0,
      maxLife: 100,
      active,
    };
  }

  // Check out a particle from the pool, initializing its properties
  public obtain(
    x: number,
    y: number,
    vx: number,
    vy: number,
    size: number,
    alpha: number,
    color: string,
    maxLife: number,
    char?: string,
    rotation?: number,
    rotSpeed?: number
  ): PooledParticle {
    let particle = this.pool.find(p => !p.active);
    if (!particle) {
      // Pool exhausted, dynamically expand
      particle = this.createNewParticle(true);
      this.pool.push(particle);
    }
    
    particle.active = true;
    particle.x = x;
    particle.y = y;
    particle.vx = vx;
    particle.vy = vy;
    particle.size = size;
    particle.alpha = alpha;
    particle.color = color;
    particle.life = maxLife;
    particle.maxLife = maxLife;
    particle.char = char;
    particle.rotation = rotation || 0;
    particle.rotSpeed = rotSpeed || 0;
    
    return particle;
  }

  // Recycle an active particle back into the pool
  public release(particle: PooledParticle) {
    particle.active = false;
  }

  public getPoolSize(): number {
    return this.pool.length;
  }

  public getActiveCount(): number {
    return this.pool.filter(p => p.active).length;
  }
}

interface AestheticCanvasProps {
  quality: 'high' | 'medium' | 'low';
}

export default function AestheticCanvas({ quality }: AestheticCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Weather settings
  const [activeWeather, setActiveWeather] = useState<'none' | 'matrix' | 'solar' | 'snow' | 'storm'>('matrix');
  
  // Real-time engine telemetry
  const [telemetry, setTelemetry] = useState({
    fps: 60,
    activeParticles: 0,
    poolSize: 300,
    gcSavingsCount: 0,
  });

  const mouseRef = useRef({ x: -1000, y: -1000, radius: 110, active: false });
  const poolRef = useRef<ParticlePool | null>(null);

  // Initialize Object Pool
  if (!poolRef.current) {
    poolRef.current = new ParticlePool(250);
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
    mouseRef.current.active = true;
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
    mouseRef.current.x = -1000;
    mouseRef.current.y = -1000;
  };

  const handleWeatherToggle = (type: 'none' | 'matrix' | 'solar' | 'snow' | 'storm') => {
    PremiumAudioManager.getInstance().playSFX('click');
    setActiveWeather(type);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle canvas responsive resizing
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(() => resizeCanvas());
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const particles: PooledParticle[] = [];
    const pool = poolRef.current!;

    // Diagnostic indicators
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsInterval = lastTime;
    let localGCSavings = 0;

    let lightningTimer = 0;
    let lightningIntensity = 0;

    // Main animation pipeline
    let animId: number;
    const animate = (timestamp: number) => {
      animId = requestAnimationFrame(animate);

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      // Handle framerate measuring
      frameCount++;
      if (timestamp > fpsInterval + 1000) {
        setTelemetry({
          fps: Math.round((frameCount * 1000) / (timestamp - fpsInterval)),
          activeParticles: particles.length,
          poolSize: pool.getPoolSize(),
          gcSavingsCount: localGCSavings,
        });
        frameCount = 0;
        fpsInterval = timestamp;
      }

      // 1. Clear background with custom overlays
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, width, height);

      // Handle magnetic storm lightning strikes
      if (activeWeather === 'storm') {
        lightningTimer--;
        if (lightningTimer <= 0) {
          // Trigger spark strike
          lightningTimer = Math.floor(Math.random() * 240) + 90;
          lightningIntensity = Math.random() * 0.4 + 0.1;
          if (Math.random() > 0.4) {
            PremiumAudioManager.getInstance().playSFX('hover');
          }
        }
        if (lightningIntensity > 0) {
          ctx.fillStyle = `rgba(147, 51, 234, ${lightningIntensity})`;
          ctx.fillRect(0, 0, width, height);
          lightningIntensity *= 0.91; // Fast fade-out
        }
      }

      // Draw cyber Grid underlay
      ctx.strokeStyle = 'rgba(75, 85, 99, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 45;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Generate atmospheric particles based on active weather choice
      const spawnChance = quality === 'low' ? 0.1 : quality === 'medium' ? 0.35 : 0.65;
      
      if (Math.random() < spawnChance) {
        if (activeWeather === 'matrix') {
          // Cyber Matrix green code drops
          const chars = '0123456789ABCDEF<>/*+-[]{}';
          const x = Math.random() * width;
          const speed = Math.random() * 2.5 + 1.5;
          const size = Math.random() * 11 + 9;
          const char = chars[Math.floor(Math.random() * chars.length)];
          const life = Math.floor(Math.random() * 100) + 80;
          const p = pool.obtain(x, -20, 0, speed, size, Math.random() * 0.7 + 0.3, '#10b981', life, char);
          particles.push(p);
        } else if (activeWeather === 'solar') {
          // Solar heat sparks ascending
          const x = Math.random() * width;
          const vy = -(Math.random() * 1.8 + 0.6);
          const vx = Math.random() * 0.6 - 0.3;
          const size = Math.random() * 5 + 3;
          const colors = ['#f59e0b', '#ef4444', '#f97316', '#f43f5e'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          const life = Math.floor(Math.random() * 120) + 100;
          const p = pool.obtain(x, height + 10, vx, vy, size, Math.random() * 0.8 + 0.2, color, life);
          particles.push(p);
        } else if (activeWeather === 'snow') {
          // Cyber snowflake nodes drifting down and spinning
          const x = Math.random() * width;
          const vy = Math.random() * 1.2 + 0.5;
          const vx = Math.random() * 0.8 - 0.4;
          const size = Math.random() * 6 + 4;
          const life = Math.floor(Math.random() * 180) + 120;
          const p = pool.obtain(x, -10, vx, vy, size, Math.random() * 0.7 + 0.3, '#22d3ee', life, undefined, Math.random() * Math.PI, Math.random() * 0.04 - 0.02);
          particles.push(p);
        } else if (activeWeather === 'storm') {
          // Intermittent lightning spark nodes
          const x = Math.random() * width;
          const y = Math.random() * height * 0.4;
          const vx = Math.random() * 4 - 2;
          const vy = Math.random() * 4 - 2;
          const size = Math.random() * 3 + 2;
          const life = Math.floor(Math.random() * 40) + 20;
          const p = pool.obtain(x, y, vx, vy, size, 1, '#c084fc', life);
          particles.push(p);
        }
      }

      // Keep some generic ambient nodes floating to preserve composition depth
      if (particles.length < 55 && Math.random() < 0.4) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const p = pool.obtain(
          x,
          y,
          Math.random() * 0.4 - 0.2,
          Math.random() * 0.4 - 0.2,
          Math.random() * 3 + 1,
          Math.random() * 0.5 + 0.1,
          '#818cf8',
          Math.floor(Math.random() * 200) + 100
        );
        particles.push(p);
      }

      // 3. Process Physics and Vector fields for active particles
      const mouse = mouseRef.current;
      
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Process life cycle tick
        p.life--;
        if (p.life <= 0 || p.x < -40 || p.x > width + 40 || p.y < -40 || p.y > height + 40) {
          // Re-insert into pool to save memory allocations (No garbage collection overhead!)
          pool.release(p);
          particles.splice(i, 1);
          localGCSavings++;
          continue;
        }

        // Apply magnetic storm gravity turbulence
        if (activeWeather === 'storm') {
          p.vx += (Math.random() * 0.4 - 0.2);
          p.vy += (Math.random() * 0.4 - 0.2);
        }

        // Calculate magnetic force push/pull from user pointer
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            
            // Solar flares push outward, everything else is slightly pulled in for gravity attraction
            const factor = activeWeather === 'solar' ? 1.5 : -1.2;
            p.vx += (dx / dist) * force * factor * 0.18;
            p.vy += (dy / dist) * force * factor * 0.18;
          }
        }

        // Friction and position update
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.rotation !== undefined && p.rotSpeed !== undefined) {
          p.rotation += p.rotSpeed;
        }

        // 4. Render Particle
        const lifeRatio = p.life / p.maxLife;
        ctx.globalAlpha = p.alpha * (lifeRatio > 0.3 ? 1 : lifeRatio / 0.3);

        if (p.char) {
          // Matrix code text
          ctx.fillStyle = p.color;
          ctx.font = `bold ${p.size}px monospace`;
          ctx.fillText(p.char, p.x, p.y);
        } else if (p.rotation !== undefined) {
          // Spin snowflake shape
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          // Cross snowflake pattern
          ctx.fillRect(-p.size / 2, -1.5, p.size, 3);
          ctx.fillRect(-1.5, -p.size / 2, 3, p.size);
          ctx.restore();
        } else {
          // Glowing light circles (Solar / Spark)
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          // Render bloom halos on Solar or Sparks in high/medium graphics
          if (quality !== 'low' && (activeWeather === 'solar' || activeWeather === 'storm' || p.size > 4)) {
            ctx.save();
            ctx.globalAlpha = ctx.globalAlpha * 0.25;
            ctx.shadowBlur = 12;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      }

      // 5. Draw mouse lighting orb halo (Backdrop spotlight)
      if (mouse.active) {
        ctx.globalAlpha = 1;
        const radialGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          10,
          mouse.x,
          mouse.y,
          mouse.radius
        );
        
        let lightColor = 'rgba(168, 85, 247, 0.08)'; // Purple default
        if (activeWeather === 'matrix') lightColor = 'rgba(16, 185, 129, 0.06)';
        if (activeWeather === 'solar') lightColor = 'rgba(249, 115, 22, 0.08)';
        if (activeWeather === 'snow') lightColor = 'rgba(34, 211, 238, 0.08)';
        
        radialGlow.addColorStop(0, lightColor);
        radialGlow.addColorStop(1, 'rgba(6, 10, 18, 0)');
        ctx.fillStyle = radialGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
    };

    animate(performance.now());

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, [activeWeather, quality]);

  // Decoded title descriptors
  const weatherLabels = {
    none: 'Clear Sector',
    matrix: 'Matrix Code Rain',
    solar: 'Solar Flare Embers',
    snow: 'Cyber Blue Snowfall',
    storm: 'Magnetic Sparks Storm',
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="absolute inset-0 w-full h-full pointer-events-auto overflow-hidden rounded-2xl"
      id="aesthetic-canvas-container"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-0" />

      {/* Real-time Environment Controller HUD Overlay */}
      <div className="absolute top-4 left-4 z-10 bg-slate-950/80 border border-slate-800/80 p-3 rounded-2xl backdrop-blur-md flex flex-col gap-2.5 max-w-[280px] text-slate-300 font-mono select-none">
        <div className="flex items-center gap-1.5 border-b border-slate-900 pb-1.5 justify-between">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-100 uppercase">AESTHETIC CONTROLLER</span>
          </div>
          <span className="text-[8px] bg-purple-950/60 border border-purple-800/40 text-purple-300 px-1 rounded">AAA v2.0</span>
        </div>

        {/* Weather selectors */}
        <div className="space-y-1">
          <span className="text-[8px] font-bold text-slate-500 uppercase block">Toggle Climate</span>
          <div className="grid grid-cols-5 gap-1">
            <button
              onClick={() => handleWeatherToggle('none')}
              title={weatherLabels.none}
              className={`p-1.5 rounded-lg border flex items-center justify-center transition-all ${
                activeWeather === 'none'
                  ? 'bg-slate-800 border-slate-600 text-slate-100'
                  : 'bg-slate-900/50 border-slate-850 text-slate-500 hover:text-slate-300'
              }`}
            >
              <Info className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleWeatherToggle('matrix')}
              title={weatherLabels.matrix}
              className={`p-1.5 rounded-lg border flex items-center justify-center transition-all ${
                activeWeather === 'matrix'
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400'
                  : 'bg-slate-900/50 border-slate-850 text-slate-500 hover:text-slate-300'
              }`}
            >
              <CloudRain className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleWeatherToggle('solar')}
              title={weatherLabels.solar}
              className={`p-1.5 rounded-lg border flex items-center justify-center transition-all ${
                activeWeather === 'solar'
                  ? 'bg-amber-950/60 border-amber-500/50 text-amber-400'
                  : 'bg-slate-900/50 border-slate-850 text-slate-500 hover:text-slate-300'
              }`}
            >
              <Flame className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleWeatherToggle('snow')}
              title={weatherLabels.snow}
              className={`p-1.5 rounded-lg border flex items-center justify-center transition-all ${
                activeWeather === 'snow'
                  ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-400'
                  : 'bg-slate-900/50 border-slate-850 text-slate-500 hover:text-slate-300'
              }`}
            >
              <CloudSnow className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleWeatherToggle('storm')}
              title={weatherLabels.storm}
              className={`p-1.5 rounded-lg border flex items-center justify-center transition-all ${
                activeWeather === 'storm'
                  ? 'bg-purple-950/60 border-purple-500/50 text-purple-400'
                  : 'bg-slate-900/50 border-slate-850 text-slate-500 hover:text-slate-300'
              }`}
            >
              <Zap className="w-3 h-3" />
            </button>
          </div>
          <span className="text-[9px] text-slate-400 font-semibold block pt-0.5">{weatherLabels[activeWeather]}</span>
        </div>

        {/* Optimization Metrics (Telemetries of our custom Pool implementation) */}
        <div className="bg-slate-950/80 p-2 border border-slate-900 rounded-xl text-[9px] text-slate-400 space-y-1">
          <div className="flex justify-between">
            <span>ENGINE RENDER RATE:</span>
            <span className="text-emerald-400 font-bold">{telemetry.fps} FPS</span>
          </div>
          <div className="flex justify-between">
            <span>ACTIVE PARTICLES:</span>
            <span className="text-cyan-400 font-bold">{telemetry.activeParticles}</span>
          </div>
          <div className="flex justify-between">
            <span>OBJECT POOL SIZE:</span>
            <span className="text-purple-400 font-bold">{telemetry.poolSize}</span>
          </div>
          <div className="flex justify-between border-t border-slate-900 pt-1 mt-1 text-[8px] text-slate-500">
            <span>GC ALLOC PREVENTED:</span>
            <span className="text-amber-400 font-bold">x{telemetry.gcSavingsCount} obj</span>
          </div>
        </div>
      </div>
    </div>
  );
}
