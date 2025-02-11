"use client";

import useAssetsStore from "@/lib/store/use-assets-store";
import { cn } from "@/lib/utils";
import { CSSProperties, useEffect } from "react";

type Props = {
  isMobileMenuButton?: boolean;
};

// Create a global audio singleton to ensure only one audio element is shared across components.
// This prevents multiple instances from playing simultaneously.
// For example, pressing "play" on the navbar button and then the mobile menu button would otherwise result in both playing at the same time instead of toggling the same audio.
let sharedAudio: HTMLAudioElement | null = null;

export default function AudioButton({ isMobileMenuButton = false }: Props) {
  // Use global state (via useAssetsStore) to manage the audio's play state across components.
  // This ensures that the play/pause state stays in sync, regardless of which component toggles the audio.
  const { isAudioPlaying, toggleIsAudioPlaying } = useAssetsStore();

  useEffect(() => {
    if (!sharedAudio) {
      sharedAudio = new Audio("/audio/loop.mp3");
      sharedAudio.loop = true;
    }
  }, []);

  function toggleAudio() {
    if (!sharedAudio) return;

    if (!isAudioPlaying) {
      sharedAudio.play();
    } else {
      sharedAudio.pause();
    }

    toggleIsAudioPlaying();
  }

  return (
    <button
      onClick={toggleAudio}
      className="flex items-center gap-0.5 px-4 py-2 font-general font-bold uppercase"
    >
      <span className="sr-only">Toggle sound</span>
      <span
        className={cn(
          "mr-2 whitespace-nowrap text-[clamp(0.75rem,0.2682rem+2.5696vw,1.5rem)]",
          {
            hidden: !isMobileMenuButton,
          },
        )}
      >
        sound {isAudioPlaying ? "on" : "off"}
      </span>
      {Array.from(Array(5)).map((_, index) => (
        <div
          key={index}
          className={cn(
            "audio-indicator-line h-[var(--base-height)] w-px rounded-full bg-black transition-all duration-200 ease-in-out",
            {
              active: isAudioPlaying,
            },
          )}
          style={
            {
              animationDelay: `${(index + 1) * 0.1}s`,
              "--base-height": isMobileMenuButton
                ? "clamp(0.25rem, 1vw, 0.5rem)"
                : "0.25rem",
            } as CSSProperties
          }
        />
      ))}
    </button>
  );
}
