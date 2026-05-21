'use client';

/**
 * tree_select-antd-T06: Set Backup office (2 instances)
 *
 * Layout: form_section centered, titled "Employee profile" with multiple fields.
 * Target components: TWO AntD TreeSelect components of the same type:
 *   1) "Primary office" (pre-selected to "Company / Sales / Americas / USA")
 *   2) "Backup office" (empty; placeholder "Select an office")  ← TARGET
 * Both TreeSelects use the same location tree.
 * Clutter (low): the form also includes two regular text inputs ("Name", "Title") and a disabled "Save" button.
 *
 * Success: The TreeSelect labeled "Backup office" has committed selection path
 * [Company, Sales, Americas, Canada] with value 'office_company_sales_americas_ca'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, TreeSelect, Input, Button, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const treeData = [
  {
    value: 'company',
    title: 'Company',
    selectable: false,
    children: [
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
              { value: 'office_company_sales_americas_usa', title: 'USA' },
              { value: 'office_company_sales_americas_ca', title: 'Canada' },
            ],
          },
          {
            value: 'company_sales_emea',
            title: 'EMEA',
            selectable: false,
            children: [
              { value: 'office_company_sales_emea_uk', title: 'UK' },
              { value: 'office_company_sales_emea_de', title: 'Germany' },
            ],
          },
        ],
      },
    ],
  },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [primaryOffice, setPrimaryOffice] = useState<string | undefined>('office_company_sales_americas_usa');
  const [backupOffice, setBackupOffice] = useState<string | undefined>(undefined);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && backupOffice === 'office_company_sales_americas_ca') {
      successFired.current = true;
      onSuccess();
    }
  }, [backupOffice, onSuccess]);

  return (
    <Card title="Employee profile" style={{ width: 480 }} data-testid="tree-select-card">
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Name</label>
          <Input placeholder="Enter name" defaultValue="John Doe" />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Title</label>
          <Input placeholder="Enter title" defaultValue="Sales Representative" />
        </div>
        <div>
          <label htmlFor="primary-office" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
            Primary office
          </label>
          <TreeSelect
            id="primary-office"
            data-testid="tree-select-primary-office"
            style={{ width: '100%' }}
            value={primaryOffice}
            onChange={(val) => setPrimaryOffice(val)}
            treeData={treeData}
            placeholder="Select an office"
            showSearch={false}
            treeDefaultExpandAll={false}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          />
        </div>
        <div>
          <label htmlFor="backup-office" style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
            Backup office
          </label>
          <TreeSelect
            id="backup-office"
            data-testid="tree-select-backup-office"
            style={{ width: '100%' }}
            value={backupOffice}
            onChange={(val) => setBackupOffice(val)}
            treeData={treeData}
            placeholder="Select an office"
            showSearch={false}
            treeDefaultExpandAll={false}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          />
        </div>
        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
          <Button type="primary" disabled>Save</Button>
        </div>
      </Space>
    </Card>
  );
}
