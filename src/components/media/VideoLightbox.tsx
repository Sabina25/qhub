import { useEffect, useRef } from 'react';

export const VideoLightbox = ({
  open,
  onClose,
  videoId,
  isShort,
  title,
}: {
  open: boolean;
  onClose: () => void;
  videoId: string | null;
  isShort: boolean;
  title?: string;
}) => {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open || !videoId) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Video viewer"
    >
      <div
        className={`relative ${isShort ? 'w-[min(420px,90vw)] aspect-[9/16]' : 'w-[min(1200px,90vw)] aspect-video'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          className="absolute inset-0 w-full h-full rounded-xl"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
          title={title || 'YouTube Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
        <button
          ref={closeBtnRef}
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white/90 hover:bg-white rounded-full w-9 h-9 shadow flex items-center justify-center text-xl leading-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
};
