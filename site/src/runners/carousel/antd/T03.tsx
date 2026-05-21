'use client';

/**
 * carousel-antd-T03: Use next arrow once
 *
 * The page uses a light theme with comfortable spacing, but the carousel card is anchored near the top-left.
 * An Ant Design Carousel is configured with arrows=true, so left/right arrow buttons are visible.
 * There are 3 slides with large step titles: "Step 1: Welcome", "Step 2: Profile", "Step 3: Finish".
 * The initial active slide is "Step 1: Welcome" (slide id: ob-welcome). Autoplay is off.
 * Dots are also shown at the bottom.
 *
 * Success: active_slide_id equals ob-profile
 */

import React, { useState, useEffect, useRef } from 'react';
import { Carousel, Card } from 'antd';
import type { CarouselRef } from 'antd/es/carousel';
import type { TaskComponentProps } from '../types';

const slides = [
  { id: 'ob-welcome', title: 'Step 1: Welcome', color: '#1890ff' },
  { id: 'ob-profile', title: 'Step 2: Profile', color: '#52c41a' },
  { id: 'ob-finish', title: 'Step 3: Finish', color: '#722ed1' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [activeSlideId, setActiveSlideId] = useState(slides[0].id);
  const carouselRef = useRef<CarouselRef>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (activeSlideId === 'ob-profile' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [activeSlideId, onSuccess]);

  const handleChange = (current: number) => {
    setActiveSlideId(slides[current].id);
  };

  return (
    <Card title="Onboarding" style={{ width: 500 }}>
      <div data-testid="carousel-root" data-active-slide-id={activeSlideId}>
        <Carousel
          ref={carouselRef}
          autoplay={false}
          arrows={true}
          dots={true}
          afterChange={handleChange}
        >
          {slides.map((slide) => (
            <div key={slide.id}>
              <div
                data-slide-id={slide.id}
                style={{
                  height: 200,
                  background: slide.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <h2 style={{ color: '#fff', fontSize: 28, margin: 0 }}>
                  {slide.title}
                </h2>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </Card>
  );
}
