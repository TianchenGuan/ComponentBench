'use client';

/**
 * toggle_button_group_multi-antd-T06: Set permissions in table row
 *
 * Layout: table_cell centered in the viewport.
 *
 * The page shows a compact "Projects" management table with three rows:
 * - Project Alpha
 * - Project Beta
 * - Project Gamma
 *
 * Columns include: Project, Owner, Permissions, Updated.
 *
 * In the "Permissions" column, each row contains its own multi-select toggle group 
 * (AntD checkbox group styled as small buttons) with the same three options:
 * - View
 * - Edit
 * - Admin
 *
 * Initial states:
 * - Project Alpha: View selected.
 * - Project Beta: View and Admin selected.
 * - Project Gamma: View and Edit selected.
 *
 * Distractors / clutter (medium):
 * - A search input above the table ("Search projects…").
 * - A "New project" button.
 * - Column sort icons.
 *
 * No global Apply/Save step; changing a row updates immediately.
 *
 * Success: Project Beta → Permissions: View + Edit (require_correct_instance: true)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Input, Button, Checkbox } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const PERMISSIONS = ['View', 'Edit', 'Admin'];
const TARGET_SET = new Set(['View', 'Edit']);

interface ProjectRow {
  key: string;
  project: string;
  owner: string;
  permissions: string[];
  updated: string;
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const [alphaPerms, setAlphaPerms] = useState<string[]>(['View']);
  const [betaPerms, setBetaPerms] = useState<string[]>(['View', 'Admin']);
  const [gammaPerms, setGammaPerms] = useState<string[]>(['View', 'Edit']);
  const successFiredRef = useRef(false);

  // Initial states for non-target rows (must remain unchanged)
  const alphaInitial = useRef(['View']);
  const gammaInitial = useRef(['View', 'Edit']);

  useEffect(() => {
    if (successFiredRef.current) return;

    // Check if beta has the target set
    const betaSet = new Set(betaPerms);
    const betaMatches = betaSet.size === TARGET_SET.size && 
      Array.from(TARGET_SET).every(v => betaSet.has(v));

    // Check if non-target rows are unchanged
    const alphaUnchanged = JSON.stringify([...alphaPerms].sort()) === JSON.stringify([...alphaInitial.current].sort());
    const gammaUnchanged = JSON.stringify([...gammaPerms].sort()) === JSON.stringify([...gammaInitial.current].sort());

    if (betaMatches && alphaUnchanged && gammaUnchanged) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [betaPerms, alphaPerms, gammaPerms, onSuccess]);

  const renderPermissions = (perms: string[], setPerms: (v: string[]) => void, rowKey: string) => (
    <Checkbox.Group
      value={perms}
      onChange={(values) => setPerms(values as string[])}
      style={{ display: 'flex', gap: 4 }}
      data-testid={`permissions-${rowKey}`}
      data-row={rowKey}
    >
      {PERMISSIONS.map(perm => (
        <Checkbox
          key={perm}
          value={perm}
          style={{
            padding: '2px 8px',
            border: '1px solid #d9d9d9',
            borderRadius: 4,
            background: perms.includes(perm) ? '#1677ff' : '#fff',
            color: perms.includes(perm) ? '#fff' : '#333',
            fontSize: 12,
          }}
          data-testid={`${rowKey}-perm-${perm.toLowerCase()}`}
        >
          {perm}
        </Checkbox>
      ))}
    </Checkbox.Group>
  );

  const columns = [
    { title: 'Project', dataIndex: 'project', key: 'project', sorter: true },
    { title: 'Owner', dataIndex: 'owner', key: 'owner', sorter: true },
    { 
      title: 'Permissions', 
      dataIndex: 'permissions', 
      key: 'permissions',
      render: (_: string[], record: ProjectRow) => {
        if (record.key === 'alpha') return renderPermissions(alphaPerms, setAlphaPerms, 'Project Alpha');
        if (record.key === 'beta') return renderPermissions(betaPerms, setBetaPerms, 'Project Beta');
        if (record.key === 'gamma') return renderPermissions(gammaPerms, setGammaPerms, 'Project Gamma');
        return null;
      },
    },
    { title: 'Updated', dataIndex: 'updated', key: 'updated', sorter: true },
  ];

  const data: ProjectRow[] = [
    { key: 'alpha', project: 'Project Alpha', owner: 'Alice', permissions: alphaPerms, updated: '2 days ago' },
    { key: 'beta', project: 'Project Beta', owner: 'Bob', permissions: betaPerms, updated: '1 hour ago' },
    { key: 'gamma', project: 'Project Gamma', owner: 'Carol', permissions: gammaPerms, updated: '5 min ago' },
  ];

  return (
    <Card title="Projects" style={{ width: 700 }}>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <Input 
          placeholder="Search projects…" 
          prefix={<SearchOutlined />} 
          style={{ width: 200 }}
          data-testid="search-projects"
        />
        <Button type="primary" icon={<PlusOutlined />} data-testid="new-project-button">
          New project
        </Button>
      </div>
      <div style={{ marginBottom: 8, color: '#666', fontSize: 12 }}>
        Set Project Beta permissions to View + Edit.
      </div>
      <Table 
        columns={columns} 
        dataSource={data} 
        pagination={false}
        size="small"
        data-testid="projects-table"
      />
    </Card>
  );
}
