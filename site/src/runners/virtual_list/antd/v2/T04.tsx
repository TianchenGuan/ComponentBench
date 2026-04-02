'use client';

/**
 * virtual_list-antd-v2-T04
 * Permissions dialog: exact four-item set in dense list
 *
 * Modal flow with a dense virtualized checkbox list (~600 rows). Agent must
 * check exactly PERM-013, PERM-027, PERM-031, PERM-044 and click "Apply permissions".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Modal, Button, Checkbox, Typography } from 'antd';
import VirtualList from 'rc-virtual-list';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface PermItem { key: string; code: string; label: string; }

const permLabels = [
  'View reports', 'Edit reports', 'Export data', 'Manage users', 'View dashboards',
  'Create dashboards', 'Delete dashboards', 'View report templates', 'Edit report templates',
  'Manage billing', 'Audit logs', 'API access', 'Webhook management', 'SSO config',
  'Role management', 'View incidents', 'Manage incidents', 'Data import', 'Schema edit',
  'Bulk operations',
];

function buildPerms(): PermItem[] {
  return Array.from({ length: 600 }, (_, i) => ({
    key: `perm-${String(i).padStart(3, '0')}`,
    code: `PERM-${String(i).padStart(3, '0')}`,
    label: permLabels[i % permLabels.length],
  }));
}

const perms = buildPerms();
const TARGET_KEYS = new Set(['perm-013', 'perm-027', 'perm-031', 'perm-044']);

export default function T04({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);
  const successRef = useRef(false);

  useEffect(() => {
    if (successRef.current) return;
    if (saved && checked.size === TARGET_KEYS.size && Array.from(TARGET_KEYS).every(k => checked.has(k))) {
      successRef.current = true;
      onSuccess();
    }
  }, [saved, checked, onSuccess]);

  const toggle = (key: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
    setSaved(false);
  };

  const handleApply = () => setSaved(true);

  return (
    <div style={{ padding: 16, maxWidth: 480 }}>
      <Card size="small" title="Role settings" style={{ marginBottom: 12 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>Configure permissions for this role.</Text>
      </Card>

      <Button onClick={() => { setOpen(true); setChecked(new Set()); setSaved(false); }}>
        Edit permissions
      </Button>

      <Modal
        title="Edit permissions"
        open={open}
        onCancel={() => setOpen(false)}
        footer={
          <Button type="primary" onClick={handleApply}>Apply permissions</Button>
        }
        width={460}
      >
        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 6 }}>
          Selected: {checked.size}
        </Text>
        <div style={{ border: '1px solid #f0f0f0', borderRadius: 4 }}>
          <VirtualList data={perms} height={360} itemHeight={38} itemKey="key">
            {(item: PermItem) => (
              <div
                key={item.key}
                data-item-key={item.key}
                onClick={() => toggle(item.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 12px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #fafafa',
                  backgroundColor: checked.has(item.key) ? '#f6ffed' : 'transparent',
                  fontSize: 13,
                }}
              >
                <Checkbox checked={checked.has(item.key)} />
                <span>{item.code} {item.label}</span>
              </div>
            )}
          </VirtualList>
        </div>
      </Modal>
    </div>
  );
}
