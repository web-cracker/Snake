import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal, ShieldAlert, Cpu } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-glitch-black text-glitch-white flex flex-col items-center overflow-hidden relative font-mono">
      
      {/* Noise Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0"></div>

      {/* Header */}
      <header className="z-10 w-full p-4 border-b-2 border-glitch-magenta/50 flex flex-col md:flex-row items-center justify-between bg-glitch-black">
         <div className="flex items-center gap-4">
             <div className="bg-glitch-magenta text-black p-1 animate-pulse">
                <Terminal size={32} />
             </div>
             <div>
                <h1 className="text-4xl md:text-5xl font-display text-glitch-cyan tracking-widest uppercase glitch-text" data-text="NEON_SNAKE">
                  NEON_SNAKE
                </h1>
                <div className="text-sm text-glitch-yellow tracking-[0.5em] mt-1 bg-black/50 inline-block px-1">
                  ERR_SYSTEM_OVERRIDE_ACTIVE
                </div>
             </div>
         </div>
         <div className="hidden md:flex flex-col items-end text-right text-xs text-glitch-magenta/70">
            <span>MEM: 64KB OK</span>
            <span>VRAM: CORRUPTED</span>
            <span>CPU: OVERCLOCKED</span>
         </div>
      </header>

      {/* Main Content Area */}
      <main className="z-10 flex-1 w-full max-w-7xl flex flex-col lg:flex-row items-stretch justify-center gap-2 p-2 lg:p-6">
        
        {/* Game Container - Visual Container mimicking a broken screen */}
        <div className="flex-grow relative border-4 border-glitch-cyan/30 bg-glitch-gray p-1 shadow-[0_0_0_4px_rgba(0,0,0,1),0_0_20px_rgba(0,255,255,0.2)]">
            <div className="absolute top-0 left-0 bg-glitch-cyan text-black px-2 py-0.5 text-xs font-bold uppercase">
              DISPLAY_01
            </div>
            <div className="w-full h-full flex justify-center items-center bg-black relative overflow-hidden">
               {/* Decorative Lines */}
               <div className="absolute top-10 left-0 w-full h-[1px] bg-glitch-magenta/20"></div>
               <div className="absolute bottom-10 left-0 w-full h-[1px] bg-glitch-magenta/20"></div>
               <div className="absolute left-10 top-0 h-full w-[1px] bg-glitch-magenta/20"></div>
               <div className="absolute right-10 top-0 h-full w-[1px] bg-glitch-magenta/20"></div>
               
               <SnakeGame />
            </div>
        </div>

        {/* Sidebar / Music Player */}
        <div className="w-full lg:w-[400px] flex flex-col gap-4">
            
            {/* Status Panel */}
            <div className="bg-glitch-black border-2 border-glitch-yellow p-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-1">
                    <ShieldAlert className="text-glitch-yellow animate-fast-flash" size={20}/>
                </div>
                <h3 className="text-glitch-yellow font-bold text-xl mb-2 border-b border-glitch-yellow/30 pb-1 font-display">
                    Directives
                </h3>
                <ul className="text-sm space-y-2 text-gray-400 font-mono uppercase">
                    <li className="flex items-start gap-2">
                        <span className="text-glitch-cyan">></span> 
                        CONSUME <span className="text-glitch-magenta bg-glitch-magenta/10 px-1">DATA_NODES</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-glitch-cyan">></span> 
                        AVOID <span className="text-red-500">FIREWALL_BOUNDARIES</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-glitch-cyan">></span> 
                        SYNC <span className="text-glitch-white">NEURAL_WAVES</span>
                    </li>
                </ul>
            </div>

            <MusicPlayer />
            
            <div className="flex-1 bg-glitch-gray border border-glitch-white/10 p-2 flex flex-col justify-end">
                <div className="text-[10px] text-glitch-cyan/40 break-all leading-tight">
                    0x4F 0x56 0x45 0x52 0x52 0x49 0x44 0x45 0x20 0x49 0x4E 0x49 0x54
                    SYSTEM_FAILURE_DETECTED... ATTEMPTING_REBOOT... FAILED
                    KERNEL_PANIC: ADDR_0xFF0055AA
                    01001000 01000101 01001100 01010000 
                </div>
            </div>
            
        </div>
      </main>

      {/* Footer */}
      <footer className="z-10 w-full bg-glitch-black border-t border-glitch-cyan/30 p-2 flex justify-between text-xs text-glitch-cyan/60 uppercase">
        <div className="flex items-center gap-2">
           <Cpu size={14} /> <span>PROC: UNSTABLE</span>
        </div>
        <div className="animate-pulse text-glitch-magenta">
           NO_SIGNAL
        </div>
      </footer>
    </div>
  );
}

export default App;
