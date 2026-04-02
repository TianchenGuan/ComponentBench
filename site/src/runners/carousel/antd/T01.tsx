'use client';

/**
 * carousel-antd-T01: Promo carousel: show Summer Sale slide
 *
 * A single Ant Design Carousel is shown inside an isolated card in the center of the page.
 * The carousel contains 4 full-width banner slides with a large title text centered on each slide:
 * "Spring Sale", "Summer Sale", "Fall Clearance", and "Winter Deals".
 * By default, the carousel shows "Spring Sale" (slide id: promo-spring). Autoplay is off.
 * Dots/indicators are visible below the carousel (default AntD dots at the bottom); arrows are not shown.
 *
 * Success: active_slide_id equals promo-summer
 */

import React, { useState, useEffect, useRef } from 'react';
import { Carousel, Card } from 'antd';
import type { CarouselRef } from 'antd/es/carousel';
import type { TaskComponentProps } from '../types';

const slides = [
  { id: 'promo-spring', title: 'Spring Sale', color: '#52c41a' },
  { id: 'promo-summer', title: 'Summer Sale', color: '#1890ff' },
  { id: 'promo-fall', title: 'Fall Clearance', color: '#fa8c16' },
  { id: 'promo-winter', title: 'Winter Deals', color: '#722ed1' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [activeSlideId, setActiveSlideId] = useState(slides[0].id);
  const carouselRef = useRef<CarouselRef>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (activeSlideId === 'promo-summer' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [activeSlideId, onSuccess]);

  const handleChange = (current: number) => {
    setActiveSlideId(slides[current].id);
  };

  return (
    <Card
      title="Promo Banners"
      style={{ width: 600 }}
      styles={{ body: { padding: 0 } }}
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
                  height: 200,
                  background: slide.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <h2 style={{ color: '#fff', fontSize: 32, margin: 0 }}>
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
