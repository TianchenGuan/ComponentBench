'use client';

/**
 * listbox_multi-antd-T06: Compact settings: select email settings
 *
 * Layout: settings_panel centered, with a left sidebar of tabs ("Profile", "Security", "Notifications"). Active tab is "Notifications".
 * Target component: a single Checkbox.Group listbox labeled "Email options".
 * Universal spacing mode is compact; the checkbox rows have reduced vertical padding.
 * Options (15 total) include several similar labels.
 * Initial state: "Weekly digest" is pre-selected; "Monthly digest" is also pre-selected.
 * No overlays. No scrolling.
 *
 * Success: The target listbox has exactly: Daily digest, Weekly digest, Security notices, New device sign-in.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Checkbox, Space, Typography, Menu, Row, Col } from 'antd';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const { Text, Title } = Typography;

const options = [
  'Daily digest',
  'Weekly digest',
  'Monthly digest',
  'Security notices',
  'Security notices (marketing)',
  'New device sign-in',
  'New device sign-in (beta)',
  'Comment replies',
  'Mentions',
  'Product announcements',
  'Feature updates',
  'Promotional emails',
  'Partner offers',
  'Survey requests',
  'Newsletter',
];

const targetSet = ['Daily digest', 'Weekly digest', 'Security notices', 'New device sign-in'];
const initialSelected = ['Weekly digest', 'Monthly digest'];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(selected, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card style={{ width: 700, padding: 0 }}>
      <Row>
        <Col span={6} style={{ borderRight: '1px solid #f0f0f0' }}>
          <Menu
            mode="inline"
            selectedKeys={['notifications']}
            items={[
              { key: 'profile', label: 'Profile' },
              { key: 'security', label: 'Security' },
              { key: 'notifications', label: 'Notifications' },
            ]}
            style={{ border: 'none', height: '100%' }}
          />
        </Col>
        <Col span={18} style={{ padding: 24 }}>
          <Title level={5} style={{ marginBottom: 8 }}>
            Notification settings: Email options
          </Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            Email options.
          </Text>
          <Checkbox.Group
            data-testid="listbox-email-options"
            value={selected}
            onChange={(values) => setSelected(values as string[])}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              {options.map((opt) => (
                <Checkbox key={opt} value={opt} data-value={opt} style={{ lineHeight: 1.5 }}>
                  {opt}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
          <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
            Selected: {selected.join(', ')}
          </Text>
        </Col>
      </Row>
    </Card>
  );
}
