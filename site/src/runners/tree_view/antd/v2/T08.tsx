'use client';

/**
 * tree_view-antd-v2-T08: Review drawer — collapse extras, keep one deep path open, confirm target leaf
 *
 * Drawer flow, high clutter. "Review scope" opens left drawer with AntD Tree.
 * Initial expanded: Finance→Invoices→{Refund queue[target], Chargebacks}, Finance→Payroll, Operations→On-call.
 * Archive collapsed. Target already visible but extra branches expanded.
 * Success: selected = finance/invoices/refund_queue,
 *          expanded = exactly {finance, finance/invoices}, "Apply review scope" clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Tree, Button, Drawer, Typography, Tag, Space, Row, Col } from 'antd';
import type { TreeDataNode } from 'antd';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const { Text, Title } = Typography;

const treeData: TreeDataNode[] = [
  {
    title: 'Finance', key: 'finance',
    children: [
      {
        title: 'Invoices', key: 'finance/invoices',
        children: [
          { title: 'Refund queue', key: 'finance/invoices/refund_queue', isLeaf: true },
          { title: 'Chargebacks', key: 'finance/invoices/chargebacks', isLeaf: true },
        ],
      },
      { title: 'Payroll', key: 'finance/payroll', isLeaf: true },
    ],
  },
  {
    title: 'Operations', key: 'operations',
    children: [
      { title: 'On-call', key: 'operations/oncall', isLeaf: true },
    ],
  },
  { title: 'Archive', key: 'archive', isLeaf: true },
];

const REQUIRED_EXPANDED = ['finance', 'finance/invoices'];
const BRANCH_KEYS = new Set(['finance', 'finance/invoices', 'operations']);

export default function T08({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([
    'finance', 'finance/invoices', 'operations',
  ]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [committed, setCommitted] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const branchExpanded = (expandedKeys as string[]).filter(k => BRANCH_KEYS.has(k));
    if (
      committed &&
      selectedKeys.length === 1 &&
      selectedKeys[0] === 'finance/invoices/refund_queue' &&
      setsEqual(branchExpanded, REQUIRED_EXPANDED)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, selectedKeys, expandedKeys, onSuccess]);

  const handleApply = () => {
    setCommitted(true);
    setDrawerOpen(false);
  };

  return (
    <div style={{ padding: 16, maxWidth: 780 }}>
      <Title level={4}>Review Console</Title>

      <Row gutter={12} style={{ marginBottom: 12 }}>
        <Col span={8}>
          <Card size="small"><Space><Tag color="blue">Open</Tag><Text>12 items pending</Text></Space></Card>
        </Col>
        <Col span={8}>
          <Card size="small"><Space><Tag color="green">Approved</Tag><Text>87 items</Text></Space></Card>
        </Col>
        <Col span={8}>
          <Card size="small"><Space><Tag color="red">Rejected</Tag><Text>3 items</Text></Space></Card>
        </Col>
      </Row>

      <Card size="small" style={{ marginBottom: 12 }}>
        <Text type="secondary">Select a review scope to filter the items below.</Text>
      </Card>

      <Button type="primary" onClick={() => setDrawerOpen(true)}>Review scope</Button>

      <Drawer
        title="Review scope"
        placement="left"
        width={360}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        footer={
          <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setDrawerOpen(false)}>Close</Button>
            <Button type="primary" onClick={handleApply}>Apply review scope</Button>
          </Space>
        }
      >
        <Tree
          treeData={treeData}
          expandedKeys={expandedKeys}
          onExpand={(keys) => { setExpandedKeys(keys); setCommitted(false); }}
          selectedKeys={selectedKeys}
          onSelect={(keys) => { setSelectedKeys(keys); setCommitted(false); }}
          selectable
          data-testid="tree-root"
        />
      </Drawer>
    </div>
  );
}
