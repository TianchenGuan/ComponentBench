'use client';

/**
 * window_splitter-mantine-v2-T05: Dark compact three-pane — Files / Editor / Console → 25/50/25 (±2)
 */

import React, { useEffect, useRef, useState } from 'react';
import { Box, Card, Table, Text } from '@mantine/core';
import '@mantine/core/styles.css';
import { ThreeHorizSplit } from './_DraggableSplit';
import type { TaskComponentProps } from '../../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [pcts, setPcts] = useState<[number, number, number]>([30, 40, 30]);
  const successFired = useRef(false);

  useEffect(() => {
    const [f0, f1, f2] = pcts;
    const ok =
      f0 >= 23 && f0 <= 27 &&
      f1 >= 48 && f1 <= 52 &&
      f2 >= 23 && f2 <= 27;
    if (!successFired.current && ok) {
      successFired.current = true;
      setTimeout(() => onSuccess(), 0);
    }
  }, [pcts, onSuccess]);

  return (
    <Box p="xs" data-mantine-color-scheme="dark" bg="dark.8" style={{ borderRadius: 8 }}>
      <Card padding="xs" radius="sm" bg="dark.7" c="gray.2" withBorder styles={{ root: { borderColor: 'var(--mantine-color-dark-4)' } }}>
        <Text fw={600} size="xs" mb="xs" c="gray.1">IDE layout (compact)</Text>
        <Box
          style={{ height: 168, border: '1px solid var(--mantine-color-dark-4)', borderRadius: 4 }}
          data-testid="splitter-primary"
        >
          <ThreeHorizSplit
            defaultPcts={[30, 40, 30]}
            mins={[8, 12, 8]}
            onPctChange={setPcts}
            sepWidth={6}
            sepColor="var(--mantine-color-dark-4)"
            contents={[
              <Box key="f" h="100%" bg="dark.6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text size="xs" fw={600}>Files</Text>
              </Box>,
              <Box key="e" h="100%" bg="dark.5" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text size="xs" fw={600}>Editor</Text>
              </Box>,
              <Box key="c" h="100%" bg="dark.6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text size="xs" fw={600}>Console</Text>
              </Box>,
            ]}
          />
        </Box>
        <CompactReadout pcts={pcts} />
      </Card>
    </Box>
  );
}

function CompactReadout({ pcts }: { pcts: [number, number, number] }) {
  return (
    <Table mt="xs" withTableBorder withColumnBorders fz="xs" c="gray.3">
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Pane</Table.Th>
          <Table.Th>%</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr><Table.Td>Files</Table.Td><Table.Td>{pcts[0].toFixed(1)}</Table.Td></Table.Tr>
        <Table.Tr><Table.Td>Editor</Table.Td><Table.Td>{pcts[1].toFixed(1)}</Table.Td></Table.Tr>
        <Table.Tr><Table.Td>Console</Table.Td><Table.Td>{pcts[2].toFixed(1)}</Table.Td></Table.Tr>
      </Table.Tbody>
    </Table>
  );
}
