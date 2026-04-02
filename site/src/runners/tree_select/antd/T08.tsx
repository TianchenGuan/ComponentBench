'use client';

/**
 * tree_select-antd-T08: Strict check: select parent and leaf
 *
 * Theme/spacing: dark theme with compact spacing.
 * Layout: isolated_card centered titled "Incident notifications".
 * Target component: one AntD TreeSelect labeled "Teams to notify" configured for strict checkable multi-select:
 *   - `treeCheckable=true` shows checkboxes.
 *   - `treeCheckStrictly=true` means checking a parent does NOT automatically check/uncheck its children.
 *   - Search is disabled.
 * Tree data:
 *   - Company
 *     - Engineering → Frontend → (Web, Mobile Web), Backend → (API, Data)
 *     - Sales
 * Initial state: nothing selected.
 *
 * Success: Teams to notify selection set is exactly {Company/Engineering, Company/Engineering/Frontend/Web}.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, TreeSelect, ConfigProvider, theme } from 'antd';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const treeData = [
  {
    value: 'company',
    title: 'Company',
    children: [
      {
        value: 'team_company_engineering',
        title: 'Engineering',
        children: [
          {
            value: 'team_company_eng_frontend',
            title: 'Frontend',
            children: [
              { value: 'dept_company_eng_frontend_web', title: 'Web' },
              { value: 'dept_company_eng_frontend_mobileweb', title: 'Mobile Web' },
            ],
          },
          {
            value: 'team_company_eng_backend',
            title: 'Backend',
            children: [
              { value: 'dept_company_eng_backend_api', title: 'API' },
              { value: 'dept_company_eng_backend_data', title: 'Data' },
            ],
          },
        ],
      },
      { value: 'team_company_sales', title: 'Sales' },
    ],
  },
];

const TARGET_VALUES = ['team_company_engineering', 'dept_company_eng_frontend_web'];

export default function T08({ onSuccess }: TaskComponentProps) {
  // For treeCheckStrictly, value is an array of { value, label } objects
  const [value, setValue] = useState<{ value: string; label: React.ReactNode }[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    const selectedValues = value.map((v) => v.value);
    if (!successFired.current && setsEqual(selectedValues, TARGET_VALUES)) {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        components: {
          Card: {
            paddingLG: 16,
          },
        },
      }}
    >
      <Card
        title="Incident notifications"
        style={{ width: 480, background: '#1f1f1f' }}
        data-testid="tree-select-card"
      >
        <div>
          <label htmlFor="teams-notify" style={{ display: 'block', marginBottom: 4, fontWeight: 500, color: '#fff' }}>
            Teams to notify
          </label>
          <TreeSelect
            id="teams-notify"
            data-testid="tree-select-teams-notify"
            style={{ width: '100%' }}
            value={value}
            onChange={(val) => setValue(val as { value: string; label: React.ReactNode }[])}
            treeData={treeData}
            placeholder="Select teams"
            treeCheckable={true}
            treeCheckStrictly={true}
            showSearch={false}
            treeDefaultExpandAll={false}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            maxTagCount="responsive"
            labelInValue
          />
        </div>
      </Card>
    </ConfigProvider>
  );
}
