'use client';

/**
 * dialog_modal-antd-v2-T01: Gateway row — open preview, dismiss via backdrop only
 */

import React, { useRef, useState } from 'react';
import { Button, Flex, Modal, Space, Table, Tag, Typography } from 'antd';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';

const { Paragraph, Text } = Typography;

export default function T01({ onSuccess }: TaskComponentProps) {
  const [gwOpen, setGwOpen] = useState(false);
  const [billOpen, setBillOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const successCalledRef = useRef(false);

  const dataSource = [
    { key: 'gw', name: 'Gateway', region: 'us-east' },
    { key: 'bill', name: 'Billing', region: 'eu-west' },
    { key: 'search', name: 'Search', region: 'ap-south' },
  ];

  const columns = [
    { title: 'Service', dataIndex: 'name', key: 'name', width: 100 },
    { title: 'Region', dataIndex: 'region', key: 'region', width: 90 },
    {
      title: '',
      key: 'act',
      render: (_: unknown, row: { key: string }) => (
        <Button
          size="small"
          type="link"
          onClick={() => {
            if (row.key === 'gw') {
              setGwOpen(true);
              setBillOpen(false);
              setSearchOpen(false);
              window.__cbModalState = {
                open: true,
                close_reason: null,
                modal_instance: 'Gateway preview',
                last_opened_instance: 'Gateway preview',
              };
            } else if (row.key === 'bill') {
              setBillOpen(true);
              setGwOpen(false);
              setSearchOpen(false);
              window.__cbModalState = {
                open: true,
                close_reason: null,
                modal_instance: 'Billing preview',
                last_opened_instance: 'Billing preview',
              };
            } else {
              setSearchOpen(true);
              setGwOpen(false);
              setBillOpen(false);
              window.__cbModalState = {
                open: true,
                close_reason: null,
                modal_instance: 'Search preview',
                last_opened_instance: 'Search preview',
              };
            }
          }}
          data-testid={`cb-preview-${row.key}`}
        >
          Preview dialog
        </Button>
      ),
    },
  ];

  const dismiss = (
    label: 'Gateway preview' | 'Billing preview' | 'Search preview',
    set: (v: boolean) => void,
  ) => {
    set(false);
    window.__cbModalState = {
      open: false,
      close_reason: 'backdrop_click',
      modal_instance: label,
      last_opened_instance: label,
    };
    if (label === 'Gateway preview' && !successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  return (
    <div style={{ maxWidth: 520 }}>
      <Flex wrap="wrap" gap={6} style={{ marginBottom: 12 }}>
        <Tag color="blue">Latency OK</Tag>
        <Tag color="default">Filter: prod</Tag>
        <Tag color="processing">Syncing</Tag>
        <Tag>Shard A</Tag>
        <Tag color="warning">Degraded</Tag>
        <Text type="secondary" style={{ fontSize: 12 }}>
          <SafetyCertificateOutlined /> TLS audit idle
        </Text>
      </Flex>
      <Table
        size="small"
        pagination={false}
        dataSource={dataSource}
        columns={columns}
        bordered
      />
      <Space size={4} wrap style={{ marginTop: 10 }}>
        {['v2', 'canary', 'read-only', 'metrics'].map((k) => (
          <Tag key={k} style={{ fontSize: 11 }}>
            {k}
          </Tag>
        ))}
      </Space>

      <Modal
        title="Gateway preview"
        open={gwOpen}
        closable
        maskClosable
        keyboard={false}
        footer={null}
        onCancel={() => dismiss('Gateway preview', setGwOpen)}
        data-testid="modal-gateway-preview"
      >
        <Paragraph style={{ marginBottom: 0 }}>
          Gateway health checks are passing. Edge cache warm.
        </Paragraph>
      </Modal>
      <Modal
        title="Billing preview"
        open={billOpen}
        closable
        maskClosable
        keyboard={false}
        footer={null}
        onCancel={() => dismiss('Billing preview', setBillOpen)}
        data-testid="modal-billing-preview"
      >
        <Paragraph style={{ marginBottom: 0 }}>Billing pipeline idle.</Paragraph>
      </Modal>
      <Modal
        title="Search preview"
        open={searchOpen}
        closable
        maskClosable
        keyboard={false}
        footer={null}
        onCancel={() => dismiss('Search preview', setSearchOpen)}
        data-testid="modal-search-preview"
      >
        <Paragraph style={{ marginBottom: 0 }}>Search index replicated.</Paragraph>
      </Modal>
    </div>
  );
}
