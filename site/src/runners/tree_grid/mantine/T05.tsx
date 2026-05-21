'use client';

/**
 * tree_grid-mantine-T05: Select in EU Region grid (instances=3)
 *
 * Layout: form_section with three cards in a row.
 * Instances: 3 Mantine composite tree grids labeled "US Region", "EU Region", and "APAC Region".
 * Each card title is directly above its table.
 * Component: each grid shows the same hierarchy but with region-specific availability badges.
 * Initial state: all three grids start collapsed; US Region has a different row pre-selected
 * ("Platform → Web Frontend") to increase disambiguation pressure.
 * Interaction: in the EU Region grid, expand Operations and Data Centers, then click the EU-West row.
 * Clutter: low—there is a short paragraph above the row of cards and a disabled Save button below.
 * Feedback: each grid has its own selected-path readout inside the card footer.
 *
 * Success: In the EU Region grid, selected row path equals Operations → Data Centers → EU-West.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Text, ActionIcon, Group, Box, Button, Stack, SimpleGrid } from '@mantine/core';
import { IconChevronRight, IconChevronDown } from '@tabler/icons-react';
import type { TaskComponentProps, TreeGridRow } from '../types';
import { SERVICE_CATALOG_DATA, getRowPath, pathEquals } from '../types';

interface TreeTableRowProps {
  row: TreeGridRow;
  depth: number;
  expandedKeys: Set<string>;
  selectedKey: string | null;
  onToggleExpand: (key: string) => void;
  onSelect: (key: string) => void;
}

function TreeTableRow({ row, depth, expandedKeys, selectedKey, onToggleExpand, onSelect }: TreeTableRowProps) {
  const isExpanded = expandedKeys.has(row.key);
  const isSelected = selectedKey === row.key;
  const hasChildren = row.children && row.children.length > 0;

  return (
    <>
      <Table.Tr
        style={{
          cursor: 'pointer',
          backgroundColor: isSelected ? '#e6f7ff' : undefined,
        }}
        onClick={() => onSelect(row.key)}
      >
        <Table.Td>
          <Group gap={4} style={{ paddingLeft: depth * 16 }}>
            {hasChildren ? (
              <ActionIcon
                variant="subtle"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand(row.key);
                }}
              >
                {isExpanded ? <IconChevronDown size={12} /> : <IconChevronRight size={12} />}
              </ActionIcon>
            ) : (
              <Box style={{ width: 18 }} />
            )}
            <Text size="xs">{row.service}</Text>
          </Group>
        </Table.Td>
        <Table.Td><Text size="xs">{row.status}</Text></Table.Td>
      </Table.Tr>
      {hasChildren && isExpanded && row.children!.map(child => (
        <TreeTableRow
          key={child.key}
          row={child}
          depth={depth + 1}
          expandedKeys={expandedKeys}
          selectedKey={selectedKey}
          onToggleExpand={onToggleExpand}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

interface RegionGridProps {
  title: string;
  instanceId: string;
  expandedKeys: Set<string>;
  selectedKey: string | null;
  onToggleExpand: (key: string) => void;
  onSelect: (key: string) => void;
}

function RegionGrid({ title, instanceId, expandedKeys, selectedKey, onToggleExpand, onSelect }: RegionGridProps) {
  const selectedPath = selectedKey ? getRowPath(SERVICE_CATALOG_DATA, selectedKey) : [];

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder data-instance={instanceId}>
      <Text fw={500} size="md" mb="sm">{title}</Text>
      <Box style={{ height: 280, overflowY: 'auto' }}>
        <Table striped={false} data-testid={`${instanceId.toLowerCase().replace(/\s+/g, '-')}-tree-grid`}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 140 }}>Service</Table.Th>
              <Table.Th style={{ width: 60 }}>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {SERVICE_CATALOG_DATA.map(row => (
              <TreeTableRow
                key={row.key}
                row={row}
                depth={0}
                expandedKeys={expandedKeys}
                selectedKey={selectedKey}
                onToggleExpand={onToggleExpand}
                onSelect={onSelect}
              />
            ))}
          </Table.Tbody>
        </Table>
      </Box>
      <Text size="xs" c="dimmed" mt="sm">
        {selectedKey ? `Selected: ${selectedPath.join(' → ')}` : 'No selection'}
      </Text>
    </Card>
  );
}

export default function T05({ onSuccess }: TaskComponentProps) {
  // US Region state - pre-selected
  const [usExpanded, setUsExpanded] = useState<Set<string>>(new Set(['platform']));
  const [usSelected, setUsSelected] = useState<string | null>('platform/web-frontend');
  
  // EU Region state - target
  const [euExpanded, setEuExpanded] = useState<Set<string>>(new Set());
  const [euSelected, setEuSelected] = useState<string | null>(null);
  
  // APAC Region state
  const [apacExpanded, setApacExpanded] = useState<Set<string>>(new Set());
  const [apacSelected, setApacSelected] = useState<string | null>(null);
  
  const successFired = useRef(false);

  const euPath = euSelected ? getRowPath(SERVICE_CATALOG_DATA, euSelected) : [];

  useEffect(() => {
    if (!successFired.current && pathEquals(euPath, ['Operations', 'Data Centers', 'EU-West'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [euPath, onSuccess]);

  const createToggle = (setter: React.Dispatch<React.SetStateAction<Set<string>>>) => (key: string) => {
    setter(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <Stack>
      <Text c="dimmed" size="sm">
        Configure region-specific service availability. Changes will apply to the selected region only.
      </Text>
      
      <Text size="sm" mb="xs">
        EU Region grid: select Operations → Data Centers → EU-West.
      </Text>

      <SimpleGrid cols={3} spacing="md">
        <RegionGrid
          title="US Region"
          instanceId="US Region"
          expandedKeys={usExpanded}
          selectedKey={usSelected}
          onToggleExpand={createToggle(setUsExpanded)}
          onSelect={setUsSelected}
        />
        <RegionGrid
          title="EU Region"
          instanceId="EU Region"
          expandedKeys={euExpanded}
          selectedKey={euSelected}
          onToggleExpand={createToggle(setEuExpanded)}
          onSelect={setEuSelected}
        />
        <RegionGrid
          title="APAC Region"
          instanceId="APAC Region"
          expandedKeys={apacExpanded}
          selectedKey={apacSelected}
          onToggleExpand={createToggle(setApacExpanded)}
          onSelect={setApacSelected}
        />
      </SimpleGrid>

      <Button disabled style={{ alignSelf: 'flex-start' }}>Save Changes</Button>
    </Stack>
  );
}
