'use client';

/**
 * carousel-antd-T04: Dark theme gallery: navigate to Forest photo
 *
 * The page is in dark theme with comfortable spacing.
 * One Ant Design Carousel is centered in an isolated card titled "Photo Gallery".
 * Slides are image cards with an overlaid label at the bottom-left: "Beach", "Forest", "City", "Desert".
 * The initial slide is "Beach" (slide id: photo-beach). Autoplay is off.
 * Dots are shown below the carousel; arrows are hidden.
 *
 * Success: active_slide_id equals photo-forest
 */

import React, { useState, useEffect, useRef } from 'react';
import { Carousel, Card } from 'antd';
import type { CarouselRef } from 'antd/es/carousel';
import type { TaskComponentProps } from '../types';

const slides = [
  { id: 'photo-beach', title: 'Beach', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'photo-forest', title: 'Forest', gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { id: 'photo-city', title: 'City', gradient: 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)' },
  { id: 'photo-desert', title: 'Desert', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [activeSlideId, setActiveSlideId] = useState(slides[0].id);
  const carouselRef = useRef<CarouselRef>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (activeSlideId === 'photo-forest' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [activeSlideId, onSuccess]);

  const handleChange = (current: number) => {
    setActiveSlideId(slides[current].id);
  };

  return (
    <Card
      title="Photo Gallery"
      style={{ width: 600 }}
    >
      <div data-testid="carousel-root" data-active-slide-id={activeSlideId}>
        <Carousel
          ref={carouselRef}
          autoplay={false}
          arrows={false}
          dots={true}
          afterChange={handleChange}
        >
          {slides.map((slide) => (
            <div key={slide.id}>
              <div
                data-slide-id={slide.id}
                style={{
                  height: 250,
                  background: slide.gradient,
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-start',
                  position: 'relative',
                }}
              >
                <img
                  src={`https://placehold.co/600x250/333/fff?text=${slide.title}`}
                  alt={slide.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    background: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: 4,
                    fontSize: 14,
                  }}
                >
                  {slide.title}
                </span>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
      <p style={{ marginTop: 12, fontSize: 12, opacity: 0.7, textAlign: 'center' }}>
        Use arrows or dots to browse.
      </p>
    </Card>
  );
}
