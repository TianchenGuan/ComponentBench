'use client';

/**
 * listbox_multi-antd-T04: Select all alert types
 *
 * Layout: isolated_card centered titled "Alert preferences".
 * Target component: a Checkbox.Group listbox with a master checkbox labeled "Select all" above the list.
 * Options in the list (5): Security alerts, Billing alerts, Product updates, Weekly summary, Incident notifications.
 * Initial state: none selected; the master checkbox is unchecked.
 * No overlays or scrolling. A live counter below the list shows "Selected: N of 5".
 *
 * Success: The target listbox has all 5 items selected.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Checkbox, Space, Typography, Divider } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const { Text } = Typography;

const options = [
  'Security alerts',
  'Billing alerts',
  'Product updates',
  'Weekly summary',
  'Incident notifications',
];
const targetSet = options; // All items

export default function T04({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(selected, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [selected, onSuccess]);

  const onSelectAll = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setSelected([...options]);
    } else {
      setSelected([]);
    }
  };

  const isAllSelected = selected.length === options.length;
  const isIndeterminate = selected.length > 0 && selected.length < options.length;

  return (
    <Card title="Alert preferences" style={{ width: 400 }}>
      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        Alert types (you can use Select all).
      </Text>
      <Checkbox
        indeterminate={isIndeterminate}
        onChange={onSelectAll}
        checked={isAllSelected}
        style={{ marginBottom: 8 }}
      >
        Select all
      </Checkbox>
      <Divider style={{ margin: '8px 0' }} />
      <Checkbox.Group
        data-testid="listbox-alert-types"
        value={selected}
        onChange={(values) => setSelected(values as string[])}
        style={{ width: '100%' }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          {options.map((opt) => (
            <Checkbox key={opt} value={opt} data-value={opt}>
              {opt}
            </Checkbox>
          ))}
        </Space>
      </Checkbox.Group>
      <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
        Selected: {selected.length} of {options.length}
      </Text>
    </Card>
  );
}
