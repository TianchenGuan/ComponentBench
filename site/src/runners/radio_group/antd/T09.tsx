'use client';

/**
 * radio_group-antd-T09: Permissions table: set Marketing access to Edit
 *
 * A table_cell layout is shown in the center of the viewport: an Ant Design Table titled "Permissions".
 * The table has three rows labeled: Sales, Marketing, Support. One column is "Data access".
 * In each row's "Data access" cell there is an inline Radio.Group with three options: View, Edit, Admin.
 * The per-row groups share the same styling and appear directly next to each other in a dense table layout.
 * Initial state:
 * - Sales: View
 * - Marketing: View
 * - Support: Admin
 * Changing a row's radio selection shows an inline "Saved" tag in that same row after a brief spinner; there is no global Save button.
 * Other table controls (sortable column headers and a Search input above the table) are present as distractors but not required.
 *
 * Success: In the instance corresponding to "Marketing — Data access", the selected value equals "edit" (label "Edit").
 */

import React, { useState } from 'react';
import { Card, Table, Radio, Input, Tag, Spin } from 'antd';
import type { TaskComponentProps } from '../types';

interface RowData {
  key: string;
  department: string;
  access: string;
  saving: boolean;
  saved: boolean;
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [data, setData] = useState<RowData[]>([
    { key: 'sales', department: 'Sales', access: 'view', saving: false, saved: false },
    { key: 'marketing', department: 'Marketing', access: 'view', saving: false, saved: false },
    { key: 'support', department: 'Support', access: 'admin', saving: false, saved: false },
  ]);

  const handleAccessChange = (key: string, value: string) => {
    setData(prev => prev.map(row => 
      row.key === key 
        ? { ...row, access: value, saving: true, saved: false }
        : row
    ));

    setTimeout(() => {
      setData(prev => prev.map(row => 
        row.key === key 
          ? { ...row, saving: false, saved: true }
          : row
      ));

      if (key === 'marketing' && value === 'edit') {
        onSuccess();
      }

      setTimeout(() => {
        setData(prev => prev.map(row => 
          row.key === key 
            ? { ...row, saved: false }
            : row
        ));
      }, 2000);
    }, 300);
  };

  const columns = [
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      sorter: true,
    },
    {
      title: 'Data access',
      key: 'access',
      render: (record: RowData) => (
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          data-row-id={record.key}
          data-instance-label={`${record.department} — Data access`}
        >
          <Radio.Group
            data-canonical-type="radio_group"
            data-selected-value={record.access}
            value={record.access}
            onChange={e => handleAccessChange(record.key, e.target.value)}
            size="small"
          >
            <Radio value="view">View</Radio>
            <Radio value="edit">Edit</Radio>
            <Radio value="admin">Admin</Radio>
          </Radio.Group>
          {record.saving && <Spin size="small" />}
          {record.saved && <Tag color="green">Saved</Tag>}
        </div>
      ),
    },
  ];

  return (
    <Card title="Permissions" style={{ width: 600 }}>
      <Input.Search 
        placeholder="Search departments..." 
        style={{ marginBottom: 16 }}
      />
      <Table 
        dataSource={data} 
        columns={columns} 
        pagination={false}
        size="middle"
      />
    </Card>
  );
}
