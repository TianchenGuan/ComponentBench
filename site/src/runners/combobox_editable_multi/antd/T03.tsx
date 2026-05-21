'use client';

/**
 * combobox_editable_multi-antd-T03: Clear alert labels
 *
 * Centered card titled "Alerts". It contains one Ant Design Select in tags mode with a visible clear (×) control.
 * - Label: "Alert labels"
 * - Initial selected tags: "Urgent", "Pager", "Customer"
 * - allowClear is enabled, so a small clear icon appears on the right side of the input when there is at least one tag.
 * Behavior:
 * - Clicking the clear icon removes all selected tags at once.
 * - Individual tags are also removable via small close icons on each pill.
 * No additional steps (no Save button) are required.
 *
 * Success: Selected values equal [] (empty).
 */

import React, { useState, useEffect } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const { Text } = Typography;

const options = [
  { value: 'Urgent', label: 'Urgent' },
  { value: 'Pager', label: 'Pager' },
  { value: 'Customer', label: 'Customer' },
  { value: 'Critical', label: 'Critical' },
  { value: 'Low', label: 'Low' },
];

const TARGET_SET: string[] = [];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>(['Urgent', 'Pager', 'Customer']);

  useEffect(() => {
    if (setsEqual(value, TARGET_SET)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Alerts" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Alert labels</Text>
      <Select
        data-testid="alert-labels"
        mode="tags"
        style={{ width: '100%' }}
        placeholder="Add alert labels"
        value={value}
        onChange={setValue}
        options={options}
        allowClear
      />
    </Card>
  );
}
