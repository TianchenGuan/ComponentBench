'use client';

/**
 * virtual_list-antd-T09: Select an exact set in a compact virtualized permissions list
 *
 * Spacing mode: compact (reduced padding and smaller row height).
 * Layout: isolated AntD Card centered, titled "Role Permissions".
 * Target component: one virtualized checkbox list (height ~380px) with ~300 permission rows.
 * Row content: a small Checkbox + a code + label, e.g., "PERM-013 View reports".
 * Initial state: no permissions checked; list starts at the top.
 *
 * Success: Exactly permissions 013, 027, 031, 044, 048 are checked
 */

import React, { useState, useEffect } from 'react';
import { Card, Typography, Checkbox } from 'antd';
import VirtualList from 'rc-virtual-list';
import type { TaskComponentProps } from '../types';
import { selectionSetEquals } from '../types';

const { Text } = Typography;

interface PermissionItem {
  key: string;
  code: string;
  label: string;
}

// Generate 300 permissions
const generatePermissions = (): PermissionItem[] => {
  const labels = [
    'View reports', 'Edit reports', 'Export data', 'Manage users', 'Billing access',
    'View dashboard', 'Edit dashboard', 'Create templates', 'Delete templates', 'View audit log',
    'View report templates', 'Edit report templates', 'View analytics', 'Export analytics',
    'Manage teams', 'View settings', 'Edit settings', 'API access', 'Webhook access', 'Admin access'
  ];
  
  return Array.from({ length: 300 }, (_, i) => {
    const num = i + 1;
    return {
      key: `perm-${String(num).padStart(3, '0')}`,
      code: `PERM-${String(num).padStart(3, '0')}`,
      label: labels[i % labels.length],
    };
  });
};

const permissions = generatePermissions();
const TARGET_KEYS = ['perm-013', 'perm-027', 'perm-031', 'perm-044', 'perm-048'];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(new Set());

  const handleToggleCheck = (key: string) => {
    setCheckedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  // Check success condition
  useEffect(() => {
    if (selectionSetEquals(checkedKeys, TARGET_KEYS)) {
      onSuccess();
    }
  }, [checkedKeys, onSuccess]);

  return (
    <Card 
      title="Role Permissions" 
      style={{ width: 450 }}
      data-testid="vl-primary"
    >
      <div 
        style={{ 
          position: 'sticky', 
          top: 0, 
          backgroundColor: '#fff', 
          padding: '8px 0', 
          borderBottom: '1px solid #f0f0f0',
          marginBottom: 8,
          fontSize: 13,
          color: '#666',
          zIndex: 1,
        }}
      >
        Checked: {checkedKeys.size}
      </div>
      <div 
        style={{ 
          border: '1px solid #f0f0f0', 
          borderRadius: 4,
        }}
      >
        <VirtualList
          data={permissions}
          height={380}
          itemHeight={36}  // Compact row height
          itemKey="key"
        >
          {(item: PermissionItem) => {
            const isChecked = checkedKeys.has(item.key);
            return (
              <div
                key={item.key}
                data-item-key={item.key}
                aria-checked={isChecked}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 12px',  // Compact padding
                  borderBottom: '1px solid #f0f0f0',
                  gap: 8,
                  fontSize: 13,
                }}
              >
                <Checkbox
                  checked={isChecked}
                  onChange={() => handleToggleCheck(item.key)}
                  style={{ marginRight: 4 }}
                />
                <Text style={{ fontSize: 13 }}>{item.code} {item.label}</Text>
              </div>
            );
          }}
        </VirtualList>
      </div>
    </Card>
  );
}
