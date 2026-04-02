'use client';

/**
 * date_picker_range-antd-T09: Set Secondary maintenance window among three pickers
 *
 * A settings_panel layout with a left navigation sidebar and a
 * right content area. The content area uses compact spacing and contains three visually
 * similar Ant Design RangePickers (instances=3) stacked vertically:
 * 1) 'Primary maintenance window' (prefilled),
 * 2) 'Secondary maintenance window' (empty — this is the target),
 * 3) 'Reporting window' (prefilled).
 * Additional distractors include two toggle switches ('Email alerts', 'Auto-reschedule')
 * and a Save button that does nothing for the task.
 *
 * Success: Secondary maintenance window has start=2026-09-02, end=2026-09-09
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Switch, Button, Menu, Layout, Typography, Space } from 'antd';
import { SettingOutlined, CalendarOutlined, BellOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const { RangePicker } = DatePicker;
const { Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function T09({ onSuccess }: TaskComponentProps) {
  const [primaryValue, setPrimaryValue] = useState<[Dayjs | null, Dayjs | null] | null>([
    dayjs('2026-08-01'),
    dayjs('2026-08-07'),
  ]);
  const [secondaryValue, setSecondaryValue] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [reportingValue, setReportingValue] = useState<[Dayjs | null, Dayjs | null] | null>([
    dayjs('2026-10-01'),
    dayjs('2026-10-15'),
  ]);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoReschedule, setAutoReschedule] = useState(false);

  useEffect(() => {
    if (
      secondaryValue &&
      secondaryValue[0] &&
      secondaryValue[1] &&
      secondaryValue[0].format('YYYY-MM-DD') === '2026-09-02' &&
      secondaryValue[1].format('YYYY-MM-DD') === '2026-09-09'
    ) {
      onSuccess();
    }
  }, [secondaryValue, onSuccess]);

  return (
    <Layout style={{ minHeight: 500, background: '#fff' }}>
      <Sider width={200} style={{ background: '#f5f5f5', borderRight: '1px solid #e8e8e8' }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['maintenance']}
          style={{ height: '100%', borderRight: 0, background: '#f5f5f5' }}
          items={[
            { key: 'general', icon: <SettingOutlined />, label: 'General' },
            { key: 'maintenance', icon: <CalendarOutlined />, label: 'Maintenance' },
            { key: 'notifications', icon: <BellOutlined />, label: 'Notifications' },
          ]}
        />
      </Sider>
      <Content style={{ padding: 16, background: '#fff' }}>
        <Title level={5} style={{ marginBottom: 16 }}>Maintenance Windows</Title>
        
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 500 }}>
              Primary maintenance window
            </Text>
            <RangePicker
              value={primaryValue}
              onChange={(dates) => setPrimaryValue(dates)}
              format="YYYY-MM-DD"
              placeholder={['Start', 'End']}
              size="small"
              style={{ width: '100%' }}
              data-testid="primary-window-range"
            />
          </div>
          
          <div>
            <Text style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 500 }}>
              Secondary maintenance window
            </Text>
            <RangePicker
              value={secondaryValue}
              onChange={(dates) => setSecondaryValue(dates)}
              format="YYYY-MM-DD"
              placeholder={['Start', 'End']}
              size="small"
              style={{ width: '100%' }}
              data-testid="secondary-window-range"
            />
          </div>
          
          <div>
            <Text style={{ display: 'block', marginBottom: 4, fontSize: 12, fontWeight: 500 }}>
              Reporting window
            </Text>
            <RangePicker
              value={reportingValue}
              onChange={(dates) => setReportingValue(dates)}
              format="YYYY-MM-DD"
              placeholder={['Start', 'End']}
              size="small"
              style={{ width: '100%' }}
              data-testid="reporting-window-range"
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
            <Text style={{ fontSize: 13 }}>Email alerts</Text>
            <Switch checked={emailAlerts} onChange={setEmailAlerts} size="small" data-testid="email-alerts-switch" />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
            <Text style={{ fontSize: 13 }}>Auto-reschedule</Text>
            <Switch checked={autoReschedule} onChange={setAutoReschedule} size="small" data-testid="auto-reschedule-switch" />
          </div>
          
          <Button type="primary" size="small" data-testid="save-button">
            Save changes
          </Button>
        </Space>
      </Content>
    </Layout>
  );
}
