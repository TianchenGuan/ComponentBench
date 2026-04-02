'use client';

/**
 * tree_select-mantine-T09: Scroll to find ARIA topic
 *
 * Layout/placement: isolated_card anchored near the bottom-right of the viewport.
 * Target component: composite TreeSelect labeled "Topic"; empty on load.
 * Popover contents: a scrollable dropdown container wrapping a Mantine Tree.
 * Tree data (large):
 *   - Topics → Accessibility (≈20 leaves), Performance (≈25 leaves), Styling (≈25 leaves), Networking (≈20 leaves)
 * Search is disabled. User must expand and scroll.
 *
 * Success: Topic committed selection equals leaf path [Topics, Accessibility, ARIA] with value 'topic_accessibility_aria'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, TextInput, Popover, Tree, Group, useTree, type TreeNodeData, type RenderTreeNodePayload } from '@mantine/core';
import { IconChevronRight, IconFolder, IconFile } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

// Generate topics
const accessibilityTopics = ['ARIA', 'Contrast', 'Focus order', 'Keyboard nav', 'Screen readers', 'Alt text', 'Labels', 'Roles', 'Landmarks', 'Skip links', 'Color blindness', 'Motion sensitivity', 'Text sizing', 'Form validation', 'Error messages', 'Focus indicators', 'Tab order', 'Semantic HTML', 'Live regions', 'Announcements'];
const performanceTopics = ['Bundle size', 'Code splitting', 'Lazy loading', 'Memoization', 'Virtualization', 'Caching', 'Service workers', 'CDN', 'Compression', 'Minification', 'Tree shaking', 'Preloading', 'Prefetching', 'Critical CSS', 'Image optimization', 'Font loading', 'Layout shifts', 'First paint', 'Time to interactive', 'Core web vitals', 'Memory leaks', 'Profiling', 'Monitoring', 'Benchmarking', 'Load testing'];
const stylingTopics = ['CSS Grid', 'Flexbox', 'CSS Variables', 'Media queries', 'Container queries', 'Animations', 'Transitions', 'Transforms', 'Filters', 'Blend modes', 'Gradients', 'Shadows', 'Typography', 'Colors', 'Spacing', 'Layouts', 'Responsive design', 'Mobile first', 'Dark mode', 'Theming', 'CSS-in-JS', 'Tailwind', 'Sass', 'PostCSS', 'BEM'];
const networkingTopics = ['REST', 'GraphQL', 'WebSockets', 'HTTP/2', 'HTTP/3', 'CORS', 'Authentication', 'Authorization', 'Caching headers', 'ETags', 'Compression', 'SSL/TLS', 'DNS', 'CDN', 'Load balancing', 'Rate limiting', 'Retries', 'Timeouts', 'Error handling', 'Offline support'];

const treeData: TreeNodeData[] = [
  {
    value: 'topics',
    label: 'Topics',
    children: [
      {
        value: 'topics/accessibility',
        label: 'Accessibility',
        children: accessibilityTopics.map((t) => ({
          value: `topic_accessibility_${t.toLowerCase().replace(/ /g, '_')}`,
          label: t,
        })),
      },
      {
        value: 'topics/performance',
        label: 'Performance',
        children: performanceTopics.map((t) => ({
          value: `topic_performance_${t.toLowerCase().replace(/ /g, '_')}`,
          label: t,
        })),
      },
      {
        value: 'topics/styling',
        label: 'Styling',
        children: stylingTopics.map((t) => ({
          value: `topic_styling_${t.toLowerCase().replace(/ /g, '_')}`,
          label: t,
        })),
      },
      {
        value: 'topics/networking',
        label: 'Networking',
        children: networkingTopics.map((t) => ({
          value: `topic_networking_${t.toLowerCase().replace(/ /g, '_')}`,
          label: t,
        })),
      },
    ],
  },
];

const allLeafValues = new Set([
  ...accessibilityTopics.map((t) => `topic_accessibility_${t.toLowerCase().replace(/ /g, '_')}`),
  ...performanceTopics.map((t) => `topic_performance_${t.toLowerCase().replace(/ /g, '_')}`),
  ...stylingTopics.map((t) => `topic_styling_${t.toLowerCase().replace(/ /g, '_')}`),
  ...networkingTopics.map((t) => `topic_networking_${t.toLowerCase().replace(/ /g, '_')}`),
]);

const valueToLabel: Record<string, string> = {};
[...accessibilityTopics, ...performanceTopics, ...stylingTopics, ...networkingTopics].forEach((t) => {
  const category = accessibilityTopics.includes(t) ? 'accessibility' :
    performanceTopics.includes(t) ? 'performance' :
    stylingTopics.includes(t) ? 'styling' : 'networking';
  const key = `topic_${category}_${t.toLowerCase().replace(/ /g, '_')}`;
  valueToLabel[key] = t;
});

export default function T09({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);
  const tree = useTree();
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && value === 'topic_accessibility_aria') {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  const renderNode = ({ node, expanded, hasChildren, elementProps, tree: treeController }: RenderTreeNodePayload) => (
    <Group
      gap={5}
      {...elementProps}
      onClick={(e) => {
        if (hasChildren) {
          treeController.toggleExpanded(node.value);
        } else if (allLeafValues.has(node.value)) {
          setValue(node.value);
          setOpened(false);
        }
        e.stopPropagation();
      }}
      style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 4 }}
    >
      {hasChildren && (
        <IconChevronRight
          size={16}
          style={{
            transform: expanded ? 'rotate(90deg)' : 'none',
            transition: 'transform 150ms',
          }}
        />
      )}
      {!hasChildren && <span style={{ width: 16 }} />}
      {hasChildren ? <IconFolder size={16} /> : <IconFile size={16} />}
      <Text size="sm">{node.label}</Text>
    </Group>
  );

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }} data-testid="tree-select-card">
      <Text fw={500} size="lg" mb="md">Topic selector</Text>
      <Text size="sm" fw={500} mb={4}>Topic</Text>
      <Popover opened={opened} onChange={setOpened} position="bottom-start" width={350}>
        <Popover.Target>
          <TextInput
            placeholder="Select a topic"
            value={value ? valueToLabel[value] || value : ''}
            onClick={() => setOpened(true)}
            readOnly
            rightSection={<IconChevronRight size={16} style={{ transform: opened ? 'rotate(90deg)' : 'none' }} />}
            data-testid="tree-select-topic"
          />
        </Popover.Target>
        <Popover.Dropdown>
          <div style={{ maxHeight: 280, overflow: 'auto' }} data-testid="tree-scroll-container">
            <Tree
              data={treeData}
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
