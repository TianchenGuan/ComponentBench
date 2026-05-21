'use client';

/**
 * carousel-mantine-T02: Reset testimonials to first card
 *
 * One Mantine Carousel is displayed in a centered isolated card titled "Testimonials".
 * The carousel has withIndicators enabled but withControls disabled.
 * There are 5 slides labeled "Testimonial 1" through "Testimonial 5".
 * Initial state: the carousel opens on "Testimonial 4" (slide id: testi-4).
 *
 * Success: active_slide_id equals testi-1
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text } from '@mantine/core';
import { Carousel, type Embla } from '@mantine/carousel';
import type { TaskComponentProps } from '../types';

const slides = [
  { id: 'testi-1', title: 'Testimonial 1', quote: 'Absolutely fantastic product!' },
  { id: 'testi-2', title: 'Testimonial 2', quote: 'Changed my workflow completely.' },
  { id: 'testi-3', title: 'Testimonial 3', quote: 'Best investment I made this year.' },
  { id: 'testi-4', title: 'Testimonial 4', quote: 'Highly recommended for teams.' },
  { id: 'testi-5', title: 'Testimonial 5', quote: 'Support team is amazing!' },
];

const INITIAL_INDEX = 3; // "Testimonial 4"

export default function T02({ onSuccess }: TaskComponentProps) {
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
    if (activeSlideId === 'testi-1' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [activeSlideId, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">Testimonials</Text>
      <div data-testid="carousel-root" data-active-slide-id={activeSlideId}>
        <Carousel
          getEmblaApi={setEmbla}
          withIndicators
          withControls={false}
          loop={false}
          slideSize="100%"
          initialSlide={INITIAL_INDEX}
        >
          {slides.map((slide) => (
            <Carousel.Slide key={slide.id}>
              <div
                data-slide-id={slide.id}
                style={{
                  height: 160,
                  background: '#f8f9fa',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  padding: 24,
                }}
              >
                <Text size="sm" c="dimmed" mb="xs">{slide.title}</Text>
                <Text size="lg" ta="center" fs="italic">
                  &quot;{slide.quote}&quot;
                </Text>
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
    </Card>
  );
}
