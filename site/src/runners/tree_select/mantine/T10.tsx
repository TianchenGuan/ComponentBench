'use client';

/**
 * tree_select-mantine-T10: Dashboard: match alert channel (3 instances, visual)
 *
 * Layout: dashboard with several widgets (high clutter): a small chart, a recent alerts table, filter chips, and a sidebar.
 * Target components: THREE composite TreeSelect instances grouped in a "Notification channels" widget:
 *   1) "Primary channel" (pre-filled with "Email / On-call list")
 *   2) "Secondary channel" (empty) ← TARGET
 *   3) "Tertiary channel" (pre-filled with "Chat / #general")
 * All three instances share the same channel tree:
 *   - Chat → (#general, #incidents, #releases)
 *   - Email → (On-call list, Security list)
 *   - PagerDuty → (Critical, Non-critical)
 * Visual guidance: a "Reference" card shows a static screenshot-like image with ONE leaf highlighted.
 * The highlighted leaf corresponds to "Chat → #incidents".
 *
 * Success: The TreeSelect labeled "Secondary channel" matches the node highlighted in the Reference card.
 * Canonical target is path [Chat, #incidents] with value 'channel_chat_incidents'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, TextInput, Popover, Tree, Group, Badge, Table, Paper, Box, useTree, type TreeNodeData, type RenderTreeNodePayload } from '@mantine/core';
import { IconChevronRight, IconFolder, IconFile, IconBell } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const treeData: TreeNodeData[] = [
  {
    value: 'chat',
    label: 'Chat',
    children: [
      { value: 'channel_chat_general', label: '#general' },
      { value: 'channel_chat_incidents', label: '#incidents' },
      { value: 'channel_chat_releases', label: '#releases' },
    ],
  },
  {
    value: 'email',
    label: 'Email',
    children: [
      { value: 'channel_email_oncall', label: 'On-call list' },
      { value: 'channel_email_security', label: 'Security list' },
    ],
  },
  {
    value: 'pagerduty',
    label: 'PagerDuty',
    children: [
      { value: 'channel_pagerduty_critical', label: 'Critical' },
      { value: 'channel_pagerduty_noncritical', label: 'Non-critical' },
    ],
  },
];

const valueLabels: Record<string, string> = {
  channel_chat_general: 'Chat / #general',
  channel_chat_incidents: 'Chat / #incidents',
  channel_chat_releases: 'Chat / #releases',
  channel_email_oncall: 'Email / On-call list',
  channel_email_security: 'Email / Security list',
  channel_pagerduty_critical: 'PagerDuty / Critical',
  channel_pagerduty_noncritical: 'PagerDuty / Non-critical',
};

const leafValues = new Set(Object.keys(valueLabels));

// Sample alert data for clutter
const alertsData = [
  { id: 1, name: 'High CPU usage', severity: 'Warning', time: '5m ago' },
  { id: 2, name: 'Database connection failed', severity: 'Critical', time: '12m ago' },
  { id: 3, name: 'SSL cert expiring', severity: 'Info', time: '1h ago' },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [primaryChannel, setPrimaryChannel] = useState<string | null>('channel_email_oncall');
  const [secondaryChannel, setSecondaryChannel] = useState<string | null>(null);
  const [tertiaryChannel, setTertiaryChannel] = useState<string | null>('channel_chat_general');
  const [openedField, setOpenedField] = useState<'primary' | 'secondary' | 'tertiary' | null>(null);
  const treePrimary = useTree();
  const treeSecondary = useTree();
  const treeTertiary = useTree();
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && secondaryChannel === 'channel_chat_incidents') {
      successFired.current = true;
      onSuccess();
    }
  }, [secondaryChannel, onSuccess]);

  const createRenderNode = (setValue: (val: string) => void, closePopover: () => void) => {
    return ({ node, expanded, hasChildren, elementProps, tree: treeController }: RenderTreeNodePayload) => (
      <Group
        gap={5}
        {...elementProps}
        onClick={(e) => {
          if (hasChildren) {
            treeController.toggleExpanded(node.value);
          } else if (leafValues.has(node.value)) {
            setValue(node.value);
            closePopover();
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
  };

  const renderChannelSelect = (
    label: string,
    value: string | null,
    setValue: (v: string) => void,
    fieldKey: 'primary' | 'secondary' | 'tertiary',
    treeInstance: ReturnType<typeof useTree>,
    testId: string
  ) => (
    <div style={{ marginBottom: 12 }}>
      <Text size="xs" fw={500} mb={4}>{label}</Text>
      <Popover
        opened={openedField === fieldKey}
        onChange={(o) => setOpenedField(o ? fieldKey : null)}
        position="bottom-start"
        width={280}
      >
        <Popover.Target>
          <TextInput
            size="xs"
            placeholder="Select a channel"
            value={value ? valueLabels[value] || value : ''}
            onClick={() => setOpenedField(fieldKey)}
            readOnly
            rightSection={<IconChevronRight size={14} />}
            data-testid={testId}
          />
        </Popover.Target>
        <Popover.Dropdown>
          <Tree
            data={treeData}
            tree={treeInstance}
            renderNode={createRenderNode(setValue, () => setOpenedField(null))}
          />
        </Popover.Dropdown>
      </Popover>
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 280px', gap: 16, maxWidth: 900 }}>
      {/* Sidebar (clutter) */}
      <Paper shadow="xs" p="sm" withBorder>
        <Text size="sm" fw={500} mb="sm">Filters</Text>
        <Group gap={4} mb="xs">
          <Badge size="sm" variant="light">All</Badge>
          <Badge size="sm" variant="outline">Critical</Badge>
          <Badge size="sm" variant="outline">Warning</Badge>
        </Group>
        <Text size="xs" c="dimmed" mt="md">Last updated: 2 min ago</Text>
      </Paper>

      {/* Main content */}
      <Box>
        {/* Reference card */}
        <Card shadow="sm" padding="sm" radius="md" withBorder mb="md" data-testid="reference-card">
          <Text size="xs" fw={500} c="dimmed" mb="xs">Reference</Text>
          <Paper
            p="xs"
            style={{ background: '#f5f5f5', fontFamily: 'monospace', fontSize: 11 }}
            data-testid="reference-card-highlight-1"
          >
            <div style={{ color: '#666' }}>▼ Chat</div>
            <div style={{ color: '#666', marginLeft: 12 }}>#general</div>
            <div style={{ background: '#228be6', color: '#fff', marginLeft: 12, padding: '2px 6px', borderRadius: 2 }}>
              #incidents
            </div>
            <div style={{ color: '#666', marginLeft: 12 }}>#releases</div>
          </Paper>
          <Text size="xs" c="dimmed" mt="xs">Match the highlighted channel</Text>
        </Card>

        {/* Alerts table (clutter) */}
        <Card shadow="sm" padding="sm" radius="md" withBorder>
          <Text size="sm" fw={500} mb="xs">Recent alerts</Text>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ fontSize: 11 }}>Alert</Table.Th>
                <Table.Th style={{ fontSize: 11 }}>Severity</Table.Th>
                <Table.Th style={{ fontSize: 11 }}>Time</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {alertsData.map((alert) => (
                <Table.Tr key={alert.id}>
                  <Table.Td style={{ fontSize: 11 }}>{alert.name}</Table.Td>
                  <Table.Td style={{ fontSize: 11 }}>{alert.severity}</Table.Td>
                  <Table.Td style={{ fontSize: 11 }}>{alert.time}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </Box>

      {/* Notification channels widget */}
      <Card shadow="sm" padding="sm" radius="md" withBorder data-testid="tree-select-card">
        <Group gap="xs" mb="md">
          <IconBell size={16} />
          <Text size="sm" fw={500}>Notification channels</Text>
        </Group>

        {renderChannelSelect('Primary channel', primaryChannel, setPrimaryChannel, 'primary', treePrimary, 'tree-select-primary-channel')}
        {renderChannelSelect('Secondary channel', secondaryChannel, setSecondaryChannel, 'secondary', treeSecondary, 'tree-select-secondary-channel')}
        {renderChannelSelect('Tertiary channel', tertiaryChannel, setTertiaryChannel, 'tertiary', treeTertiary, 'tree-select-tertiary-channel')}
      </Card>
    </div>
  );
}
