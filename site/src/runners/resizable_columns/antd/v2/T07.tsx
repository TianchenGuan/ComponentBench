'use client';

/**
 * Task ID: resizable_columns-antd-v2-T07
 * Task Name: Modal draft layout: resize Runbook and commit the saved width
 *
 * Setup Description:
 * modal_flow: deploy history + "Customize table" opens Modal with preview table
 * (Service, Environment, Runbook, Window). Runbook starts 268px. Draft readout under table; Save commits.
 *
 * Success Trigger: Runbook ±5 of 340 AND Save clicked (committed width). require_confirm: true.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Modal, Space, Table, Typography } from 'antd';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';
import type { TaskComponentProps } from '../../types';
import { isWithinTolerance } from '../../types';

const { Text } = Typography;

interface ColumnType {
  title: string;
  dataIndex: string;
  key: string;
  width: number;
}

interface DeployRow {
  key: string;
  service: string;
  environment: string;
  runbook: string;
  window: string;
}

const ResizableTitle = (
  props: React.HTMLAttributes<HTMLElement> & {
    onResize: (e: React.SyntheticEvent, data: ResizeCallbackData) => void;
    width: number;
  }
) => {
  const { onResize, width, ...restProps } = props;
  const [resizing, setResizing] = useState(false);
  const [currentWidth, setCurrentWidth] = useState(width);

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          style={{
            position: 'absolute',
            right: -5,
            bottom: 0,
            top: 0,
            width: 10,
            cursor: 'col-resize',
            zIndex: 2,
          }}
          onClick={e => e.stopPropagation()}
          onMouseDown={e => e.stopPropagation()}
        />
      }
      onResizeStart={() => setResizing(true)}
      onResize={(e, data) => {
        setCurrentWidth(data.size.width);
        onResize(e, data);
      }}
      onResizeStop={() => setResizing(false)}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} style={{ ...restProps.style, position: 'relative' }}>
        {restProps.children}
        {resizing && (
          <div
            style={{
              position: 'absolute',
              top: -22,
              right: 0,
              background: '#1677ff',
              color: '#fff',
              padding: '2px 6px',
              borderRadius: 4,
              fontSize: 10,
              zIndex: 100,
            }}
          >
            {Math.round(currentWidth)}px
          </div>
        )}
      </th>
    </Resizable>
  );
};

const previewRows: DeployRow[] = [
  { key: '1', service: 'checkout', environment: 'prod', runbook: 'rollback.md', window: 'Sun 02:00' },
  { key: '2', service: 'search', environment: 'stage', runbook: 'reindex.md', window: 'Sat 22:00' },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [columns, setColumns] = useState<ColumnType[]>([
    { title: 'Service', dataIndex: 'service', key: 'service', width: 120 },
    { title: 'Environment', dataIndex: 'environment', key: 'environment', width: 112 },
    { title: 'Runbook', dataIndex: 'runbook', key: 'runbook', width: 268 },
    { title: 'Window', dataIndex: 'window', key: 'window', width: 128 },
  ]);
  const [committedRunbook, setCommittedRunbook] = useState<number | null>(null);
  const successFired = useRef(false);

  const draftRunbook = columns.find(c => c.key === 'runbook')?.width ?? 0;

  useEffect(() => {
    if (
      !successFired.current &&
      committedRunbook !== null &&
      isWithinTolerance(committedRunbook, 340, 5)
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedRunbook, onSuccess]);

  const handleResize = (index: number) => (_e: React.SyntheticEvent, { size }: ResizeCallbackData) => {
    setColumns(prev => {
      const next = [...prev];
      next[index] = { ...next[index], width: size.width };
      return next;
    });
  };

  const mergedColumns = columns.map((col, index) => ({
    ...col,
    onHeaderCell: () => ({
      width: col.width,
      onResize: handleResize(index),
    }),
  }));

  return (
    <div style={{ padding: 12, maxWidth: 560 }} data-testid="rc-v2-t07-page">
      <Space style={{ marginBottom: 10 }}>
        <Button type="primary" onClick={() => setModalOpen(true)} data-testid="rc-v2-t07-customize">
          Customize table
        </Button>
      </Space>
      <Card size="small" title="Deploy history (committed preview)" styles={{ body: { padding: 8 } }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Runbook column (saved): {committedRunbook ?? '—'}px
        </Text>
        <Table<DeployRow>
          bordered
          size="small"
          style={{ marginTop: 8 }}
          pagination={false}
          dataSource={previewRows}
          columns={[
            { title: 'Service', dataIndex: 'service', key: 'service', width: 120 },
            { title: 'Environment', dataIndex: 'environment', key: 'environment', width: 112 },
            {
              title: 'Runbook',
              dataIndex: 'runbook',
              key: 'runbook',
              width: committedRunbook ?? draftRunbook,
            },
            { title: 'Window', dataIndex: 'window', key: 'window', width: 128 },
          ]}
        />
      </Card>

      <Modal
        title="Customize table"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={[
          <Button key="c" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="s"
            type="primary"
            onClick={() => {
              setCommittedRunbook(draftRunbook);
              setModalOpen(false);
            }}
            data-testid="rc-v2-t07-save"
          >
            Save
          </Button>,
        ]}
      >
        <Table<DeployRow>
          bordered
          size="small"
          tableLayout="fixed"
          components={{ header: { cell: ResizableTitle } }}
          columns={mergedColumns}
          dataSource={previewRows}
          pagination={false}
          scroll={{ x: columns.reduce((s, c) => s + c.width, 0) }}
        />
        <div style={{ fontSize: 11, color: '#666', marginTop: 8 }} data-testid="rc-v2-t07-draft-readout">
          Draft Runbook width: {draftRunbook}px
        </div>
      </Modal>
    </div>
  );
}
