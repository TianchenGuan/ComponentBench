'use client';

/**
 * toolbar-antd-T01: Click Refresh in actions toolbar
 *
 * A single isolated card is centered in the viewport. At the top of the card there is an 
 * Ant Design-style horizontal toolbar labeled "Actions" implemented as a Flex/Space row 
 * of three medium-size Buttons: "Refresh", "Export", and "Help".
 * Below the toolbar, a read-only status line shows "Last action: …" and updates immediately 
 * when a toolbar button is pressed. The initial value is "None".
 */

import React, { useState } from 'react';
import { Button, Card, Space, Typography } from 'antd';
import { ReloadOutlined, ExportOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [lastAction, setLastAction] = useState<string>('None');

  const handleAction = (action: string) => {
    setLastAction(action);
    if (action.toLowerCase() === 'refresh') {
      onSuccess();
    }
  };

  return (
    <Card title="Actions" style={{ width: 400 }} data-testid="toolbar-actions">
      <Space size="middle" style={{ width: '100%', marginBottom: 16 }}>
        <Button
          icon={<ReloadOutlined />}
          onClick={() => handleAction('Refresh')}
          data-testid="toolbar-actions-refresh"
        >
          Refresh
        </Button>
        <Button
          icon={<ExportOutlined />}
          onClick={() => handleAction('Export')}
          data-testid="toolbar-actions-export"
        >
          Export
        </Button>
        <Button
          icon={<QuestionCircleOutlined />}
          onClick={() => handleAction('Help')}
          data-testid="toolbar-actions-help"
        >
          Help
        </Button>
      </Space>
      <Text type="secondary">Last action: {lastAction}</Text>
    </Card>
  );
}
