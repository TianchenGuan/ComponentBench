'use client';

/**
 * switch-antd-T03: Privacy form: show profile photo
 *
 * Layout: form_section centered on the page with the heading "Privacy".
 * The section contains several non-required form fields (Display name text input and Time zone dropdown) above a single Ant Design Switch row.
 * The target switch is labeled "Show profile photo" with a short description underneath ("Visible to teammates").
 * Initial state: the "Show profile photo" switch is OFF.
 * Clutter: low — the other fields are present as realistic distractors but do not affect task success.
 * Feedback: toggling the switch updates immediately; no Save button and no toast appears.
 */

import React, { useState } from 'react';
import { Card, Switch, Input, Select, Form } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState(false);

  const handleChange = (newChecked: boolean) => {
    setChecked(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <Card title="Privacy" style={{ width: 450 }}>
      <Form layout="vertical">
        <Form.Item label="Display name">
          <Input placeholder="Enter display name" />
        </Form.Item>
        <Form.Item label="Time zone">
          <Select placeholder="Select time zone">
            <Select.Option value="utc">UTC</Select.Option>
            <Select.Option value="est">Eastern Time</Select.Option>
            <Select.Option value="pst">Pacific Time</Select.Option>
          </Select>
        </Form.Item>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
          <div>
            <div id="profile-photo-label">Show profile photo</div>
            <div style={{ fontSize: 12, color: '#999' }}>Visible to teammates</div>
          </div>
          <Switch
            checked={checked}
            onChange={handleChange}
            data-testid="show-profile-photo-switch"
            aria-labelledby="profile-photo-label"
            aria-checked={checked}
          />
        </div>
      </Form>
    </Card>
  );
}
