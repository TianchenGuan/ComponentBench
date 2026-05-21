'use client';

/**
 * toggle_button_group_multi-antd-T04: Small compact notification channels
 *
 * Layout: isolated_card centered in the viewport, but the card uses compact spacing 
 * and a small component size tier.
 *
 * The card title is "Notification channels". Beneath it is a compact, small-size 
 * multi-select toggle group with three pill buttons:
 * - Email
 * - SMS
 * - Push
 *
 * Initial state:
 * - Email is selected.
 * - SMS is not selected.
 * - Push is not selected.
 *
 * The buttons are smaller than default (reduced padding and font size), with tighter 
 * spacing between them. Selections apply immediately with a highlighted background 
 * and a small check indicator.
 *
 * No Apply/Save controls and no other distractors.
 *
 * Success: Selected options equal exactly: Email, Push
 */

import React, { useState, useEffect } from 'react';
import { Card, Checkbox } from 'antd';
import type { TaskComponentProps } from '../types';

const CHANNELS = ['Email', 'SMS', 'Push'];
const TARGET_SET = new Set(['Email', 'Push']);

export default function T04({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Email']);

  useEffect(() => {
    const currentSet = new Set(selected);
    if (currentSet.size === TARGET_SET.size && 
        Array.from(TARGET_SET).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card 
      title="Notification channels" 
      style={{ width: 320 }} 
      size="small"
      data-testid="notification-channels-group"
    >
      <div style={{ marginBottom: 4, color: '#666', fontSize: 12 }}>
        Select Email and Push.
      </div>
      <Checkbox.Group
        value={selected}
        onChange={(values) => setSelected(values as string[])}
        style={{ display: 'flex', gap: 4 }}
      >
        {CHANNELS.map(channel => (
          <Checkbox
            key={channel}
            value={channel}
            style={{
              padding: '4px 10px',
              border: '1px solid #d9d9d9',
              borderRadius: 16,
              background: selected.includes(channel) ? '#1677ff' : '#fff',
              color: selected.includes(channel) ? '#fff' : '#333',
              fontSize: 12,
            }}
            data-testid={`channel-${channel.toLowerCase()}`}
          >
            {channel}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </Card>
  );
}
