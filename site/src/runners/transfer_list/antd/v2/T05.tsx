'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Transfer, Typography, Table, Space } from 'antd';
import type { TaskComponentProps, TransferItem } from '../../types';
import { setsEqual } from '../../types';

const { Title, Text } = Typography;

const revenueItems: TransferItem[] = [
  'Date', 'Customer', 'Total', 'Notes', 'Margin', 'Discount', 'Tax',
].map(n => ({ key: n, title: n }));

const churnItems: TransferItem[] = [
  'Date', 'Churn rate', 'Region', 'MRR', 'ARR', 'Cohort',
].map(n => ({ key: n, title: n }));

const REV_TARGET = ['Date', 'Customer', 'Total', 'Margin'];
const CHURN_MUST_REMAIN = ['Date', 'Churn rate', 'Region'];

const tableRows = [
  { key: 'revenue', name: 'Revenue', status: 'Active' },
  { key: 'churn', name: 'Churn', status: 'Active' },
  { key: 'growth', name: 'Growth', status: 'Draft' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [revKeys, setRevKeys] = useState<string[]>(['Date', 'Customer', 'Total', 'Notes']);
  const [revSel, setRevSel] = useState<string[]>([]);
  const [churnKeys, setChurnKeys] = useState<string[]>(['Date', 'Churn rate', 'Region']);
  const [churnSel, setChurnSel] = useState<string[]>([]);
  const [committedRev, setCommittedRev] = useState<string[] | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (
      !successFired.current && committedRev &&
      setsEqual(committedRev, REV_TARGET) &&
      setsEqual(churnKeys, CHURN_MUST_REMAIN)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedRev, churnKeys, onSuccess]);

  const columns = [
    { title: 'Report', dataIndex: 'name', key: 'name' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  return (
    <div style={{ padding: 16, maxWidth: 800, marginLeft: 40 }}>
      <Title level={4}>Report rows</Title>
      <Table
        dataSource={tableRows}
        columns={columns}
        pagination={false}
        size="small"
        expandable={{
          defaultExpandedRowKeys: ['revenue', 'churn'],
          rowExpandable: (record) => record.key !== 'growth',
          expandedRowRender: (record) => {
            if (record.key === 'revenue') {
              return (
                <Space direction="vertical">
                  <Text strong>Visible columns</Text>
                  <Transfer
                    dataSource={revenueItems}
                    titles={['Hidden', 'Visible']}
                    targetKeys={revKeys}
                    selectedKeys={revSel}
                    onChange={(keys) => setRevKeys(keys as string[])}
                    onSelectChange={(s, t) => setRevSel([...s, ...t] as string[])}
                    render={(item) => item.title}
                    listStyle={{ width: 200, height: 200 }}
                  />
                  <Button
                    type="primary"
                    size="small"
                    data-testid="save-row-revenue"
                    onClick={() => setCommittedRev([...revKeys])}
                  >
                    Save row
                  </Button>
                </Space>
              );
            }
            if (record.key === 'churn') {
              return (
                <Space direction="vertical">
                  <Text strong>Visible columns</Text>
                  <Transfer
                    dataSource={churnItems}
                    titles={['Hidden', 'Visible']}
                    targetKeys={churnKeys}
                    selectedKeys={churnSel}
                    onChange={(keys) => setChurnKeys(keys as string[])}
                    onSelectChange={(s, t) => setChurnSel([...s, ...t] as string[])}
                    render={(item) => item.title}
                    listStyle={{ width: 200, height: 200 }}
                  />
                  <Button
                    type="primary"
                    size="small"
                    data-testid="save-row-churn"
                    onClick={() => {}}
                  >
                    Save row
                  </Button>
                </Space>
              );
            }
            return null;
          },
        }}
      />
    </div>
  );
}
