'use client';

/**
 * tree_view-mantine-T05: Select Daily Digest in Notification channels tree (2 instances)
 *
 * Layout: settings_panel with two columns and additional settings controls.
 * Left column: a card titled "Navigation" containing a Mantine Tree for sections (Profile, Security, Notifications).
 * Right column: a card titled "Notification channels" containing a second Mantine Tree (TARGET) listing channel options.
 *
 * Target tree structure:
 * • Email (value=notify/email)
 *   – Weekly summary (notify/email/weekly)
 *   – Daily digest (notify/email/daily) [TARGET]
 * • SMS (notify/sms) – Alerts
 *
 * Initial state: both trees are collapsed and have no selection. The page also includes toggle switches
 * and text inputs below the trees (clutter), but they are not required.
 * Both trees use the same styling, so the panel titles are needed to pick the correct instance.
 *
 * Success: In the Tree instance labeled 'Notification channels', the selected node value equals 'notify/email/daily'.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, Tree, Group, TextInput, Switch, Stack, Grid, useTree, type TreeNodeData, type RenderTreeNodePayload } from '@mantine/core';
import { IconChevronRight, IconFolder, IconFile, IconMail, IconDeviceMobile } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const navigationTreeData: TreeNodeData[] = [
  { value: 'nav/profile', label: 'Profile' },
  { value: 'nav/security', label: 'Security' },
  { value: 'nav/notifications', label: 'Notifications' },
];

const notificationTreeData: TreeNodeData[] = [
  {
    value: 'notify/email',
    label: 'Email',
    children: [
      { value: 'notify/email/weekly', label: 'Weekly summary' },
      { value: 'notify/email/daily', label: 'Daily digest' },
    ],
  },
  {
    value: 'notify/sms',
    label: 'SMS',
    children: [
      { value: 'notify/sms/alerts', label: 'Alerts' },
    ],
  },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const navTree = useTree({
    initialExpandedState: {},
    initialSelectedState: [],
  });
  
  const notifyTree = useTree({
    initialExpandedState: {},
    initialSelectedState: [],
  });
  
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && notifyTree.selectedState.includes('notify/email/daily')) {
      successFired.current = true;
      onSuccess();
    }
  }, [notifyTree.selectedState, onSuccess]);

  const renderNavNode = ({ node, expanded, hasChildren, elementProps, tree: treeController, selected }: RenderTreeNodePayload) => (
    <Group
      gap={5}
      {...elementProps}
      style={{
        ...elementProps.style,
        backgroundColor: selected ? '#e6f4ff' : undefined,
        borderRadius: 4,
        padding: '2px 4px',
        cursor: 'pointer',
      }}
    >
      {hasChildren && (
        <IconChevronRight
          size={16}
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
      {!hasChildren && <span style={{ width: 16 }} />}
      <IconFolder size={16} />
      <Text size="sm">{node.label}</Text>
    </Group>
  );

  const renderNotifyNode = ({ node, expanded, hasChildren, elementProps, tree: treeController, selected }: RenderTreeNodePayload) => (
    <Group
      gap={5}
      {...elementProps}
      style={{
        ...elementProps.style,
        backgroundColor: selected ? '#e6f4ff' : undefined,
        borderRadius: 4,
        padding: '2px 4px',
        cursor: 'pointer',
      }}
    >
      {hasChildren && (
        <IconChevronRight
          size={16}
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
      {!hasChildren && <span style={{ width: 16 }} />}
      {node.value.includes('email') ? <IconMail size={16} /> : <IconDeviceMobile size={16} />}
      <Text size="sm">{node.label}</Text>
    </Group>
  );

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 700 }} data-testid="settings-panel">
      <Text fw={500} size="lg" mb="md">Settings</Text>
      
      <Grid>
        <Grid.Col span={6}>
          <Card withBorder padding="md" data-testid="navigation-tree">
            <Text fw={500} size="md" mb="sm">Navigation</Text>
            <Tree
              data={navigationTreeData}
              tree={navTree}
              renderNode={renderNavNode}
              selectOnClick
            />
          </Card>
        </Grid.Col>
        
        <Grid.Col span={6}>
          <Card withBorder padding="md" data-testid="notification-channels-tree">
            <Text fw={500} size="md" mb="sm">Notification channels</Text>
            <Tree
              data={notificationTreeData}
              tree={notifyTree}
              renderNode={renderNotifyNode}
              selectOnClick
            />
          </Card>
        </Grid.Col>
      </Grid>
      
      {/* Clutter: additional settings controls (not required for task) */}
      <Stack mt="lg" gap="sm">
        <Switch label="Enable notifications" defaultChecked />
        <TextInput label="Email address" placeholder="user@example.com" />
      </Stack>
    </Card>
  );
}
