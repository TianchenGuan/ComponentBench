'use client';

/**
 * carousel-mantine-T06: Changelog carousel: find 'Breaking changes'
 *
 * The page is a form_section titled "Release center" with light clutter.
 * Within the section there is one Mantine Carousel with withIndicators=true and withControls=true.
 * The carousel contains 8 slides that all look similar. Titles are:
 * "Highlights", "Improvements", "Bug fixes", "Performance", "Security", "Deprecated", "Breaking changes", "Thanks".
 * Initial state: the carousel starts on "Bug fixes" (slide id: ch-bugfix).
 *
 * Success: active_slide_id equals ch-breaking
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Button, Badge, Group } from '@mantine/core';
import { Carousel, type Embla } from '@mantine/carousel';
import type { TaskComponentProps } from '../types';

const slides = [
  { id: 'ch-highlights', title: 'Highlights' },
  { id: 'ch-improvements', title: 'Improvements' },
  { id: 'ch-bugfix', title: 'Bug fixes' },
  { id: 'ch-performance', title: 'Performance' },
  { id: 'ch-security', title: 'Security' },
  { id: 'ch-deprecated', title: 'Deprecated' },
  { id: 'ch-breaking', title: 'Breaking changes' },
  { id: 'ch-thanks', title: 'Thanks' },
];

const INITIAL_INDEX = 2; // "Bug fixes"

export default function T06({ onSuccess }: TaskComponentProps) {
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
    if (activeSlideId === 'ch-breaking' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [activeSlideId, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }}>
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">Release center</Text>
        <Badge color="blue">v3.2.0</Badge>
      </Group>

      {/* Light clutter */}
      <Group mb="md">
        <Text size="sm" c="dimmed">Latest release: 2 days ago</Text>
        <Button size="xs" variant="light">Subscribe</Button>
      </Group>

      <Text fw={500} size="sm" mb="sm">Changelog</Text>
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
                  height: 140,
                  background: '#f8f9fa',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  border: '1px solid #e9ecef',
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
                <Text size="lg" fw={600}>{slide.title}</Text>
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
    </Card>
  );
}
