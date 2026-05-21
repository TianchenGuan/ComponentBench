'use client';

/**
 * progress_bar-antd-T10: Segmented wizard: reach step 3 of 5
 *
 * Layout: settings_panel. The page looks like a product setup screen with a left-aligned 
 * settings sidebar (static) and a main content panel.
 *
 * Target component: an AntD segmented line Progress bar labeled "Setup wizard progress". 
 * It uses the `steps=5` configuration so the bar is divided into 5 discrete segments. 
 * The percent text is shown below the bar as "Step X of 5".
 *
 * Initial state:
 * - Setup wizard progress starts at step 1 of 5 (20%).
 *
 * Controls:
 * - "Back" button: decreases step by 1 (min 1).
 * - "Next step" button: increases step by 1 (max 5).
 *
 * Distractor instance (instances=2):
 * - A separate standard Progress bar labeled "Disk usage" (continuous) is shown further down 
 *   the panel and must not be used.
 *
 * Success: "Setup wizard progress" segmented bar shows exactly 3 filled segments (60%).
 */

import React, { useState, useEffect } from 'react';
import { Card, Progress, Button, Space, Typography, Layout, Menu } from 'antd';
import { SettingOutlined, DatabaseOutlined, UserOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text, Title } = Typography;
const { Sider, Content } = Layout;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [step, setStep] = useState(1);
  const successFiredRef = React.useRef(false);

  useEffect(() => {
    if (step === 3 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [step, onSuccess]);

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
    successFiredRef.current = false;
  };

  const handleNext = () => {
    setStep((prev) => Math.min(5, prev + 1));
    if (step === 2) {
      successFiredRef.current = false;
    }
  };

  const percent = (step / 5) * 100;

  return (
    <Layout style={{ minHeight: 400, background: '#f5f5f5' }}>
      <Sider width={200} style={{ background: '#fff', borderRight: '1px solid #e8e8e8' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e8e8e8' }}>
          <Title level={5} style={{ margin: 0 }}>Settings</Title>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['setup']}
          items={[
            { key: 'setup', icon: <SettingOutlined />, label: 'Setup Wizard' },
            { key: 'storage', icon: <DatabaseOutlined />, label: 'Storage' },
            { key: 'users', icon: <UserOutlined />, label: 'Users' },
          ]}
        />
      </Sider>
      <Content style={{ padding: 24, background: '#f5f5f5' }}>
        <Card style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 8 }}>
            <Text strong>Setup wizard progress</Text>
          </div>
          <div style={{ marginBottom: 4 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>Target: Step 3 of 5</Text>
          </div>
          <Progress
            percent={percent}
            steps={5}
            status="normal"
            showInfo={false}
            data-testid="wizard-progress"
          />
          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
            Step {step} of 5
          </Text>
          <Space style={{ marginTop: 16 }}>
            <Button onClick={handleBack} disabled={step === 1}>
              Back
            </Button>
            <Button type="primary" onClick={handleNext} disabled={step === 5}>
              Next step
            </Button>
          </Space>
        </Card>

        <Card>
          <div style={{ marginBottom: 8 }}>
            <Text strong>Disk usage</Text>
          </div>
          <Progress
            percent={68}
            status="normal"
            data-testid="disk-usage-progress"
          />
        </Card>
      </Content>
    </Layout>
  );
}
