'use client';

/**
 * tree_grid-antd-T09: Reset filters, selection, and expansions to default
 *
 * Layout: dashboard with a left navigation rail and a main content area.
 * Clutter: medium (other cards below the table and a sidebar menu).
 * Component: Ant Design tree table with row selection (checkboxes) and an "Owner" column with filter dropdown.
 * Initial state (non-default):
 *   - Expanded: Platform and Finance are expanded.
 *   - Selected rows: "Platform → Auth Service" and "Finance → Billing" are selected.
 *   - Active filter: Owner is filtered to "Priya Singh" (filter indicator is shown).
 * Interaction: deselect rows by unchecking; collapse groups via carets; open Owner filter dropdown
 *   and use "Reset" then "OK" to clear.
 * Feedback: selection counter and breadcrumb update; filter indicator disappears once cleared.
 *
 * Success: No rows selected, no filters active, no groups expanded.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, Typography, Layout, Menu, Space } from 'antd';
import { HomeOutlined, SettingOutlined, TeamOutlined, FileOutlined } from '@ant-design/icons';
import type { ColumnsType, FilterValue } from 'antd/es/table/interface';
import type { TaskComponentProps, TreeGridRow, FilterModel } from '../types';
import { SERVICE_CATALOG_DATA } from '../types';

const { Sider, Content } = Layout;
const { Text } = Typography;

// Get unique owners for filter options
const allOwners = new Set<string>();
function collectOwners(rows: TreeGridRow[]) {
  for (const row of rows) {
    allOwners.add(row.owner);
    if (row.children) collectOwners(row.children);
  }
}
collectOwners(SERVICE_CATALOG_DATA);
const ownerFilters = Array.from(allOwners).map(o => ({ text: o, value: o }));

export default function T09({ onSuccess }: TaskComponentProps) {
  // Initial non-default state
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['platform', 'finance']);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(['platform/auth-service', 'finance/billing']);
  const [filterModel, setFilterModel] = useState<FilterModel[]>([
    { column: 'Owner', operator: 'in', value: ['Priya Singh'] }
  ]);
  const successFired = useRef(false);

  const columns: ColumnsType<TreeGridRow> = [
    { title: 'Service', dataIndex: 'service', key: 'service', width: 180 },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      width: 130,
      filters: ownerFilters,
      filteredValue: filterModel.find(f => f.column === 'Owner')?.value as string[] || null,
      onFilter: (value: React.Key | boolean, record: TreeGridRow) => record.owner === value,
    },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 80 },
    { title: 'Last updated', dataIndex: 'lastUpdated', key: 'lastUpdated', width: 100 },
  ];

  // Check for reset state: no selection, no filters, no expansions
  useEffect(() => {
    const isReset =
      selectedRowKeys.length === 0 &&
      filterModel.length === 0 &&
      expandedKeys.length === 0;
    
    if (!successFired.current && isReset) {
      successFired.current = true;
      onSuccess();
    }
  }, [selectedRowKeys, filterModel, expandedKeys, onSuccess]);

  const handleTableChange = (
    _pagination: unknown,
    filters: Record<string, FilterValue | null>
  ) => {
    const newFilters: FilterModel[] = [];
    if (filters.owner && Array.isArray(filters.owner) && filters.owner.length > 0) {
      newFilters.push({
        column: 'Owner',
        operator: 'in',
        value: filters.owner as string[],
      });
    }
    setFilterModel(newFilters);
  };

  return (
    <Layout style={{ minHeight: 600 }}>
      <Sider width={200} style={{ background: '#fff' }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['services']}
          items={[
            { key: 'home', icon: <HomeOutlined />, label: 'Home' },
            { key: 'services', icon: <FileOutlined />, label: 'Services' },
            { key: 'team', icon: <TeamOutlined />, label: 'Team' },
            { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
          ]}
        />
      </Sider>
      <Content style={{ padding: 24, background: '#f5f5f5' }}>
        <Card 
          title="Service Catalog" 
          style={{ marginBottom: 16 }}
          data-testid="tree-grid-card"
        >
          <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
            Reset the Service Catalog table (no selection, no Owner filter, all groups collapsed).
          </Text>
          
          {selectedRowKeys.length > 0 && (
            <Text style={{ display: 'block', marginBottom: 8 }}>
              Selected: {selectedRowKeys.length} row(s)
            </Text>
          )}
          
          <Table<TreeGridRow>
            columns={columns}
            dataSource={SERVICE_CATALOG_DATA}
            expandable={{
              expandedRowKeys: expandedKeys,
              onExpand: (expanded, record) => {
                if (expanded) {
                  setExpandedKeys([...expandedKeys, record.key]);
                } else {
                  setExpandedKeys(expandedKeys.filter(k => k !== record.key));
                }
              },
            }}
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys),
              checkStrictly: true,
            }}
            onChange={handleTableChange}
            pagination={false}
            size="small"
            data-testid="tree-grid"
          />
        </Card>

        {/* Distractor cards */}
        <Space direction="vertical" style={{ width: '100%' }}>
          <Card size="small" title="Recent Activity">
            <Text type="secondary">No recent activity to display.</Text>
          </Card>
          <Card size="small" title="Quick Stats">
            <Text type="secondary">5 services active, 2 paused.</Text>
          </Card>
        </Space>
      </Content>
    </Layout>
  );
}
