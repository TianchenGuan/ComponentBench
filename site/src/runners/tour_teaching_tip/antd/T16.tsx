'use client';

/**
 * tour_teaching_tip-antd-T16: Dashboard clutter: reach Filter bar step
 *
 * setup_description:
 * A dashboard layout fills the center of the page (light theme, comfortable spacing) with medium clutter: a top filter bar, two metric cards, a small line chart placeholder, and a data table.
 * A button labeled "Start Dashboard Tour" sits in the dashboard header.
 * The AntD Tour is already open on page load on step 1 of 4 titled "Dashboard header".
 * Step 2 is titled "Filter bar" and points to the row of filter controls (date range, status select, and search input).
 * Step 3 is "Metrics", step 4 is "Table".
 * The Tour uses mask=true; the overlay dims the dashboard but the many underlying controls create visual clutter.
 *
 * success_trigger: Tour overlay is open, current step title is "Filter bar", current step index equals 1.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tour, Input, Select, DatePicker, Table, Space, Statistic, Row, Col } from 'antd';
import type { TourProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T16({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true);
  const [current, setCurrent] = useState(0); // Start at Dashboard header
  const successCalledRef = useRef(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const steps: TourProps['steps'] = [
    {
      title: 'Dashboard header',
      description: 'This is your dashboard header with quick actions.',
      target: () => headerRef.current!,
    },
    {
      title: 'Filter bar',
      description: 'Use these filters to narrow down your data.',
      target: () => filterRef.current!,
    },
    {
      title: 'Metrics',
      description: 'View key performance metrics at a glance.',
      target: () => metricsRef.current!,
    },
    {
      title: 'Table',
      description: 'Detailed data is displayed in this table.',
      target: () => tableRef.current!,
    },
  ];

  useEffect(() => {
    if (open && current === 1 && !successCalledRef.current) {
      const titleNode = document.querySelector('.ant-tour-title');
      if (titleNode?.textContent === 'Filter bar') {
        successCalledRef.current = true;
        onSuccess();
      }
    }
  }, [open, current, onSuccess]);

  useEffect(() => {
    const checkTour = () => {
      if (open && current === 1 && !successCalledRef.current) {
        const titleNode = document.querySelector('.ant-tour-title');
        if (titleNode?.textContent === 'Filter bar') {
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
    { key: '1', name: 'Item A', status: 'Active', value: 100 },
    { key: '2', name: 'Item B', status: 'Pending', value: 250 },
    { key: '3', name: 'Item C', status: 'Active', value: 180 },
  ];

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Value', dataIndex: 'value', key: 'value' },
  ];

  return (
    <>
      <div style={{ width: 700 }} data-testid="dashboard">
        {/* Header */}
        <div
          ref={headerRef}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            padding: '12px 16px',
            background: '#fff',
            borderRadius: 8,
          }}
          data-testid="dashboard-header"
        >
          <h2 style={{ margin: 0 }}>Dashboard</h2>
          <Button type="primary" data-testid="start-dashboard-tour-btn">
            Start Dashboard Tour
          </Button>
        </div>

        {/* Filter bar */}
        <div
          ref={filterRef}
          style={{
            display: 'flex',
            gap: 12,
            marginBottom: 16,
            padding: '12px 16px',
            background: '#fff',
            borderRadius: 8,
          }}
          data-testid="filter-bar"
        >
          <DatePicker.RangePicker size="small" />
          <Select defaultValue="all" size="small" style={{ width: 120 }}>
            <Select.Option value="all">All Status</Select.Option>
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="pending">Pending</Select.Option>
          </Select>
          <Input.Search placeholder="Search..." size="small" style={{ width: 200 }} />
        </div>

        {/* Metrics */}
        <div ref={metricsRef} data-testid="metrics-section">
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={12}>
              <Card size="small">
                <Statistic title="Total Users" value={1234} />
              </Card>
            </Col>
            <Col span={12}>
              <Card size="small">
                <Statistic title="Revenue" value={56789} prefix="$" />
              </Card>
            </Col>
          </Row>
        </div>

        {/* Chart placeholder */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <div style={{ height: 80, background: '#f5f5f5', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#999' }}>Chart Placeholder</span>
          </div>
        </Card>

        {/* Table */}
        <div ref={tableRef} data-testid="table-section">
          <Card size="small">
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
        mask={true}
        data-testid="tour-dashboard"
      />
    </>
  );
}
