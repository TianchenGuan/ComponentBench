'use client';

/**
 * transfer_list-antd-T04: Add two SMS recipients in the correct section
 *
 * Layout: a form section titled "Notification routing" in the center of the page.
 * The form contains a few standard inputs (a disabled "Workspace" text field and a non-functional info tooltip)
 * to create low clutter, but only the transfer lists affect success.
 *
 * There are TWO AntD Transfer components stacked vertically:
 * 1) "Email recipients" (first transfer list)
 * 2) "SMS recipients" (second transfer list; this is the target instance)
 *
 * Each transfer list has columns labeled "Available contacts" (left) and "Selected" (right)
 * with the standard operation buttons in the middle. No search boxes are shown.
 *
 * Initial state:
 * - Email recipients: right list contains Eva Müller (pre-selected).
 * - SMS recipients: right list is empty.
 *
 * Both lists share the same 8 available contact names, including Priya Shah and Mateo Rossi.
 *
 * Success: SMS recipients Selected contains exactly: Priya Shah, Mateo Rossi (order ignore).
 * Only the "SMS recipients" instance is considered.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Transfer, Input, Typography, Space } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import type { TransferProps } from 'antd';
import type { TaskComponentProps, TransferItem } from '../types';
import { setsEqual } from '../types';

const { Text } = Typography;

const allContacts: TransferItem[] = [
  { key: 'priya-shah', title: 'Priya Shah' },
  { key: 'mateo-rossi', title: 'Mateo Rossi' },
  { key: 'eva-muller', title: 'Eva Müller' },
  { key: 'chen-wei', title: 'Chen Wei' },
  { key: 'anna-kowalski', title: 'Anna Kowalski' },
  { key: 'james-thompson', title: 'James Thompson' },
  { key: 'yuki-tanaka', title: 'Yuki Tanaka' },
  { key: 'omar-hassan', title: 'Omar Hassan' },
];

const targetKeys = ['priya-shah', 'mateo-rossi'];

export default function T04({ onSuccess }: TaskComponentProps) {
  // Email transfer state
  const [emailTargetKeys, setEmailTargetKeys] = useState<string[]>(['eva-muller']);
  const [emailSelectedKeys, setEmailSelectedKeys] = useState<string[]>([]);

  // SMS transfer state
  const [smsTargetKeys, setSmsTargetKeys] = useState<string[]>([]);
  const [smsSelectedKeys, setSmsSelectedKeys] = useState<string[]>([]);

  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(smsTargetKeys, targetKeys)) {
      successFired.current = true;
      onSuccess();
    }
  }, [smsTargetKeys, onSuccess]);

  const handleEmailChange: TransferProps['onChange'] = (newTargetKeys) => {
    setEmailTargetKeys(newTargetKeys as string[]);
  };

  const handleEmailSelectChange: TransferProps['onSelectChange'] = (source, target) => {
    setEmailSelectedKeys([...source, ...target] as string[]);
  };

  const handleSmsChange: TransferProps['onChange'] = (newTargetKeys) => {
    setSmsTargetKeys(newTargetKeys as string[]);
  };

  const handleSmsSelectChange: TransferProps['onSelectChange'] = (source, target) => {
    setSmsSelectedKeys([...source, ...target] as string[]);
  };

  return (
    <Card title="Notification routing" style={{ width: 750 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Workspace field (disabled, clutter) */}
        <div>
          <Text type="secondary">
            Workspace <InfoCircleOutlined style={{ marginLeft: 4 }} />
          </Text>
          <Input disabled value="Default Workspace" style={{ marginTop: 8, maxWidth: 300 }} />
        </div>

        {/* Email recipients transfer */}
        <div data-testid="transfer-email">
          <Text strong style={{ display: 'block', marginBottom: 12 }}>
            Email recipients
          </Text>
          <Transfer
            dataSource={allContacts}
            titles={['Available contacts', 'Selected']}
            targetKeys={emailTargetKeys}
            selectedKeys={emailSelectedKeys}
            onChange={handleEmailChange}
            onSelectChange={handleEmailSelectChange}
            render={(item) => item.title}
            listStyle={{ width: 250, height: 200 }}
          />
        </div>

        {/* SMS recipients transfer (target instance) */}
        <div data-testid="transfer-sms">
          <Text strong style={{ display: 'block', marginBottom: 12 }}>
            SMS recipients
          </Text>
          <Transfer
            dataSource={allContacts}
            titles={['Available contacts', 'Selected']}
            targetKeys={smsTargetKeys}
            selectedKeys={smsSelectedKeys}
            onChange={handleSmsChange}
            onSelectChange={handleSmsSelectChange}
            render={(item) => item.title}
            listStyle={{ width: 250, height: 200 }}
          />
        </div>
      </Space>
    </Card>
  );
}
