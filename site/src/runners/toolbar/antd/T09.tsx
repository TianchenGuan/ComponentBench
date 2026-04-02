'use client';

/**
 * toolbar-antd-T09: Dark toolbar: scroll to Export PDF and click
 *
 * The page uses a dashboard layout in dark theme. A top widget titled "Monthly reports" 
 * contains a single horizontally scrollable toolbar labeled "Reports".
 * The toolbar is a single row of icon-only Ant Design buttons (small size) with tooltips.
 * Because there are many actions (about 14), the toolbar overflows and can be scrolled 
 * horizontally within its own container.
 * The "Export PDF" action is located near the far right end and is not visible initially.
 */

import React, { useState, useRef } from 'react';
import { Button, Card, Tooltip, Typography, Space } from 'antd';
import {
  ReloadOutlined,
  FileExcelOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  PrinterOutlined,
  SettingOutlined,
  SearchOutlined,
  ShareAltOutlined,
  MailOutlined,
  CloudDownloadOutlined,
  SaveOutlined,
  HistoryOutlined,
  FilePdfOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text, Title } = Typography;

interface ToolbarAction {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const ACTIONS: ToolbarAction[] = [
  { id: 'refresh', label: 'Refresh', icon: <ReloadOutlined /> },
  { id: 'export_csv', label: 'Export CSV', icon: <FileExcelOutlined /> },
  { id: 'filter', label: 'Filter', icon: <FilterOutlined /> },
  { id: 'sort', label: 'Sort', icon: <SortAscendingOutlined /> },
  { id: 'print', label: 'Print', icon: <PrinterOutlined /> },
  { id: 'settings', label: 'Settings', icon: <SettingOutlined /> },
  { id: 'search', label: 'Search', icon: <SearchOutlined /> },
  { id: 'share', label: 'Share', icon: <ShareAltOutlined /> },
  { id: 'email', label: 'Email', icon: <MailOutlined /> },
  { id: 'download', label: 'Download', icon: <CloudDownloadOutlined /> },
  { id: 'save', label: 'Save', icon: <SaveOutlined /> },
  { id: 'history', label: 'History', icon: <HistoryOutlined /> },
  { id: 'export_pdf', label: 'Export PDF', icon: <FilePdfOutlined /> },
  { id: 'chart', label: 'Chart', icon: <PieChartOutlined /> },
];

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [lastAction, setLastAction] = useState<string>('None');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleAction = (action: ToolbarAction) => {
    setLastAction(action.label);
    if (action.id === 'export_pdf') {
      onSuccess();
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: 800 }}>
      {/* Dashboard header */}
      <Card
        title={<Title level={5} style={{ margin: 0 }}>Monthly reports</Title>}
        size="small"
        style={{ marginBottom: 16 }}
      >
        {/* Scrollable toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12,
          }}
        >
          <Text strong style={{ whiteSpace: 'nowrap' }}>Reports</Text>
          <div
            ref={scrollRef}
            style={{
              display: 'flex',
              gap: 4,
              overflowX: 'auto',
              flex: 1,
              paddingBottom: 4,
              scrollbarWidth: 'thin',
            }}
            data-testid="toolbar-reports"
          >
            {ACTIONS.map((action) => (
              <Tooltip key={action.id} title={action.label}>
                <Button
                  size="small"
                  type="text"
                  icon={action.icon}
                  onClick={() => handleAction(action)}
                  aria-label={action.label}
                  data-testid={`toolbar-reports-${action.id}`}
                />
              </Tooltip>
            ))}
          </div>
        </div>

        <Text type="secondary">Last action: {lastAction}</Text>
      </Card>

      {/* Clutter: other dashboard widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card size="small" title="Revenue">
          <div style={{ height: 80, background: '#252525', borderRadius: 4 }} />
        </Card>
        <Card size="small" title="Users">
          <div style={{ height: 80, background: '#252525', borderRadius: 4 }} />
        </Card>
      </div>
    </div>
  );
}
