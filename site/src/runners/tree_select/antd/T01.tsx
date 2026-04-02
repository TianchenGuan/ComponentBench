'use client';

/**
 * tree_select-antd-T01: Pick Web (basic single select)
 *
 * Layout: isolated_card centered in the viewport with a short title "Team setup".
 * Target component: one AntD TreeSelect labeled "Department" with placeholder "Please select". It is empty on load.
 * Interaction: clicking the input opens a dropdown containing a collapsible tree.
 * Tree data (moderate size, ~3 roots, ~20 total nodes):
 *   - Company
 *     - Engineering → Frontend → (Web, Mobile Web), Backend → (API, Data), QA
 *     - Sales → Americas → (USA, Canada), EMEA → (UK, Germany)
 *     - HR → (Recruiting, People Ops)
 * No search box is shown for this task (search disabled), and selecting a leaf closes the dropdown automatically.
 *
 * Success: The Department TreeSelect's committed selection is exactly the leaf node with canonical path
 * [Company, Engineering, Frontend, Web] with value 'dept_company_eng_frontend_web'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, TreeSelect } from 'antd';
import type { TaskComponentProps } from '../types';

const treeData = [
  {
    value: 'company',
    title: 'Company',
    selectable: false,
    children: [
      {
        value: 'company_engineering',
        title: 'Engineering',
        selectable: false,
        children: [
          {
            value: 'company_eng_frontend',
            title: 'Frontend',
            selectable: false,
            children: [
              { value: 'dept_company_eng_frontend_web', title: 'Web' },
              { value: 'dept_company_eng_frontend_mobileweb', title: 'Mobile Web' },
            ],
          },
          {
            value: 'company_eng_backend',
            title: 'Backend',
            selectable: false,
            children: [
              { value: 'dept_company_eng_backend_api', title: 'API' },
              { value: 'dept_company_eng_backend_data', title: 'Data' },
            ],
          },
          { value: 'dept_company_eng_qa', title: 'QA' },
        ],
      },
      {
        value: 'company_sales',
        title: 'Sales',
        selectable: false,
        children: [
          {
            value: 'company_sales_americas',
            title: 'Americas',
            selectable: false,
            children: [
              { value: 'dept_company_sales_americas_usa', title: 'USA' },
              { value: 'dept_company_sales_americas_ca', title: 'Canada' },
            ],
          },
          {
            value: 'company_sales_emea',
            title: 'EMEA',
            selectable: false,
            children: [
              { value: 'region_company_sales_emea_uk', title: 'UK' },
              { value: 'region_company_sales_emea_de', title: 'Germany' },
            ],
          },
        ],
      },
      {
        value: 'company_hr',
        title: 'HR',
        selectable: false,
        children: [
          { value: 'dept_company_hr_recruiting', title: 'Recruiting' },
          { value: 'dept_company_hr_peopleops', title: 'People Ops' },
        ],
      },
    ],
  },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | undefined>(undefined);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && value === 'dept_company_eng_frontend_web') {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Team setup" style={{ width: 450 }} data-testid="tree-select-card">
      <div style={{ marginBottom: 8 }}>
        <label htmlFor="department-select" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Department
        </label>
        <TreeSelect
          id="department-select"
          data-testid="tree-select-department"
          style={{ width: '100%' }}
          value={value}
          onChange={(val) => setValue(val)}
          treeData={treeData}
          placeholder="Please select"
          showSearch={false}
          treeDefaultExpandAll={false}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        />
      </div>
    </Card>
  );
}
