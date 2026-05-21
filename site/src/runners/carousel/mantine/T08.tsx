'use client';

/**
 * carousel-mantine-T08: Two carousels in a form: set 'Shipping options' to Express
 *
 * The page is a form_section layout anchored near the top-right.
 * Two Mantine Carousels appear as horizontally scrollable option pickers:
 *   - "Payment methods" carousel with slides: "Card", "PayPal", "Bank transfer".
 *   - "Shipping options" carousel with slides: "Standard", "Express", "Overnight".
 * Initial state: Payment methods is on "Card" (pay-card). Shipping options starts on "Overnight" (ship-overnight).
 * Only the Shipping options carousel is checked.
 *
 * Success: Shipping options active_slide_id equals ship-express
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, TextInput, Stack } from '@mantine/core';
import { Carousel, type Embla } from '@mantine/carousel';
import type { TaskComponentProps } from '../types';

const paymentSlides = [
  { id: 'pay-card', title: 'Card' },
  { id: 'pay-paypal', title: 'PayPal' },
  { id: 'pay-bank', title: 'Bank transfer' },
];

const shippingSlides = [
  { id: 'ship-standard', title: 'Standard' },
  { id: 'ship-express', title: 'Express' },
  { id: 'ship-overnight', title: 'Overnight' },
];

const SHIPPING_INITIAL_INDEX = 2; // "Overnight"

export default function T08({ onSuccess }: TaskComponentProps) {
  const [shippingEmbla, setShippingEmbla] = useState<Embla | null>(null);
  const [shippingActiveIndex, setShippingActiveIndex] = useState(SHIPPING_INITIAL_INDEX);
  const successFired = useRef(false);

  useEffect(() => {
    if (shippingEmbla) {
      const onSelect = () => {
        setShippingActiveIndex(shippingEmbla.selectedScrollSnap());
      };
      shippingEmbla.on('select', onSelect);
      return () => {
        shippingEmbla.off('select', onSelect);
      };
    }
  }, [shippingEmbla]);

  const shippingActiveId = shippingSlides[shippingActiveIndex]?.id;

  useEffect(() => {
    if (shippingActiveId === 'ship-express' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [shippingActiveId, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">Checkout settings</Text>

      {/* Distractor form fields */}
      <Stack gap="sm" mb="lg">
        <TextInput label="Street Address" placeholder="123 Main St" />
        <TextInput label="City" placeholder="New York" />
      </Stack>

      {/* Payment methods - Distractor */}
      <Text fw={500} size="sm" mb="xs">Payment methods</Text>
      <div data-testid="payment-carousel" data-instance-id="payment-methods" style={{ marginBottom: 16 }}>
        <Carousel
          withIndicators
          withControls={false}
          loop={false}
          slideSize="70%"
          slideGap="md"
          align="start"
        >
          {paymentSlides.map((slide) => (
            <Carousel.Slide key={slide.id}>
              <div
                style={{
                  height: 70,
                  background: '#e9ecef',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                }}
              >
                <Text size="sm" fw={500}>{slide.title}</Text>
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>

      {/* Shipping options - Target */}
      <Text fw={500} size="sm" mb="xs">Shipping options</Text>
      <div
        data-testid="carousel-root"
        data-instance-id="shipping-options"
        data-active-slide-id={shippingActiveId}
      >
        <Carousel
          getEmblaApi={setShippingEmbla}
          withIndicators
          withControls={false}
          loop={false}
          slideSize="70%"
          slideGap="md"
          align="start"
          initialSlide={SHIPPING_INITIAL_INDEX}
        >
          {shippingSlides.map((slide) => (
            <Carousel.Slide key={slide.id}>
              <div
                data-slide-id={slide.id}
                style={{
                  height: 70,
                  background: '#d3f9d8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                }}
              >
                <Text size="sm" fw={500}>{slide.title}</Text>
              </div>
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>
    </Card>
  );
}
