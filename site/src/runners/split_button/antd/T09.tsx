'use client';

/**
 * split_button-antd-T09: Share: select nested action Share > Copy link (dark, corner)
 *
 * Layout: settings_panel anchored near the top-right of the viewport (placement=top_right) in dark theme.
 *
 * Target component: one Ant Design split button labeled "Share".
 * Menu structure (two levels):
 * - "Share" (submenu): "Copy link", "Email…", "QR code"
 * - "Export" (submenu): "PDF", "PNG"
 * - Divider
 * - "Open in new tab"
 *
 * Initial state: Selected action is "Open in new tab".
 * Success: selectedPath = ["Share", "Copy link"], selectedAction = "share_copy_link"
 */

import React, { useState } from 'react';
import { Card, Dropdown, Button, Switch } from 'antd';
import { DownOutlined, ShareAltOutlined, ExportOutlined, LinkOutlined, MailOutlined, QrcodeOutlined, FilePdfOutlined, FileImageOutlined, SelectOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [selectedAction, setSelectedAction] = useState('open_new_tab');
  const [selectedPath, setSelectedPath] = useState<string[]>(['Open in new tab']);
  const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false);

  const menuItems: MenuProps['items'] = [
    {
      key: 'share',
      label: 'Share',
      icon: <ShareAltOutlined />,
      children: [
        { key: 'share_copy_link', label: 'Copy link', icon: <LinkOutlined /> },
        { key: 'share_email', label: 'Email…', icon: <MailOutlined /> },
        { key: 'share_qr', label: 'QR code', icon: <QrcodeOutlined /> },
      ],
    },
    {
      key: 'export',
      label: 'Export',
      icon: <ExportOutlined />,
      children: [
        { key: 'export_pdf', label: 'PDF', icon: <FilePdfOutlined /> },
        { key: 'export_png', label: 'PNG', icon: <FileImageOutlined /> },
      ],
    },
    { type: 'divider' },
    { key: 'open_new_tab', label: 'Open in new tab', icon: <SelectOutlined /> },
  ];

  const getActionLabel = (key: string) => {
    const labels: Record<string, string> = {
      'share_copy_link': 'Copy link',
      'share_email': 'Email…',
      'share_qr': 'QR code',
      'export_pdf': 'PDF',
      'export_png': 'PNG',
      'open_new_tab': 'Open in new tab',
    };
    return labels[key] || key;
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setSelectedAction(e.key);
    // Set the path based on the key
    if (e.key.startsWith('share_')) {
      setSelectedPath(['Share', getActionLabel(e.key)]);
    } else if (e.key.startsWith('export_')) {
      setSelectedPath(['Export', getActionLabel(e.key)]);
    } else {
      setSelectedPath([getActionLabel(e.key)]);
    }

    if (e.key === 'share_copy_link' && !hasTriggeredSuccess) {
      setHasTriggeredSuccess(true);
      onSuccess();
    }
  };

  return (
    <Card 
      title="Share settings" 
      style={{ width: 360 }}
      styles={{ header: { background: '#1f1f1f', color: '#fff', borderBottom: '1px solid #303030' } }}
      bodyStyle={{ background: '#1f1f1f' }}
    >
      {/* Dark-mode sidebar sections (distractors) */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>Visibility</div>
        <div style={{ color: '#ddd', fontSize: 13, marginBottom: 4 }}>Public link enabled</div>
        <div style={{ color: '#ddd', fontSize: 13 }}>Anyone with the link can view</div>
      </div>

      {/* Disabled theme toggle (distractor) */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 8, 
        marginBottom: 16,
        opacity: 0.5
      }}>
        <Switch disabled size="small" />
        <span style={{ color: '#888', fontSize: 13 }}>Theme (disabled for this task)</span>
      </div>

      <div
        data-testid="split-button-root"
        data-selected-action={selectedAction}
        data-selected-path={JSON.stringify(selectedPath)}
      >
        <Dropdown.Button
          menu={{ items: menuItems, onClick: handleMenuClick }}
          icon={<DownOutlined />}
        >
          {getActionLabel(selectedAction)}
        </Dropdown.Button>
      </div>
    </Card>
  );
}
