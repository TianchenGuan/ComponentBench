'use client';

/**
 * carousel-mantine-T11: Vertical carousel in compact mode: drag to 'Chapter 6'
 *
 * The page is light theme with compact spacing and small scale tier.
 * A single Mantine Carousel is configured with orientation="vertical".
 * withControls is disabled; withIndicators is enabled as a vertical dot list.
 * The carousel contains 8 slides labeled "Chapter 1" through "Chapter 8".
 * Initial state: Chapter 3 (chap-3) is active. Loop is off. Drag is enabled.
 *
 * Success: active_slide_id equals chap-6
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text } from '@mantine/core';
import { Carousel, type Embla } from '@mantine/carousel';
import type { TaskComponentProps } from '../types';

const slides = Array.from({ length: 8 }, (_, i) => ({
  id: `chap-${i + 1}`,
  title: `Chapter ${i + 1}`,
}));

const INITIAL_INDEX = 2; // "Chapter 3"

export default function T11({ onSuccess }: TaskComponentProps) {
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
    if (activeSlideId === 'chap-6' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [activeSlideId, onSuccess]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 300 }}>
      <Text fw={600} size="md" mb="sm">Chapters</Text>
      <div
        data-testid="carousel-root"
        data-active-slide-id={activeSlideId}
        style={{ fontSize: 12 }}
      >
        <Carousel
          getEmblaApi={setEmbla}
          withIndicators
          withControls={false}
          loop={false}
          orientation="vertical"
          height={150}
          slideSize="100%"
          initialSlide={INITIAL_INDEX}
          draggable
        >
          {slides.map((slide) => (
            <Carousel.Slide key={slide.id}>
              <div
                data-slide-id={slide.id}
                style={{
                  height: 150,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6,
                }}
              >
                <Text c="white" size="lg" fw={600}>{slide.title}</Text>
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
      <Text size="xs" c="dimmed" ta="center" mt="sm">
        Drag up/down to navigate
      </Text>
    </Card>
  );
}
