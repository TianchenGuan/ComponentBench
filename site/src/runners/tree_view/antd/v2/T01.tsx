'use client';

/**
 * tree_view-antd-v2-T01: Permissions tree — expand Services and check exactly two logging leaves
 *
 * Settings panel with clutter (role-name fields, audit toggles, read-only summary card).
 * Target panel "Write scopes" has an AntD Tree with checkable + checkStrictly.
 * Tree: Services → Logging → {Access logs, Retention policies, Export jobs}, Monitoring → {Alerts, Metrics}
 *       Billing → {Billing exports [checked], Invoices}
 * Initial: all collapsed except Billing (so Billing exports is visible and checked).
 * Success: committed checked leaf ids = {services/logging/access_logs, services/logging/retention},
 *          billing/exports NOT checked, "Apply scopes" clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Tree, Button, Input, Switch, Typography, Space, Row, Col, Tag } from 'antd';
import type { TreeDataNode } from 'antd';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const { Text, Title } = Typography;

const treeData: TreeDataNode[] = [
  {
    title: 'Services',
    key: 'services',
    children: [
      {
        title: 'Logging',
        key: 'services/logging',
        children: [
          { title: 'Access logs', key: 'services/logging/access_logs', isLeaf: true },
          { title: 'Retention policies', key: 'services/logging/retention', isLeaf: true },
          { title: 'Export jobs', key: 'services/logging/export_jobs', isLeaf: true },
        ],
      },
      {
        title: 'Monitoring',
        key: 'services/monitoring',
        children: [
          { title: 'Alerts', key: 'services/monitoring/alerts', isLeaf: true },
          { title: 'Metrics', key: 'services/monitoring/metrics', isLeaf: true },
        ],
      },
    ],
  },
  {
    title: 'Billing',
    key: 'billing',
    children: [
      { title: 'Billing exports', key: 'billing/exports', isLeaf: true },
      { title: 'Invoices', key: 'billing/invoices', isLeaf: true },
    ],
  },
];

const TARGET_CHECKED = ['services/logging/access_logs', 'services/logging/retention'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['billing']);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(['billing/exports']);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      committed &&
      setsEqual(checkedKeys as string[], TARGET_CHECKED) &&
      !(checkedKeys as string[]).includes('billing/exports')
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, checkedKeys, onSuccess]);

  const handleApply = () => setCommitted(true);

  return (
    <div style={{ padding: 16, maxWidth: 780 }}>
      <Title level={4}>Role Configuration</Title>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card size="small">
            <Text strong style={{ display: 'block', marginBottom: 4 }}>Role name</Text>
            <Input value="Service Operator" disabled size="small" />
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small">
            <Space direction="vertical" size={4}>
              <Space><Text>Audit logging</Text><Switch defaultChecked size="small" /></Space>
              <Space><Text>MFA required</Text><Switch size="small" /></Space>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Text type="secondary">Summary: 0 read scopes, 0 write scopes configured.</Text>
        <Tag style={{ marginLeft: 8 }}>Draft</Tag>
      </Card>

      <Card title="Write scopes" size="small">
        <Tree
          treeData={treeData}
          expandedKeys={expandedKeys}
          onExpand={(keys) => { setExpandedKeys(keys); setCommitted(false); }}
          checkedKeys={checkedKeys}
          onCheck={(checked) => {
            const keys = Array.isArray(checked) ? checked : checked.checked;
            setCheckedKeys(keys);
            setCommitted(false);
          }}
          checkable
          checkStrictly
          selectable
          data-testid="tree-root"
        />
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button size="small">Cancel</Button>
          <Button type="primary" size="small" onClick={handleApply}>Apply scopes</Button>
        </div>
      </Card>
    </div>
  );
}
