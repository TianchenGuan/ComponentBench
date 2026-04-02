'use client';

/**
 * toggle_button_group_multi-antd-T08: Save alert channels with confirmation
 *
 * Layout: isolated_card centered in the viewport, rendered in a dark theme.
 *
 * A single card titled "Alert channels" contains:
 * - A multi-select toggle button group (checkbox group styled as buttons) with options:
 *   Email, SMS, Push, Phone call
 * - A primary button below the group labeled "Save changes".
 *
 * Initial state:
 * - SMS is selected.
 * - Email, Push, and Phone call are not selected.
 *
 * Confirmation behavior:
 * - Clicking "Save changes" opens an Ant Design Popconfirm anchored to the button.
 * - Popconfirm text: "Save changes?"
 * - Popconfirm actions: "Confirm" (primary) and "Cancel".
 * - The system only commits the new selection after the user clicks "Confirm".
 *
 * No other interactive elements on the page (clutter=low due to Save button + popconfirm).
 *
 * Success: Selected options equal exactly: Email, Push (require_confirm: true, confirm_control: Confirm)
 * Theme: dark
 */

import React, { useState, useRef } from 'react';
import { Card, Checkbox, Button, Popconfirm } from 'antd';
import type { TaskComponentProps } from '../types';

const CHANNELS = ['Email', 'SMS', 'Push', 'Phone call'];
const TARGET_SET = new Set(['Email', 'Push']);

export default function T08({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['SMS']);
  const successFiredRef = useRef(false);

  const handleConfirm = () => {
    if (successFiredRef.current) return;
    
    const currentSet = new Set(selected);
    if (currentSet.size === TARGET_SET.size && 
        Array.from(TARGET_SET).every(v => currentSet.has(v))) {
      successFiredRef.current = true;
      onSuccess();
    }
  };

  return (
    <Card 
      title="Alert channels" 
      style={{ 
        width: 450,
        background: '#1f1f1f',
        borderColor: '#303030',
      }}
      headStyle={{ 
        background: '#1f1f1f', 
        color: '#fff',
        borderColor: '#303030',
      }}
      bodyStyle={{ background: '#1f1f1f' }}
      data-testid="alert-channels-group"
    >
      <div style={{ marginBottom: 8, color: '#aaa', fontSize: 12 }}>
        Select Email and Push, then Save changes → Confirm.
      </div>
      <Checkbox.Group
        value={selected}
        onChange={(values) => setSelected(values as string[])}
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}
      >
        {CHANNELS.map(channel => (
          <Checkbox
            key={channel}
            value={channel}
            style={{
              padding: '8px 16px',
              border: '1px solid #434343',
              borderRadius: 6,
              background: selected.includes(channel) ? '#1677ff' : '#2a2a2a',
              color: selected.includes(channel) ? '#fff' : '#ddd',
            }}
            data-testid={`channel-${channel.toLowerCase().replace(' ', '-')}`}
          >
            {channel}
          </Checkbox>
        ))}
      </Checkbox.Group>

      <Popconfirm
        title="Save changes?"
        onConfirm={handleConfirm}
        okText="Confirm"
        cancelText="Cancel"
        okButtonProps={{ 'data-testid': 'confirm-button' } as React.ComponentProps<typeof Button>}
      >
        <Button type="primary" data-testid="save-changes-button">
          Save changes
        </Button>
      </Popconfirm>
    </Card>
  );
}
