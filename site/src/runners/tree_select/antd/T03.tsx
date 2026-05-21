'use client';

/**
 * tree_select-antd-T03: Clear Manager selection
 *
 * Layout: isolated_card centered titled "Approval chain".
 * Target component: one AntD TreeSelect labeled "Manager".
 * Initial state: pre-selected value is "Company / HR / People Ops" (shown in the input).
 * Configuration: `allowClear` is enabled so a clear (×) control appears.
 * Tree data (small, ~10 nodes).
 *
 * Success: The Manager TreeSelect has no selected value (empty selection).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, TreeSelect, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const treeData = [
  {
    value: 'company',
    title: 'Company',
    selectable: false,
    children: [
      {
        value: 'company_hr',
        title: 'HR',
        selectable: false,
        children: [
          { value: 'manager_company_hr_recruiting', title: 'Recruiting' },
          { value: 'manager_company_hr_peopleops', title: 'People Ops' },
        ],
      },
      {
        value: 'company_engineering',
        title: 'Engineering',
        selectable: false,
        children: [
          { value: 'manager_company_eng_frontend', title: 'Frontend' },
          { value: 'manager_company_eng_backend', title: 'Backend' },
        ],
      },
      { value: 'manager_company_sales', title: 'Sales' },
    ],
  },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | undefined>('manager_company_hr_peopleops');
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && (value === undefined || value === null || value === '')) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Approval chain" style={{ width: 420 }} data-testid="tree-select-card">
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="manager-select" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Manager
        </label>
        <TreeSelect
          id="manager-select"
          data-testid="tree-select-manager"
          style={{ width: '100%' }}
          value={value}
          onChange={(val) => setValue(val)}
          treeData={treeData}
          placeholder="Select a manager"
          allowClear
          showSearch={false}
          treeDefaultExpandAll={false}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        />
      </div>
      <Text type="secondary">The selected manager will be notified for approval requests.</Text>
    </Card>
  );
}
