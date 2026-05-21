'use client';

/**
 * context_menu-antd-T04: Choose Print using icon reference
 *
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1, guidance=mixed.
 *
 * Target element: a single card shows an attachment row with a file chip labeled "budget.xlsx".
 * Right-clicking on the file chip opens a custom context menu.
 *
 * Guidance element: within the same card, a small non-interactive "Reference" box shows
 * a printer icon next to the word "Print". This is the visual cue for which option to select.
 *
 * Context menu: AntD Dropdown trigger=['contextMenu'] with icons.
 * Menu items: Open (folder icon), Download (down arrow icon), Print (printer icon), Share (link icon).
 *
 * Success: The activated context-menu item path equals ['Print'] for the budget.xlsx menu.
 */

import React, { useState, useEffect } from 'react';
import { Dropdown, Card, Tag } from 'antd';
import {
  FolderOpenOutlined,
  DownloadOutlined,
  PrinterOutlined,
  LinkOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [lastActivatedItem, setLastActivatedItem] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (lastActivatedItem === 'Print' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [lastActivatedItem, successTriggered, onSuccess]);

  const menuItems: MenuProps['items'] = [
    { key: 'Open', label: 'Open', icon: <FolderOpenOutlined /> },
    { key: 'Download', label: 'Download', icon: <DownloadOutlined /> },
    { key: 'Print', label: 'Print', icon: <PrinterOutlined /> },
    { key: 'Share', label: 'Share', icon: <LinkOutlined /> },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    setLastActivatedItem(key);
  };

  return (
    <Card title="Attachments" style={{ width: 400 }}>
      {/* Reference box */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 12px',
          background: '#f0f5ff',
          border: '1px solid #adc6ff',
          borderRadius: 4,
          marginBottom: 16,
          fontSize: 12,
          color: '#1677ff',
        }}
        data-testid="reference-box"
      >
        <PrinterOutlined />
        <span>Reference: Print</span>
      </div>

      {/* File chip */}
      <Dropdown
        menu={{ items: menuItems, onClick: handleMenuClick }}
        trigger={['contextMenu']}
      >
        <Tag
          icon={<FileExcelOutlined />}
          color="green"
          style={{
            padding: '8px 16px',
            fontSize: 14,
            cursor: 'context-menu',
          }}
          data-testid="file-chip"
          data-last-activated={lastActivatedItem}
        >
          budget.xlsx
        </Tag>
      </Dropdown>

      <div style={{ marginTop: 16, fontSize: 12, color: '#666' }}>
        Last action: <strong data-testid="last-action">{lastActivatedItem || 'None'}</strong>
      </div>
    </Card>
  );
}
