'use client';

/**
 * drawer-antd-T10: Open nested Audit log drawer from within another drawer
 *
 * Layout: isolated_card centered with comfortable spacing.
 *
 * On the card:
 * - A primary button labeled "Open Advanced settings".
 *
 * Drawer flow:
 * 1) Clicking "Open Advanced settings" opens the first AntD Drawer titled "Advanced settings" (slides in from the right).
 *    - This drawer contains several read-only setting rows (distractors) and a button labeled "View audit log".
 * 2) Clicking "View audit log" opens a SECOND AntD Drawer titled "Audit log" on top of the first drawer (nested drawers).
 *    - The Audit log drawer has its own header with a close (X) icon and its own mask layer above the first drawer.
 *
 * Initial state:
 * - Both drawers are CLOSED.
 *
 * Target:
 * - The "Audit log" drawer must be OPEN at the end.
 *
 * Feedback:
 * - Each drawer has an opening animation. When the nested Audit log drawer opens, the header title "Audit log" is visible on the topmost panel.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Button, Drawer, Typography, Space, List } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const successCalledRef = useRef(false);

  // Success when the audit log drawer is open
  useEffect(() => {
    if (auditOpen && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [auditOpen, onSuccess]);

  const settingsData = [
    { label: 'Debug mode', value: 'Disabled' },
    { label: 'API rate limit', value: '1000 req/min' },
    { label: 'Cache TTL', value: '3600s' },
    { label: 'Log level', value: 'INFO' },
  ];

  const auditLogData = [
    { time: '10:32:15', action: 'User logged in', user: 'admin@example.com' },
    { time: '10:30:45', action: 'Settings updated', user: 'admin@example.com' },
    { time: '10:28:12', action: 'Report generated', user: 'admin@example.com' },
  ];

  return (
    <Card title="System Administration" style={{ width: 350 }}>
      <Button
        type="primary"
        onClick={() => setAdvancedOpen(true)}
        data-testid="open-advanced"
      >
        Open Advanced settings
      </Button>

      {/* First drawer: Advanced settings */}
      <Drawer
        title="Advanced settings"
        placement="right"
        onClose={() => setAdvancedOpen(false)}
        open={advancedOpen}
        data-testid="drawer-advanced"
      >
        <List
          itemLayout="horizontal"
          dataSource={settingsData}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={item.label}
                description={item.value}
              />
            </List.Item>
          )}
        />
        <Space direction="vertical" style={{ width: '100%', marginTop: 16 }}>
          <Button
            onClick={() => setAuditOpen(true)}
            data-testid="open-audit-log"
          >
            View audit log
          </Button>
        </Space>

        {/* Nested drawer: Audit log */}
        <Drawer
          title="Audit log"
          placement="right"
          onClose={() => setAuditOpen(false)}
          open={auditOpen}
          data-testid="drawer-audit-log"
        >
          <List
            itemLayout="horizontal"
            dataSource={auditLogData}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Space>
                      <Text type="secondary">{item.time}</Text>
                      <Text>{item.action}</Text>
                    </Space>
                  }
                  description={item.user}
                />
              </List.Item>
            )}
          />
        </Drawer>
      </Drawer>
    </Card>
  );
}
