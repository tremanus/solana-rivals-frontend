"use client";;
import Image from "next/image";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

interface Candlestick {
  id: string;
  x: number;
  height: number;
  isGreen: boolean;
  opacity: number;
  speed: number;
}

interface DataPoint {
  id: string;
  x: number;
  y: number;
  size: number;
  connected: boolean;
  opacity: number;
  speed: number;
}

const AnimatedBackground: React.FC = () => {
  const [candlesticks, setCandlesticks] = useState<Candlestick[]>([]);
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  
  useEffect(() => {
    // Generate initial candlesticks
    const initialCandlesticks: Candlestick[] = Array.from({ length: 15 }, (_, i) => ({
      id: `candle-${i}`,
      x: (i * 6) + Math.random() * 2,
      height: Math.random() * 8 + 4,
      isGreen: Math.random() > 0.5,
      opacity: Math.random() * 0.3 + 0.1,
      speed: Math.random() * 0.3 + 0.1
    }));
    
    // Generate data points for the "agent paths"
    const initialDataPoints: DataPoint[] = Array.from({ length: 30 }, (_, i) => ({
      id: `point-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      connected: Math.random() > 0.7,
      opacity: Math.random() * 0.4 + 0.1,
      speed: Math.random() * 0.4 + 0.2
    }));
    
    setCandlesticks(initialCandlesticks);
    setDataPoints(initialDataPoints);
    
    // Animation frame
    const animate = () => {
      setCandlesticks((prev) => prev.map(candle => ({
        ...candle,
        height: candle.height + (Math.random() - 0.5) * 2,
        isGreen: Math.random() > 0.4 ? candle.isGreen : !candle.isGreen,
      })));
      
      setDataPoints((prev) => prev.map(point => ({
        ...point,
        y: point.y - point.speed,
        x: point.x + (Math.random() - 0.5) * 0.5,
        connected: Math.random() > 0.8 ? !point.connected : point.connected,
        ...(point.y < -10 ? {
          y: 110,
          x: Math.random() * 100,
          connected: Math.random() > 0.7
        } : {})
      })));
    };
    
    const intervalId = setInterval(animate, 100);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Candlestick patterns */}
      <div className="absolute inset-0">
        {candlesticks.map(candle => (
          <div
            key={candle.id}
            className={`absolute bottom-0 w-2 ${candle.isGreen ? 'bg-purple-400/30' : 'bg-red-400/30'}`}
            style={{
              left: `${candle.x}%`,
              height: `${candle.height}%`,
              opacity: candle.opacity,
              transition: 'all 0.1s ease-out'
            }}
          />
        ))}
      </div>
      
      {/* Agent pathways */}
      {dataPoints.map((point, i) => (
        <React.Fragment key={point.id}>
          {point.connected && i > 0 && (
            <div
              className="absolute bg-purple-400/30"
              style={{
                left: `${(dataPoints[i-1].x + point.x) / 2}%`,
                top: `${(dataPoints[i-1].y + point.y) / 2}%`,
                width: '1px',
                height: `${Math.sqrt(
                  Math.pow(dataPoints[i-1].x - point.x, 2) +
                  Math.pow(dataPoints[i-1].y - point.y, 2)
                )}%`,
                opacity: point.opacity * 0.5,
                transform: `rotate(${Math.atan2(
                  dataPoints[i-1].y - point.y,
                  dataPoints[i-1].x - point.x
                )}rad)`,
                transformOrigin: 'top left'
              }}
            />
          )}
          <div
            className="absolute rounded-full bg-purple-400/30"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              width: `${point.size}px`,
              height: `${point.size}px`,
              opacity: point.opacity,
              transform: 'translate(-50%, -50%)',
              transition: 'all 0.1s linear'
            }}
          />
        </React.Fragment>
      ))}
      
      {/* Binary code effect */}
      <div className="absolute inset-0 select-none pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={`binary-${i}`}
            className="absolute text-purple-400/20 text-xs"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </div>
        ))}
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#051B2C] via-[#062838] to-[#1E0B41] flex flex-col items-center justify-center font-sans overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Audiowide&display=swap');
        .title-font { 
          font-family: 'Audiowide', cursive;
        }
      `}</style>
      <AnimatedBackground />
      <div className="relative z-10">
        <main className="text-center px-4 flex flex-col items-center gap-8">
          <h1 className="title-font flex flex-col text-7xl md:text-9xl font-bold text-white tracking-wider leading-nonemb-8">
            <span className="mt-20">SOLANA</span>
            <span className="mt-[0em]">RIVALS</span>
          </h1>
          <p className="text-2xl md:text-3xl text-white font-medium uppercase tracking-wide">
            First ever weekly trading competition
          </p>
          <p className="text-3xl md:text-4xl text-purple-400 font-bold mb-8">
            CREATE YOUR OWN AI TRADING AGENTS!
          </p>
          <button 
            onClick={() => router.push('/login')}
            className="bg-purple-700 hover:bg-purple-800 text-white text-2xl font-bold px-16 py-4 rounded transform hover:scale-105 transition-all duration-200 shadow-lg uppercase"
          >
            Join Now
          </button>
          <div className="mt-16 flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Image
                  src="https://treehacks.com/favicon.ico"
                  alt="TreeHacks Logo"
                  width={28}
                  height={28}
                  className="rounded-sm"
                />
                <span className="text-white/80">Built @ TreeHacks</span>
              </div>
              <span className="text-white/80">|</span>
              <div className="flex items-center gap-2">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/4/4b/Stanford_Cardinal_logo.svg"
                  alt="Stanford Logo"
                  width={16}
                  height={16}
                  className="rounded-sm"
                />
                <span className="text-white/80">Stanford</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;