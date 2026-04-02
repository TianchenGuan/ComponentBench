'use client';

/**
 * tree_select-mantine-v2-T19: Scrollable popover — select deep ARIA roles topic
 *
 * Nested-scroll layout. TextInput + Popover + ScrollArea + Tree. The Accessibility branch
 * has many ARIA-related leaves; "Roles" sits below the initially visible items.
 * Click "Apply topic" to commit.
 *
 * Success: value = topics-accessibility-aria-roles, Apply topic clicked.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Card, Text, Button, TextInput, Popover, Stack, Badge, Group, ScrollArea,
  MantineProvider, Tree, useTree,
} from '@mantine/core';
import type { TaskComponentProps } from '../../types';

const treeData = [
  {
    label: 'Topics', value: 'topics', children: [
      {
        label: 'Accessibility', value: 'topics-accessibility', children: [
          {
            label: 'ARIA', value: 'topics-accessibility-aria', children: [
              { label: 'Landmarks', value: 'topics-accessibility-aria-landmarks' },
              { label: 'Live Regions', value: 'topics-accessibility-aria-live-regions' },
              { label: 'States', value: 'topics-accessibility-aria-states' },
              { label: 'Properties', value: 'topics-accessibility-aria-properties' },
              { label: 'Widgets', value: 'topics-accessibility-aria-widgets' },
              { label: 'Roles', value: 'topics-accessibility-aria-roles' },
            ],
          },
          {
            label: 'Keyboard', value: 'topics-accessibility-keyboard', children: [
              { label: 'Focus Management', value: 'topics-accessibility-keyboard-focus' },
              { label: 'Tab Order', value: 'topics-accessibility-keyboard-taborder' },
            ],
          },
          {
            label: 'Color', value: 'topics-accessibility-color', children: [
              { label: 'Contrast', value: 'topics-accessibility-color-contrast' },
              { label: 'Palettes', value: 'topics-accessibility-color-palettes' },
            ],
          },
        ],
      },
      {
        label: 'Performance', value: 'topics-performance', children: [
          { label: 'Lazy Loading', value: 'topics-performance-lazy' },
          { label: 'Code Splitting', value: 'topics-performance-splitting' },
        ],
      },
      {
        label: 'Security', value: 'topics-security', children: [
          { label: 'XSS', value: 'topics-security-xss' },
          { label: 'CSRF', value: 'topics-security-csrf' },
        ],
      },
    ],
  },
];

const LEAF_VALUES = new Set([
  'topics-accessibility-aria-landmarks', 'topics-accessibility-aria-live-regions',
  'topics-accessibility-aria-states', 'topics-accessibility-aria-properties',
  'topics-accessibility-aria-widgets', 'topics-accessibility-aria-roles',
  'topics-accessibility-keyboard-focus', 'topics-accessibility-keyboard-taborder',
  'topics-accessibility-color-contrast', 'topics-accessibility-color-palettes',
  'topics-performance-lazy', 'topics-performance-splitting',
  'topics-security-xss', 'topics-security-csrf',
]);

export default function T19({ onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);
  const tree = useTree();

  useEffect(() => {
    if (successFired.current) return;
    if (committed && value === 'topics-accessibility-aria-roles') {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, value, onSuccess]);

  const handleClick = useCallback((val: string) => {
    if (LEAF_VALUES.has(val)) {
      setValue(val);
      setOpened(false);
      setCommitted(false);
    }
  }, []);

  const display = value ? value.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join(' / ') : '';

  return (
    <MantineProvider>
      <div style={{ height: '150vh', padding: 16 }}>
        <div style={{ maxWidth: 400, position: 'absolute', bottom: 60, right: 40 }}>
          <Text fw={600} size="md" mb="xs">Documentation</Text>
          <Group gap="xs" mb="sm">
            <Badge size="sm" variant="outline">v2.1</Badge>
            <Badge size="sm">Draft</Badge>
          </Group>
          <Card shadow="sm" padding="md" radius="md" withBorder>
            <Stack gap="md">
              <Popover opened={opened} onChange={setOpened} width={320} position="bottom-start">
                <Popover.Target>
                  <TextInput
                    label="Topic"
                    size="sm"
                    readOnly
                    value={display}
                    placeholder="Click to select topic"
                    onClick={() => setOpened(true)}
                    style={{ cursor: 'pointer' }}
                  />
                </Popover.Target>
                <Popover.Dropdown>
                  <ScrollArea h={220}>
                    <Tree
                      data={treeData}
                      tree={tree}
                      levelOffset={23}
                      renderNode={({ node, expanded, hasChildren, elementProps }) => (
                        <Group
                          gap="xs"
                          {...elementProps}
                          onClick={(e) => {
                            elementProps.onClick?.(e);
                            handleClick(node.value);
                          }}
                          style={{ ...elementProps.style, cursor: 'pointer' }}
                        >
                          {hasChildren && (
                            <span style={{ fontSize: 12, width: 16 }}>{expanded ? '▼' : '▶'}</span>
                          )}
                          {!hasChildren && <span style={{ width: 16 }} />}
                          <Text size="sm">{node.label}</Text>
                        </Group>
                      )}
                    />
                  </ScrollArea>
                </Popover.Dropdown>
              </Popover>
              <Button size="sm" onClick={() => setCommitted(true)}>Apply topic</Button>
            </Stack>
          </Card>
        </div>
      </div>
    </MantineProvider>
  );
}
