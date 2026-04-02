'use client';

/**
 * tour_teaching_tip-antd-T30: Non-modal dark dashboard: reach Save changes in Settings Tour
 *
 * setup_description:
 * A dark-themed dashboard (layout=dashboard, clutter=high) includes many interactive controls: a left nav, header actions, a settings form card, and a data table.
 * A single AntD Tour ("Settings Tour") is open on page load on step 1 of 5 titled "Settings overview".
 * This tour is configured as non-modal (mask=false), so the background dashboard remains interactive and visually busy while the Tour is open.
 * The Settings Tour step titles are: "Settings overview" → "Edit profile" → "Notifications" → "Save changes" → "Done".
 * There is no second Tour instance; difficulty comes from background interference rather than instance disambiguation.
 *
 * success_trigger: Tour overlay is open, current step title is "Save changes", current step index equals 3.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tour, Input, Switch, Table, Menu, Space, Row, Col, Statistic } from 'antd';
import type { TourProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T30({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true);
  const [current, setCurrent] = useState(0);
  const successCalledRef = useRef(false);

  const overviewRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const saveRef = useRef<HTMLButtonElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  const steps: TourProps['steps'] = [
    { title: 'Settings overview', description: 'Overview of your settings.', target: () => overviewRef.current! },
    { title: 'Edit profile', description: 'Update your profile information.', target: () => profileRef.current! },
    { title: 'Notifications', description: 'Configure notification settings.', target: () => notificationsRef.current! },
    { title: 'Save changes', description: 'Save all your changes here.', target: () => saveRef.current! },
    { title: 'Done', description: 'You\'re all set!', target: () => doneRef.current! },
  ];

  useEffect(() => {
    if (open && current === 3 && !successCalledRef.current) {
      const titleNode = document.querySelector('.ant-tour-title');
      if (titleNode?.textContent === 'Save changes') {
        successCalledRef.current = true;
        onSuccess();
      }
    }
  }, [open, current, onSuccess]);

  useEffect(() => {
    const checkTour = () => {
      if (open && current === 3 && !successCalledRef.current) {
        const titleNode = document.querySelector('.ant-tour-title');
        if (titleNode?.textContent === 'Save changes') {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkTour);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [open, current, onSuccess]);

  const tableData = [
    { key: '1', setting: 'Dark mode', value: 'Enabled' },
    { key: '2', setting: 'Language', value: 'English' },
    { key: '3', setting: 'Timezone', value: 'UTC-5' },
  ];

  const columns = [
    { title: 'Setting', dataIndex: 'setting', key: 'setting' },
    { title: 'Value', dataIndex: 'value', key: 'value' },
  ];

  return (
    <>
      <div style={{ display: 'flex', width: 800 }} data-testid="dark-dashboard">
        {/* Left navigation */}
        <div style={{ width: 160, background: '#001529', minHeight: 450 }}>
          <Menu
            mode="vertical"
            theme="dark"
            defaultSelectedKeys={['settings']}
            items={[
              { key: 'home', label: 'Home' },
              { key: 'settings', label: 'Settings' },
              { key: 'reports', label: 'Reports' },
            ]}
          />
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: 16 }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
              padding: '8px 12px',
              background: '#1f1f1f',
              borderRadius: 8,
            }}
          >
            <h3 style={{ margin: 0 }}>Settings Dashboard</h3>
            <Space>
              <Button size="small">Export</Button>
              <Button size="small">Help</Button>
            </Space>
          </div>

          {/* KPIs */}
          <Row gutter={12} style={{ marginBottom: 16 }}>
            <Col span={12}>
              <Card size="small"><Statistic title="Active Sessions" value={23} /></Card>
            </Col>
            <Col span={12}>
              <Card size="small"><Statistic title="Pending Changes" value={5} /></Card>
            </Col>
          </Row>

          {/* Settings form */}
          <Card
            size="small"
            title={<span ref={overviewRef}>Settings</span>}
            style={{ marginBottom: 16 }}
            data-testid="settings-card"
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div ref={profileRef} data-testid="profile-section">
                <label style={{ display: 'block', marginBottom: 4 }}>Display Name</label>
                <Input placeholder="Your name" size="small" />
              </div>

              <div ref={notificationsRef} data-testid="notifications-section">
                <label style={{ display: 'block', marginBottom: 4 }}>Email Notifications</label>
                <Switch size="small" defaultChecked />
              </div>

              <Button ref={saveRef} type="primary" size="small" data-testid="save-btn">
                Save changes
              </Button>

              <div ref={doneRef} style={{ color: '#52c41a', fontSize: 12 }} data-testid="done-section">
                Settings saved successfully
              </div>
            </Space>
          </Card>

          {/* Settings table */}
          <Card size="small" title="Current Settings">
            <Table dataSource={tableData} columns={columns} pagination={false} size="small" />
          </Card>
        </div>
      </div>

      <Tour
        open={open}
        onClose={() => setOpen(false)}
        current={current}
        onChange={setCurrent}
        steps={steps}
        mask={false}
        data-testid="tour-settings"
      />
    </>
  );
}
