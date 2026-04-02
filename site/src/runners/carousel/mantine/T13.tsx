'use client';

/**
 * carousel-mantine-T13: Looping carousel: find and stop on 'Slide 12: Credits'
 *
 * A single Mantine Carousel is displayed with withIndicators=true.
 * emblaOptions.loop=true is enabled, so navigating past the end wraps around.
 * There are 12 slides with short titles: "Intro", "Scene 1"–"Scene 10", "Epilogue", "Credits".
 * Initial state: the carousel starts on "Scene 6" (sb-scene6). The target is "Credits" (sb-credits).
 *
 * Success: active_slide_id equals sb-credits
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text } from '@mantine/core';
import { Carousel, type Embla } from '@mantine/carousel';
import type { TaskComponentProps } from '../types';

const slides = [
  { id: 'sb-intro', title: 'Intro' },
  { id: 'sb-scene1', title: 'Scene 1' },
  { id: 'sb-scene2', title: 'Scene 2' },
  { id: 'sb-scene3', title: 'Scene 3' },
  { id: 'sb-scene4', title: 'Scene 4' },
  { id: 'sb-scene5', title: 'Scene 5' },
  { id: 'sb-scene6', title: 'Scene 6' },
  { id: 'sb-scene7', title: 'Scene 7' },
  { id: 'sb-scene8', title: 'Scene 8' },
  { id: 'sb-scene9', title: 'Scene 9' },
  { id: 'sb-scene10', title: 'Scene 10' },
  { id: 'sb-epilogue', title: 'Epilogue' },
  { id: 'sb-credits', title: 'Credits' },
];

const INITIAL_INDEX = 6; // "Scene 6"

export default function T13({ onSuccess }: TaskComponentProps) {
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
    if (activeSlideId === 'sb-credits' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [activeSlideId, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">Storyboard</Text>
      <div data-testid="carousel-root" data-active-slide-id={activeSlideId}>
        <Carousel
          getEmblaApi={setEmbla}
          withIndicators
          withControls
          loop
          slideSize="100%"
          initialSlide={INITIAL_INDEX}
        >
          {slides.map((slide) => (
            <Carousel.Slide key={slide.id}>
              <div
                data-slide-id={slide.id}
                style={{
                  height: 160,
                  background: slide.id === 'sb-credits' 
                    ? 'linear-gradient(135deg, #ffd43b 0%, #fab005 100%)'
                    : 'linear-gradient(135deg, #868e96 0%, #495057 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                }}
              >
                <Text c="white" size="xl" fw={700}>{slide.title}</Text>
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
    </Card>
  );
}
