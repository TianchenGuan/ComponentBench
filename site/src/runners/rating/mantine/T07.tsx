'use client';

/**
 * rating-mantine-T07: Custom per-item symbols (mood faces): match level 4/6 (Mantine)
 * 
 * Scene details: theme=light, spacing=comfortable, scale=default, placement=center.
 * Layout: isolated_card centered.
 * A "Mood check" card contains a non-interactive reference row labeled "Reference mood", showing the face icon corresponding to level 4 on this scale.
 * Below it is one Mantine Rating component labeled "Mood".
 * Configuration: count=6 (six positions), fractions=1, and each position uses a different face icon (from very sad → very happy).
 * Initial state: Mood = 1 (pre-filled with the first face).
 * No confirm button; the selected level commits immediately.
 * 
 * Success: Target rating value equals 4 out of 6.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Rating, Stack, Group } from '@mantine/core';
import { 
  IconMoodEmpty, 
  IconMoodSad, 
  IconMoodConfuzed, 
  IconMoodSmile, 
  IconMoodHappy, 
  IconMoodCrazyHappy 
} from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

// Custom emoji function for each rating level
function getEmptyIcon(value: number) {
  const iconStyle = { width: 24, height: 24, color: 'gray' };
  switch (value) {
    case 1: return <IconMoodEmpty style={iconStyle} />;
    case 2: return <IconMoodSad style={iconStyle} />;
    case 3: return <IconMoodConfuzed style={iconStyle} />;
    case 4: return <IconMoodSmile style={iconStyle} />;
    case 5: return <IconMoodHappy style={iconStyle} />;
    case 6: return <IconMoodCrazyHappy style={iconStyle} />;
    default: return <IconMoodEmpty style={iconStyle} />;
  }
}

function getFullIcon(value: number) {
  const iconStyle = { width: 24, height: 24 };
  switch (value) {
    case 1: return <IconMoodEmpty style={{ ...iconStyle, color: '#fa5252' }} />;
    case 2: return <IconMoodSad style={{ ...iconStyle, color: '#fd7e14' }} />;
    case 3: return <IconMoodConfuzed style={{ ...iconStyle, color: '#fab005' }} />;
    case 4: return <IconMoodSmile style={{ ...iconStyle, color: '#82c91e' }} />;
    case 5: return <IconMoodHappy style={{ ...iconStyle, color: '#40c057' }} />;
    case 6: return <IconMoodCrazyHappy style={{ ...iconStyle, color: '#12b886' }} />;
    default: return <IconMoodEmpty style={{ ...iconStyle, color: '#fa5252' }} />;
  }
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number>(1);

  useEffect(() => {
    if (value === 4) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Stack gap="md">
        <Text fw={600} size="lg">Mood check</Text>
        
        <Group>
          <Text fw={500}>Reference mood: </Text>
          <IconMoodSmile style={{ width: 28, height: 28, color: '#82c91e' }} />
          <Text size="sm" c="dimmed">(level 4)</Text>
        </Group>
        
        <div>
          <Text fw={500} mb={8}>Mood</Text>
          <Rating
            value={value}
            onChange={setValue}
            count={6}
            fractions={1}
            emptySymbol={getEmptyIcon}
            fullSymbol={getFullIcon}
            data-testid="rating-mood"
          />
        </div>
      </Stack>
    </Card>
  );
}
