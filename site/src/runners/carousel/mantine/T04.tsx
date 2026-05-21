'use client';

/**
 * carousel-mantine-T04: Corner placement: show 'Overview' slide
 *
 * The page uses a dark theme and comfortable spacing, but the carousel card is anchored bottom-left.
 * A Mantine Carousel withControls enabled is shown with 3 slides: "Overview", "Install", "Next steps".
 * The carousel starts on "Install" (slide id: gs-install). Indicators are off.
 *
 * Success: active_slide_id equals gs-overview
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text } from '@mantine/core';
import { Carousel, type Embla } from '@mantine/carousel';
import type { TaskComponentProps } from '../types';

const slides = [
  { id: 'gs-overview', title: 'Overview' },
  { id: 'gs-install', title: 'Install' },
  { id: 'gs-next', title: 'Next steps' },
];

const INITIAL_INDEX = 1; // "Install"

export default function T04({ onSuccess }: TaskComponentProps) {
  const [embla, setEmbla] = useState<Embla | null>(null);
  const [activeIndex, setActiveIndex] = useState(INITIAL_INDEX);
  const successFired = useRef(false);

  useEffect(() => {
    if (embla) {
      const onSelect = () => {
        setActiveIndex(embla.selectedScrollSnap());
      };
      embla.on('select', onSelect);
      return () => {
        embla.off('select', onSelect);
      };
    }
  }, [embla]);

  const activeSlideId = slides[activeIndex]?.id;

  useEffect(() => {
    if (activeSlideId === 'gs-overview' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [activeSlideId, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">Getting Started</Text>
      <div data-testid="carousel-root" data-active-slide-id={activeSlideId}>
        <Carousel
          getEmblaApi={setEmbla}
          withIndicators={false}
          withControls
          loop={false}
          slideSize="100%"
          initialSlide={INITIAL_INDEX}
        >
          {slides.map((slide) => (
            <Carousel.Slide key={slide.id}>
              <div
                data-slide-id={slide.id}
                style={{
                  height: 180,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                }}
              >
                <Text c="white" size="xl" fw={700}>
                  {slide.title}
                </Text>
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
    </Card>
  );
}
