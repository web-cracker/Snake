import React, { useEffect, useState, useRef } from 'react';
import { Play, Square, SkipForward, SkipBack, Zap, Activity } from 'lucide-react';
import { audioEngine, TRACK_LIST } from '../services/audioService';
import { AudioState } from '../types';

const MusicPlayer: React.FC = () => {
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    currentTrackIndex: 0,
    volume: 0.5,
    currentTime: 0,
    duration: 180,
  });
  
  const animationRef = useRef<number>(0);

  useEffect(() => {
      audioEngine.setVolume(audioState.volume);
  }, []);

  const togglePlay = () => {
    if (audioState.isPlaying) {
      audioEngine.stop();
      setAudioState(prev => ({ ...prev, isPlaying: false }));
      cancelAnimationFrame(animationRef.current);
    } else {
      audioEngine.playTrack(TRACK_LIST[audioState.currentTrackIndex]);
      setAudioState(prev => ({ ...prev, isPlaying: true }));
      animateProgress();
    }
  };

  const nextTrack = () => {
    changeTrack((audioState.currentTrackIndex + 1) % TRACK_LIST.length);
  };
  const prevTrack = () => {
    changeTrack((audioState.currentTrackIndex - 1 + TRACK_LIST.length) % TRACK_LIST.length);
  };

  const changeTrack = (index: number) => {
    audioEngine.stop();
    setAudioState(prev => ({ ...prev, currentTrackIndex: index, isPlaying: true, currentTime: 0 }));
    audioEngine.playTrack(TRACK_LIST[index]);
    cancelAnimationFrame(animationRef.current);
    animateProgress();
  };

  const animateProgress = () => {
    setAudioState(prev => {
        const newTime = prev.currentTime + 0.1;
        if (newTime >= prev.duration) {
            nextTrack();
            return { ...prev, currentTime: 0 };
        }
        return { ...prev, currentTime: newTime };
    });
    animationRef.current = requestAnimationFrame(animateProgress);
  };
  
  useEffect(() => {
      return () => {
          cancelAnimationFrame(animationRef.current);
          audioEngine.stop();
      };
  }, []);

  const currentTrack = TRACK_LIST[audioState.currentTrackIndex];
  // Calculate raw percentage
  const progressPercent = (audioState.currentTime / audioState.duration) * 100;

  return (
    <div className="w-full bg-black border-2 border-glitch-magenta p-4 relative shadow-[4px_4px_0px_#ff00ff]">
      {/* Decorative Header */}
      <div className="absolute -top-3 left-4 bg-black px-2 text-glitch-magenta text-xs font-bold border border-glitch-magenta">
        AUDIO_DEBUGGER_V0.9
      </div>

      <div className="flex flex-col gap-4 mt-2">
        {/* Track Display */}
        <div className="flex justify-between items-end border-b border-dashed border-glitch-white/30 pb-2">
            <div>
                <div className="text-[10px] text-gray-500 mb-1">CURRENT_STREAM</div>
                <div className="text-xl text-glitch-cyan font-bold uppercase truncate max-w-[200px] glitch-text" data-text={currentTrack.title}>
                    {currentTrack.title}
                </div>
            </div>
            <div className="text-right">
                <div className="text-[10px] text-gray-500">FREQ_MOD</div>
                <div className="text-glitch-yellow font-mono text-sm">{currentTrack.bpm} BPM</div>
            </div>
        </div>

        {/* Raw Visualizer (CSS Animation) */}
        <div className="h-12 bg-glitch-gray border border-glitch-white/20 flex items-end justify-between px-1 pb-1 gap-0.5 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
                <div 
                    key={i} 
                    className="w-full bg-glitch-cyan transition-all duration-75"
                    style={{ 
                        height: audioState.isPlaying ? `${Math.random() * 100}%` : '5%',
                        opacity: audioState.isPlaying ? 1 : 0.3
                    }}
                />
            ))}
        </div>

        {/* Progress Tape */}
        <div className="relative h-4 bg-glitch-gray border border-glitch-white/20">
            <div 
                className="absolute top-0 left-0 h-full bg-glitch-magenta/50" 
                style={{ width: `${progressPercent}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px] font-mono text-white/50 pointer-events-none">
                <span>00:00</span>
                <span>{Math.floor(audioState.currentTime).toString(16).toUpperCase()}</span>
                <span>FF:FF</span>
            </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
                <Zap size={16} className={audioState.isPlaying ? "text-glitch-yellow animate-bounce" : "text-gray-600"} />
                <span className="text-xs text-glitch-yellow">{audioState.isPlaying ? "LIVE_FEED" : "OFFLINE"}</span>
            </div>
            
            <div className="flex items-center gap-1">
                <button onClick={prevTrack} className="p-2 bg-glitch-gray hover:bg-glitch-cyan hover:text-black border border-glitch-white/20 transition-colors">
                    <SkipBack size={16} />
                </button>
                <button onClick={togglePlay} className="p-2 bg-glitch-white text-black hover:bg-glitch-magenta hover:text-white border border-white transition-colors">
                    {audioState.isPlaying ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                </button>
                <button onClick={nextTrack} className="p-2 bg-glitch-gray hover:bg-glitch-cyan hover:text-black border border-glitch-white/20 transition-colors">
                    <SkipForward size={16} />
                </button>
            </div>
        </div>

        {/* Volume Slider styled as raw input */}
        <div className="flex items-center gap-2 mt-2">
            <Activity size={12} className="text-gray-500" />
            <input 
                type="range" 
                min="0" max="1" step="0.1" 
                value={audioState.volume}
                onChange={(e) => {
                    const vol = parseFloat(e.target.value);
                    setAudioState(prev => ({...prev, volume: vol}));
                    audioEngine.setVolume(vol);
                }}
                className="w-full h-1 bg-gray-800 appearance-none cursor-crosshair [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-glitch-cyan"
            />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
