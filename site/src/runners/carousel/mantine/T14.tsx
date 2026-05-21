'use client';

/**
 * carousel-mantine-T14: Dashboard tiles: set the 'Announcements' carousel to 'Maintenance'
 *
 * The page uses a dashboard layout anchored near the bottom-right.
 * Two Mantine Carousels appear as small tiles:
 *   - "Announcements" (target) with 6 slides
 *   - "Tips" (distractor) with 6 slides
 * The Announcements slides are: "Welcome", "Pricing", "Maintenance", "New feature", "Survey", "Status".
 * Initial state: Announcements starts on "Survey" (ann-survey); Tips starts on "Tip 1".
 *
 * Success: Announcements active_slide_id equals ann-maintenance
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, SimpleGrid, Badge, Group, Button } from '@mantine/core';
import { Carousel, type Embla } from '@mantine/carousel';
import type { TaskComponentProps } from '../types';

const announcementSlides = [
  { id: 'ann-welcome', title: 'Welcome' },
  { id: 'ann-pricing', title: 'Pricing' },
  { id: 'ann-maintenance', title: 'Maintenance' },
  { id: 'ann-feature', title: 'New feature' },
  { id: 'ann-survey', title: 'Survey' },
  { id: 'ann-status', title: 'Status' },
];

const tipSlides = [
  { id: 'tip-1', title: 'Tip 1' },
  { id: 'tip-2', title: 'Tip 2' },
  { id: 'tip-3', title: 'Tip 3' },
  { id: 'tip-4', title: 'Tip 4' },
  { id: 'tip-5', title: 'Tip 5' },
  { id: 'tip-6', title: 'Tip 6' },
];

const ANN_INITIAL_INDEX = 4; // "Survey"

export default function T14({ onSuccess }: TaskComponentProps) {
  const [annEmbla, setAnnEmbla] = useState<Embla | null>(null);
  const [annActiveIndex, setAnnActiveIndex] = useState(ANN_INITIAL_INDEX);
  const successFired = useRef(false);

  useEffect(() => {
    if (annEmbla) {
      const onSelect = () => {
        setAnnActiveIndex(annEmbla.selectedScrollSnap());
      };
      annEmbla.on('select', onSelect);
      return () => {
        annEmbla.off('select', onSelect);
      };
    }
  }, [annEmbla]);

  const annActiveId = announcementSlides[annActiveIndex]?.id;

  useEffect(() => {
    if (annActiveId === 'ann-maintenance' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [annActiveId, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }}>
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">Dashboard</Text>
        <Group gap="xs">
          <Badge color="blue">Live</Badge>
          <Button size="xs" variant="light">Settings</Button>
        </Group>
      </Group>

      {/* Distractor widgets */}
      <SimpleGrid cols={2} spacing="sm" mb="md">
        <Card withBorder padding="xs">
          <Text size="xs" c="dimmed">Active Users</Text>
          <Text size="lg" fw={600}>1,234</Text>
        </Card>
        <Card withBorder padding="xs">
          <Text size="xs" c="dimmed">Revenue</Text>
          <Text size="lg" fw={600}>$45,678</Text>
        </Card>
      </SimpleGrid>

      <SimpleGrid cols={2} spacing="md">
        {/* Announcements - Target */}
        <div>
          <Text size="sm" fw={500} mb="xs">Announcements</Text>
          <div
            data-testid="carousel-root"
            data-instance-id="announcements"
            data-active-slide-id={annActiveId}
          >
            <Carousel
              getEmblaApi={setAnnEmbla}
              withIndicators
              withControls={false}
              loop={false}
              slideSize="100%"
              height={80}
              initialSlide={ANN_INITIAL_INDEX}
              draggable
            >
              {announcementSlides.map((slide) => (
                <Carousel.Slide key={slide.id}>
                  <div
                    data-slide-id={slide.id}
                    style={{
                      height: 80,
                      background: '#e9ecef',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 6,
                    }}
                  >
                    <Text size="sm" fw={500}>{slide.title}</Text>
                  </div>
                </Carousel.Slide>
              ))}
            </Carousel>
          </div>
        </div>

        {/* Tips - Distractor */}
        <div>
          <Text size="sm" fw={500} mb="xs">Tips</Text>
          <div data-testid="tips-carousel" data-instance-id="tips">
            <Carousel
              withIndicators
              withControls={false}
              loop={false}
              slideSize="100%"
              height={80}
              draggable
            >
              {tipSlides.map((slide) => (
                <Carousel.Slide key={slide.id}>
                  <div
                    style={{
                      height: 80,
                      background: '#d3f9d8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 6,
                    }}
                  >
                    <Text size="sm" fw={500}>{slide.title}</Text>
                  </div>
                </Carousel.Slide>
              ))}
            </Carousel>
          </div>
        </div>
      </SimpleGrid>
    </Card>
  );
}
