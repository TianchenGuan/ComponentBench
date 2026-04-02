'use client';

/**
 * checkbox_tristate-antd-T09: Dashboard: match Team visibility to Partial
 *
 * Layout: dashboard with multiple statistic cards and controls; the target area is anchored near the bottom-left.
 * There are three Ant Design tri-state checkboxes presented as compact "visibility" cards in a row:
 * - "Personal visibility"
 * - "Team visibility" (target)
 * - "Org visibility"
 *
 * Guidance is mixed:
 * - Above the row is a small read-only reference badge that shows an icon of the desired checkbox state
 *   and the text "Desired: Partial".
 *
 * Initial states:
 * - Personal visibility: Checked
 * - Team visibility: Unchecked
 * - Org visibility: Indeterminate
 *
 * Clutter: high. The dashboard also contains unrelated buttons ("Export", "Refresh"),
 * a search input, and a table preview beneath the cards.
 * 
 * Success: "Team visibility" is Indeterminate.
 */

import React, { useState } from 'react';
import { Card, Checkbox, Button, Input, Table, Space, Tag } from 'antd';
import { SearchOutlined, ExportOutlined, ReloadOutlined } from '@ant-design/icons';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [personalState, setPersonalState] = useState<TristateValue>('checked');
  const [teamState, setTeamState] = useState<TristateValue>('unchecked');
  const [orgState, setOrgState] = useState<TristateValue>('indeterminate');

  const handlePersonalClick = () => {
    setPersonalState(cycleTristateValue(personalState));
  };

  const handleTeamClick = () => {
    const newState = cycleTristateValue(teamState);
    setTeamState(newState);
    if (newState === 'indeterminate') {
      onSuccess();
    }
  };

  const handleOrgClick = () => {
    setOrgState(cycleTristateValue(orgState));
  };

  const tableData = [
    { key: '1', name: 'Project Alpha', status: 'Active' },
    { key: '2', name: 'Project Beta', status: 'Pending' },
  ];

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  return (
    <div style={{ width: 600 }}>
      {/* Header with search and actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Input
          placeholder="Search..."
          prefix={<SearchOutlined />}
          style={{ width: 200 }}
        />
        <Space>
          <Button icon={<ExportOutlined />}>Export</Button>
          <Button icon={<ReloadOutlined />}>Refresh</Button>
        </Space>
      </div>

      {/* Reference badge */}
      <div style={{ marginBottom: 12 }}>
        <Tag>
          <Checkbox indeterminate disabled style={{ marginRight: 8, pointerEvents: 'none' }} />
          Desired: Partial
        </Tag>
      </div>

      {/* Visibility cards row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Card size="small" style={{ flex: 1 }}>
          <div onClick={handlePersonalClick} style={{ cursor: 'pointer' }}>
            <Checkbox
              checked={personalState === 'checked'}
              indeterminate={personalState === 'indeterminate'}
              data-testid="visibility-personal"
            >
              Personal visibility
            </Checkbox>
          </div>
          <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>Your own content</div>
        </Card>
        
        <Card size="small" style={{ flex: 1 }}>
          <div onClick={handleTeamClick} style={{ cursor: 'pointer' }}>
            <Checkbox
              checked={teamState === 'checked'}
              indeterminate={teamState === 'indeterminate'}
              data-testid="visibility-team"
            >
              Team visibility
            </Checkbox>
          </div>
          <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>Shared with team</div>
        </Card>
        
        <Card size="small" style={{ flex: 1 }}>
          <div onClick={handleOrgClick} style={{ cursor: 'pointer' }}>
            <Checkbox
              checked={orgState === 'checked'}
              indeterminate={orgState === 'indeterminate'}
              data-testid="visibility-org"
            >
              Org visibility
            </Checkbox>
          </div>
          <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>Company-wide</div>
        </Card>
      </div>

      {/* Table preview */}
      <Table
        size="small"
        dataSource={tableData}
        columns={columns}
        pagination={false}
      />
    </div>
  );
}
