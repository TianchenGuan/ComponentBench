'use client';

/**
 * checkbox_group-antd-T08: Enable four permissions in a long list
 *
 * Scene: light theme; compact spacing; a settings panel anchored toward the top-right of the viewport.
 * Ant Design settings-style page with compact spacing. The main content is anchored toward the top-right.
 * A settings panel titled "Team permissions" contains:
 * - A non-interactive breadcrumb row (Team → Permissions)
 * - Two small input fields (disabled) for Team name and Role name (distractors)
 * - The target: a Checkbox.Group labeled "Permissions"
 * The "Permissions" Checkbox.Group is inside a scrollable container with ~20 permission options.
 * Initial state: three unrelated permissions checked (View dashboard, Create tasks, View invoices).
 * Success: Exactly View analytics, Export reports, Manage members, Edit settings are checked.
 */

import React, { useState, useEffect } from 'react';
import { Card, Checkbox, Typography, Input, Breadcrumb } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Title } = Typography;

const permissionOptions = [
  'View dashboard', 'View analytics', 'Edit settings', 'Manage members',
  'Invite members', 'Remove members', 'Create projects', 'Delete projects',
  'Archive projects', 'Create tasks', 'Delete tasks', 'Export reports',
  'Import data', 'Manage billing', 'View invoices', 'Edit invoices',
  'Manage API keys', 'View logs', 'Manage webhooks', 'Admin access'
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['View dashboard', 'Create tasks', 'View invoices']);

  useEffect(() => {
    const targetSet = new Set(['View analytics', 'Export reports', 'Manage members', 'Edit settings']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card style={{ width: 450 }}>
      <Title level={4}>Team permissions</Title>
      
      {/* Breadcrumb (non-interactive) */}
      <Breadcrumb 
        items={[{ title: 'Team' }, { title: 'Permissions' }]}
        style={{ marginBottom: 16 }}
      />
      
      {/* Distractor inputs */}
      <div style={{ marginBottom: 12 }}>
        <Text style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Team name</Text>
        <Input value="Engineering" disabled size="small" style={{ maxWidth: 200 }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <Text style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Role name</Text>
        <Input value="Developer" disabled size="small" style={{ maxWidth: 200 }} />
      </div>
      
      {/* Target: Permissions checkbox group in scrollable container */}
      <div>
        <Text strong style={{ display: 'block', marginBottom: 12 }}>Permissions</Text>
        <div style={{ 
          maxHeight: 250, 
          overflowY: 'auto', 
          padding: 12,
          border: '1px solid #e8e8e8',
          borderRadius: 6
        }}>
          <Checkbox.Group
            data-testid="cg-permissions"
            value={selected}
            onChange={(checkedValues) => setSelected(checkedValues as string[])}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {permissionOptions.map(option => (
                <Checkbox key={option} value={option} style={{ fontSize: 13 }}>
                  {option}
                </Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        </div>
      </div>
    </Card>
  );
}
