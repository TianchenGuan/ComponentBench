'use client';

/**
 * carousel-antd-T02: Return carousel to first slide
 *
 * A single Ant Design Carousel appears in an isolated card (centered).
 * It contains 5 slides with a headline and short subtext. Slide titles in order are:
 * 1) "Top Story", 2) "Markets", 3) "Sports", 4) "Weather", 5) "Arts".
 * The initial state is NOT the first slide: the carousel loads on "Sports" (slide id: news-sports).
 * Dots are shown at the bottom; arrows are disabled. Autoplay is off.
 * A small helper text above the carousel says "Use the carousel to browse today's sections."
 *
 * Success: active_slide_id equals news-top
 */

import React, { useState, useEffect, useRef } from 'react';
import { Carousel, Card, Typography } from 'antd';
import type { CarouselRef } from 'antd/es/carousel';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const slides = [
  { id: 'news-top', title: 'Top Story', subtitle: 'Breaking news from around the world' },
  { id: 'news-markets', title: 'Markets', subtitle: 'Stock updates and financial analysis' },
  { id: 'news-sports', title: 'Sports', subtitle: 'Latest scores and highlights' },
  { id: 'news-weather', title: 'Weather', subtitle: 'Your local forecast' },
  { id: 'news-arts', title: 'Arts', subtitle: 'Culture and entertainment' },
];

const INITIAL_INDEX = 2; // "Sports"

export default function T02({ onSuccess }: TaskComponentProps) {
  const [activeSlideId, setActiveSlideId] = useState(slides[INITIAL_INDEX].id);
  const carouselRef = useRef<CarouselRef>(null);
  const successFired = useRef(false);
  const initialized = useRef(false);

  useEffect(() => {
    // Set initial slide on mount
    if (!initialized.current && carouselRef.current) {
      initialized.current = true;
      carouselRef.current.goTo(INITIAL_INDEX, false);
    }
  }, []);

  useEffect(() => {
    if (activeSlideId === 'news-top' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [activeSlideId, onSuccess]);

  const handleChange = (current: number) => {
    setActiveSlideId(slides[current].id);
  };

  return (
    <Card title="News Highlights" style={{ width: 600 }}>
      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        Use the carousel to browse today&apos;s sections.
      </Text>
      <div data-testid="carousel-root" data-active-slide-id={activeSlideId}>
        <Carousel
          ref={carouselRef}
          autoplay={false}
          arrows={false}
          dots={true}
          afterChange={handleChange}
          initialSlide={INITIAL_INDEX}
        >
          {slides.map((slide) => (
            <div key={slide.id}>
              <div
                data-slide-id={slide.id}
                style={{
                  height: 180,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 24,
                }}
              >
                <h2 style={{ color: '#fff', fontSize: 28, margin: 0 }}>
                  {slide.title}
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 8 }}>
                  {slide.subtitle}
                </p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </Card>
  );
}
