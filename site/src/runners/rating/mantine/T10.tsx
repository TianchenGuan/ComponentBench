'use client';

/**
 * rating-mantine-T10: Compact small rating below fold: set to 5 (Mantine)
 * 
 * Scene details: theme=light, spacing=compact, scale=small, placement=center.
 * Layout: form_section in compact spacing.
 * The page is a long feedback form with several accordion-like sections; only the last section ("Final check-in") contains the target rating.
 * The "Final check-in" section is below the fold at initial load.
 * Inside that section is one Mantine Rating component labeled "Overall experience", rendered in a small visual size.
 * Configuration: count=5, fractions=1, size='xs' (or equivalent small size).
 * Initial state: value = 0.
 * Clutter: there are other non-target fields above (text inputs, checkboxes) but they are not required.
 * No submit/confirm button; success is immediate once the rating is set to 5.
 * 
 * Success: Target rating value equals 5 out of 5.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Rating, Stack, TextInput, Textarea, Checkbox, Accordion } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    if (value === 5) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <div style={{ maxWidth: 600, height: 700, overflowY: 'auto' }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Text fw={600} size="lg">Long feedback form</Text>
          
          <Accordion defaultValue="basic" variant="contained">
            <Accordion.Item value="basic">
              <Accordion.Control>Basic Information</Accordion.Control>
              <Accordion.Panel>
                <Stack gap="sm">
                  <TextInput label="Full Name" placeholder="Enter your name" />
                  <TextInput label="Email" placeholder="your@email.com" />
                  <TextInput label="Phone" placeholder="+1 (555) 000-0000" />
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
            
            <Accordion.Item value="preferences">
              <Accordion.Control>Preferences</Accordion.Control>
              <Accordion.Panel>
                <Stack gap="sm">
                  <Checkbox label="Receive email notifications" defaultChecked />
                  <Checkbox label="Receive SMS updates" />
                  <Checkbox label="Subscribe to newsletter" defaultChecked />
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
            
            <Accordion.Item value="comments">
              <Accordion.Control>Additional Comments</Accordion.Control>
              <Accordion.Panel>
                <Stack gap="sm">
                  <Textarea 
                    label="What did you like?" 
                    placeholder="Tell us what worked well..."
                    rows={3}
                  />
                  <Textarea 
                    label="Areas for improvement" 
                    placeholder="How can we do better?"
                    rows={3}
                  />
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
            
            <Accordion.Item value="final" data-testid="final-checkin-section">
              <Accordion.Control>Final check-in</Accordion.Control>
              <Accordion.Panel>
                <Stack gap="sm">
                  <div>
                    <Text fw={500} size="sm" mb={4}>Overall experience</Text>
                    <Rating
                      value={value}
                      onChange={setValue}
                      fractions={1}
                      size="xs"
                      data-testid="rating-overall-experience"
                    />
                  </div>
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Stack>
      </Card>
    </div>
  );
}
