'use client';

/**
 * window_splitter-mantine-v2-T07: Fixed 800px content — Notes width 270–282 px
 */

import React, { useEffect, useRef, useState } from 'react';
import { Box, Card, Group, NativeSelect, Switch, Text } from '@mantine/core';
import '@mantine/core/styles.css';
import { HorizSplit } from './_DraggableSplit';
import type { TaskComponentProps } from '../../types';

const CONTENT_W = 800;

export default function T07({ onSuccess }: TaskComponentProps) {
  const [notesPx, setNotesPx] = useState(400);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && notesPx >= 270 && notesPx <= 282) {
      successFired.current = true;
      setTimeout(() => onSuccess(), 0);
    }
  }, [notesPx, onSuccess]);

  return (
    <Box p="md" style={{ maxWidth: 920 }}>
      <Text fw={700} size="sm" mb="xs">Workspace settings</Text>
      <Group mb="lg" gap="md" align="flex-end" wrap="wrap">
        <Switch label="Mirror panes" defaultChecked={false} />
        <NativeSelect label="Theme density" data={['Comfortable', 'Compact']} defaultValue="Compact" w={160} />
      </Group>

      <Card withBorder padding="sm" radius="md" w={CONTENT_W + 32}>
        <Text fw={600} size="sm" mb="xs">Fixed-width editor split</Text>
        <Text size="xs" c="dimmed" mb="sm">Distractors above — only the splitter below counts.</Text>
        <Box
          w={CONTENT_W}
          style={{ height: 220, border: '1px solid var(--mantine-color-gray-4)', borderRadius: 4 }}
          data-testid="splitter-primary"
        >
          <HorizSplit
            defaultLeftPct={50}
            leftMin={10}
            leftMax={90}
            onLeftPxChange={setNotesPx}
            leftContent={
              <Box h="100%" bg="gray.0" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text size="sm" fw={500}>Notes</Text>
              </Box>
            }
            rightContent={
              <Box h="100%" bg="gray.2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text size="sm" fw={500}>Preview</Text>
              </Box>
            }
          />
        </Box>
        <Text size="sm" mt="sm" ta="center" fw={500}>
          Notes width: {notesPx}px
        </Text>
      </Card>
    </Box>
  );
}
