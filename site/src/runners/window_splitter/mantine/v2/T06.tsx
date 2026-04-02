'use client';

/**
 * window_splitter-mantine-v2-T06: Visual-only match — left ~74% (±2), reference thumbnail
 */

import React, { useEffect, useRef, useState } from 'react';
import { Box, Card, Text } from '@mantine/core';
import '@mantine/core/styles.css';
import { HorizSplit } from './_DraggableSplit';
import type { TaskComponentProps } from '../../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [leftPct, setLeftPct] = useState(50);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && leftPct >= 72 && leftPct <= 76) {
      successFired.current = true;
      setTimeout(() => onSuccess(), 0);
    }
  }, [leftPct, onSuccess]);

  return (
    <Box p="xs" style={{ maxWidth: 440 }}>
      <Card withBorder padding="xs" radius="md" shadow="xs">
        <Text fw={600} size="sm" mb="xs">Live layout</Text>
        <Box
          style={{ height: 140, border: '1px solid var(--mantine-color-gray-4)', borderRadius: 4 }}
          data-testid="splitter-primary"
        >
          <HorizSplit
            defaultLeftPct={50}
            leftMin={12}
            leftMax={88}
            onLeftPctChange={setLeftPct}
            sepWidth={4}
            leftContent={
              <Box h="100%" bg="gray.1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text size="sm" fw={500}>Left</Text>
              </Box>
            }
            rightContent={
              <Box h="100%" bg="gray.3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text size="sm" fw={500}>Right</Text>
              </Box>
            }
          />
        </Box>
        <Text size="xs" c="dimmed" mt="sm">
          Match the reference thumbnail below; the live panes do not show a numeric readout.
        </Text>
        <Box mt="md" data-reference-id="mantine_ref_74_26" style={{ maxWidth: 200 }}>
          <Text size="xs" fw={500} mb={4}>Target reference</Text>
          <Box
            style={{
              height: 36,
              borderRadius: 4,
              overflow: 'hidden',
              display: 'flex',
              border: '1px solid var(--mantine-color-gray-5)',
            }}
          >
            <Box style={{ width: '74%', background: 'var(--mantine-color-gray-2)' }} />
            <Box style={{ width: '26%', background: 'var(--mantine-color-gray-5)' }} />
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
