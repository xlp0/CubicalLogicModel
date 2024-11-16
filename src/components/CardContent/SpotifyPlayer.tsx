"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

interface SpotifyPlayerProps {
  spotifyUri?: string; // Format: 'spotify:track:ID', 'spotify:album:ID', or 'spotify:playlist:ID'
  title?: string;
  type?: 'track' | 'album' | 'playlist';
}

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({ 
  spotifyUri = "spotify:track:4cOdK2wGLETKBW3PvgPWqT", // Default song as fallback
  title = "Spotify Player",
  type = "track"
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [origin, setOrigin] = useState('');
  const playerRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // Extract ID from Spotify URI
  const getSpotifyId = (uri: string) => {
    return uri.split(':').pop() || '';
  };

  // Get the appropriate embed URL based on type
  const getEmbedUrl = () => {
    const id = getSpotifyId(spotifyUri);
    return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
  };

  const togglePlayPause = () => {
    if (playerRef.current?.contentWindow) {
      playerRef.current.contentWindow.postMessage({
        command: isPlaying ? 'pause' : 'play'
      }, '*');
      setIsPlaying(!isPlaying);
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
              className="absolute inset-0"
              src={getEmbedUrl()}
              width="100%"
              height="100%"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title={title}
            />
          )}
        </div>
        <div className="flex justify-center">
          <Button
            onClick={togglePlayPause}
            className="bg-green-600 hover:bg-green-700 text-white transition-colors"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SpotifyPlayer;
