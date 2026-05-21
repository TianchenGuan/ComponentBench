'use client';

/**
 * progress_bar-mantine-T07: Compound sections: set storage allocation segments
 *
 * Layout: isolated_card centered, titled "Storage".
 *
 * Target components on page (instances=2 of canonical progress_bar):
 * 1) TARGET: A Mantine compound progress labeled "Storage allocation", built with Progress.Root 
 *    and three Progress.Section segments:
 *    - Section label "Documents"
 *    - Section label "Photos"
 *    - Section label "Other"
 * 2) Distractor: A separate simple Progress bar labeled "Network usage" (static at 60%).
 *
 * Initial state (Storage allocation):
 * - Documents: 20%
 * - Photos: 20%
 * - Other: 20%
 *
 * Controls (affect Storage allocation only):
 * - For each segment (Documents/Photos/Other), there are "+5" and "-5" buttons.
 * - A "Reset allocation" link restores all three to 20%.
 *
 * Target values: Documents 35%, Photos 28%, Other 15%
 *
 * Success: All three segments within ±2% of their targets.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Progress, Button, Group, Stack, Anchor } from '@mantine/core';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [documents, setDocuments] = useState(20);
  const [photos, setPhotos] = useState(20);
  const [other, setOther] = useState(20);
  const successFiredRef = useRef(false);

  // Target values
  const targetDocuments = 35;
  const targetPhotos = 28;
  const targetOther = 15;

  useEffect(() => {
    const docsMatch = Math.abs(documents - targetDocuments) <= 2;
    const photosMatch = Math.abs(photos - targetPhotos) <= 2;
    const otherMatch = Math.abs(other - targetOther) <= 2;

    if (docsMatch && photosMatch && otherMatch && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [documents, photos, other, onSuccess]);

  const adjustSegment = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    delta: number
  ) => {
    setter((prev) => Math.max(0, Math.min(100, prev + delta)));
    successFiredRef.current = false;
  };

  const handleReset = () => {
    setDocuments(20);
    setPhotos(20);
    setOther(20);
    successFiredRef.current = false;
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Stack gap="lg">
        <Text fw={600} size="lg">Storage</Text>

        {/* Target legend */}
        <Text size="sm" c="dimmed">
          Target: Documents 35% • Photos 28% • Other 15%
        </Text>

        {/* Storage allocation - compound progress */}
        <div>
          <Text fw={500} size="sm" mb={8}>Storage allocation</Text>
          <Progress.Root size="xl" data-testid="storage-allocation">
            <Progress.Section
              value={documents}
              color="blue"
              aria-label="Documents segment"
            >
              <Progress.Label>Docs</Progress.Label>
            </Progress.Section>
            <Progress.Section
              value={photos}
              color="green"
              aria-label="Photos segment"
            >
              <Progress.Label>Photos</Progress.Label>
            </Progress.Section>
            <Progress.Section
              value={other}
              color="orange"
              aria-label="Other segment"
            >
              <Progress.Label>Other</Progress.Label>
            </Progress.Section>
          </Progress.Root>
        </div>

        {/* Controls for each segment */}
        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="sm">Documents: {documents}%</Text>
            <Group gap="xs">
              <Button size="xs" variant="outline" onClick={() => adjustSegment(setDocuments, -5)}>
                -5
              </Button>
              <Button size="xs" variant="outline" onClick={() => adjustSegment(setDocuments, 5)}>
                +5
              </Button>
            </Group>
          </Group>
          <Group justify="space-between">
            <Text size="sm">Photos: {photos}%</Text>
            <Group gap="xs">
              <Button size="xs" variant="outline" onClick={() => adjustSegment(setPhotos, -5)}>
                -5
              </Button>
              <Button size="xs" variant="outline" onClick={() => adjustSegment(setPhotos, 5)}>
                +5
              </Button>
            </Group>
          </Group>
          <Group justify="space-between">
            <Text size="sm">Other: {other}%</Text>
            <Group gap="xs">
              <Button size="xs" variant="outline" onClick={() => adjustSegment(setOther, -5)}>
                -5
              </Button>
              <Button size="xs" variant="outline" onClick={() => adjustSegment(setOther, 5)}>
                +5
              </Button>
            </Group>
          </Group>
        </Stack>

        <Anchor size="sm" onClick={handleReset}>Reset allocation</Anchor>

        {/* Distractor: Network usage */}
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #e9ecef' }}>
          <Text fw={500} size="sm" mb={8}>Network usage</Text>
          <Progress
            value={60}
            aria-label="Network usage"
            data-testid="network-usage"
          />
        </div>
      </Stack>
    </Card>
  );
}
