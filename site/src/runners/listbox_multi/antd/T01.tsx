'use client';

/**
 * listbox_multi-antd-T01: Weekly report recipients
 *
 * Layout: isolated_card placed at the center of the viewport. The card title is "Weekly report settings".
 * Target component: a single multi-select listbox implemented as an Ant Design Checkbox.Group rendered in a vertical List.
 * Options (6 total) are shown as labeled checkboxes in one column: Sales, Marketing, Finance, Product, Support, HR.
 * Initial state: no options are selected.
 * No overlays, no scrolling. No other listboxes on the page.
 * Feedback: checkbox checkmarks update immediately; a small text line under the list shows "Selected: N" (updates live).
 *
 * Success: The target listbox has exactly these selected items (order does not matter): Sales, Product, Support.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Checkbox, Space, Typography } from 'antd';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const { Text } = Typography;

const options = ['Sales', 'Marketing', 'Finance', 'Product', 'Support', 'HR'];
const targetSet = ['Sales', 'Product', 'Support'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(selected, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card title="Weekly report settings" style={{ width: 400 }}>
      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        Report recipients (choose all that should receive the weekly report).
      </Text>
      <Checkbox.Group
        data-testid="listbox-report-recipients"
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
        Selected: {selected.length}
      </Text>
    </Card>
  );
}
