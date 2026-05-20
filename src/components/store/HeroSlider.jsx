import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSlider({ slides: propSlides, settings = {} }) {
  const slides = propSlides
    ? [...propSlides].filter(s => s.is_active).sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
    : [];

  const {
    animation_type = 'fade',
    autoplay = true,
    autoplay_interval = 5000,
    transition_speed = 500,
    show_arrows = true,
    show_dots = true,
    default_overlay_opacity = 0.35
  } = settings;

  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);
  const touchStartX = useRef(null);
  const isPaused = useRef(false);

  const goTo = useCallback((index) => {
    if (animating || index === current) return;
    setAnimating(true);
    setCurrent(index);
    setTimeout(() => setAnimating(false), transition_speed);
  }, [animating, current, transition_speed]);

  const goNext = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, slides.length, goTo]);

  useEffect(() => {
    if (!autoplay || slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      if (!isPaused.current) goNext();
    }, autoplay_interval);
    return () => clearInterval(timerRef.current);
  }, [autoplay, autoplay_interval, goNext, slides.length]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goPrev();
    }
    touchStartX.current = null;
  };

  if (slides.length === 0) return null;

  const slide = slides[current];
  const opacity = slide.overlay_opacity ?? default_overlay_opacity;

  const transitionStyle = {
    transition: animation_type === 'fade'
      ? `opacity ${transition_speed}ms ease-in-out`
      : `transform ${transition_speed}ms ease-in-out`
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl mx-4 md:mx-6"
      style={{ height: 'clamp(234px, 45vw, 343px)', marginBottom: '24px' }}
      onMouseEnter={() => { isPaused.current = true; }}
      onMouseLeave={() => { isPaused.current = false; }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      {slides.map((s, i) => {
        const isActive = i === current;
        let style = { ...transitionStyle };
        if (animation_type === 'fade') {
          style.opacity = isActive ? 1 : 0;
          style.zIndex = isActive ? 1 : 0;
        } else {
          style.transform = `translateX(${(i - current) * 100}%)`;
          style.zIndex = 1;
        }

        return (
          <div
            key={s.id || i}
            className="absolute inset-0"
            style={style}
          >
            <img
              src={s.image_url}
              alt={s.title || ''}
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div
              className="absolute inset-0"
              style={{ background: `rgba(0,0,0,${s.overlay_opacity ?? default_overlay_opacity})` }}
            />
            {/* Text content */}
            {(s.title || s.subtitle || s.cta_text) && (
              <div className="absolute inset-0 flex flex-col justify-end pb-6 px-6 md:justify-center md:items-start md:text-left md:px-16 md:max-w-[60%] md:pb-0">
                <div className="text-center md:text-left">
                  {s.title && (
                    <h2 className="text-white font-bold text-2xl md:text-4xl leading-tight mb-2 drop-shadow-lg">
                      {s.title}
                    </h2>
                  )}
                  {s.subtitle && (
                    <p className="text-white/90 text-sm md:text-lg mb-4 drop-shadow">
                      {s.subtitle}
                    </p>
                  )}
                </div>
                {s.cta_text && (
                  <div className="flex justify-end md:justify-start">
                    <a href={s.cta_link || '#'}>
                      <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-sm md:text-base">
                        {s.cta_text}
                      </button>
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Prev / Next arrows */}
      {show_arrows && slides.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/25 hover:bg-white/50 backdrop-blur-sm text-white rounded-full w-9 h-9 flex items-center justify-center transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/25 hover:bg-white/50 backdrop-blur-sm text-white rounded-full w-9 h-9 flex items-center justify-center transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Pagination dots */}
      {show_dots && slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                height: '6px',
                width: i === current ? '20px' : '6px',
                background: i === current ? '#fff' : 'rgba(255,255,255,0.5)'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}