import { useEffect, useRef } from "react";

export function useVideoMuteOnHidden(userMuted: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        video.muted = !entry.isIntersecting || userMuted;
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [userMuted]);

  return videoRef;
}
