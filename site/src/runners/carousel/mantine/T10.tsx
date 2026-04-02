'use client';

/**
 * carousel-mantine-T10: Open modal and navigate to 'Gallery: Mountains'
 *
 * The main page shows a button labeled "Open Gallery".
 * Clicking it opens a modal dialog containing a Mantine Carousel.
 * The carousel has withControls=true and withIndicators=true and contains 5 photo slides:
 * "Beach", "Forest", "Mountains", "City", "Desert".
 * The modal opens with "Beach" active (slide id: mgal-beach). Loop is off.
 *
 * Success: active_slide_id equals mgal-mountains
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Button, Modal } from '@mantine/core';
import { Carousel, type Embla } from '@mantine/carousel';
import { useDisclosure } from '@mantine/hooks';
import type { TaskComponentProps } from '../types';

const slides = [
  { id: 'mgal-beach', title: 'Beach', color: '#fab005' },
  { id: 'mgal-forest', title: 'Forest', color: '#40c057' },
  { id: 'mgal-mountains', title: 'Mountains', color: '#7950f2' },
  { id: 'mgal-city', title: 'City', color: '#495057' },
  { id: 'mgal-desert', title: 'Desert', color: '#fd7e14' },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [opened, { open, close }] = useDisclosure(false);
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
    if (activeSlideId === 'mgal-mountains' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [activeSlideId, onSuccess]);

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350, textAlign: 'center' }}>
        <Button size="lg" onClick={open}>
          Open Gallery
        </Button>
      </Card>

      <Modal opened={opened} onClose={close} title="Gallery" size="lg" centered>
        <div data-testid="carousel-root" data-active-slide-id={activeSlideId}>
          <Carousel
            getEmblaApi={setEmbla}
            withIndicators
            withControls
            loop={false}
            slideSize="100%"
          >
            {slides.map((slide) => (
              <Carousel.Slide key={slide.id}>
                <div
                  data-slide-id={slide.id}
                  style={{
                    height: 280,
                    background: slide.color,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    borderRadius: 8,
                    paddingBottom: 24,
                  }}
                >
                  <Text c="white" size="lg" fw={600}>{slide.title}</Text>
                </div>
              </Carousel.Slide>
            ))}
          </Carousel>
        </div>
      </Modal>
    </>
  );
}
