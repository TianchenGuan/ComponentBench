'use client';

/**
 * menu-antd-T10: Choose a sort option and apply it
 * 
 * Scene: theme=dark, spacing=comfortable, layout=isolated_card, placement=bottom_left, scale=default, instances=1.
 *
 * Component:
 * - A menu-like vertical list titled "Sort".
 * - The list behaves like a single-choice menu (radio semantics): only one option can be chosen at a time.
 * - Under the list is a small footer row with two buttons: "Apply" and "Cancel".
 *
 * Options (top to bottom):
 * - Name (currently applied)
 * - Last updated
 * - Priority
 *
 * State model / feedback:
 * - Selecting an option changes a "Pending selection" line immediately.
 * - The "Applied sort" line updates ONLY after pressing "Apply".
 * - Pressing "Cancel" discards the pending choice and restores the applied sort.
 *
 * Success: The committed/applied sort value equals "Last updated" (require_confirm=true with Apply).
 */

import React, { useState, useEffect } from 'react';
import { Menu, Card, Button, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const sortOptions = [
  { key: 'Name', label: 'Name' },
  { key: 'Last updated', label: 'Last updated' },
  { key: 'Priority', label: 'Priority' },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [appliedSort, setAppliedSort] = useState<string>('Name');
  const [pendingSort, setPendingSort] = useState<string>('Name');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (appliedSort === 'Last updated' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [appliedSort, successTriggered, onSuccess]);

  const handleApply = () => {
    setAppliedSort(pendingSort);
  };

  const handleCancel = () => {
    setPendingSort(appliedSort);
  };

  return (
    <Card 
      style={{ width: 320, background: '#1f1f1f', borderColor: '#303030' }}
      styles={{ body: { padding: 16 } }}
    >
      {/* Explanatory text (non-interactive clutter) */}
      <div style={{ marginBottom: 16, fontSize: 12, color: '#888', lineHeight: 1.5 }}>
        Choose how to sort your items. Click Apply to confirm your selection.
      </div>

      <div style={{ fontSize: 12, color: '#888', marginBottom: 8, fontWeight: 500 }}>
        Sort
      </div>
      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={[pendingSort]}
        items={sortOptions}
        onClick={({ key }) => setPendingSort(key)}
        style={{ borderRight: 'none', background: 'transparent' }}
        data-testid="menu-sort"
      />

      {/* Footer with Apply/Cancel */}
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #303030', display: 'flex', justifyContent: 'flex-end' }}>
        <Space>
          <Button onClick={handleCancel} data-testid="btn-cancel">Cancel</Button>
          <Button type="primary" onClick={handleApply} data-testid="btn-apply">Apply</Button>
        </Space>
      </div>

      {/* Status lines */}
      <div style={{ marginTop: 16, fontSize: 12, color: '#888' }}>
        <div>Pending: <strong style={{ color: '#fff' }} data-testid="pending-sort">{pendingSort}</strong></div>
        <div>Applied: <strong style={{ color: '#52c41a' }} data-testid="applied-sort">{appliedSort}</strong></div>
      </div>
    </Card>
  );
}
