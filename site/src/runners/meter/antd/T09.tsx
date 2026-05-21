'use client';

/**
 * meter-antd-T09: Match Primary Storage Used meter to reference and Save
 *
 * Setup Description:
 * A dashboard layout shows several cards with charts and KPIs; one card is titled "Storage".
 * - Layout: dashboard; placement center.
 * - Clutter: medium (other cards contain buttons, dropdowns, and non-target charts).
 * - Component: within the Storage card there are three AntD Progress (type='line') meters labeled:
 *   * "Storage Used (Primary)" (interactive target)
 *   * "Storage Used (Secondary)" (interactive)
 *   * "Storage Used (Archive)" (interactive)
 * - Guidance: mixed. Inside the Storage card, a small green reference bar swatch appears with label 
 *   "Reference level". It has no number, but its length is the visual target.
 * - Initial state: Primary=20%, Secondary=55%, Archive=80%. The reference bar corresponds to ~72%.
 * - Interaction: clicking on each meter bar sets its value. Numeric percent labels are hidden on all 
 *   three meters; you can hover to see a tooltip with exact percent.
 * - Confirmation: a footer button "Save changes" commits the current Primary value (pending vs committed). 
 *   Until saved, a small "Unsaved" badge remains.
 * - Feedback: after Save changes, a toast "Storage settings saved" appears and the Unsaved badge disappears.
 *
 * Success: Storage Used (Primary) matches the reference bar (±2 percentage points). Save changes has been clicked.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Progress, Typography, Button, Badge, Tooltip, Row, Col, message } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Title } = Typography;

const REFERENCE_VALUE = 72;

export default function T09({ onSuccess }: TaskComponentProps) {
  const [primary, setPrimary] = useState(20);
  const [secondary, setSecondary] = useState(55);
  const [archive, setArchive] = useState(80);
  const [committed, setCommitted] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (committed && Math.abs(primary - REFERENCE_VALUE) <= 2 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [primary, committed, onSuccess]);

  const handlePrimaryClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    setPrimary(Math.max(0, Math.min(100, percent)));
    setHasUnsavedChanges(true);
    setCommitted(false);
  };

  const handleSecondaryClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    setSecondary(Math.max(0, Math.min(100, percent)));
  };

  const handleArchiveClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    setArchive(Math.max(0, Math.min(100, percent)));
  };

  const handleSave = () => {
    setCommitted(true);
    setHasUnsavedChanges(false);
    message.success('Storage settings saved');
  };

  return (
    <Row gutter={16}>
      {/* Distractor cards */}
      <Col span={8}>
        <Card title="CPU Usage" size="small">
          <div style={{ height: 80, background: '#f5f5f5', borderRadius: 4 }} />
          <Button size="small" style={{ marginTop: 8 }}>Refresh</Button>
        </Card>
      </Col>
      
      <Col span={8}>
        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>Storage</span>
              {hasUnsavedChanges && <Badge status="warning" text="Unsaved" />}
            </div>
          }
          size="small"
        >
          {/* Reference bar */}
          <div style={{ marginBottom: 16 }}>
            <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>Reference level</Text>
            <div 
              style={{ 
                height: 8, 
                background: '#f0f0f0', 
                borderRadius: 4,
                overflow: 'hidden'
              }}
            >
              <div 
                style={{ 
                  width: `${REFERENCE_VALUE}%`, 
                  height: '100%', 
                  background: '#52c41a',
                  borderRadius: 4
                }} 
              />
            </div>
          </div>

          {/* Primary meter */}
          <div style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 11, display: 'block', marginBottom: 2 }}>Storage Used (Primary)</Text>
            <Tooltip title={`${primary}%`}>
              <div
                onClick={handlePrimaryClick}
                style={{ cursor: 'pointer' }}
                data-testid="meter-storage-primary"
                data-instance-label="Storage Used (Primary)"
                data-meter-value={primary}
                data-meter-committed={committed}
                role="meter"
                aria-valuenow={primary}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Storage Used Primary"
              >
                <Progress percent={primary} showInfo={false} size="small" />
              </div>
            </Tooltip>
          </div>

          {/* Secondary meter */}
          <div style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 11, display: 'block', marginBottom: 2 }}>Storage Used (Secondary)</Text>
            <Tooltip title={`${secondary}%`}>
              <div
                onClick={handleSecondaryClick}
                style={{ cursor: 'pointer' }}
                data-testid="meter-storage-secondary"
                data-instance-label="Storage Used (Secondary)"
                data-meter-value={secondary}
                role="meter"
                aria-valuenow={secondary}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Storage Used Secondary"
              >
                <Progress percent={secondary} showInfo={false} size="small" />
              </div>
            </Tooltip>
          </div>

          {/* Archive meter */}
          <div style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 11, display: 'block', marginBottom: 2 }}>Storage Used (Archive)</Text>
            <Tooltip title={`${archive}%`}>
              <div
                onClick={handleArchiveClick}
                style={{ cursor: 'pointer' }}
                data-testid="meter-storage-archive"
                data-instance-label="Storage Used (Archive)"
                data-meter-value={archive}
                role="meter"
                aria-valuenow={archive}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Storage Used Archive"
              >
                <Progress percent={archive} showInfo={false} size="small" />
              </div>
            </Tooltip>
          </div>

          <Button size="small" type="primary" onClick={handleSave} data-testid="storage-save">
            Save changes
          </Button>
        </Card>
      </Col>

      <Col span={8}>
        <Card title="Network" size="small">
          <div style={{ height: 80, background: '#f5f5f5', borderRadius: 4 }} />
          <Button size="small" style={{ marginTop: 8 }} disabled>Configure</Button>
        </Card>
      </Col>
    </Row>
  );
}
