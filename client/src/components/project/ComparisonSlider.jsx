import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

function ComparisonSlider({
  beforeImage,
  afterImage,
  mode = 'slider',
  tone = 'default',
  imageClassName = 'h-[420px]',
}) {
  const containerRef = useRef(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const isWarm = tone === 'warm';

  useEffect(() => {
    setPosition(50);
  }, [beforeImage, afterImage]);

  useEffect(() => {
    const onMove = (event) => {
      if (!isDragging || !containerRef.current) {
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const percent = ((clientX - rect.left) / rect.width) * 100;
      setPosition(Math.max(0, Math.min(100, percent)));
    };

    const onUp = () => setIsDragging(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        'relative overflow-hidden rounded-2xl border',
        isWarm ? 'border-sand-300 shadow-warm' : 'border-white/10',
      )}
      onMouseMove={(event) => {
        if (mode !== 'hover' || !containerRef.current) {
          return;
        }
        const rect = containerRef.current.getBoundingClientRect();
        const percent = ((event.clientX - rect.left) / rect.width) * 100;
        setPosition(Math.max(0, Math.min(100, percent)));
      }}
    >
      <img src={beforeImage} alt="Blueprint before render" className={clsx(imageClassName, 'w-full object-cover')} />
      <img
        src={afterImage}
        alt="Generated render after transformation"
        className={clsx(
          imageClassName,
          'pointer-events-none absolute inset-0 w-full object-cover',
        )}
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      />
      <div
        className="absolute inset-y-0 z-10"
        style={{ left: `${position}%` }}
        aria-label="Comparison slider"
      >
        <button
          type="button"
          className={clsx(
            'absolute left-0 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border text-xs font-bold',
            isWarm
              ? 'border-wood-300 bg-wood-500 text-white shadow-[0_0_0_4px_rgba(141,107,79,0.22)]'
              : 'slider-handle border-white/30 bg-brand-500',
          )}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') {
              setPosition((prev) => Math.max(0, prev - 2));
            }
            if (event.key === 'ArrowRight') {
              setPosition((prev) => Math.min(100, prev + 2));
            }
          }}
        >
          ||
        </button>
        <div className={clsx('absolute inset-y-0 left-0 w-px', isWarm ? 'bg-wood-400/70' : 'bg-white/60')} />
      </div>
      <div
        className={clsx(
          'absolute left-3 top-3 rounded px-2 py-1 text-xs',
          isWarm ? 'bg-sand-50/90 text-sand-900' : 'bg-black/60',
        )}
      >
        Before
      </div>
      <div
        className={clsx(
          'absolute right-3 top-3 rounded px-2 py-1 text-xs',
          isWarm ? 'bg-wood-500/90 text-sand-50' : 'bg-brand-500/80',
        )}
      >
        After
      </div>
    </div>
  );
}

export default ComparisonSlider;

