'use client';

/**
 * carousel-antd-T12: Compact vertical dots: go to slide 11
 *
 * The page is light theme with compact spacing and small scale tier.
 * A single Ant Design Carousel titled "Release Notes" is centered.
 * The carousel is configured with dots placed on the left side (vertical).
 * There are 12 slides titled "v2.01" through "v2.12".
 * Initial state: carousel starts on "v2.04" (slide id: rel-204). Autoplay off; arrows hidden.
 *
 * Success: active_slide_id equals rel-211
 */

import React, { useState, useEffect, useRef } from 'react';
import { Carousel, Card } from 'antd';
import type { CarouselRef } from 'antd/es/carousel';
import type { TaskComponentProps } from '../types';

const slides = Array.from({ length: 12 }, (_, i) => ({
  id: `rel-${201 + i}`,
  title: `v2.${String(i + 1).padStart(2, '0')}`,
}));

const INITIAL_INDEX = 3; // "v2.04"

export default function T12({ onSuccess }: TaskComponentProps) {
  const [activeSlideId, setActiveSlideId] = useState(slides[INITIAL_INDEX].id);
  const carouselRef = useRef<CarouselRef>(null);
  const successFired = useRef(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && carouselRef.current) {
      initialized.current = true;
      carouselRef.current.goTo(INITIAL_INDEX, false);
    }
  }, []);

  useEffect(() => {
    if (activeSlideId === 'rel-211' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [activeSlideId, onSuccess]);

  const handleChange = (current: number) => {
    setActiveSlideId(slides[current].id);
  };

  return (
    <Card
      title="Release Notes"
      size="small"
      style={{ width: 280 }}
      styles={{ body: { padding: 8 } }}
    >
      <div
        data-testid="carousel-root"
        data-active-slide-id={activeSlideId}
        style={{ fontSize: 12 }}
      >
        <Carousel
          ref={carouselRef}
          autoplay={false}
          arrows={false}
          dots={true}
          dotPosition="left"
          afterChange={handleChange}
          initialSlide={INITIAL_INDEX}
        >
          {slides.map((slide) => (
            <div key={slide.id}>
              <div
                data-slide-id={slide.id}
                style={{
                  height: 120,
                  background: '#f5f5f5',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 12,
                }}
              >
                <span style={{ fontSize: 10, color: '#999', marginBottom: 4 }}>
                  Release
                </span>
                <h3 style={{ margin: 0, fontSize: 18 }}>{slide.title}</h3>
                <span style={{ fontSize: 10, color: '#999', marginTop: 8 }}>
                  Bug fixes and improvements
                </span>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </Card>
  );
}
