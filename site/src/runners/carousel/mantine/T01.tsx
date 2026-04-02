'use client';

/**
 * carousel-mantine-T01: Featured cards: select 'Starter Pack'
 *
 * A single Mantine Carousel (from @mantine/carousel) is shown inside a centered isolated card.
 * The carousel is horizontal, withControls enabled and withIndicators enabled.
 * It contains 4 card slides with large titles: "New Arrivals", "Starter Pack", "Team Picks", "Last Chance".
 * The carousel starts on "New Arrivals" (slide id: feat-new). Loop is disabled; drag is enabled.
 *
 * Success: active_slide_id equals feat-starter
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text } from '@mantine/core';
import { Carousel, type Embla } from '@mantine/carousel';
import type { TaskComponentProps } from '../types';

const slides = [
  { id: 'feat-new', title: 'New Arrivals', color: '#1890ff' },
  { id: 'feat-starter', title: 'Starter Pack', color: '#52c41a' },
  { id: 'feat-team', title: 'Team Picks', color: '#fa8c16' },
  { id: 'feat-last', title: 'Last Chance', color: '#ff4d4f' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [embla, setEmbla] = useState<Embla | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const successFired = useRef(false);

  useEffect(() => {
    if (embla) {
      const onSelect = () => {
        setActiveIndex(embla.selectedScrollSnap());
      };
      embla.on('select', onSelect);
      onSelect();
      return () => {
        embla.off('select', onSelect);
      };
    }
  }, [embla]);

  const activeSlideId = slides[activeIndex]?.id;

  useEffect(() => {
    if (activeSlideId === 'feat-starter' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [activeSlideId, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }}>
      <Text fw={600} size="lg" mb="md">Featured Cards</Text>
      <div data-testid="carousel-root" data-active-slide-id={activeSlideId}>
        <Carousel
          getEmblaApi={setEmbla}
          withIndicators
          withControls
          loop={false}
          slideSize="100%"
          slideGap="md"
        >
          {slides.map((slide) => (
            <Carousel.Slide key={slide.id}>
              <div
                data-slide-id={slide.id}
                style={{
                  height: 200,
                  background: slide.color,
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
