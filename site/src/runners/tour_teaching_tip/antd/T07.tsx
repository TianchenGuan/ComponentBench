'use client';

/**
 * tour_teaching_tip-antd-T07: Start Profile Settings tour
 *
 * setup_description:
 * A settings_panel layout is displayed in the center of the viewport (light theme, comfortable spacing). The panel is a single scrollable card titled "Profile Settings".
 * Near the top of the panel there is a button labeled "Start Profile Tour". Below it are a few realistic but non-required controls (e.g., a theme toggle, a language select, and a disabled "Delete account" button) that serve as low clutter.
 * Clicking "Start Profile Tour" opens an AntD Tour (mask enabled) with 3 steps anchored to elements inside the settings panel:
 * 1) "Profile photo" (points to an avatar uploader),
 * 2) "Display name" (points to a name field),
 * 3) "Save profile" (points to a save button).
 * The tour is initially closed; default Next/Previous buttons and a close (×) icon are visible when open.
 *
 * success_trigger: Tour overlay is open, current step title is "Profile photo", current step index equals 0.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tour, Input, Select, Switch, Avatar, Space, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { TourProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const successCalledRef = useRef(false);

  const avatarRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const saveRef = useRef<HTMLButtonElement>(null);

  const steps: TourProps['steps'] = [
    {
      title: 'Profile photo',
      description: 'Upload or change your profile photo here.',
      target: () => avatarRef.current!,
    },
    {
      title: 'Display name',
      description: 'Enter the name that will be shown to other users.',
      target: () => nameRef.current!,
    },
    {
      title: 'Save profile',
      description: 'Click here to save all your profile changes.',
      target: () => saveRef.current!,
    },
  ];

  useEffect(() => {
    if (open && current === 0 && !successCalledRef.current) {
      const titleNode = document.querySelector('.ant-tour-title');
      if (titleNode?.textContent === 'Profile photo') {
        successCalledRef.current = true;
        onSuccess();
      }
    }
  }, [open, current, onSuccess]);

  useEffect(() => {
    const checkTour = () => {
      if (open && current === 0 && !successCalledRef.current) {
        const titleNode = document.querySelector('.ant-tour-title');
        if (titleNode?.textContent === 'Profile photo') {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkTour);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [open, current, onSuccess]);

  return (
    <>
      <Card
        title="Profile Settings"
        style={{ width: 450, maxHeight: 500, overflow: 'auto' }}
        data-testid="settings-panel"
      >
        <Button
          type="primary"
          onClick={() => {
            setOpen(true);
            setCurrent(0);
          }}
          style={{ marginBottom: 16 }}
          data-testid="start-profile-tour-btn"
        >
          Start Profile Tour
        </Button>

        <Divider />

        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div ref={avatarRef} data-testid="avatar-section">
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Profile Photo</div>
            <Space>
              <Avatar size={64} icon={<UserOutlined />} />
              <Button size="small">Change</Button>
            </Space>
          </div>

          <div ref={nameRef} data-testid="name-section">
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Display Name</div>
            <Input placeholder="Enter your name" style={{ width: 250 }} />
          </div>

          <div>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Theme</div>
            <Switch checkedChildren="Dark" unCheckedChildren="Light" />
          </div>

          <div>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Language</div>
            <Select defaultValue="en" style={{ width: 150 }}>
              <Select.Option value="en">English</Select.Option>
              <Select.Option value="es">Spanish</Select.Option>
              <Select.Option value="fr">French</Select.Option>
            </Select>
          </div>

          <Divider />

          <Button ref={saveRef} type="primary" data-testid="save-profile-btn">
            Save Profile
          </Button>

          <Button danger disabled data-testid="delete-account-btn">
            Delete Account
          </Button>
        </Space>
      </Card>

      <Tour
        open={open}
        onClose={() => setOpen(false)}
        current={current}
        onChange={setCurrent}
        steps={steps}
        mask={true}
        data-testid="tour-profile"
      />
    </>
  );
}
