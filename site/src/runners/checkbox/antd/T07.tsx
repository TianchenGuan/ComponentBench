'use client';

/**
 * checkbox-antd-T07: Enable auto-archive with confirmation popover
 *
 * Layout: settings panel (left-aligned labels with right-aligned controls) centered in the viewport.
 * The panel has several rows of settings; only one row uses a checkbox:
 *   - Row label: "Auto-archive chats"
 *   - Control: AntD Checkbox (initially unchecked)
 * Interaction behavior: when you try to turn it on, an Ant Design Popconfirm appears anchored to the row,
 * asking "Enable auto-archive?" with two buttons: "Cancel" and "Confirm".
 * The checkbox only becomes committed as checked after clicking "Confirm". Clicking "Cancel" leaves it unchecked.
 * Clutter: a couple of non-checkbox rows (e.g., a read-only text field) are present but irrelevant.
 */

import React, { useState } from 'react';
import { Card, Checkbox, Popconfirm, Input } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState(false);
  const [popconfirmOpen, setPopconfirmOpen] = useState(false);

  const handleCheckboxChange = (e: { target: { checked: boolean } }) => {
    if (e.target.checked && !checked) {
      // Trying to enable - show popconfirm
      setPopconfirmOpen(true);
    } else {
      // Disabling - just do it
      setChecked(false);
    }
  };

  const handleConfirm = () => {
    setChecked(true);
    setPopconfirmOpen(false);
    onSuccess();
  };

  const handleCancel = () => {
    setPopconfirmOpen(false);
  };

  return (
    <Card title="Chat Settings" style={{ width: 450 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Read-only row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#666' }}>Chat history retention</span>
          <Input value="90 days" disabled style={{ width: 120 }} />
        </div>

        {/* Checkbox row with popconfirm */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#666' }}>Auto-archive chats</span>
          <Popconfirm
            title="Enable auto-archive?"
            open={popconfirmOpen}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            okText="Confirm"
            cancelText="Cancel"
          >
            <Checkbox
              checked={checked}
              onChange={handleCheckboxChange}
              data-testid="cb-auto-archive-chats"
            />
          </Popconfirm>
        </div>

        {/* Another read-only row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#666' }}>Notification sound</span>
          <Input value="Default" disabled style={{ width: 120 }} />
        </div>
      </div>
    </Card>
  );
}
