'use client';

/**
 * date_picker_range-antd-T07: Set the Comparison period in a dashboard filter bar
 *
 * A dashboard layout with a top filter bar. The page includes
 * two Ant Design RangePickers of the same type: 'Primary period' and 'Comparison
 * period' (instances=2). Both are initially empty and look identical except for
 * their labels. The filter bar also contains non-required controls: a 'Region'
 * dropdown, a 'Channel' dropdown, and a search box (distractors). The 'Comparison
 * period' picker is placed at the top-right area of the viewport. When opened,
 * its calendar popover shows January 2026 and February 2026 side-by-side, so the
 * requested cross-month range can be selected without extra month navigation.
 *
 * Success: Comparison period instance has start=2026-01-20, end=2026-02-05
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Select, Input, Space, Typography, Row, Col } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const { RangePicker } = DatePicker;
const { Title } = Typography;

export default function T07({ onSuccess }: TaskComponentProps) {
  const [primaryValue, setPrimaryValue] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [comparisonValue, setComparisonValue] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [region, setRegion] = useState<string | undefined>(undefined);
  const [channel, setChannel] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (
      comparisonValue &&
      comparisonValue[0] &&
      comparisonValue[1] &&
      comparisonValue[0].format('YYYY-MM-DD') === '2026-01-20' &&
      comparisonValue[1].format('YYYY-MM-DD') === '2026-02-05'
    ) {
      onSuccess();
    }
  }, [comparisonValue, onSuccess]);

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: 24 }}>
      <Card style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0, marginBottom: 16 }}>Analytics Dashboard</Title>
        
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#666' }}>Primary period</label>
              <RangePicker
                value={primaryValue}
                onChange={(dates) => setPrimaryValue(dates)}
                format="YYYY-MM-DD"
                placeholder={['Start', 'End']}
                style={{ width: '100%' }}
                data-testid="primary-period-range"
              />
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#666' }}>Comparison period</label>
              <RangePicker
                value={comparisonValue}
                onChange={(dates) => setComparisonValue(dates)}
                format="YYYY-MM-DD"
                placeholder={['Start', 'End']}
                style={{ width: '100%' }}
                data-testid="comparison-period-range"
                defaultPickerValue={[dayjs('2026-01-01'), dayjs('2026-02-01')]}
              />
            </div>
          </Col>
          
          <Col xs={24} sm={8} md={4}>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#666' }}>Region</label>
              <Select
                value={region}
                onChange={setRegion}
                placeholder="Select"
                style={{ width: '100%' }}
                options={[
                  { value: 'us', label: 'US' },
                  { value: 'eu', label: 'EU' },
                  { value: 'apac', label: 'APAC' },
                ]}
                data-testid="region-select"
              />
            </div>
          </Col>
          
          <Col xs={24} sm={8} md={4}>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#666' }}>Channel</label>
              <Select
                value={channel}
                onChange={setChannel}
                placeholder="Select"
                style={{ width: '100%' }}
                options={[
                  { value: 'web', label: 'Web' },
                  { value: 'mobile', label: 'Mobile' },
                  { value: 'api', label: 'API' },
                ]}
                data-testid="channel-select"
              />
            </div>
          </Col>
          
          <Col xs={24} sm={8} md={4}>
            <div>
              <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#666' }}>Search</label>
              <Input.Search
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                style={{ width: '100%' }}
                data-testid="search-input"
              />
            </div>
          </Col>
        </Row>
      </Card>
      
      {/* Dashboard content placeholder */}
      <Card>
        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
          Dashboard charts would appear here
        </div>
      </Card>
    </div>
  );
}
