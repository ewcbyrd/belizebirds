import { useRef, useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const AudioPlayer = ({ audioSrc, birdId, birdName }) => {
  const audioRef = useRef(null);
  const { currentlyPlaying, setCurrentlyPlaying } = useAppContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(false);

  const isThisPlaying = currentlyPlaying === birdId;

  // Check if audio file exists
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = () => {
      setAudioAvailable(true);
    };

    const handleError = () => {
      setAudioAvailable(false);
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    // Trigger load to check if file exists
    audio.load();

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [audioSrc]);

  useEffect(() => {
    // If another bird is playing, stop this one
    if (currentlyPlaying !== birdId && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [currentlyPlaying, birdId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentlyPlaying(null);
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [setCurrentlyPlaying]);

  const togglePlay = (e) => {
    e.stopPropagation(); // Prevent card click when clicking play button
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setCurrentlyPlaying(null);
    } else {
      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
      setIsPlaying(true);
      setCurrentlyPlaying(birdId);
    }
  };

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={audioSrc} preload="metadata" />
      <button
        onClick={togglePlay}
        disabled={!audioAvailable}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          !audioAvailable
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isThisPlaying
            ? 'bg-belize-red text-white hover:bg-red-700'
            : 'bg-belize-green text-white hover:bg-belize-green-dark'
        }`}
        aria-label={
          !audioAvailable
            ? `Audio not available for ${birdName}`
            : isThisPlaying
            ? `Stop ${birdName} call`
            : `Play ${birdName} call`
        }
      >
        {isThisPlaying ? (
          <>
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">Stop</span>
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">
              {audioAvailable ? 'Play Call' : 'Audio Unavailable'}
            </span>
          </>
        )}
      </button>
    </div>
  );
};

export default AudioPlayer;
