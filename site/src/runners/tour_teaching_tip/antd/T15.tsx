'use client';

/**
 * tour_teaching_tip-antd-T15: Top-right placement: dismiss tour
 *
 * setup_description:
 * A small header toolbar is pinned near the top-right of the viewport (placement=top_right) in a light theme.
 * A "Help" icon button in the toolbar is the Tour target. The AntD Tour is currently open on step 1 titled "Toolbar help".
 * Because the Tour is anchored to a top-right element, the guide card is positioned close to the viewport edge; all controls remain visible but more cramped.
 * The Tour has a close (×) icon in the header and standard navigation buttons in the footer (not required).
 *
 * success_trigger: Tour overlay is closed.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Tour, Space } from 'antd';
import { QuestionCircleOutlined, SettingOutlined, BellOutlined } from '@ant-design/icons';
import type { TourProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T15({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true);
  const [current, setCurrent] = useState(0);
  const successCalledRef = useRef(false);

  const helpRef = useRef<HTMLButtonElement>(null);
  const settingsRef = useRef<HTMLButtonElement>(null);

  const steps: TourProps['steps'] = [
    {
      title: 'Toolbar help',
      description: 'Click here anytime to access help resources.',
      target: () => helpRef.current!,
    },
    {
      title: 'Settings',
      description: 'Configure your application settings.',
      target: () => settingsRef.current!,
    },
  ];

  useEffect(() => {
    if (!open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  return (
    <>
      <div
        style={{
          padding: '8px 16px',
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
        data-testid="toolbar"
      >
        <Space>
          <Button icon={<BellOutlined />} size="small" data-testid="notifications-btn" />
          <Button ref={settingsRef} icon={<SettingOutlined />} size="small" data-testid="settings-btn" />
          <Button ref={helpRef} icon={<QuestionCircleOutlined />} size="small" data-testid="help-btn" />
        </Space>
      </div>

      <Tour
        open={open}
        onClose={() => setOpen(false)}
        current={current}
        onChange={setCurrent}
        steps={steps}
        data-testid="tour-toolbar"
      />
    </>
  );
}
