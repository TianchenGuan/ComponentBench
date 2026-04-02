'use client';

/**
 * checkbox_group-antd-T10: Set Status filters to match reference and apply
 *
 * Scene: light theme; comfortable spacing; a dashboard-style page anchored toward the bottom-left; instances=3.
 * Ant Design analytics dashboard in a light theme. High clutter: chart area, KPI cards.
 * Layout: Dashboard anchored toward bottom-left with a filter sidebar titled "Filters".
 * Inside the Filters sidebar there are THREE Checkbox.Group instances:
 * 1) "Region" (Americas, EMEA, APAC)
 * 2) "Department" (Sales, Marketing, Support, Engineering)
 * 3) "Status" (Active, Paused, Archived, Draft) ← target
 * A "Target statuses" reference row shows two pill chips (Active, Archived).
 * Initial state: Region: Americas, Department: Sales, Status: Active only.
 * Success: Status group has Active and Archived checked, Apply filters is clicked.
 */

import React, { useState, useRef } from 'react';
import { Card, Checkbox, Typography, Button, Space, Statistic, Row, Col } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Title } = Typography;

const regionOptions = ['Americas', 'EMEA', 'APAC'];
const departmentOptions = ['Sales', 'Marketing', 'Support', 'Engineering'];
const statusOptions = ['Active', 'Paused', 'Archived', 'Draft'];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [region, setRegion] = useState<string[]>(['Americas']);
  const [department, setDepartment] = useState<string[]>(['Sales']);
  const [status, setStatus] = useState<string[]>(['Active']);
  const hasSucceeded = useRef(false);

  const handleApplyFilters = () => {
    const targetSet = new Set(['Active', 'Archived']);
    const currentSet = new Set(status);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      if (!hasSucceeded.current) {
        hasSucceeded.current = true;
        onSuccess();
      }
    }
  };

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      {/* Filter sidebar */}
      <Card title="Filters" style={{ width: 280 }}>
        {/* Target statuses reference */}
        <div style={{ marginBottom: 16, padding: 8, background: '#f5f5f5', borderRadius: 6 }}>
          <Text style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 4 }}>Target statuses</Text>
          <Space>
            <span style={{ 
              background: '#e6f7ff', 
              border: '1px solid #91d5ff',
              padding: '2px 8px', 
              borderRadius: 4, 
              fontSize: 12 
            }}>
              🟢 Active
            </span>
            <span style={{ 
              background: '#fff7e6', 
              border: '1px solid #ffd591',
              padding: '2px 8px', 
              borderRadius: 4, 
              fontSize: 12 
            }}>
              📦 Archived
            </span>
          </Space>
        </div>

        {/* Region group (distractor) */}
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 13 }}>Region</Text>
          <Checkbox.Group
            data-testid="cg-filter-region"
            value={region}
            onChange={(v) => setRegion(v as string[])}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {regionOptions.map(opt => (
                <Checkbox key={opt} value={opt} style={{ fontSize: 12 }}>{opt}</Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        </div>

        {/* Department group (distractor) */}
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 13 }}>Department</Text>
          <Checkbox.Group
            data-testid="cg-filter-department"
            value={department}
            onChange={(v) => setDepartment(v as string[])}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {departmentOptions.map(opt => (
                <Checkbox key={opt} value={opt} style={{ fontSize: 12 }}>{opt}</Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        </div>

        {/* Status group (target) */}
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 13 }}>Status</Text>
          <Checkbox.Group
            data-testid="cg-filter-status"
            value={status}
            onChange={(v) => setStatus(v as string[])}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {statusOptions.map(opt => (
                <Checkbox key={opt} value={opt} style={{ fontSize: 12 }}>{opt}</Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        </div>

        <Button type="primary" block onClick={handleApplyFilters} data-testid="btn-apply-filters">
          Apply filters
        </Button>
      </Card>

      {/* Dashboard content (clutter) */}
      <Card style={{ flex: 1, minWidth: 400 }}>
        <Title level={4}>Analytics Dashboard</Title>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Statistic title="Total Users" value={11234} />
          </Col>
          <Col span={8}>
            <Statistic title="Active Sessions" value={842} />
          </Col>
          <Col span={8}>
            <Statistic title="Revenue" value={52389} prefix="$" />
          </Col>
        </Row>
        <div style={{ 
          height: 200, 
          background: '#fafafa', 
          borderRadius: 8, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#999'
        }}>
          Chart Placeholder
        </div>
      </Card>
    </div>
  );
}
