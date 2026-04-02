'use client';

/**
 * split_button-antd-T07: Output: choose action by matching icon reference (Print)
 *
 * Layout: isolated card titled "Output" centered in the viewport.
 *
 * Guidance (visual):
 * - The card header shows "Match this icon:" followed by a small icon-only chip (printer glyph).
 *
 * Target component: One `Dropdown.Button` split button labeled "Output action".
 * Menu items (icon + label): Printer-"Print", Download-"Download", Share-"Share", Link-"Copy link"
 *
 * Initial state: Selected action is "Download".
 * Success: selectedAction equals "print"
 */

import React, { useState } from 'react';
import { Card, Dropdown, Button, Space } from 'antd';
import { DownOutlined, PrinterOutlined, DownloadOutlined, ShareAltOutlined, LinkOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [selectedAction, setSelectedAction] = useState('download');
  const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false);

  const menuItems: MenuProps['items'] = [
    { key: 'print', label: 'Print', icon: <PrinterOutlined /> },
    { key: 'download', label: 'Download', icon: <DownloadOutlined /> },
    { key: 'share', label: 'Share', icon: <ShareAltOutlined /> },
    { key: 'copy_link', label: 'Copy link', icon: <LinkOutlined /> },
  ];

  const getActionLabel = (key: string) => {
    const labels: Record<string, string> = {
      'print': 'Print',
      'download': 'Download',
      'share': 'Share',
      'copy_link': 'Copy link',
    };
    return labels[key] || key;
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setSelectedAction(e.key);
    if (e.key === 'print' && !hasTriggeredSuccess) {
      setHasTriggeredSuccess(true);
      onSuccess();
    }
  };

  return (
    <Card 
      title="Output" 
      style={{ width: 400 }}
    >
      {/* Visual guidance - reference icon chip */}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, color: '#666' }}>Match this icon:</span>
        <span 
          data-reference-token="icon_printer"
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: 32, 
            height: 32, 
            background: '#f0f0f0', 
            borderRadius: 6,
            fontSize: 16
          }}
        >
          <PrinterOutlined />
        </span>
      </div>

      {/* Decorative preview thumbnail (non-interactive) */}
      <div style={{ 
        marginBottom: 16, 
        padding: 32, 
        background: '#fafafa', 
        borderRadius: 4,
        textAlign: 'center',
        color: '#bbb',
        fontSize: 13
      }}>
        📄 Document preview
      </div>

      <div
        data-testid="split-button-root"
        data-selected-action={selectedAction}
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
