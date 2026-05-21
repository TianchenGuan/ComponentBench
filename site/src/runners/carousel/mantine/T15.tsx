'use client';

/**
 * carousel-mantine-T15: Drawer gallery picker: choose the referenced banner for 'Header carousel'
 *
 * The main page has a button labeled "Choose banners".
 * Clicking it opens a left-side drawer containing two Mantine Carousels:
 *   - "Header carousel" (target) with 7 banner slides
 *   - "Sidebar carousel" (distractor) with 7 banner slides
 * At the top of the drawer is a "Reference preview" thumbnail (ref-banner-teal-grid).
 * Initial state: Header carousel starts on "Blue Wave" (hdr-blue); 
 * Sidebar carousel starts on "Teal Grid" (side-teal) to create a tempting distractor.
 *
 * Success: Header carousel active_slide_id equals hdr-teal-grid (matches reference)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Button, Drawer, Switch, Select, Group, Divider, Stack } from '@mantine/core';
import { Carousel, type Embla } from '@mantine/carousel';
import { useDisclosure } from '@mantine/hooks';
import type { TaskComponentProps } from '../types';

const headerSlides = [
  { id: 'hdr-blue-wave', title: 'Blue Wave', color: '#228be6' },
  { id: 'hdr-green-hills', title: 'Green Hills', color: '#40c057' },
  { id: 'hdr-orange-burst', title: 'Orange Burst', color: '#fd7e14' },
  { id: 'hdr-purple-night', title: 'Purple Night', color: '#7950f2' },
  { id: 'hdr-red-sunset', title: 'Red Sunset', color: '#fa5252' },
  { id: 'hdr-teal-grid', title: 'Teal Grid', color: '#15aabf' },
  { id: 'hdr-yellow-dawn', title: 'Yellow Dawn', color: '#fab005' },
];

const sidebarSlides = [
  { id: 'side-blue', title: 'Blue Wave', color: '#228be6' },
  { id: 'side-green', title: 'Green Hills', color: '#40c057' },
  { id: 'side-orange', title: 'Orange Burst', color: '#fd7e14' },
  { id: 'side-purple', title: 'Purple Night', color: '#7950f2' },
  { id: 'side-red', title: 'Red Sunset', color: '#fa5252' },
  { id: 'side-teal', title: 'Teal Grid', color: '#15aabf' },
  { id: 'side-yellow', title: 'Yellow Dawn', color: '#fab005' },
];

const TARGET_BANNER = headerSlides.find(s => s.id === 'hdr-teal-grid')!;
const SIDEBAR_INITIAL_INDEX = 5; // "Teal Grid" - tempting distractor

export default function T15({ onSuccess }: TaskComponentProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [headerEmbla, setHeaderEmbla] = useState<Embla | null>(null);
  const [headerActiveIndex, setHeaderActiveIndex] = useState(0);
  const successFired = useRef(false);

  useEffect(() => {
    if (headerEmbla) {
      const onSelect = () => {
        setHeaderActiveIndex(headerEmbla.selectedScrollSnap());
      };
      headerEmbla.on('select', onSelect);
      onSelect();
      return () => {
        headerEmbla.off('select', onSelect);
      };
    }
  }, [headerEmbla]);

  const headerActiveId = headerSlides[headerActiveIndex]?.id;

  useEffect(() => {
    if (headerActiveId === 'hdr-teal-grid' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [headerActiveId, onSuccess]);

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
        <Text fw={600} size="lg" mb="md">Banner Settings</Text>
        <Text c="dimmed" size="sm" mb="lg">
          Configure banner layouts for your site.
        </Text>
        <Button onClick={open}>Choose banners</Button>
      </Card>

      <Drawer opened={opened} onClose={close} title="Choose banners" position="left" size="lg">
        {/* Reference preview */}
        <div
          data-testid="reference-preview"
          data-reference-token="ref-banner-teal-grid"
          style={{ marginBottom: 16 }}
        >
          <Text size="xs" c="dimmed" mb="xs">Reference preview</Text>
          <Group>
            <div
              style={{
                width: 80,
                height: 50,
                background: TARGET_BANNER.color,
                borderRadius: 4,
              }}
            />
            <Text size="sm">{TARGET_BANNER.title}</Text>
          </Group>
        </div>

        <Divider my="md" />

        {/* Distractor controls */}
        <Stack gap="sm" mb="lg">
          <Group justify="space-between">
            <Text size="sm">Auto-rotate</Text>
            <Switch />
          </Group>
          <Group justify="space-between">
            <Text size="sm">Speed</Text>
            <Select
              size="xs"
              w={100}
              defaultValue="normal"
              data={['slow', 'normal', 'fast']}
            />
          </Group>
        </Stack>

        <Divider my="md" />

        {/* Header carousel - Target */}
        <div style={{ marginBottom: 24 }}>
          <Text fw={500} size="sm" mb="xs">Header carousel</Text>
          <div
            data-testid="carousel-root"
            data-instance-id="header-carousel"
            data-active-slide-id={headerActiveId}
          >
            <Carousel
              getEmblaApi={setHeaderEmbla}
              withIndicators
              withControls
              loop={false}
              slideSize="100%"
            >
              {headerSlides.map((slide) => (
                <Carousel.Slide key={slide.id}>
                  <div
                    data-slide-id={slide.id}
                    style={{
                      height: 100,
                      background: slide.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 8,
                    }}
                  >
                    <Text c="white" size="sm" fw={500}>{slide.title}</Text>
                  </div>
                </Carousel.Slide>
              ))}
            </Carousel>
          </div>
        </div>

        <Divider my="md" />

        {/* Sidebar carousel - Distractor */}
        <div style={{ marginBottom: 24 }}>
          <Text fw={500} size="sm" mb="xs">Sidebar carousel</Text>
          <div data-testid="sidebar-carousel" data-instance-id="sidebar-carousel">
            <Carousel
              withIndicators
              withControls
              loop={false}
              slideSize="100%"
              initialSlide={SIDEBAR_INITIAL_INDEX}
            >
              {sidebarSlides.map((slide) => (
                <Carousel.Slide key={slide.id}>
                  <div
                    style={{
                      height: 100,
                      background: slide.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 8,
                    }}
                  >
                    <Text c="white" size="sm" fw={500}>{slide.title}</Text>
                  </div>
                </Carousel.Slide>
              ))}
            </Carousel>
          </div>
        </div>

        {/* Footer buttons */}
        <Group justify="flex-end" mt="xl">
          <Button variant="light" onClick={close}>Cancel</Button>
          <Button>Save changes</Button>
        </Group>
      </Drawer>
    </>
  );
}
