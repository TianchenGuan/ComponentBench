'use client';

/**
 * tree_select-mantine-T07: Compact search: select Czechia
 *
 * Spacing/scale: compact spacing with small-size inputs and denser dropdown rows.
 * Layout: isolated_card centered titled "Shipping address".
 * Target component: composite TreeSelect labeled "Country"; starts empty.
 * Popover contents:
 *   1) a small search input labeled "Search countries",
 *   2) a Mantine Tree showing regions and countries (≈60 leaves).
 * Tree data:
 *   - Countries → Europe → (Czechia, Croatia, Cyprus, …), Americas → (Canada, Chile, …), Asia → (China, …)
 *
 * Success: Country committed selection equals leaf path [Countries, Europe, Czechia] with value 'country_europe_cz'.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, Text, TextInput, Popover, Tree, Group, useTree, type TreeNodeData, type RenderTreeNodePayload } from '@mantine/core';
import { IconChevronRight, IconSearch } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

// Build tree data with countries
const europeCountries = ['Austria', 'Belgium', 'Croatia', 'Cyprus', 'Czechia', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden'];
const americasCountries = ['Argentina', 'Brazil', 'Canada', 'Chile', 'Colombia', 'Mexico', 'Peru', 'USA', 'Venezuela'];
const asiaCountries = ['China', 'India', 'Indonesia', 'Japan', 'Malaysia', 'Philippines', 'Singapore', 'South Korea', 'Taiwan', 'Thailand', 'Vietnam'];

const treeData: TreeNodeData[] = [
  {
    value: 'countries',
    label: 'Countries',
    children: [
      {
        value: 'countries/europe',
        label: 'Europe',
        children: europeCountries.map((c) => ({
          value: `country_europe_${c.toLowerCase().replace(/ /g, '_')}`,
          label: c,
        })),
      },
      {
        value: 'countries/americas',
        label: 'Americas',
        children: americasCountries.map((c) => ({
          value: `country_americas_${c.toLowerCase().replace(/ /g, '_')}`,
          label: c,
        })),
      },
      {
        value: 'countries/asia',
        label: 'Asia',
        children: asiaCountries.map((c) => ({
          value: `country_asia_${c.toLowerCase().replace(/ /g, '_')}`,
          label: c,
        })),
      },
    ],
  },
];

// Build leaf values set
const allLeafValues = new Set([
  ...europeCountries.map((c) => `country_europe_${c.toLowerCase().replace(/ /g, '_')}`),
  ...americasCountries.map((c) => `country_americas_${c.toLowerCase().replace(/ /g, '_')}`),
  ...asiaCountries.map((c) => `country_asia_${c.toLowerCase().replace(/ /g, '_')}`),
]);

// Build value to label map
const valueToLabel: Record<string, string> = {};
[...europeCountries, ...americasCountries, ...asiaCountries].forEach((c, _) => {
  const region = europeCountries.includes(c) ? 'europe' : americasCountries.includes(c) ? 'americas' : 'asia';
  const key = `country_${region}_${c.toLowerCase().replace(/ /g, '_')}`;
  valueToLabel[key] = c;
});

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const tree = useTree();
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && value === 'country_europe_czechia') {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  // Filter tree based on search
  const filteredTree = useMemo(() => {
    if (!searchTerm) return treeData;
    const lower = searchTerm.toLowerCase();

    const filterChildren = (nodes: TreeNodeData[]): TreeNodeData[] => {
      return nodes
        .map((node) => {
          const labelStr = String(node.label ?? '');
          if (node.children) {
            const filtered = filterChildren(node.children);
            if (filtered.length > 0 || labelStr.toLowerCase().includes(lower)) {
              return { ...node, children: filtered };
            }
            return null;
          }
          return labelStr.toLowerCase().includes(lower) ? node : null;
        })
        .filter((n): n is TreeNodeData => n !== null);
    };

    return filterChildren(treeData);
  }, [searchTerm]);

  const renderNode = ({ node, expanded, hasChildren, elementProps, tree: treeController }: RenderTreeNodePayload) => (
    <Group
      gap={4}
      {...elementProps}
      onClick={(e) => {
        if (hasChildren) {
          treeController.toggleExpanded(node.value);
        } else if (allLeafValues.has(node.value)) {
          setValue(node.value);
          setOpened(false);
          setSearchTerm('');
        }
        e.stopPropagation();
      }}
      style={{ cursor: 'pointer', padding: '3px 6px', borderRadius: 4, fontSize: 13 }}
    >
      {hasChildren && (
        <IconChevronRight
          size={14}
          style={{
            transform: expanded ? 'rotate(90deg)' : 'none',
            transition: 'transform 150ms',
          }}
        />
      )}
      {!hasChildren && <span style={{ width: 14 }} />}
      <Text size="xs">{node.label}</Text>
    </Group>
  );

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 380 }} data-testid="tree-select-card">
      <Text fw={500} size="md" mb="sm">Shipping address</Text>
      <Text size="xs" fw={500} mb={4}>Country</Text>
      <Popover opened={opened} onChange={setOpened} position="bottom-start" width={320}>
        <Popover.Target>
          <TextInput
            size="sm"
            placeholder="Select a country"
            value={value ? valueToLabel[value] || value : ''}
            onClick={() => setOpened(true)}
            readOnly
            rightSection={<IconChevronRight size={14} />}
            data-testid="tree-select-country"
          />
        </Popover.Target>
        <Popover.Dropdown>
          <TextInput
            size="xs"
            placeholder="Search countries"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
            leftSection={<IconSearch size={14} />}
            mb="xs"
            autoFocus
          />
          <div style={{ maxHeight: 250, overflow: 'auto' }}>
            <Tree
              data={filteredTree}
              tree={tree}
              renderNode={renderNode}
              data-testid="tree-view"
            />
          </div>
        </Popover.Dropdown>
      </Popover>
    </Card>
  );
}
