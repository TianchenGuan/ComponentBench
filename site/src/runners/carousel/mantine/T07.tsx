'use client';

/**
 * carousel-mantine-T07: Match the reference product photo
 *
 * An isolated card contains a Mantine Carousel titled "Product Gallery".
 * The carousel uses withControls=true and withIndicators=true.
 * Directly below the carousel is a read-only "Reference photo" strip (reference token: ref-angle-d).
 * The carousel contains 7 photo slides: "Angle A"–"Angle G".
 * Initial state: the carousel starts on "Angle B" (slide id: angle-b). Loop is off.
 *
 * Success: active_slide_id equals angle-d (matches reference)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Divider } from '@mantine/core';
import { Carousel, type Embla } from '@mantine/carousel';
import type { TaskComponentProps } from '../types';

const slides = [
  { id: 'angle-a', title: 'Angle A', color: '#228be6' },
  { id: 'angle-b', title: 'Angle B', color: '#40c057' },
  { id: 'angle-c', title: 'Angle C', color: '#fab005' },
  { id: 'angle-d', title: 'Angle D', color: '#7950f2' },
  { id: 'angle-e', title: 'Angle E', color: '#fa5252' },
  { id: 'angle-f', title: 'Angle F', color: '#15aabf' },
  { id: 'angle-g', title: 'Angle G', color: '#f783ac' },
];

const TARGET_SLIDE = slides.find(s => s.id === 'angle-d')!;
const INITIAL_INDEX = 1; // "Angle B"

export default function T07({ onSuccess }: TaskComponentProps) {
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
    if (activeSlideId === 'angle-d' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [activeSlideId, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">Product Gallery</Text>
      <div data-testid="carousel-root" data-active-slide-id={activeSlideId}>
        <Carousel
          getEmblaApi={setEmbla}
          withIndicators
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
                  height: 200,
                  background: slide.color,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  borderRadius: 8,
                  paddingBottom: 16,
                }}
              >
                <Text c="white" size="md" fw={500}>{slide.title}</Text>
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>

      <Divider my="md" />

      {/* Reference photo */}
      <div data-testid="reference-preview" data-reference-token="ref-angle-d">
        <Text size="xs" c="dimmed" mb="xs">Reference photo</Text>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 80,
              height: 60,
              background: TARGET_SLIDE.color,
              borderRadius: 4,
            }}
          />
          <Text size="sm">{TARGET_SLIDE.title}</Text>
        </div>
      </div>
    </Card>
  );
}
