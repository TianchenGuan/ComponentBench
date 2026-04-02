'use client';

/**
 * carousel-mantine-T05: Small carousel: go to slide 5 'FAQ'
 *
 * A single Mantine Carousel is rendered at a small scale tier in the center.
 * Spacing is comfortable, but controls and indicators appear smaller.
 * The carousel has withIndicators enabled and contains 6 slides:
 * "Contact", "Billing", "Shipping", "Returns", "FAQ", "Troubleshooting".
 * Initial state: the carousel starts on "Returns" (slide id: help-returns).
 *
 * Success: active_slide_id equals help-faq
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text } from '@mantine/core';
import { Carousel, type Embla } from '@mantine/carousel';
import type { TaskComponentProps } from '../types';

const slides = [
  { id: 'help-contact', title: 'Contact' },
  { id: 'help-billing', title: 'Billing' },
  { id: 'help-shipping', title: 'Shipping' },
  { id: 'help-returns', title: 'Returns' },
  { id: 'help-faq', title: 'FAQ' },
  { id: 'help-trouble', title: 'Troubleshooting' },
];

const INITIAL_INDEX = 3; // "Returns"

export default function T05({ onSuccess }: TaskComponentProps) {
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
    if (activeSlideId === 'help-faq' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [activeSlideId, onSuccess]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 320 }}>
      <Text fw={600} size="md" mb="sm">Help Topics</Text>
      <div data-testid="carousel-root" data-active-slide-id={activeSlideId} style={{ fontSize: 12 }}>
        <Carousel
          getEmblaApi={setEmbla}
          withIndicators
          withControls
          loop={false}
          slideSize="100%"
          initialSlide={INITIAL_INDEX}
          height={100}
          controlSize={24}
        >
          {slides.map((slide) => (
            <Carousel.Slide key={slide.id}>
              <div
                data-slide-id={slide.id}
                style={{
                  height: 100,
                  background: '#f1f3f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6,
                }}
              >
                <Text size="md" fw={600}>{slide.title}</Text>
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
    </Card>
  );
}
