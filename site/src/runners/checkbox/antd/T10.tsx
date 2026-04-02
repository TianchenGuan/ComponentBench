'use client';

/**
 * checkbox-antd-T10: Uncheck visibility for Project Delta (table cell checkbox)
 *
 * Layout: table cell scene.
 * A card titled "Project visibility" contains an Ant Design Table with 4 rows and 2 columns:
 *   - Column 1: Project name (Alpha, Beta, Gamma, Delta)
 *   - Column 2: "Visible" (a checkbox in each row)
 * Initial state: all four "Visible" checkboxes are checked.
 * Task target: the checkbox in the row labeled "Project Delta" under the "Visible" column.
 * There is no Save/Apply button; the checkbox state updates immediately.
 * Clutter: table header, row striping, and other non-interactive text contribute to visual density.
 */

import React, { useState } from 'react';
import { Card, Table, Checkbox } from 'antd';
import type { TaskComponentProps } from '../types';

interface ProjectRow {
  key: string;
  name: string;
  visible: boolean;
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [projects, setProjects] = useState<ProjectRow[]>([
    { key: 'alpha', name: 'Project Alpha', visible: true },
    { key: 'beta', name: 'Project Beta', visible: true },
    { key: 'gamma', name: 'Project Gamma', visible: true },
    { key: 'delta', name: 'Project Delta', visible: true },
  ]);

  const handleVisibilityChange = (key: string, checked: boolean) => {
    setProjects(prev => 
      prev.map(p => p.key === key ? { ...p, visible: checked } : p)
    );
    
    // Success when Project Delta is unchecked
    if (key === 'delta' && !checked) {
      onSuccess();
    }
  };

  const columns = [
    {
      title: 'Project name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Visible',
      dataIndex: 'visible',
      key: 'visible',
      render: (visible: boolean, record: ProjectRow) => (
        <Checkbox
          checked={visible}
          onChange={(e) => handleVisibilityChange(record.key, e.target.checked)}
          data-testid={`row-${record.key}-visible-cb`}
        />
      ),
    },
  ];

  return (
    <Card title="Project visibility" style={{ width: 500 }}>
      <Table
        dataSource={projects}
        columns={columns}
        pagination={false}
        size="middle"
      />
    </Card>
  );
}
