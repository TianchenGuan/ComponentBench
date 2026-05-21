'use client';

/**
 * carousel-mantine-T03: Swipe gallery: drag to 'Card 3'
 *
 * A Mantine Carousel withIndicators=false and withControls=false is displayed.
 * The carousel is intended to be used via drag/swipe (Embla drag interaction).
 * There are 6 slides labeled "Card 1"–"Card 6".
 * Initial state: "Card 1" (slide id: swipe-1) is active.
 *
 * Success: active_slide_id equals swipe-3
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text } from '@mantine/core';
import { Carousel, type Embla } from '@mantine/carousel';
import type { TaskComponentProps } from '../types';

const slides = [
  { id: 'swipe-1', title: 'Card 1', color: '#228be6' },
  { id: 'swipe-2', title: 'Card 2', color: '#40c057' },
  { id: 'swipe-3', title: 'Card 3', color: '#fab005' },
  { id: 'swipe-4', title: 'Card 4', color: '#fa5252' },
  { id: 'swipe-5', title: 'Card 5', color: '#7950f2' },
  { id: 'swipe-6', title: 'Card 6', color: '#15aabf' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
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
    if (activeSlideId === 'swipe-3' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [activeSlideId, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">Swipe Gallery</Text>
      <div data-testid="carousel-root" data-active-slide-id={activeSlideId}>
        <Carousel
          getEmblaApi={setEmbla}
          withIndicators={false}
          withControls={false}
          loop={false}
          slideSize="100%"
          draggable
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
      <Text size="xs" c="dimmed" ta="center" mt="sm">
        Drag to navigate
      </Text>
    </Card>
  );
}
