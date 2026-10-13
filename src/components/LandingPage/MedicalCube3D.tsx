import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Play, Pause, Activity, BedDouble } from 'lucide-react';

interface MedicalCube3DProps {
  className?: string;
}

export const MedicalCube3D: React.FC<MedicalCube3DProps> = ({ className = '' }) => {
  // Optimal default perspective: reveals Top, Front, and Right faces simultaneously
  const DEFAULT_ROT_X = -20;
  const DEFAULT_ROT_Y = 35;

  const [rotX, setRotX] = useState<number>(DEFAULT_ROT_X);
  const [rotY, setRotY] = useState<number>(DEFAULT_ROT_Y);
  const [isOrbiting, setIsOrbiting] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragRotStart, setDragRotStart] = useState<{ x: number; y: number }>({ x: DEFAULT_ROT_X, y: DEFAULT_ROT_Y });

  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  // Check user preference for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsOrbiting(false);
    }
  }, []);

  // Continuous auto-orbit animation loop
  useEffect(() => {
    if (!isOrbiting || isDragging) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
      return;
    }

    const orbitStep = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Rotate Y axis smoothly (~15 degrees per second)
      setRotY((prev) => (prev + (delta * 0.018)) % 360);

      animFrameRef.current = requestAnimationFrame(orbitStep);
    };

    animFrameRef.current = requestAnimationFrame(orbitStep);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOrbiting, isDragging]);

  // Mouse / Touch Drag handlers for manual 3D inspection
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragRotStart({ x: rotX, y: rotY });
  }, [rotX, rotY]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    // Dampen drag sensitivity
    const newRotY = (dragRotStart.y + deltaX * 0.5) % 360;
    const newRotX = Math.max(-65, Math.min(65, dragRotStart.x - deltaY * 0.5));

    setRotX(newRotX);
    setRotY(newRotY);
  }, [isDragging, dragStart, dragRotStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleResetView = () => {
    setRotX(DEFAULT_ROT_X);
    setRotY(DEFAULT_ROT_Y);
  };

  const toggleOrbit = () => {
    setIsOrbiting((prev) => !prev);
  };

  return (
    <div
      ref={sceneRef}
      className={`cube-scene ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      aria-label="Interactive 3D Medical Acrylic Cube"
    >
      {/* Realistic Soft Ambient Ground Shadow */}
      <div className="cube-ground-shadow" />

      {/* Holographic Ring System below the cube */}
      <div className="holographic-system">
        <div className="holographic-disc-glow" />
        <div className="holographic-ring-outer" />
        <div className="holographic-ring-inner" />
      </div>

      {/* Floating Glass Panels */}
      <div className="floating-telemetry-badge floating-badge-top-left" style={{ cursor: 'default' }}>
        <div className="w-8 h-8 rounded-lg bg-violet-600/30 border border-violet-400/40 flex items-center justify-center text-violet-300">
          <Activity className="w-4 h-4 text-violet-300 animate-pulse" />
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-violet-300">Predictive Analytics</div>
          <div className="text-xs font-semibold text-white flex items-center gap-1.5">
            <span>Surge Alert -0.8%</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
        </div>
      </div>

      <div className="floating-telemetry-badge floating-badge-bottom-right" style={{ cursor: 'default' }}>
        <div className="w-8 h-8 rounded-lg bg-purple-900/50 border border-purple-500/40 flex items-center justify-center text-purple-300">
          <BedDouble className="w-4 h-4 text-purple-300" />
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-purple-300">Capacity Intelligence</div>
          <div className="text-xs font-semibold text-white flex items-center gap-1.5">
            <span>Dynamic Census Sync</span>
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
          </div>
        </div>
      </div>

      {/* Outer Bobbing / Floating Wrapper */}
      <div className="cube-float-wrapper">
        {/* 3D Rotator Assembly */}
        <div
          className="cube-assembly"
          style={{
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            transition: isDragging ? 'none' : 'transform 0.1s linear',
          }}
        >
          {/* Luminous Volumetric Internal Core */}
          <div className="cube-inner-core" />

          {/* FRONT FACE */}
          <div className="cube-face cube-face-front">
            <div className="medical-plus">
              <div className="medical-plus-bar medical-plus-vertical" />
              <div className="medical-plus-bar medical-plus-horizontal" />
            </div>
          </div>

          {/* BACK FACE */}
          <div className="cube-face cube-face-back">
            <div className="medical-plus">
              <div className="medical-plus-bar medical-plus-vertical" />
              <div className="medical-plus-bar medical-plus-horizontal" />
            </div>
          </div>

          {/* RIGHT FACE */}
          <div className="cube-face cube-face-right">
            <div className="medical-plus">
              <div className="medical-plus-bar medical-plus-vertical" />
              <div className="medical-plus-bar medical-plus-horizontal" />
            </div>
          </div>

          {/* LEFT FACE */}
          <div className="cube-face cube-face-left">
            <div className="medical-plus">
              <div className="medical-plus-bar medical-plus-vertical" />
              <div className="medical-plus-bar medical-plus-horizontal" />
            </div>
          </div>

          {/* TOP FACE */}
          <div className="cube-face cube-face-top">
            <div className="medical-plus">
              <div className="medical-plus-bar medical-plus-vertical" />
              <div className="medical-plus-bar medical-plus-horizontal" />
            </div>
          </div>

          {/* BOTTOM FACE */}
          <div className="cube-face cube-face-bottom">
            <div className="medical-plus">
              <div className="medical-plus-bar medical-plus-vertical" />
              <div className="medical-plus-bar medical-plus-horizontal" />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls Bar: Orbit Toggle & Reset View */}
      <div className="cube-controls-bar" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={toggleOrbit}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
            isOrbiting
              ? 'bg-violet-600/80 text-white shadow-[0_0_12px_rgba(139,92,246,0.5)]'
              : 'bg-white/10 text-violet-200 hover:bg-white/20'
          }`}
          title={isOrbiting ? 'Pause 3D rotation' : 'Start 3D rotation'}
        >
          {isOrbiting ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          <span>Orbit {isOrbiting ? 'ON' : 'OFF'}</span>
        </button>

        <button
          type="button"
          onClick={handleResetView}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-white/10 text-violet-200 hover:bg-white/20 transition-all"
          title="Reset 3D perspective"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset View</span>
        </button>
      </div>
    </div>
  );
};
