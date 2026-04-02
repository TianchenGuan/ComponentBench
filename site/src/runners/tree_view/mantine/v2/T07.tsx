'use client';

/**
 * tree_view-mantine-v2-T07: Permission trees — choose the target tree and exact checked leaves
 *
 * Settings panel, high clutter. Two Mantine Trees with custom checkbox indicators and same node labels.
 * Both: Platform→{Deployments, Incidents, Logs}, Finance→{Budgets}.
 * Write permissions: Logs checked by default. Read permissions: Deployments checked by default.
 * Both roots collapsed. Shared "Apply permissions" button.
 * Success: Write permissions checked = exactly {write/platform/deployments, write/platform/incidents},
 *          Read permissions unchanged, "Apply permissions" clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, Text, Tree, Group, Checkbox, Button, Box, TextInput, SimpleGrid, Stack,
  useTree, type TreeNodeData, type RenderTreeNodePayload,
} from '@mantine/core';
import { IconChevronRight, IconShield, IconFile } from '@tabler/icons-react';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

function makePermTree(prefix: string): TreeNodeData[] {
  return [
    {
      value: `${prefix}/platform`, label: 'Platform',
      children: [
        { value: `${prefix}/platform/deployments`, label: 'Deployments' },
        { value: `${prefix}/platform/incidents`, label: 'Incidents' },
        { value: `${prefix}/platform/logs`, label: 'Logs' },
      ],
    },
    {
      value: `${prefix}/finance`, label: 'Finance',
      children: [
        { value: `${prefix}/finance/budgets`, label: 'Budgets' },
      ],
    },
  ];
}

const readData = makePermTree('read');
const writeData = makePermTree('write');

const TARGET_CHECKED = ['write/platform/deployments', 'write/platform/incidents'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const readTree = useTree({
    initialExpandedState: {},
    initialCheckedState: ['read/platform/deployments'],
  });
  const writeTree = useTree({
    initialExpandedState: {},
    initialCheckedState: ['write/platform/logs'],
  });
  const [readInitialChecked] = useState(() => [...readTree.checkedState]);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const writeLeafChecked = writeTree.checkedState.filter(
      (v) => !['write/platform', 'write/finance'].includes(v),
    );
    const readUnchanged = setsEqual(readTree.checkedState, readInitialChecked);
    if (committed && setsEqual(writeLeafChecked, TARGET_CHECKED) && readUnchanged) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, writeTree.checkedState, readTree.checkedState, readInitialChecked, onSuccess]);

  const makeRenderNode = (onToggle: () => void) =>
    ({ node, expanded, hasChildren, elementProps, tree: tc }: RenderTreeNodePayload) => {
      const checked = tc.isNodeChecked(node.value);
      const indeterminate = tc.isNodeIndeterminate(node.value);
      return (
        <Group gap={5} {...elementProps}>
          {hasChildren ? (
            <IconChevronRight size={16}
              style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 150ms', cursor: 'pointer' }}
              onClick={(e) => { e.stopPropagation(); tc.toggleExpanded(node.value); }}
            />
          ) : <span style={{ width: 16 }} />}
          <Checkbox.Indicator checked={checked} indeterminate={indeterminate} size="xs"
            onClick={(e) => { e.stopPropagation(); checked ? tc.uncheckNode(node.value) : tc.checkNode(node.value); onToggle(); }}
          />
          {hasChildren ? <IconShield size={14} /> : <IconFile size={14} />}
          <Text size="sm">{node.label}</Text>
        </Group>
      );
    };

  return (
    <Box p="md" maw={700}>
      <Text fw={600} size="lg" mb="md">Role Permissions</Text>

      <Card shadow="xs" padding="sm" withBorder mb="md">
        <Group gap="md">
          <TextInput size="xs" label="Role name" value="Operator" readOnly style={{ flex: 1 }} />
          <TextInput size="xs" label="Region" value="US-West" readOnly style={{ flex: 1 }} />
        </Group>
      </Card>

      <Card shadow="xs" padding="sm" withBorder mb="md">
        <Text size="xs" c="dimmed">Summary: permissions configured for 1 role, 2 trees</Text>
      </Card>

      <SimpleGrid cols={2} mb="md">
        <Card shadow="xs" padding="sm" withBorder>
          <Text fw={500} size="sm" mb="xs">Read permissions</Text>
          <Tree data={readData} tree={readTree} renderNode={makeRenderNode(() => {})} expandOnClick={false} />
        </Card>
        <Card shadow="xs" padding="sm" withBorder>
          <Text fw={500} size="sm" mb="xs">Write permissions</Text>
          <Tree data={writeData} tree={writeTree}
            renderNode={makeRenderNode(() => setCommitted(false))} expandOnClick={false} data-testid="tree-root"
          />
        </Card>
      </SimpleGrid>

      <Group justify="flex-end">
        <Button size="xs" onClick={() => setCommitted(true)}>Apply permissions</Button>
      </Group>
    </Box>
  );
}
