'use client';

/**
 * stepper-antd-T09: Dashboard: set Incident response step to Containment
 *
 * Layout: dashboard with multiple cards (placement=bottom_right).
 * Three Ant Design Steps components in separate dashboard cards:
 *   1) "User onboarding" (distractor)
 *   2) "Checkout pipeline" (distractor)
 *   3) "Incident response" (TARGET)
 * Incident response steps: "Detect" → "Triage" → "Containment" → "Eradication" → "Recovery".
 * Initial state: Incident response is on "Triage" (index 1).
 * Success: Incident response active step is "Containment" (index 2).
 */

import React, { useState } from 'react';
import { Steps, Card, Button, Statistic, Row, Col } from 'antd';
import type { TaskComponentProps } from '../types';

const userOnboardingSteps = [
  { title: 'Welcome' },
  { title: 'Profile' },
  { title: 'Review' },
  { title: 'Done' },
];

const checkoutSteps = [
  { title: 'Cart' },
  { title: 'Shipping' },
  { title: 'Review' },
  { title: 'Complete' },
];

const incidentSteps = [
  { title: 'Detect' },
  { title: 'Triage' },
  { title: 'Containment' },
  { title: 'Eradication' },
  { title: 'Recovery' },
];

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [userOnboarding, setUserOnboarding] = useState(1);
  const [checkout, setCheckout] = useState(2);
  const [incident, setIncident] = useState(1); // Start at "Triage"

  const handleIncidentChange = (value: number) => {
    setIncident(value);
    if (value === 2) {
      onSuccess();
    }
  };

  return (
    <div style={{ width: 900 }}>
      {/* KPI tiles */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card size="small">
            <Statistic title="Active Users" value={1234} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="Open Tickets" value={42} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="Response Time" value="2.3s" />
          </Card>
        </Col>
        <Col span={6}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button size="small">Export</Button>
            <Button size="small">Refresh</Button>
            <Button size="small">Help</Button>
          </div>
        </Col>
      </Row>

      {/* Dashboard Cards with Steppers */}
      <Row gutter={16}>
        <Col span={12}>
          <Card
            title="User onboarding"
            size="small"
            style={{ marginBottom: 16 }}
            data-testid="stepper-user-onboarding"
          >
            <Steps
              current={userOnboarding}
              onChange={setUserOnboarding}
              items={userOnboardingSteps}
              size="small"
            />
          </Card>
          <Card
            title="Checkout pipeline"
            size="small"
            data-testid="stepper-checkout-pipeline"
          >
            <Steps
              current={checkout}
              onChange={setCheckout}
              items={checkoutSteps}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="Incident response"
            size="small"
            data-testid="stepper-incident-response"
          >
            <Steps
              current={incident}
              onChange={handleIncidentChange}
              items={incidentSteps}
              size="small"
            />
          </Card>
          {/* Line chart placeholder */}
          <Card title="Metrics" size="small" style={{ marginTop: 16, height: 150 }}>
            <div style={{ color: '#999', fontSize: 12 }}>Chart placeholder</div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
