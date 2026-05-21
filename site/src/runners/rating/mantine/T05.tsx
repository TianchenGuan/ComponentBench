'use client';

/**
 * rating-mantine-T05: Form with two ratings: set Value to 1 (Mantine)
 * 
 * Scene details: theme=light, spacing=comfortable, scale=default, placement=center.
 * Layout: form_section with low clutter.
 * The form contains two text inputs ("Order number" and "Comments") as distractors.
 * Two Mantine Rating components appear in the middle of the form:
 *   • "Packaging" (top)
 *   • "Value" (bottom)
 * Configuration: both have count=5 and fractions=1.
 * Initial state: Packaging = 4, Value = 3.
 * No submit button required for success; ratings commit immediately when selected.
 * 
 * Success: Target rating value equals 1 out of 5 on "Value" AND "Packaging" remains at 4.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Rating, Stack, TextInput, Textarea } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [packaging, setPackaging] = useState<number>(4);
  const [valueRating, setValueRating] = useState<number>(3);
  const initialPackaging = useRef(4);

  useEffect(() => {
    // Success requires Value = 1 AND Packaging unchanged from initial (4)
    if (valueRating === 1 && packaging === initialPackaging.current) {
      onSuccess();
    }
  }, [valueRating, packaging, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Stack gap="md">
        <Text fw={600} size="lg">Purchase feedback</Text>
        
        <TextInput
          label="Order number"
          placeholder="Enter order number"
        />
        
        <div>
          <Text fw={500} mb={8}>Packaging</Text>
          <Rating
            value={packaging}
            onChange={setPackaging}
            fractions={1}
            data-testid="rating-packaging"
          />
        </div>
        
        <div>
          <Text fw={500} mb={8}>Value</Text>
          <Rating
            value={valueRating}
            onChange={setValueRating}
            fractions={1}
            data-testid="rating-value"
          />
        </div>
        
        <Textarea
          label="Comments"
          placeholder="Your comments..."
          rows={3}
        />
      </Stack>
    </Card>
  );
}
