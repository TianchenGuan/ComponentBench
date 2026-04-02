'use client';

/**
 * carousel-antd-T05: Compact carousel: set to slide 4
 *
 * The page uses light theme but is set to compact spacing and the carousel is rendered in a small size tier.
 * A single Ant Design Carousel sits in the center of a small isolated card labeled "Mini Tips".
 * The carousel contains 6 short tip slides with titles: 
 * 1) "Getting Started", 2) "Search", 3) "Filters", 4) "Shortcut Keys", 5) "Exports", 6) "Support".
 * The carousel starts on slide 2 "Search" (slide id: tip-search).
 * Dots are visible but smaller due to compact mode; arrows are not shown. Autoplay is off.
 *
 * Success: active_slide_id equals tip-shortcuts
 */

import React, { useState, useEffect, useRef } from 'react';
import { Carousel, Card } from 'antd';
import type { CarouselRef } from 'antd/es/carousel';
import type { TaskComponentProps } from '../types';

const slides = [
  { id: 'tip-getting-started', title: 'Getting Started' },
  { id: 'tip-search', title: 'Search' },
  { id: 'tip-filters', title: 'Filters' },
  { id: 'tip-shortcuts', title: 'Shortcut Keys' },
  { id: 'tip-exports', title: 'Exports' },
  { id: 'tip-support', title: 'Support' },
];

const INITIAL_INDEX = 1; // "Search"

export default function T05({ onSuccess }: TaskComponentProps) {
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
    if (activeSlideId === 'tip-shortcuts' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [activeSlideId, onSuccess]);

  const handleChange = (current: number) => {
    setActiveSlideId(slides[current].id);
  };

  return (
    <Card
      title="Mini Tips"
      size="small"
      style={{ width: 320 }}
      styles={{ body: { padding: 12 } }}
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
          afterChange={handleChange}
          initialSlide={INITIAL_INDEX}
          dotPosition="bottom"
        >
          {slides.map((slide, index) => (
            <div key={slide.id}>
              <div
                data-slide-id={slide.id}
                style={{
                  height: 100,
                  background: '#f0f0f0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 12,
                }}
              >
                <span style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>
                  Tip {index + 1}
                </span>
                <h3 style={{ margin: 0, fontSize: 16, textAlign: 'center' }}>
                  {slide.title}
                </h3>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </Card>
  );
}
