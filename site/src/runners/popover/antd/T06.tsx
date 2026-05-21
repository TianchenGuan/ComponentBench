'use client';

/**
 * popover-antd-T06: Find and open Session timeout info popover (scroll)
 *
 * Settings panel layout with a vertically scrollable content area (about 2–3 viewport heights).
 * The panel contains multiple sections with toggles, selects, and text descriptions (distractors).
 * In the 'Security' section near the bottom, there is a row labeled 'Session timeout' with a small info icon.
 * The 'Session timeout' info icon triggers an AntD Popover (trigger='click').
 * Popover title: 'Session timeout'; content: one paragraph.
 * Initial state: popover is closed; the 'Security' section is initially below the fold.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Popover, Switch, Select, Typography, Divider } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text, Title } = Typography;

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, onSuccess]);

  const popoverContent = (
    <div style={{ maxWidth: 250 }} data-testid="popover-session-timeout">
      <p style={{ margin: 0 }}>
        Session timeout determines how long you can remain inactive before being automatically logged out for security.
      </p>
    </div>
  );

  return (
    <Card title="Settings" style={{ width: 400, maxHeight: 400, overflow: 'auto' }}>
      {/* General Section */}
      <Title level={5}>General</Title>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Text>Dark mode</Text>
        <Switch />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Text>Language</Text>
        <Select defaultValue="en" style={{ width: 120 }} options={[{ value: 'en', label: 'English' }]} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Text>Timezone</Text>
        <Select defaultValue="utc" style={{ width: 120 }} options={[{ value: 'utc', label: 'UTC' }]} />
      </div>

      <Divider />

      {/* Notifications Section */}
      <Title level={5}>Notifications</Title>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Text>Email notifications</Text>
        <Switch defaultChecked />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Text>Push notifications</Text>
        <Switch />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Text>SMS alerts</Text>
        <Switch />
      </div>

      <Divider />

      {/* Privacy Section */}
      <Title level={5}>Privacy</Title>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Text>Profile visibility</Text>
        <Select defaultValue="public" style={{ width: 120 }} options={[{ value: 'public', label: 'Public' }]} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Text>Data sharing</Text>
        <Switch />
      </div>

      <Divider />

      {/* Security Section - target is here */}
      <Title level={5}>Security</Title>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Text>Two-factor authentication</Text>
        <Switch />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text>Session timeout</Text>
          <Popover
            content={popoverContent}
            title="Session timeout"
            trigger="click"
            open={open}
            onOpenChange={setOpen}
          >
            <InfoCircleOutlined
              data-testid="popover-target-session-timeout"
              style={{ cursor: 'pointer', color: '#1677ff' }}
            />
          </Popover>
        </div>
        <Select defaultValue="30" style={{ width: 120 }} options={[{ value: '30', label: '30 minutes' }]} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Text>Login alerts</Text>
        <Switch defaultChecked />
      </div>
    </Card>
  );
}
