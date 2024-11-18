'use client';

import React, { useState } from 'react';
import YouTube from 'react-youtube';

interface YouTubePlayerProps {
  videoId?: string;
  title?: string;
}

interface YouTubeOpts {
  width: string | number;
  height: string | number;
  playerVars?: {
    autoplay?: number;
    modestbranding?: number;
    rel?: number;
    controls?: number;
  };
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ 
  videoId = "ipf4Gw_y210",
  title = "YouTube Player" 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const opts: YouTubeOpts = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
      controls: 1,
    },
  };

  const onReady = (event: { target: any }) => {
    // Store the player instance
    const player = event.target;
    console.log('YouTube Player is ready:', player);
  };

  const onStateChange = (event: { target: any; data: number }) => {
    // Update playing state based on player state
    // PlayerState.PLAYING = 1
    setIsPlaying(event.data === 1);
  };

  const onError = (error: any) => {
    console.error('YouTube Player Error:', error);
  };

  return (
    <div className="flex flex-col w-full h-full bg-black">
      <div className="text-white text-center py-2 bg-gray-800">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="flex-grow relative">
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={onReady}
          onStateChange={onStateChange}
          onError={onError}
          className="absolute inset-0"
          iframeClassName="w-full h-full"
        />
      </div>
    </div>
  );
};

export default YouTubePlayer;
