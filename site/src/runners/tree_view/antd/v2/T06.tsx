'use client';

/**
 * tree_view-antd-v2-T06: Two trees on one dashboard — update Notification channels, not Navigation
 *
 * Dashboard with KPI cards, chart, two adjacent tree panels.
 * Left (distractor): "Navigation" tree — Settings→{Notifications, Integrations}, Reports→{Daily digest}.
 * Right (target): "Notification channels" checkable tree — Email→{Daily digest, Weekly digest[checked], Incident alerts},
 *   Chat→{On-call pings, Standup reminders}. Both collapsed. "Apply channels" under target.
 * Success: target checked = exactly {notify/email/daily, notify/email/incidents},
 *          weekly NOT checked, Navigation unchanged, "Apply channels" clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Tree, Button, Typography, Statistic, Row, Col } from 'antd';
import type { TreeDataNode } from 'antd';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const { Text, Title } = Typography;

const navTreeData: TreeDataNode[] = [
  {
    title: 'Settings', key: 'nav/settings',
    children: [
      { title: 'Notifications', key: 'nav/settings/notifications', isLeaf: true },
      { title: 'Integrations', key: 'nav/settings/integrations', isLeaf: true },
    ],
  },
  {
    title: 'Reports', key: 'nav/reports',
    children: [
      { title: 'Daily digest', key: 'nav/reports/daily', isLeaf: true },
    ],
  },
];

const notifyTreeData: TreeDataNode[] = [
  {
    title: 'Email', key: 'notify/email',
    children: [
      { title: 'Daily digest', key: 'notify/email/daily', isLeaf: true },
      { title: 'Weekly digest', key: 'notify/email/weekly', isLeaf: true },
      { title: 'Incident alerts', key: 'notify/email/incidents', isLeaf: true },
    ],
  },
  {
    title: 'Chat', key: 'notify/chat',
    children: [
      { title: 'On-call pings', key: 'notify/chat/oncall', isLeaf: true },
      { title: 'Standup reminders', key: 'notify/chat/standup', isLeaf: true },
    ],
  },
];

const TARGET_CHECKED = ['notify/email/daily', 'notify/email/incidents'];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [navExpanded, setNavExpanded] = useState<React.Key[]>([]);
  const [navSelected, setNavSelected] = useState<React.Key[]>([]);

  const [notifyExpanded, setNotifyExpanded] = useState<React.Key[]>([]);
  const [notifyChecked, setNotifyChecked] = useState<React.Key[]>(['notify/email/weekly']);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const leafChecked = (notifyChecked as string[]).filter(
      (k) => !['notify/email', 'notify/chat'].includes(k),
    );
    if (committed && setsEqual(leafChecked, TARGET_CHECKED)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, notifyChecked, onSuccess]);

  const handleApply = () => setCommitted(true);

  return (
    <div style={{ padding: 16, maxWidth: 800 }}>
      <Title level={4}>Dashboard</Title>

      <Row gutter={12} style={{ marginBottom: 12 }}>
        <Col span={6}><Card size="small"><Statistic title="Users" value={1240} /></Card></Col>
        <Col span={6}><Card size="small"><Statistic title="Events" value={8302} /></Card></Col>
        <Col span={6}><Card size="small"><Statistic title="Uptime" value="99.7%" /></Card></Col>
        <Col span={6}><Card size="small"><Statistic title="Errors" value={12} /></Card></Col>
      </Row>

      <Card size="small" style={{ marginBottom: 12, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Text type="secondary">Chart placeholder — event timeline</Text>
      </Card>

      <Row gutter={16}>
        <Col span={10}>
          <Card title="Navigation" size="small">
            <Tree
              treeData={navTreeData}
              expandedKeys={navExpanded}
              onExpand={setNavExpanded}
              selectedKeys={navSelected}
              onSelect={setNavSelected}
              selectable
            />
          </Card>
        </Col>
        <Col span={14}>
          <Card title="Notification channels" size="small">
            <Tree
              treeData={notifyTreeData}
              expandedKeys={notifyExpanded}
              onExpand={(keys) => { setNotifyExpanded(keys); setCommitted(false); }}
              checkedKeys={notifyChecked}
              onCheck={(checked) => {
                const keys = Array.isArray(checked) ? checked : checked.checked;
                setNotifyChecked(keys);
                setCommitted(false);
              }}
              checkable
              checkStrictly
              selectable={false}
              data-testid="tree-root"
            />
            <div style={{ marginTop: 12, textAlign: 'right' }}>
              <Button type="primary" size="small" onClick={handleApply}>Apply channels</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
