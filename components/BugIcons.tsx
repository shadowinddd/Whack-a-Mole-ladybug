import React from 'react';
import { BugType } from '../types';

// Common props for consistency
interface IconProps {
  className?: string;
  isDizzy?: boolean;
}

// Helper for Dizzy Eyes (X shape)
const DizzyEyes: React.FC<{ cx1: number, cy1: number, cx2: number, cy2: number, size?: number, color?: string }> = ({ cx1, cy1, cx2, cy2, size = 3, color = "#333" }) => (
  <g stroke={color} strokeWidth="2" strokeLinecap="round">
    {/* Left Eye X */}
    <path d={`M${cx1 - size} ${cy1 - size} L${cx1 + size} ${cy1 + size}`} />
    <path d={`M${cx1 + size} ${cy1 - size} L${cx1 - size} ${cy1 + size}`} />
    {/* Right Eye X */}
    <path d={`M${cx2 - size} ${cy2 - size} L${cx2 + size} ${cy2 + size}`} />
    <path d={`M${cx2 + size} ${cy2 - size} L${cx2 - size} ${cy2 + size}`} />
  </g>
);

export const HammerIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="rotate(-15 50 50)">
      {/* Handle - Yellow Toy Style */}
      <rect x="42" y="35" width="16" height="60" rx="4" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />
      
      {/* Handle Grip Detail */}
      <path d="M42 80 H58 M42 70 H58 M42 60 H58" stroke="#D97706" strokeWidth="2" opacity="0.5" />
      
      {/* Head - Big Red Cylinder */}
      <rect x="15" y="15" width="70" height="40" rx="8" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />
      
      {/* Impact Faces (Yellow Circles) */}
      <ellipse cx="15" cy="35" rx="4" ry="12" fill="#FCD34D" stroke="#B45309" strokeWidth="2" />
      <ellipse cx="85" cy="35" rx="4" ry="12" fill="#FCD34D" stroke="#B45309" strokeWidth="2" />
      
      {/* Shine on Head */}
      <path d="M25 22 H75" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
      <path d="M25 28 H40" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      
      {/* Decorative Star */}
      <path d="M50 30 L52 34 H56 L53 36 L54 40 L50 38 L46 40 L47 36 L44 34 H48 Z" fill="#FCD34D" />
    </g>
  </svg>
);

export const LadybugIcon: React.FC<IconProps> = ({ className, isDizzy }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Legs */}
    <path d="M20 30 L10 20 M80 30 L90 20 M15 50 L5 50 M85 50 L95 50 M20 70 L10 80 M80 70 L90 80" stroke="#333" strokeWidth="6" strokeLinecap="round" />
    {/* Body */}
    <circle cx="50" cy="55" r="40" fill="#EF4444" stroke="#333" strokeWidth="3" />
    {/* Head */}
    <circle cx="50" cy="25" r="18" fill="#1F2937" />
    {/* Eyes */}
    {isDizzy ? (
      <DizzyEyes cx1={42} cy1={22} cx2={58} cy2={22} color="white" />
    ) : (
      <>
        <circle cx="42" cy="22" r="5" fill="white" />
        <circle cx="58" cy="22" r="5" fill="white" />
        <circle cx="42" cy="22" r="2" fill="black" />
        <circle cx="58" cy="22" r="2" fill="black" />
      </>
    )}
    {/* Spots */}
    <circle cx="50" cy="50" r="6" fill="#1F2937" />
    <circle cx="30" cy="45" r="5" fill="#1F2937" />
    <circle cx="70" cy="45" r="5" fill="#1F2937" />
    <circle cx="35" cy="70" r="5" fill="#1F2937" />
    <circle cx="65" cy="70" r="5" fill="#1F2937" />
    {/* Divider Line */}
    <path d="M50 35 L50 95" stroke="#1F2937" strokeWidth="2" />
    {/* Antennae */}
    <path d="M40 12 L35 5 M60 12 L65 5" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const SpiderIcon: React.FC<IconProps> = ({ className, isDizzy }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Web Thread */}
    <line x1="50" y1="0" x2="50" y2="30" stroke="white" strokeWidth="2" opacity="0.5" />
    {/* Legs */}
    <path d="M20 40 Q 10 20 30 50 M80 40 Q 90 20 70 50" stroke="#4C1D95" strokeWidth="4" fill="none" />
    <path d="M15 60 Q 5 60 30 60 M85 60 Q 95 60 70 60" stroke="#4C1D95" strokeWidth="4" fill="none" />
    <path d="M20 80 Q 10 90 30 70 M80 80 Q 90 90 70 70" stroke="#4C1D95" strokeWidth="4" fill="none" />
    {/* Body */}
    <ellipse cx="50" cy="60" rx="25" ry="22" fill="#8B5CF6" stroke="#4C1D95" strokeWidth="2" />
    {/* Eyes */}
    {isDizzy ? (
      <DizzyEyes cx1={40} cy1={55} cx2={60} cy2={55} color="white" />
    ) : (
      <>
        <circle cx="40" cy="55" r="6" fill="white" />
        <circle cx="60" cy="55" r="6" fill="white" />
        <circle cx="40" cy="55" r="2" fill="black" />
        <circle cx="60" cy="55" r="2" fill="black" />
      </>
    )}
    {/* Mouth */}
    <path d={isDizzy ? "M45 75 Q 50 70 55 75" : "M45 70 Q 50 75 55 70"} stroke="#4C1D95" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const BeeIcon: React.FC<IconProps> = ({ className, isDizzy }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Wings */}
    <ellipse cx="30" cy="35" rx="15" ry="20" transform="rotate(-30 30 35)" fill="#E0F2FE" stroke="#7DD3FC" strokeWidth="2" opacity="0.8" />
    <ellipse cx="70" cy="35" rx="15" ry="20" transform="rotate(30 70 35)" fill="#E0F2FE" stroke="#7DD3FC" strokeWidth="2" opacity="0.8" />
    {/* Body */}
    <ellipse cx="50" cy="60" rx="25" ry="30" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />
    {/* Stripes */}
    <path d="M30 50 H70 M28 65 H72 M35 80 H65" stroke="#451A03" strokeWidth="6" strokeLinecap="round" />
    {/* Face */}
    {isDizzy ? (
       <DizzyEyes cx1={40} cy1={50} cx2={60} cy2={50} color="black" />
    ) : (
      <>
        <circle cx="40" cy="50" r="3" fill="black" />
        <circle cx="60" cy="50" r="3" fill="black" />
      </>
    )}
    <path d={isDizzy ? "M45 65 Q 50 60 55 65" : "M45 60 Q 50 63 55 60"} stroke="black" strokeWidth="2" strokeLinecap="round" />
    {/* Stinger */}
    <path d="M50 90 L45 85 H55 Z" fill="#451A03" />
  </svg>
);

export const FlyIcon: React.FC<IconProps> = ({ className, isDizzy }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Wings */}
    <path d="M20 40 Q 10 10 50 40 Q 90 10 80 40" fill="#A7F3D0" stroke="#34D399" strokeWidth="2" opacity="0.8" />
    {/* Body */}
    <circle cx="50" cy="50" r="20" fill="#374151" stroke="black" strokeWidth="2" />
    {/* Big Eyes */}
    <circle cx="40" cy="40" r="10" fill="#EF4444" stroke="white" strokeWidth="2" />
    <circle cx="60" cy="40" r="10" fill="#EF4444" stroke="white" strokeWidth="2" />
    
    {isDizzy ? (
      <>
        <path d="M36 36 L44 44 M44 36 L36 44" stroke="black" strokeWidth="2" />
        <path d="M56 36 L64 44 M64 36 L56 44" stroke="black" strokeWidth="2" />
      </>
    ) : (
      <>
        <circle cx="40" cy="40" r="3" fill="black" />
        <circle cx="60" cy="40" r="3" fill="black" />
      </>
    )}
  </svg>
);

export const CaterpillarIcon: React.FC<IconProps> = ({ className, isDizzy }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Body Segments */}
    <circle cx="20" cy="70" r="12" fill="#84CC16" stroke="#3F6212" strokeWidth="2" />
    <circle cx="35" cy="65" r="14" fill="#84CC16" stroke="#3F6212" strokeWidth="2" />
    <circle cx="55" cy="65" r="14" fill="#84CC16" stroke="#3F6212" strokeWidth="2" />
    {/* Head */}
    <circle cx="75" cy="55" r="18" fill="#A3E635" stroke="#3F6212" strokeWidth="2" />
    {/* Face */}
    {isDizzy ? (
       <DizzyEyes cx1={70} cy1={50} cx2={82} cy2={50} color="black" />
    ) : (
      <>
        <circle cx="70" cy="50" r="3" fill="black" />
        <circle cx="82" cy="50" r="3" fill="black" />
      </>
    )}
    <path d={isDizzy ? "M72 66 Q 76 62 80 66" : "M72 62 Q 76 66 80 62"} stroke="#3F6212" strokeWidth="2" strokeLinecap="round" />
    {/* Antennae */}
    <path d="M70 40 L65 30 M80 40 L85 30" stroke="#3F6212" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const BlackAntIcon: React.FC<IconProps> = ({ className, isDizzy }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
     {/* Legs */}
    <path d="M30 40 L10 25 M30 50 L10 50 M35 60 L15 75" stroke="#1F2937" strokeWidth="4" strokeLinecap="round" />
    <path d="M70 40 L90 25 M70 50 L90 50 M65 60 L85 75" stroke="#1F2937" strokeWidth="4" strokeLinecap="round" />
    {/* Abdomen */}
    <ellipse cx="50" cy="70" rx="15" ry="20" fill="#374151" />
    {/* Thorax */}
    <circle cx="50" cy="50" r="12" fill="#374151" />
    {/* Head */}
    <circle cx="50" cy="30" r="14" fill="#374151" />
    {/* Eyes */}
    {isDizzy ? (
      <DizzyEyes cx1={45} cy1={28} cx2={55} cy2={28} color="white" />
    ) : (
      <>
        <circle cx="45" cy="28" r="3" fill="white" />
        <circle cx="55" cy="28" r="3" fill="white" />
      </>
    )}
    {/* Antennae */}
    <path d="M45 20 L35 10 M55 20 L65 10" stroke="#1F2937" strokeWidth="3" />
  </svg>
);

export const RedAntIcon: React.FC<IconProps> = ({ className, isDizzy }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
     {/* Legs */}
    <path d="M30 40 L10 25 M30 50 L10 50 M35 60 L15 75" stroke="#7F1D1D" strokeWidth="4" strokeLinecap="round" />
    <path d="M70 40 L90 25 M70 50 L90 50 M65 60 L85 75" stroke="#7F1D1D" strokeWidth="4" strokeLinecap="round" />
    {/* Abdomen */}
    <ellipse cx="50" cy="70" rx="15" ry="20" fill="#DC2626" />
    {/* Thorax */}
    <circle cx="50" cy="50" r="12" fill="#B91C1C" />
    {/* Head */}
    <circle cx="50" cy="30" r="14" fill="#EF4444" />
    {/* Eyes */}
    {isDizzy ? (
      <DizzyEyes cx1={45} cy1={28} cx2={55} cy2={28} color="white" />
    ) : (
      <>
        <circle cx="45" cy="28" r="3" fill="white" />
        <circle cx="55" cy="28" r="3" fill="white" />
      </>
    )}
    {/* Antennae */}
    <path d="M45 20 L35 10 M55 20 L65 10" stroke="#7F1D1D" strokeWidth="3" />
  </svg>
);

export const DragonflyIcon: React.FC<IconProps> = ({ className, isDizzy }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Wings */}
    <ellipse cx="20" cy="40" rx="25" ry="8" transform="rotate(-15 20 40)" fill="#A5F3FC" stroke="#22D3EE" strokeWidth="2" opacity="0.8" />
    <ellipse cx="80" cy="40" rx="25" ry="8" transform="rotate(15 80 40)" fill="#A5F3FC" stroke="#22D3EE" strokeWidth="2" opacity="0.8" />
    <ellipse cx="25" cy="55" rx="22" ry="7" transform="rotate(-20 25 55)" fill="#A5F3FC" stroke="#22D3EE" strokeWidth="2" opacity="0.8" />
    <ellipse cx="75" cy="55" rx="22" ry="7" transform="rotate(20 75 55)" fill="#A5F3FC" stroke="#22D3EE" strokeWidth="2" opacity="0.8" />
    
    {/* Tail */}
    <path d="M50 50 L48 95 L52 95 Z" fill="#0E7490" />
    
    {/* Body */}
    <ellipse cx="50" cy="45" rx="5" ry="15" fill="#0891B2" />
    
    {/* Head */}
    <circle cx="50" cy="25" r="10" fill="#155E75" />
    {/* Eyes */}
    {isDizzy ? (
      <DizzyEyes cx1={46} cy1={22} cx2={54} cy2={22} color="#CFFAFE" />
    ) : (
      <>
        <circle cx="46" cy="22" r="4" fill="#CFFAFE" />
        <circle cx="54" cy="22" r="4" fill="#CFFAFE" />
      </>
    )}
  </svg>
);

export const LocustIcon: React.FC<IconProps> = ({ className, isDizzy }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Big Hind Legs */}
    <path d="M30 60 L20 40 L40 50" stroke="#365314" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M70 60 L80 40 L60 50" stroke="#365314" strokeWidth="4" strokeLinecap="round" fill="none" />
    
    {/* Wings folded */}
    <path d="M40 40 L50 85 L60 40" fill="#84CC16" stroke="#4D7C0F" strokeWidth="2" />
    
    {/* Head */}
    <path d="M40 40 L50 20 L60 40 Z" fill="#65A30D" />
    
    {/* Eyes */}
    {isDizzy ? (
      <DizzyEyes cx1={45} cy1={35} cx2={55} cy2={35} color="black" size={2} />
    ) : (
      <>
        <circle cx="45" cy="35" r="2" fill="black" />
        <circle cx="55" cy="35" r="2" fill="black" />
      </>
    )}
    
    {/* Antennae */}
    <path d="M45 25 L40 10 M55 25 L60 10" stroke="#365314" strokeWidth="2" />
  </svg>
);

export const PoliceCarIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Body */}
    <path d="M10 60 L20 40 H80 L90 60 V80 H10 V60 Z" fill="#3B82F6" stroke="#1E40AF" strokeWidth="2" />
    <rect x="10" y="60" width="80" height="20" fill="#2563EB" />
    {/* Windows */}
    <path d="M25 42 H75 L82 60 H18 L25 42 Z" fill="#93C5FD" />
    {/* Siren */}
    <path d="M40 30 H60 V40 H40 Z" fill="#EF4444" className="animate-pulse" />
    <path d="M45 30 H55 V40 H45 Z" fill="#3B82F6" className="animate-pulse" style={{animationDelay: '0.1s'}} />
    {/* Wheels */}
    <circle cx="25" cy="80" r="10" fill="#1F2937" stroke="#4B5563" strokeWidth="2" />
    <circle cx="75" cy="80" r="10" fill="#1F2937" stroke="#4B5563" strokeWidth="2" />
    <circle cx="25" cy="80" r="4" fill="#9CA3AF" />
    <circle cx="75" cy="80" r="4" fill="#9CA3AF" />
    {/* Star/Police Badge */}
    <path d="M50 62 L52 68 H58 L53 72 L55 78 L50 74 L45 78 L47 72 L42 68 H48 Z" fill="#FBBF24" />
  </svg>
);

export const CrossIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 20 L80 80 M80 20 L20 80" stroke="#EF4444" strokeWidth="15" strokeLinecap="round" />
  </svg>
);

export const PauseIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M18 10a1 1 0 01-1 1H7a1 1 0 01-1-1V3a1 1 0 011-1h10a1 1 0 011 1v7zm-5 4.94a1 1 0 010 1.41l-4 4a1 1 0 01-1.41 0l-4-4a1 1 0 011.41-1.41L7 16.59V13a1 1 0 112 0v3.59l2.29-2.29a1 1 0 011.42 0z" clipRule="evenodd" opacity="0"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const PlayIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const RefreshIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

export const HomeIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export const VolumeIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
  </svg>
);

export const MuteIcon: React.FC<IconProps> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
  </svg>
);

export const RenderBug: React.FC<{ type: BugType; className?: string; isDizzy?: boolean }> = ({ type, className, isDizzy }) => {
  switch (type) {
    case BugType.LADYBUG: return <LadybugIcon className={className} isDizzy={isDizzy} />;
    case BugType.SPIDER: return <SpiderIcon className={className} isDizzy={isDizzy} />;
    case BugType.BEE: return <BeeIcon className={className} isDizzy={isDizzy} />;
    case BugType.FLY: return <FlyIcon className={className} isDizzy={isDizzy} />;
    case BugType.CATERPILLAR: return <CaterpillarIcon className={className} isDizzy={isDizzy} />;
    case BugType.BLACK_ANT: return <BlackAntIcon className={className} isDizzy={isDizzy} />;
    case BugType.RED_ANT: return <RedAntIcon className={className} isDizzy={isDizzy} />;
    case BugType.DRAGONFLY: return <DragonflyIcon className={className} isDizzy={isDizzy} />;
    case BugType.LOCUST: return <LocustIcon className={className} isDizzy={isDizzy} />;
    default: return null;
  }
};