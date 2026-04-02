'use client';

/**
 * tree_view-mantine-T07: Match reference: open Roadmap and select it
 *
 * Layout: isolated_card centered titled "Workspace". The card has two columns:
 * • Left: a Mantine Tree rendered at small scale (smaller text and tighter indentation).
 * • Right: a visual "Reference" panel showing a folder/file breadcrumb with icons;
 *   the final item is highlighted visually.
 *
 * Tree structure:
 * Workspace (value=ws)
 *   Projects (ws/projects)
 *     Planning (ws/projects/planning)
 *       Roadmap.md (ws/projects/planning/roadmap) [TARGET]
 *       Notes.md (ws/projects/planning/notes)
 *     Delivery (ws/projects/delivery)
 *   Archive (ws/archive)
 *
 * Initial state: all nodes are collapsed and nothing is selected. The reference panel shows
 * the icon breadcrumb Workspace → Projects → Planning → Roadmap.md (no additional instructions
 * text besides the breadcrumb).
 *
 * Success:
 * - Expanded nodes equal exactly {ws, ws/projects, ws/projects/planning}.
 * - Selected node value equals 'ws/projects/planning/roadmap'.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, Tree, Group, Grid, Box, useTree, type TreeNodeData, type RenderTreeNodePayload } from '@mantine/core';
import { IconChevronRight, IconFolder, IconFile, IconFolderOpen } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const treeData: TreeNodeData[] = [
  {
    value: 'ws',
    label: 'Workspace',
    children: [
      {
        value: 'ws/projects',
        label: 'Projects',
        children: [
          {
            value: 'ws/projects/planning',
            label: 'Planning',
            children: [
              { value: 'ws/projects/planning/roadmap', label: 'Roadmap.md' },
              { value: 'ws/projects/planning/notes', label: 'Notes.md' },
            ],
          },
          {
            value: 'ws/projects/delivery',
            label: 'Delivery',
            children: [
              { value: 'ws/projects/delivery/tasks', label: 'Tasks.md' },
            ],
          },
        ],
      },
      {
        value: 'ws/archive',
        label: 'Archive',
        children: [
          { value: 'ws/archive/old', label: 'Old files' },
        ],
      },
    ],
  },
];

const targetExpanded = ['ws', 'ws/projects', 'ws/projects/planning'];
const targetSelected = 'ws/projects/planning/roadmap';

export default function T07({ onSuccess }: TaskComponentProps) {
  const tree = useTree({
    initialExpandedState: {},
    initialSelectedState: [],
  });
  const successFired = useRef(false);

  useEffect(() => {
    // Get expanded nodes from expandedState object
    const expandedNodes = Object.entries(tree.expandedState)
      .filter(([_, isExpanded]) => isExpanded)
      .map(([value]) => value);
    
    const expandedMatch = setsEqual(expandedNodes, targetExpanded);
    const selectedMatch = tree.selectedState.includes(targetSelected);
    
    if (!successFired.current && expandedMatch && selectedMatch) {
      successFired.current = true;
      onSuccess();
    }
  }, [tree.expandedState, tree.selectedState, onSuccess]);

  const renderNode = ({ node, expanded, hasChildren, elementProps, tree: treeController, selected }: RenderTreeNodePayload) => (
    <Group
      gap={4}
      {...elementProps}
      style={{
        ...elementProps.style,
        backgroundColor: selected ? '#e6f4ff' : undefined,
        borderRadius: 4,
        padding: '1px 3px',
        cursor: 'pointer',
        fontSize: '12px',
      }}
    >
      {hasChildren && (
        <IconChevronRight
          size={14}
          style={{
            transform: expanded ? 'rotate(90deg)' : 'none',
            transition: 'transform 150ms',
            cursor: 'pointer',
          }}
          onClick={(e) => {
            e.stopPropagation();
            treeController.toggleExpanded(node.value);
          }}
        />
      )}
      {!hasChildren && <span style={{ width: 14 }} />}
      {hasChildren ? (
        expanded ? <IconFolderOpen size={14} /> : <IconFolder size={14} />
      ) : (
        <IconFile size={14} />
      )}
      <Text size="xs">{node.label}</Text>
    </Group>
  );

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 550 }} data-testid="tree-card">
      <Text fw={500} size="lg" mb="md">Workspace</Text>
      
      <Grid>
        <Grid.Col span={7}>
          <Tree
            data={treeData}
            tree={tree}
            renderNode={renderNode}
            selectOnClick
            data-testid="tree-root"
          />
        </Grid.Col>
        
        <Grid.Col span={5}>
          <Box
            p="md"
            style={{
              background: '#f5f5f5',
              borderRadius: 8,
              border: '1px solid #e0e0e0',
            }}
            data-testid="ref-ws-roadmap"
          >
            <Text size="xs" fw={500} mb="sm" c="dimmed">Reference</Text>
            <Group gap={4}>
              <IconFolder size={14} />
              <Text size="xs">Workspace</Text>
              <Text size="xs" c="dimmed">→</Text>
              <IconFolder size={14} />
              <Text size="xs">Projects</Text>
              <Text size="xs" c="dimmed">→</Text>
            </Group>
            <Group gap={4} mt={4}>
              <IconFolder size={14} />
              <Text size="xs">Planning</Text>
              <Text size="xs" c="dimmed">→</Text>
              <IconFile size={14} color="#1890ff" />
              <Text size="xs" fw={600} c="blue">Roadmap.md</Text>
            </Group>
          </Box>
        </Grid.Col>
      </Grid>
    </Card>
  );
}
