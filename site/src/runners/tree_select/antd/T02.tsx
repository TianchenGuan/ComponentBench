'use client';

/**
 * tree_select-antd-T02: Search for Germany (search + select)
 *
 * Layout: isolated_card centered with the heading "Routing rules".
 * Target component: one AntD TreeSelect labeled "Sales region"; it starts empty.
 * Configuration: search is enabled. Typing filters tree nodes by their labels.
 * Tree data (same "Company" hierarchy as in T01). The relevant branch is Company → Sales → EMEA → Germany.
 * Distractors: there is also an adjacent non-interactive paragraph describing the rule.
 *
 * Success: The Sales region TreeSelect's committed selection is exactly the leaf node with
 * canonical path [Company, Sales, EMEA, Germany] with value 'region_company_sales_emea_de'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, TreeSelect, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Paragraph } = Typography;

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
              { value: 'region_company_sales_americas_usa', title: 'USA' },
              { value: 'region_company_sales_americas_ca', title: 'Canada' },
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

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | undefined>(undefined);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && value === 'region_company_sales_emea_de') {
      successFired.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Routing rules" style={{ width: 480 }} data-testid="tree-select-card">
      <Paragraph type="secondary" style={{ marginBottom: 16 }}>
        Configure the default sales region for incoming leads based on geography.
      </Paragraph>
      <div>
        <label htmlFor="sales-region-select" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Sales region
        </label>
        <TreeSelect
          id="sales-region-select"
          data-testid="tree-select-sales-region"
          style={{ width: '100%' }}
          value={value}
          onChange={(val) => setValue(val)}
          treeData={treeData}
          placeholder="Select a region"
          showSearch={true}
          treeNodeFilterProp="title"
          treeDefaultExpandAll={false}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        />
      </div>
    </Card>
  );
}
