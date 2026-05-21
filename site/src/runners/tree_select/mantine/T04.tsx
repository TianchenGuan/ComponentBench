'use client';

/**
 * tree_select-mantine-T04: Select Laptops policy (deep path, top-left)
 *
 * Layout: isolated_card anchored near the top-left of the viewport (non-center placement).
 * Target component: composite TreeSelect labeled "Policy"; initially empty.
 * Popover contents: Mantine Tree (no search input).
 * Tree data (depth=4):
 *   - Handbook → IT → Devices → (Laptops, Phones), Accounts → (SSO, Passwords)
 *   - Handbook → Security → Access → (VPN, SSH keys)
 *
 * Success: The Policy tree selector committed selection equals leaf path
 * [Handbook, IT, Devices, Laptops] with value 'kb_handbook_it_devices_laptops'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, TextInput, Popover, Tree, Group, useTree, type TreeNodeData, type RenderTreeNodePayload } from '@mantine/core';
import { IconChevronRight, IconFolder, IconFile } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const treeData: TreeNodeData[] = [
  {
    value: 'handbook',
    label: 'Handbook',
    children: [
      {
        value: 'handbook/it',
        label: 'IT',
        children: [
          {
            value: 'handbook/it/devices',
            label: 'Devices',
            children: [
              { value: 'kb_handbook_it_devices_laptops', label: 'Laptops' },
              { value: 'kb_handbook_it_devices_phones', label: 'Phones' },
            ],
          },
          {
            value: 'handbook/it/accounts',
            label: 'Accounts',
            children: [
              { value: 'kb_handbook_it_accounts_sso', label: 'SSO' },
              { value: 'kb_handbook_it_accounts_passwords', label: 'Passwords' },
            ],
          },
        ],
      },
      {
        value: 'handbook/security',
        label: 'Security',
        children: [
          {
            value: 'handbook/security/access',
            label: 'Access',
            children: [
              { value: 'kb_handbook_security_access_vpn', label: 'VPN' },
              { value: 'kb_handbook_security_access_ssh', label: 'SSH keys' },
            ],
          },
        ],
      },
    ],
  },
];

const valueLabels: Record<string, string> = {
  kb_handbook_it_devices_laptops: 'Handbook / IT / Devices / Laptops',
  kb_handbook_it_devices_phones: 'Handbook / IT / Devices / Phones',
  kb_handbook_it_accounts_sso: 'Handbook / IT / Accounts / SSO',
  kb_handbook_it_accounts_passwords: 'Handbook / IT / Accounts / Passwords',
  kb_handbook_security_access_vpn: 'Handbook / Security / Access / VPN',
  kb_handbook_security_access_ssh: 'Handbook / Security / Access / SSH keys',
};

const leafValues = new Set(Object.keys(valueLabels));

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);
  const tree = useTree();
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && value === 'kb_handbook_it_devices_laptops') {
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
        } else if (leafValues.has(node.value)) {
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
      <Text fw={500} size="lg" mb="md">Policy page</Text>
      <Text size="sm" fw={500} mb={4}>Policy</Text>
      <Popover opened={opened} onChange={setOpened} position="bottom-start" width={350}>
        <Popover.Target>
          <TextInput
            placeholder="Select a policy page"
            value={value ? valueLabels[value] || value : ''}
            onClick={() => setOpened(true)}
            readOnly
            rightSection={<IconChevronRight size={16} style={{ transform: opened ? 'rotate(90deg)' : 'none' }} />}
            data-testid="tree-select-policy"
          />
        </Popover.Target>
        <Popover.Dropdown>
          <Tree
            data={treeData}
            tree={tree}
            renderNode={renderNode}
            data-testid="tree-view"
          />
        </Popover.Dropdown>
      </Popover>
      <Text size="xs" c="dimmed" mt="xs">Link to internal documentation.</Text>
    </Card>
  );
}
