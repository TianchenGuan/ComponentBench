'use client';

/**
 * toggle_button_group_multi-antd-T10: Dashboard visible columns selection
 *
 * Layout: dashboard with the target card anchored toward the top-right of the viewport 
 * (placement=top_right).
 *
 * The screen resembles a user-management dashboard with multiple cards and controls:
 * - A KPI row (non-interactive).
 * - A filters card.
 * - A table preview (read-only in this task).
 *
 * There are three multi-select toggle-button groups (same canonical type) in different cards:
 * 1) "Quick filters" (options: Active, Trial, Churn risk, Flagged)
 *    - Initial state: Active selected only.
 * 2) "Chart overlays" (options: Average line, Trend, Target, Annotations)
 *    - Initial state: Average line and Target selected.
 * 3) "Visible columns" (TARGET) in a card titled "Table columns"
 *
 * The target group "Visible columns" contains 8 button-style options:
 * - Name, Email, Role, Status, Last active, Plan, Region, Created
 *
 * Initial state for "Visible columns":
 * - Name, Status, and Plan are selected.
 * - All others are unselected.
 *
 * Clutter (high):
 * - Multiple other buttons (Export, Refresh), a search input, and two other toggle groups.
 *
 * No Apply/Save step; selection changes apply immediately. 
 * Only the "Visible columns" group determines success.
 *
 * Success: Visible columns → Name, Email, Status, Last active (require_correct_instance: true)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Checkbox, Button, Input, Table, Statistic, Row, Col } from 'antd';
import { SearchOutlined, ExportOutlined, ReloadOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const QUICK_FILTER_OPTIONS = ['Active', 'Trial', 'Churn risk', 'Flagged'];
const CHART_OVERLAY_OPTIONS = ['Average line', 'Trend', 'Target', 'Annotations'];
const COLUMN_OPTIONS = ['Name', 'Email', 'Role', 'Status', 'Last active', 'Plan', 'Region', 'Created'];

const TARGET_SET = new Set(['Name', 'Email', 'Status', 'Last active']);

export default function T10({ onSuccess }: TaskComponentProps) {
  const [quickFilters, setQuickFilters] = useState<string[]>(['Active']);
  const [chartOverlays, setChartOverlays] = useState<string[]>(['Average line', 'Target']);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['Name', 'Status', 'Plan']);
  const successFiredRef = useRef(false);

  // Initial states for non-target groups
  const quickFiltersInitial = useRef(['Active']);
  const chartOverlaysInitial = useRef(['Average line', 'Target']);

  useEffect(() => {
    if (successFiredRef.current) return;

    // Check if visible columns has the target set
    const columnsSet = new Set(visibleColumns);
    const columnsMatch = columnsSet.size === TARGET_SET.size && 
      Array.from(TARGET_SET).every(v => columnsSet.has(v));

    // Check if non-target groups are unchanged
    const quickUnchanged = JSON.stringify([...quickFilters].sort()) === 
      JSON.stringify([...quickFiltersInitial.current].sort());
    const chartUnchanged = JSON.stringify([...chartOverlays].sort()) === 
      JSON.stringify([...chartOverlaysInitial.current].sort());

    if (columnsMatch && quickUnchanged && chartUnchanged) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [visibleColumns, quickFilters, chartOverlays, onSuccess]);

  const renderToggleGroup = (
    options: string[],
    selected: string[],
    setSelected: (v: string[]) => void,
    groupId: string
  ) => (
    <Checkbox.Group
      value={selected}
      onChange={(values) => setSelected(values as string[])}
      style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}
      data-testid={`${groupId}-group`}
    >
      {options.map(opt => (
        <Checkbox
          key={opt}
          value={opt}
          style={{
            padding: '4px 10px',
            border: '1px solid #d9d9d9',
            borderRadius: 4,
            background: selected.includes(opt) ? '#1677ff' : '#fff',
            color: selected.includes(opt) ? '#fff' : '#333',
            fontSize: 12,
          }}
          data-testid={`${groupId}-${opt.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {opt}
        </Checkbox>
      ))}
    </Checkbox.Group>
  );

  const tableData = [
    { key: '1', name: 'Alice', email: 'alice@example.com', status: 'Active' },
    { key: '2', name: 'Bob', email: 'bob@example.com', status: 'Trial' },
    { key: '3', name: 'Carol', email: 'carol@example.com', status: 'Active' },
  ];

  return (
    <div style={{ width: 900 }}>
      {/* KPI Row */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic title="Total Users" value={1234} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="Active" value={890} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="Trial" value={210} valueStyle={{ color: '#1677ff' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="Churn Risk" value={45} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* Left column - filters and table */}
        <Col span={16}>
          {/* Quick filters card */}
          <Card 
            size="small" 
            title="Quick filters" 
            style={{ marginBottom: 16 }}
            data-testid="quick-filters-card"
          >
            {renderToggleGroup(QUICK_FILTER_OPTIONS, quickFilters, setQuickFilters, 'quick-filters')}
          </Card>

          {/* Search and actions */}
          <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
            <Input prefix={<SearchOutlined />} placeholder="Search users..." style={{ width: 200 }} />
            <Button icon={<ExportOutlined />}>Export</Button>
            <Button icon={<ReloadOutlined />}>Refresh</Button>
          </div>

          {/* Table preview */}
          <Card size="small" title="Users (preview)" data-testid="users-table-card">
            <Table
              dataSource={tableData}
              columns={[
                { title: 'Name', dataIndex: 'name', key: 'name' },
                { title: 'Email', dataIndex: 'email', key: 'email' },
                { title: 'Status', dataIndex: 'status', key: 'status' },
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* Right column - chart overlays and columns */}
        <Col span={8}>
          {/* Chart overlays card */}
          <Card 
            size="small" 
            title="Chart overlays" 
            style={{ marginBottom: 16 }}
            data-testid="chart-overlays-card"
          >
            {renderToggleGroup(CHART_OVERLAY_OPTIONS, chartOverlays, setChartOverlays, 'chart-overlays')}
          </Card>

          {/* Visible columns card (TARGET) */}
          <Card 
            size="small" 
            title="Table columns" 
            style={{ marginBottom: 16 }}
            data-testid="visible-columns-card"
          >
            <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>
              Visible columns: Name, Email, Status, Last active
            </div>
            {renderToggleGroup(COLUMN_OPTIONS, visibleColumns, setVisibleColumns, 'visible-columns')}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
