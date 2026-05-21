'use client';

/**
 * split_button-antd-T03: Report: set split-button action to Export as PDF
 *
 * Layout: isolated card titled "Monthly report" centered in the viewport.
 * Target component: one `Dropdown.Button` split button labeled "Export".
 * - The left segment displays the currently selected export format.
 * - The right chevron opens a dropdown menu of export formats.
 *
 * Menu items: "Export as CSV", "Export as PDF", "Export as PNG", "Export as Excel"
 * Initial state: Currently selected action: "Export as CSV" (left segment shows this text).
 *
 * Success: selectedAction equals "export_pdf"
 */

import React, { useState } from 'react';
import { Card, Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [selectedAction, setSelectedAction] = useState('export_csv');
  const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false);

  const menuItems: MenuProps['items'] = [
    { key: 'export_csv', label: 'Export as CSV' },
    { key: 'export_pdf', label: 'Export as PDF' },
    { key: 'export_png', label: 'Export as PNG' },
    { key: 'export_excel', label: 'Export as Excel' },
  ];

  const getActionLabel = (key: string) => {
    const item = menuItems.find(i => i?.key === key);
    return (item as { label: string })?.label || key;
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setSelectedAction(e.key);
    if (e.key === 'export_pdf' && !hasTriggeredSuccess) {
      setHasTriggeredSuccess(true);
      onSuccess();
    }
  };

  return (
    <Card title="Monthly report" style={{ width: 400 }}>
      {/* Static chart thumbnail (non-interactive distractor) */}
      <div style={{ 
        marginBottom: 16, 
        padding: 24, 
        background: '#fafafa', 
        borderRadius: 4,
        textAlign: 'center',
        color: '#999',
        fontSize: 13
      }}>
        📊 Chart preview placeholder
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

      {/* Disabled link (distractor) */}
      <div style={{ marginTop: 12 }}>
        <span style={{ color: '#bbb', cursor: 'not-allowed', fontSize: 13 }}>
          Download sample
        </span>
      </div>
    </Card>
  );
}
