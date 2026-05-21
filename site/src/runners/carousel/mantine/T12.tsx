'use client';

/**
 * carousel-mantine-T12: Dark dashboard: match the reference hero image in the correct carousel
 *
 * The page is in dark theme and uses a dashboard layout with medium clutter.
 * A small "Reference image" tile at the top shows the target hero image (ref-hero-lighthouse).
 * Below it are three Mantine Carousels side by side:
 *   - "Hero Images" (target)
 *   - "Customer Logos" (distractor)
 *   - "Team Photos" (distractor)
 * Initial state: Hero Images starts on hero-forest. Loop is enabled.
 *
 * Success: Hero Images active_slide_id equals hero-lighthouse
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Group, Badge, Button, Stack, SimpleGrid } from '@mantine/core';
import { Carousel, type Embla } from '@mantine/carousel';
import type { TaskComponentProps } from '../types';

const heroSlides = [
  { id: 'hero-forest', title: 'Forest', color: '#40c057' },
  { id: 'hero-lighthouse', title: 'Lighthouse', color: '#228be6' },
  { id: 'hero-mountain', title: 'Mountain', color: '#7950f2' },
  { id: 'hero-sunset', title: 'Sunset', color: '#fd7e14' },
];

const logoSlides = [
  { id: 'logo-1', title: 'Logo 1' },
  { id: 'logo-2', title: 'Logo 2' },
  { id: 'logo-3', title: 'Logo 3' },
];

const teamSlides = [
  { id: 'team-1', title: 'Team 1' },
  { id: 'team-2', title: 'Team 2' },
  { id: 'team-3', title: 'Team 3' },
];

const TARGET_HERO = heroSlides.find(s => s.id === 'hero-lighthouse')!;

export default function T12({ onSuccess }: TaskComponentProps) {
  const [heroEmbla, setHeroEmbla] = useState<Embla | null>(null);
  const [heroActiveIndex, setHeroActiveIndex] = useState(0);
  const successFired = useRef(false);

  useEffect(() => {
    if (heroEmbla) {
      const onSelect = () => {
        setHeroActiveIndex(heroEmbla.selectedScrollSnap());
      };
      heroEmbla.on('select', onSelect);
      onSelect();
      return () => {
        heroEmbla.off('select', onSelect);
      };
    }
  }, [heroEmbla]);

  const heroActiveId = heroSlides[heroActiveIndex]?.id;

  useEffect(() => {
    if (heroActiveId === 'hero-lighthouse' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [heroActiveId, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 750 }}>
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">Dashboard</Text>
        <Group>
          <Badge color="green">Active</Badge>
          <Button size="xs" variant="light">Refresh</Button>
        </Group>
      </Group>

      {/* Reference image */}
      <div
        data-testid="reference-preview"
        data-reference-token="ref-hero-lighthouse"
        style={{ marginBottom: 16 }}
      >
        <Text size="xs" c="dimmed" mb="xs">Reference image</Text>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 60,
              height: 40,
              background: TARGET_HERO.color,
              borderRadius: 4,
            }}
          />
          <Text size="sm">{TARGET_HERO.title}</Text>
        </div>
      </div>

      {/* Three carousels */}
      <SimpleGrid cols={3} spacing="md">
        {/* Hero Images - Target */}
        <Stack gap="xs">
          <Text size="sm" fw={500}>Hero Images</Text>
          <div
            data-testid="carousel-root"
            data-instance-id="hero-images"
            data-active-slide-id={heroActiveId}
          >
            <Carousel
              getEmblaApi={setHeroEmbla}
              withIndicators
              withControls
              loop
              slideSize="100%"
              height={100}
              controlSize={20}
            >
              {heroSlides.map((slide) => (
                <Carousel.Slide key={slide.id}>
                  <div
                    data-slide-id={slide.id}
                    style={{
                      height: 100,
                      background: slide.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 6,
                    }}
                  >
                    <Text c="white" size="xs" fw={500}>{slide.title}</Text>
                  </div>
                </Carousel.Slide>
              ))}
            </Carousel>
          </div>
        </Stack>

        {/* Customer Logos - Distractor */}
        <Stack gap="xs">
          <Text size="sm" fw={500}>Customer Logos</Text>
          <div data-testid="logos-carousel" data-instance-id="customer-logos">
            <Carousel
              withIndicators
              withControls
              loop
              slideSize="100%"
              height={100}
              controlSize={20}
            >
              {logoSlides.map((slide) => (
                <Carousel.Slide key={slide.id}>
                  <div
                    style={{
                      height: 100,
                      background: '#868e96',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 6,
                    }}
                  >
                    <Text c="white" size="xs" fw={500}>{slide.title}</Text>
                  </div>
                </Carousel.Slide>
              ))}
            </Carousel>
          </div>
        </Stack>

        {/* Team Photos - Distractor */}
        <Stack gap="xs">
          <Text size="sm" fw={500}>Team Photos</Text>
          <div data-testid="team-carousel" data-instance-id="team-photos">
            <Carousel
              withIndicators
              withControls
              loop
              slideSize="100%"
              height={100}
              controlSize={20}
            >
              {teamSlides.map((slide) => (
                <Carousel.Slide key={slide.id}>
                  <div
                    style={{
                      height: 100,
                      background: '#495057',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 6,
                    }}
                  >
                    <Text c="white" size="xs" fw={500}>{slide.title}</Text>
                  </div>
                </Carousel.Slide>
              ))}
            </Carousel>
          </div>
        </Stack>
      </SimpleGrid>
    </Card>
  );
}
