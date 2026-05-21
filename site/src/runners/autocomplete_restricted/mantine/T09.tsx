'use client';

/**
 * autocomplete_restricted-mantine-T09: Three contacts: set the emergency contact relationship
 *
 * setup_description:
 * A small "Contacts" card is positioned near the **top-left** of the viewport.
 *
 * It contains three Mantine Select fields of the same canonical type:
 * 1) Primary contact relationship (preselected: Parent)
 * 2) Secondary contact relationship (preselected: Sibling)
 * 3) **Emergency contact relationship** (empty)  ← target
 *
 * All three share the same options: Parent, Sibling, Spouse, Partner, Friend, Other.
 * - Theme: light; spacing: comfortable; size: default.
 * - Each Select is restricted to the options.
 * - Selecting commits immediately.
 *
 * The agent must correctly identify the Emergency contact relationship field and set it to Spouse without altering the other two.
 *
 * Success: The "Emergency contact relationship" Select has selected value "Spouse".
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Text, Select, Stack } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const relationships = [
  { label: 'Parent', value: 'Parent' },
  { label: 'Sibling', value: 'Sibling' },
  { label: 'Spouse', value: 'Spouse' },
  { label: 'Partner', value: 'Partner' },
  { label: 'Friend', value: 'Friend' },
  { label: 'Other', value: 'Other' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [primaryRelationship, setPrimaryRelationship] = useState<string | null>('Parent');
  const [secondaryRelationship, setSecondaryRelationship] = useState<string | null>('Sibling');
  const [emergencyRelationship, setEmergencyRelationship] = useState<string | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && emergencyRelationship === 'Spouse') {
      successFired.current = true;
      onSuccess();
    }
  }, [emergencyRelationship, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 380 }}>
      <Text fw={600} size="lg" mb="md">Contacts</Text>
      <Stack gap="md">
        <div>
          <Text fw={500} size="sm" mb={4}>Primary contact relationship</Text>
          <Select
            data-testid="primary-contact-select"
            data={relationships}
            value={primaryRelationship}
            onChange={setPrimaryRelationship}
          />
        </div>

        <div>
          <Text fw={500} size="sm" mb={4}>Secondary contact relationship</Text>
          <Select
            data-testid="secondary-contact-select"
            data={relationships}
            value={secondaryRelationship}
            onChange={setSecondaryRelationship}
          />
        </div>

        <div>
          <Text fw={500} size="sm" mb={4}>Emergency contact relationship</Text>
          <Select
            data-testid="emergency-contact-select"
            placeholder="Select relationship"
            data={relationships}
            value={emergencyRelationship}
            onChange={setEmergencyRelationship}
          />
        </div>
      </Stack>
    </Card>
  );
}
