'use client';

/**
 * datetime_picker_range-antd-T10: Deployments table: scroll and set the Staging window (cross-year)
 *
 * Layout: settings_panel with multiple collapsible sections and form controls (medium clutter).
 * Light theme, comfortable spacing, default scale.
 * The page initially shows the top of the settings panel; the "Deployment windows" section is further down and requires scrolling to reach.
 * Inside "Deployment windows" is a compact table with three AntD RangePickers (showTime) in separate rows labeled "Dev", "Staging", and "Prod".
 * All three pickers look identical and each opens a popover that requires clicking OK to commit.
 * Initial state: Dev and Prod rows are pre-filled with other ranges; Staging starts empty.
 *
 * Success: The Staging row's RangePicker equals start=2026-12-28T18:00:00, end=2027-01-02T09:00:00 (local time) after OK is clicked.
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Collapse, Input, Switch, Typography, Table } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { Text } = Typography;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [devValue] = useState<[Dayjs | null, Dayjs | null]>([
    dayjs('2026-01-15 08:00', 'YYYY-MM-DD HH:mm'),
    dayjs('2026-01-15 12:00', 'YYYY-MM-DD HH:mm'),
  ]);
  const [stagingValue, setStagingValue] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [prodValue] = useState<[Dayjs | null, Dayjs | null]>([
    dayjs('2026-02-01 02:00', 'YYYY-MM-DD HH:mm'),
    dayjs('2026-02-01 04:00', 'YYYY-MM-DD HH:mm'),
  ]);

  useEffect(() => {
    if (stagingValue && stagingValue[0] && stagingValue[1]) {
      const startMatch = stagingValue[0].format('YYYY-MM-DD HH:mm') === '2026-12-28 18:00';
      const endMatch = stagingValue[1].format('YYYY-MM-DD HH:mm') === '2027-01-02 09:00';
      if (startMatch && endMatch) {
        onSuccess();
      }
    }
  }, [stagingValue, onSuccess]);

  const deploymentData = [
    {
      key: 'dev',
      environment: 'Dev',
      picker: (
        <RangePicker
          size="small"
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          value={devValue}
          disabled
          placeholder={['Start', 'End']}
          style={{ width: '100%' }}
          data-cb-instance="Deployment windows > Dev"
        />
      ),
    },
    {
      key: 'staging',
      environment: 'Staging',
      picker: (
        <RangePicker
          size="small"
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          value={stagingValue}
          onChange={(dates) => setStagingValue(dates)}
          placeholder={['Start', 'End']}
          style={{ width: '100%' }}
          data-cb-instance="Deployment windows > Staging"
          data-testid="dt-range-staging"
          needConfirm
        />
      ),
    },
    {
      key: 'prod',
      environment: 'Prod',
      picker: (
        <RangePicker
          size="small"
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          value={prodValue}
          disabled
          placeholder={['Start', 'End']}
          style={{ width: '100%' }}
          data-cb-instance="Deployment windows > Prod"
        />
      ),
    },
  ];

  const columns = [
    { title: 'Environment', dataIndex: 'environment', key: 'environment', width: 100 },
    { title: 'Deployment Window', dataIndex: 'picker', key: 'picker' },
  ];

  return (
    <div style={{ maxWidth: 600, height: 500, overflow: 'auto' }}>
      <Card title="Settings" style={{ marginBottom: 16 }}>
        <Collapse defaultActiveKey={['general']}>
          <Panel header="General" key="general">
            <div style={{ marginBottom: 12 }}>
              <Text style={{ display: 'block', marginBottom: 4 }}>Application Name</Text>
              <Input defaultValue="MyApp Production" style={{ width: '100%' }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <Text style={{ display: 'block', marginBottom: 4 }}>Region</Text>
              <Input defaultValue="us-east-1" style={{ width: '100%' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text>Enable monitoring</Text>
              <Switch defaultChecked />
            </div>
          </Panel>

          <Panel header="Notifications" key="notifications">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text>Email alerts</Text>
              <Switch defaultChecked />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text>Slack notifications</Text>
              <Switch />
            </div>
            <div style={{ marginBottom: 12 }}>
              <Text style={{ display: 'block', marginBottom: 4 }}>Webhook URL</Text>
              <Input placeholder="https://..." style={{ width: '100%' }} />
            </div>
          </Panel>

          <Panel header="Security" key="security">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text>Two-factor authentication</Text>
              <Switch defaultChecked />
            </div>
            <div style={{ marginBottom: 12 }}>
              <Text style={{ display: 'block', marginBottom: 4 }}>API Key</Text>
              <Input.Password defaultValue="sk-xxx-xxxx-xxxx" style={{ width: '100%' }} />
            </div>
          </Panel>

          <Panel header="Deployment Windows" key="deployment">
            <div style={{ marginBottom: 8, color: '#666', fontSize: 12 }}>
              Set the Staging row to: 2026-12-28 18:00 – 2027-01-02 09:00
            </div>
            <Table
              dataSource={deploymentData}
              columns={columns}
              pagination={false}
              size="small"
            />
          </Panel>
        </Collapse>
      </Card>
    </div>
  );
}
