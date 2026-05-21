'use client';

/**
 * carousel-antd-T06: Draggable product shots: drag to 'Side view'
 *
 * A single Ant Design Carousel is displayed in an isolated card centered on the page.
 * The carousel is configured with draggable=true (desktop drag/swipe enabled) and arrows=false.
 * There are 8 slides representing product photos with labels:
 * "Front view", "Side view", "Back view", "Detail", "In hand", "Packaging", "Lifestyle", "Size chart".
 * The carousel starts on "Front view" (slide id: shot-front). Autoplay is off.
 * Dots are visible.
 *
 * Success: active_slide_id equals shot-side
 */

import React, { useState, useEffect, useRef } from 'react';
import { Carousel, Card, Typography } from 'antd';
import type { CarouselRef } from 'antd/es/carousel';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const slides = [
  { id: 'shot-front', title: 'Front view' },
  { id: 'shot-side', title: 'Side view' },
  { id: 'shot-back', title: 'Back view' },
  { id: 'shot-detail', title: 'Detail' },
  { id: 'shot-hand', title: 'In hand' },
  { id: 'shot-packaging', title: 'Packaging' },
  { id: 'shot-lifestyle', title: 'Lifestyle' },
  { id: 'shot-size', title: 'Size chart' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [activeSlideId, setActiveSlideId] = useState(slides[0].id);
  const carouselRef = useRef<CarouselRef>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (activeSlideId === 'shot-side' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [activeSlideId, onSuccess]);

  const handleChange = (current: number) => {
    setActiveSlideId(slides[current].id);
  };

  return (
    <Card title="Product Shots" style={{ width: 550 }}>
      <div data-testid="carousel-root" data-active-slide-id={activeSlideId}>
        <Carousel
          ref={carouselRef}
          autoplay={false}
          arrows={false}
          dots={true}
          draggable={true}
          afterChange={handleChange}
        >
          {slides.map((slide) => (
            <div key={slide.id}>
              <div
                data-slide-id={slide.id}
                style={{
                  height: 280,
                  background: '#e8e8e8',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: 180,
                    height: 180,
                    background: '#ccc',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <span style={{ fontSize: 48, opacity: 0.3 }}>📷</span>
                </div>
                <Text strong style={{ fontSize: 16 }}>{slide.title}</Text>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
      <Text type="secondary" style={{ display: 'block', marginTop: 12, fontSize: 12, textAlign: 'center' }}>
        Tip: you can click and drag the image.
      </Text>
    </Card>
  );
}
