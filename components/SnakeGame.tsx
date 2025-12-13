import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Coordinate, Direction } from '../types';
import { Play, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;

const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [snake, setSnake] = useState<Coordinate[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Coordinate>({ x: 5, y: 5 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [direction, setDirection] = useState<Direction>(Direction.UP);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const directionRef = useRef<Direction>(Direction.UP);

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
    setScore(0);
    setDirection(Direction.UP);
    directionRef.current = Direction.UP;
    setIsGameOver(false);
    setIsPlaying(true);
    spawnFood();
  };

  const spawnFood = useCallback(() => {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    setFood({ x, y });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
      if (!isPlaying) return;

      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W':
          if (directionRef.current !== Direction.DOWN) directionRef.current = Direction.UP; break;
        case 'ArrowDown': case 's': case 'S':
          if (directionRef.current !== Direction.UP) directionRef.current = Direction.DOWN; break;
        case 'ArrowLeft': case 'a': case 'A':
          if (directionRef.current !== Direction.RIGHT) directionRef.current = Direction.LEFT; break;
        case 'ArrowRight': case 'd': case 'D':
          if (directionRef.current !== Direction.LEFT) directionRef.current = Direction.RIGHT; break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying || isGameOver) return;
    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        switch (directionRef.current) {
          case Direction.UP: head.y -= 1; break;
          case Direction.DOWN: head.y += 1; break;
          case Direction.LEFT: head.x -= 1; break;
          case Direction.RIGHT: head.x += 1; break;
        }

        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setIsGameOver(true); setIsPlaying(false); return prevSnake;
        }
        for (let i = 0; i < prevSnake.length; i++) {
          if (head.x === prevSnake[i].x && head.y === prevSnake[i].y) {
            setIsGameOver(true); setIsPlaying(false); return prevSnake;
          }
        }

        const newSnake = [head, ...prevSnake];
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 10); spawnFood();
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    };
    const gameInterval = setInterval(moveSnake, 120);
    return () => clearInterval(gameInterval);
  }, [isPlaying, isGameOver, food, spawnFood]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  // Canvas Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const containerSize = Math.min(
        (containerRef.current?.offsetWidth || 400), 
        (containerRef.current?.offsetHeight || 400)
    );
    canvas.width = containerSize;
    canvas.height = containerSize;
    const cellSize = containerSize / GRID_SIZE;

    // Clear with dark void color
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid dots
    ctx.fillStyle = '#1a1a1a';
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
          ctx.fillRect(x * cellSize + cellSize/2 - 1, y * cellSize + cellSize/2 - 1, 2, 2);
      }
    }

    // Draw Food (Glitchy Square)
    ctx.fillStyle = '#ff00ff'; // Magenta
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 0;
    const fx = food.x * cellSize;
    const fy = food.y * cellSize;
    ctx.fillRect(fx + 2, fy + 2, cellSize - 4, cellSize - 4);
    // Artifact
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(fx + 4, fy + 4, 4, 4);

    // Draw Snake (Raw blocks)
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#ffffff' : '#00ffff'; // White head, Cyan body
      const x = segment.x * cellSize;
      const y = segment.y * cellSize;
      
      // Glitch offset for body
      const offsetX = (!isHead && Math.random() > 0.9) ? (Math.random() * 4 - 2) : 0;
      
      ctx.fillRect(x + 1 + offsetX, y + 1, cellSize - 2, cellSize - 2);
      
      if (isHead) {
          // Eyes
          ctx.fillStyle = '#000';
          ctx.fillRect(x + 4, y + 4, 4, 4);
          ctx.fillRect(x + cellSize - 8, y + 4, 4, 4);
      }
    });

  }, [snake, food, containerRef.current?.offsetWidth]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-lg aspect-square p-1 bg-glitch-black border border-glitch-gray" ref={containerRef}>
      
      {/* Raw HUD */}
      <div className="absolute -top-8 w-full flex justify-between text-glitch-cyan font-mono text-xl tracking-widest">
        <div>SCORE_00{score}</div>
        <div className="text-glitch-magenta">HI_00{highScore}</div>
      </div>

      <canvas ref={canvasRef} className="block w-full h-full image-pixelated" style={{ imageRendering: 'pixelated' }} />

      {/* Overlay Screens */}
      {(!isPlaying && !isGameOver) && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 border-2 border-glitch-cyan/50 m-2">
            <h2 className="text-6xl font-display text-glitch-white animate-glitch-skew mb-4">START</h2>
            <button onClick={startGame} className="group relative px-6 py-2 bg-glitch-cyan text-black font-bold uppercase hover:bg-white transition-colors">
                <span className="flex items-center gap-2">
                   <Play size={20} /> INITIALIZE
                </span>
                <div className="absolute inset-0 border border-white translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform pointer-events-none mix-blend-difference"></div>
            </button>
        </div>
      )}

      {isGameOver && (
        <div className="absolute inset-0 bg-red-900/90 mix-blend-hard-light flex flex-col items-center justify-center z-20 m-2">
             <h2 className="text-6xl font-display text-black bg-glitch-cyan px-4 skew-x-12 mb-2">FATAL_ERR</h2>
             <p className="text-white font-mono mb-8 text-lg blink">PROCESS TERMINATED</p>
             <button onClick={startGame} className="border-2 border-white text-white px-8 py-2 hover:bg-white hover:text-black font-mono font-bold uppercase transition-all">
                <span className="flex items-center gap-2">
                   <RotateCcw size={16} /> REBOOT_SYSTEM
                </span>
             </button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
