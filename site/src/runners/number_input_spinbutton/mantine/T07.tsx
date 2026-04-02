'use client';

/**
 * number_input_spinbutton-mantine-T07: Visual: match Target altitude to chip
 * 
 * A dashboard panel is centered with header "Altitude control".
 * Near the header there is a pill-shaped chip labeled "Recommended altitude" displaying a number in meters.
 * Below are two Mantine NumberInput fields (2 instances):
 * - "Target altitude (m)" (TARGET) — initial value 1000, min=0, max=9000, step=100
 * - "Backup altitude (m)" — initial value 800, min=0, max=9000, step=100
 * Guidance is visual: the target number must be taken from the chip rather than stated directly.
 * Low clutter: a small chart image and a help icon are present but irrelevant. No Apply button is required.
 * 
 * Success: The numeric value of the target number input (Target altitude (m)) matches the value shown in the reference element ("Recommended altitude chip").
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, NumberInput, Text, Badge, Group, Box } from '@mantine/core';
import { IconHelp } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  // Random target value for the chip (between 2000 and 6000, in hundreds)
  const targetValue = useMemo(() => Math.floor(Math.random() * 41 + 20) * 100, []);
  
  const [targetAltitude, setTargetAltitude] = useState<string | number>(1000);
  const [backupAltitude, setBackupAltitude] = useState<string | number>(800);

  useEffect(() => {
    if (targetAltitude === targetValue) {
      onSuccess();
    }
  }, [targetAltitude, targetValue, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <Text fw={600} size="lg">Altitude control</Text>
          <IconHelp size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />
        </Group>
        <Badge 
          variant="filled" 
          size="lg"
          data-testid="recommended-altitude"
        >
          Recommended altitude: {targetValue}m
        </Badge>
      </Group>

      {/* Clutter: mini chart */}
      <Box 
        mb="md" 
        p="xs" 
        style={{ background: 'var(--mantine-color-gray-1)', borderRadius: 4 }}
      >
        <Group gap={4} align="flex-end" h={24}>
          {[30, 45, 60, 40, 75, 55, 80, 50, 65, 45].map((h, i) => (
            <Box 
              key={i} 
              style={{ 
                width: 10, 
                height: h * 0.3, 
                background: 'var(--mantine-color-blue-4)', 
                borderRadius: 2 
              }} 
            />
          ))}
        </Group>
      </Box>

      <NumberInput
        label="Target altitude (m)"
        min={0}
        max={9000}
        step={100}
        value={targetAltitude}
        onChange={(val) => setTargetAltitude(val)}
        mb="md"
        data-testid="target-altitude-input"
      />
      
      <NumberInput
        label="Backup altitude (m)"
        min={0}
        max={9000}
        step={100}
        value={backupAltitude}
        onChange={(val) => setBackupAltitude(val)}
        data-testid="backup-altitude-input"
      />
    </Card>
  );
}
