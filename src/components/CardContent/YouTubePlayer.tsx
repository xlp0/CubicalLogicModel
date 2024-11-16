"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface YouTubePlayerProps {
  videoId?: string;
  title?: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ 
  videoId = "FKRpjAF7764",
  title = "YouTube Player" 
}) => {
  const [isPlaying, setIsPlaying] = useState(true); 
  const [isMuted, setIsMuted] = useState(true); 
  const [origin, setOrigin] = useState('');
  const playerRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setOrigin(window.location.origin);

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://www.youtube.com") return;
      
      try {
        const data = JSON.parse(event.data);
        if (data.event === "onStateChange") {
          // -1: unstarted, 0: ended, 1: playing, 2: paused, 3: buffering, 5: cued
          setIsPlaying(data.info === 1);
        }
      } catch (e) {
        // Ignore non-JSON messages
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const togglePlayPause = () => {
    if (playerRef.current?.contentWindow) {
      const command = isPlaying ? 'pauseVideo' : 'playVideo';
      playerRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: command,
          args: ''
        }),
        'https://www.youtube.com'
      );
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (playerRef.current?.contentWindow) {
      const command = isMuted ? 'unMute' : 'mute';
      playerRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: command,
          args: ''
        }),
        'https://www.youtube.com'
      );
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-700 rounded-lg p-3">
        <div className="text-white text-center text-lg font-semibold mb-2">
          {title}
        </div>
        <div className="relative aspect-video w-full mb-2 bg-black rounded-lg overflow-hidden">
          {origin && (
            <iframe
              ref={playerRef}
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${origin}&autoplay=1&mute=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="absolute inset-0"
            />
          )}
        </div>
        <div className="flex justify-center gap-2">
          <Button
            onClick={togglePlayPause}
            className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button
            onClick={toggleMute}
            className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default YouTubePlayer;
