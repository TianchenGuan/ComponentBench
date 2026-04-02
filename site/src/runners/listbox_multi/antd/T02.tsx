'use client';

/**
 * listbox_multi-antd-T02: Backup carriers only
 *
 * Layout: isolated_card centered. The card contains two side-by-side sections labeled "Primary carriers" (left) and "Backup carriers" (right).
 * Each section is a multi-select listbox implemented with Ant Design Checkbox.Group in a vertical stack.
 * Primary carriers options: FedEx, UPS, USPS.
 * Backup carriers options: UPS, USPS, DHL, Local Courier.
 * Initial state: all options unchecked in both lists.
 * No overlays. No scrolling.
 * Disambiguation: both lists contain "UPS" and "USPS", so the label at the top of each section is the main cue.
 *
 * Success: The target listbox (Backup carriers) has exactly these selected items: USPS, DHL.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Checkbox, Space, Typography, Row, Col } from 'antd';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const { Text, Title } = Typography;

const primaryOptions = ['FedEx', 'UPS', 'USPS'];
const backupOptions = ['UPS', 'USPS', 'DHL', 'Local Courier'];
const targetSet = ['USPS', 'DHL'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [primarySelected, setPrimarySelected] = useState<string[]>([]);
  const [backupSelected, setBackupSelected] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(backupSelected, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [backupSelected, onSuccess]);

  return (
    <Card title="Shipping carriers" style={{ width: 600 }}>
      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        Shipping carriers: choose Primary and Backup carriers.
      </Text>
      <Row gutter={32}>
        <Col span={12}>
          <Title level={5}>Primary carriers</Title>
          <Checkbox.Group
            data-testid="listbox-primary-carriers"
            value={primarySelected}
            onChange={(values) => setPrimarySelected(values as string[])}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {primaryOptions.map((opt) => (
                <Checkbox key={opt} value={opt} data-value={opt}>
                  {opt}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </Col>
        <Col span={12}>
          <Title level={5}>Backup carriers</Title>
          <Checkbox.Group
            data-testid="listbox-backup-carriers"
            aria-labelledby="backup-carriers-label"
            value={backupSelected}
            onChange={(values) => setBackupSelected(values as string[])}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {backupOptions.map((opt) => (
                <Checkbox key={opt} value={opt} data-value={opt}>
                  {opt}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </Col>
      </Row>
    </Card>
  );
}
