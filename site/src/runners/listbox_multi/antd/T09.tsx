'use client';

/**
 * listbox_multi-antd-T09: Dashboard filter: customer segments
 *
 * Layout: dashboard. The page shows a header, a central chart area, and a left sidebar titled "Filters".
 * In the sidebar there are three separate Checkbox.Group listboxes (instances=3) stacked vertically:
 *   1) "Regions" (Americas, EMEA, APAC, LATAM, …)
 *   2) "Customer segments" (Enterprise, SMB, Mid-market, Education, Non-profit, Government, …)
 *   3) "Product lines" (Core, Add-ons, Mobile, API, …)
 * Target is ONLY the "Customer segments" list.
 * Initial state: some filters in other sections may be preselected (e.g., Regions=EMEA), but Customer segments starts with none selected.
 * Clutter: the dashboard has many unrelated controls.
 *
 * Success: The target listbox (Customer segments) has exactly: Enterprise, SMB, Education, Non-profit.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Checkbox, Space, Typography, Layout, Row, Col, Button, DatePicker } from 'antd';
import { DownloadOutlined, FilterOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const { Text, Title } = Typography;
const { Header, Sider, Content } = Layout;

const regionsOptions = ['Americas', 'EMEA', 'APAC', 'LATAM'];
const segmentsOptions = ['Enterprise', 'SMB', 'Mid-market', 'Education', 'Non-profit', 'Government'];
const productsOptions = ['Core', 'Add-ons', 'Mobile', 'API'];

const targetSet = ['Enterprise', 'SMB', 'Education', 'Non-profit'];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [regionsSelected, setRegionsSelected] = useState<string[]>(['EMEA']);
  const [segmentsSelected, setSegmentsSelected] = useState<string[]>([]);
  const [productsSelected, setProductsSelected] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(segmentsSelected, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [segmentsSelected, onSuccess]);

  return (
    <Layout style={{ minHeight: 500, background: '#fff' }}>
      <Header
        style={{
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Analytics Dashboard
        </Title>
        <Space>
          <DatePicker.RangePicker size="small" />
          <Button icon={<DownloadOutlined />} size="small">
            Export
          </Button>
        </Space>
      </Header>
      <Layout>
        <Sider
          width={240}
          style={{
            background: '#fafafa',
            borderRight: '1px solid #f0f0f0',
            padding: 16,
          }}
        >
          <Title level={5} style={{ marginBottom: 16 }}>
            <FilterOutlined /> Filters
          </Title>

          <Card size="small" title="Regions" style={{ marginBottom: 16 }}>
            <Checkbox.Group
              data-testid="filter-regions"
              value={regionsSelected}
              onChange={(values) => setRegionsSelected(values as string[])}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" size={2}>
                {regionsOptions.map((opt) => (
                  <Checkbox key={opt} value={opt} data-value={opt}>
                    {opt}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </Card>

          <Card size="small" title="Customer segments" style={{ marginBottom: 16 }}>
            <Checkbox.Group
              data-testid="filter-customer-segments"
              value={segmentsSelected}
              onChange={(values) => setSegmentsSelected(values as string[])}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" size={2}>
                {segmentsOptions.map((opt) => (
                  <Checkbox key={opt} value={opt} data-value={opt}>
                    {opt}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </Card>

          <Card size="small" title="Product lines">
            <Checkbox.Group
              data-testid="filter-products"
              value={productsSelected}
              onChange={(values) => setProductsSelected(values as string[])}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" size={2}>
                {productsOptions.map((opt) => (
                  <Checkbox key={opt} value={opt} data-value={opt}>
                    {opt}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </Card>
        </Sider>

        <Content style={{ padding: 24, background: '#fff' }}>
          <Row gutter={16}>
            <Col span={24}>
              <Card>
                <div
                  style={{
                    height: 200,
                    background: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#999',
                  }}
                >
                  [Chart Area]
                </div>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
}
