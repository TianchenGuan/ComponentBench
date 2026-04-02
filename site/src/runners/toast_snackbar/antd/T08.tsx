'use client';

/**
 * toast_snackbar-antd-T08: Undo file deletion from a table row via notification action
 *
 * setup_description:
 * Scene uses a table_cell layout: a small "Files" table is centered on the page. Spacing is set to **compact** to create denser rows.
 * The table has 5 rows. One row has filename "Contract.docx" (target). Each row has an icon-only "Delete" (trash) action in the last column.
 * When the delete action is clicked for any row, an Ant Design **notification** appears with title "File deleted" and a description that includes the filename.
 * For the target row, the description reads "Contract.docx was deleted." The notification includes an actions area with buttons "Undo" (target) and "Dismiss" (distractor).
 * Clicking "Undo" shows an Ant Design success **message** toast: "Restored: Contract.docx".
 *
 * success_trigger: A success toast message becomes visible with text exactly "Restored: Contract.docx".
 */

import React, { useEffect, useRef } from 'react';
import { Card, Table, Button, Space, notification, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const files = [
  { key: '1', name: 'Budget.xlsx', size: '24 KB', modified: 'Jan 15, 2024' },
  { key: '2', name: 'Contract.docx', size: '156 KB', modified: 'Jan 12, 2024' },
  { key: '3', name: 'Presentation.pptx', size: '2.4 MB', modified: 'Jan 10, 2024' },
  { key: '4', name: 'Notes.txt', size: '4 KB', modified: 'Jan 8, 2024' },
  { key: '5', name: 'Image.png', size: '890 KB', modified: 'Jan 5, 2024' },
];

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [messageApi, messageContextHolder] = message.useMessage();
  const successCalledRef = useRef(false);

  // Monitor for success message
  useEffect(() => {
    const checkToast = () => {
      const messageNode = document.querySelector('.ant-message-notice-content');
      if (messageNode && messageNode.textContent?.includes('Restored: Contract.docx')) {
        if (!successCalledRef.current) {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkToast);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => observer.disconnect();
  }, [onSuccess]);

  const handleDelete = (filename: string) => {
    const notificationKey = `delete-${filename}`;
    notificationApi.warning({
      key: notificationKey,
      message: <span data-testid="toast-title">File deleted</span>,
      description: <span data-testid="toast-text">{filename} was deleted.</span>,
      placement: 'topRight',
      duration: 0,
      btn: (
        <Space>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              notificationApi.destroy(notificationKey);
              messageApi.success({
                content: <span data-testid="success-toast-text">Restored: {filename}</span>,
                duration: 3,
              });
            }}
            data-testid="toast-action-undo"
          >
            Undo
          </Button>
          <Button
            size="small"
            onClick={() => {
              notificationApi.destroy(notificationKey);
            }}
            data-testid="toast-action-dismiss"
          >
            Dismiss
          </Button>
        </Space>
      ),
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Modified',
      dataIndex: 'modified',
      key: 'modified',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: typeof files[0]) => (
        <Button
          type="text"
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.name)}
          data-testid={`delete-row-${record.key}`}
          data-row-key={record.key}
          aria-label={`Delete ${record.name}`}
        />
      ),
    },
  ];

  return (
    <>
      {notificationContextHolder}
      {messageContextHolder}
      <Card title="Files" style={{ width: 600 }}>
        <Table
          dataSource={files}
          columns={columns}
          pagination={false}
          size="small"
        />
      </Card>
    </>
  );
}
