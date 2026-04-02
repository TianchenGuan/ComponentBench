'use client';

/**
 * carousel-mantine-T09: Multi-item carousel: jump to 'Item 7'
 *
 * A Mantine Carousel is displayed with withControls=true and withIndicators=true.
 * The carousel is configured to show multiple items per view: slideSize ~one-third width.
 * There are 9 item slides labeled "Item 1" through "Item 9". Initial state is "Item 1" (trend-1).
 * Because multiple items are visible, the agent must ensure "Item 7" is the selected/active slide.
 *
 * Success: active_slide_id equals trend-7
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text } from '@mantine/core';
import { Carousel, type Embla } from '@mantine/carousel';
import type { TaskComponentProps } from '../types';

const slides = Array.from({ length: 9 }, (_, i) => ({
  id: `trend-${i + 1}`,
  title: `Item ${i + 1}`,
}));

export default function T09({ onSuccess }: TaskComponentProps) {
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

  // In multi-item mode, selectedScrollSnap returns the page index (0,1,2),
  // not the individual slide index. Track clicked item separately.
  const [selectedItem, setSelectedItem] = useState(0);
  const activeSlideId = slides[selectedItem]?.id;

  useEffect(() => {
    if (activeSlideId === 'trend-7' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [activeSlideId, onSuccess]);

  const handleItemClick = (index: number) => {
    setSelectedItem(index);
    embla?.scrollTo(Math.floor(index / 3));
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 600 }}>
      <Text fw={600} size="lg" mb="md">Trending Items</Text>
      <div data-testid="carousel-root" data-active-slide-id={activeSlideId}>
        <Carousel
          getEmblaApi={setEmbla}
          withIndicators
          withControls
          loop={false}
          slideSize="33.333%"
          slideGap="md"
          align="start"
          slidesToScroll={3}
        >
          {slides.map((slide, index) => (
            <Carousel.Slide key={slide.id}>
              <div
                data-slide-id={slide.id}
                style={{
                  height: 120,
                  background: selectedItem === index ? '#228be6' : '#e9ecef',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  border: selectedItem === index ? '2px solid #1971c2' : '1px solid #dee2e6',
                  cursor: 'pointer',
                }}
                onClick={() => handleItemClick(index)}
              >
                <Text
                  size="sm"
                  fw={600}
                  c={selectedItem === index ? 'white' : 'dark'}
                >
                  {slide.title}
                </Text>
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
      <Text size="xs" c="dimmed" ta="center" mt="sm">
        Click an item to select it
      </Text>
    </Card>
  );
}
