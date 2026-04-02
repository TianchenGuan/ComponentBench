'use client';

/**
 * transfer_list-antd-T08: Match required permissions in dark compact mode
 *
 * Layout: isolated card centered on the page titled "Role permissions".
 * Theme is dark and spacing mode is compact (tighter rows and smaller checkbox hit areas).
 *
 * At the top of the card, a read-only reference strip labeled "Required permissions"
 * shows the target set as pill chips (visual guidance).
 * Below it is a single AntD Transfer component with titles "All permissions" (left) and "Selected" (right).
 * No search input.
 *
 * The left list contains 40 permission-like labels with intentionally similar wording.
 * Initial state: the right list contains a few unrelated permissions (e.g., "Read-only", "Export (csv)")
 * to force both additions and removals.
 *
 * Success: Target (right) list contains exactly: Read, Write, Export, Delete, Manage billing, View audit log (order ignore).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Transfer, Tag, Typography, ConfigProvider, theme } from 'antd';
import type { TransferProps } from 'antd';
import type { TaskComponentProps, TransferItem } from '../types';
import { setsEqual } from '../types';

const { Text } = Typography;

// 40 permission-like labels with similar wording
const allItems: TransferItem[] = [
  { key: 'read', title: 'Read' },
  { key: 'read-only', title: 'Read-only' },
  { key: 'read-audit', title: 'Read (audit)' },
  { key: 'write', title: 'Write' },
  { key: 'write-admin', title: 'Write (admin)' },
  { key: 'write-limited', title: 'Write (limited)' },
  { key: 'export', title: 'Export' },
  { key: 'export-csv', title: 'Export (csv)' },
  { key: 'export-pdf', title: 'Export (pdf)' },
  { key: 'delete', title: 'Delete' },
  { key: 'delete-hard', title: 'Delete (hard)' },
  { key: 'delete-soft', title: 'Delete (soft)' },
  { key: 'manage-billing', title: 'Manage billing' },
  { key: 'manage-billing-view', title: 'Manage billing (view)' },
  { key: 'manage-billing-edit', title: 'Manage billing (edit)' },
  { key: 'view-audit-log', title: 'View audit log' },
  { key: 'view-audit-logs-export', title: 'View audit logs (export)' },
  { key: 'view-audit-summary', title: 'View audit summary' },
  { key: 'create', title: 'Create' },
  { key: 'create-draft', title: 'Create (draft)' },
  { key: 'update', title: 'Update' },
  { key: 'update-metadata', title: 'Update (metadata)' },
  { key: 'archive', title: 'Archive' },
  { key: 'archive-restore', title: 'Archive (restore)' },
  { key: 'share', title: 'Share' },
  { key: 'share-external', title: 'Share (external)' },
  { key: 'comment', title: 'Comment' },
  { key: 'comment-edit', title: 'Comment (edit)' },
  { key: 'invite', title: 'Invite' },
  { key: 'invite-admin', title: 'Invite (admin)' },
  { key: 'configure', title: 'Configure' },
  { key: 'configure-advanced', title: 'Configure (advanced)' },
  { key: 'approve', title: 'Approve' },
  { key: 'approve-final', title: 'Approve (final)' },
  { key: 'reject', title: 'Reject' },
  { key: 'transfer', title: 'Transfer' },
  { key: 'transfer-ownership', title: 'Transfer (ownership)' },
  { key: 'download', title: 'Download' },
  { key: 'upload', title: 'Upload' },
  { key: 'sync', title: 'Sync' },
];

const initialTargetKeys = ['read-only', 'export-csv'];
const goalTargetKeys = ['read', 'write', 'export', 'delete', 'manage-billing', 'view-audit-log'];

const requiredPermissions = ['Read', 'Write', 'Export', 'Delete', 'Manage billing', 'View audit log'];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [targetKeyState, setTargetKeyState] = useState<string[]>(initialTargetKeys);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(targetKeyState, goalTargetKeys)) {
      successFired.current = true;
      onSuccess();
    }
  }, [targetKeyState, onSuccess]);

  const handleChange: TransferProps['onChange'] = (newTargetKeys) => {
    setTargetKeyState(newTargetKeys as string[]);
  };

  const handleSelectChange: TransferProps['onSelectChange'] = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys] as string[]);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        components: {
          Transfer: {
            listHeight: 300,
          },
        },
      }}
    >
      <Card
        title="Role permissions"
        style={{ width: 750, background: '#1f1f1f' }}
        data-testid="transfer-permissions"
        styles={{ header: { color: '#fff' }, body: { padding: '16px' } }}
      >
        {/* Required permissions reference */}
        <div style={{ marginBottom: 16 }}>
          <Text style={{ color: '#aaa', display: 'block', marginBottom: 8 }}>
            Required permissions
          </Text>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {requiredPermissions.map((perm) => (
              <Tag key={perm} color="blue">
                {perm}
              </Tag>
            ))}
          </div>
        </div>

        <Transfer
          dataSource={allItems}
          titles={['All permissions', 'Selected']}
          targetKeys={targetKeyState}
          selectedKeys={selectedKeys}
          onChange={handleChange}
          onSelectChange={handleSelectChange}
          render={(item) => item.title}
          listStyle={{ width: 280, height: 300 }}
          data-testid="transfer-component"
        />
      </Card>
    </ConfigProvider>
  );
}
