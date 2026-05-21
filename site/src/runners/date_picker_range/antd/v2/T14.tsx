'use client';

/**
 * date_picker_range-antd-v2-T14: Business-days-only scheduling range in a drawer
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, DatePicker, Drawer, Typography, Space, Tag, Statistic, Row, Col } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

const { RangePicker } = DatePicker;
const { Text, Paragraph } = Typography;

const Q4_START = dayjs('2026-10-01');
const Q4_END = dayjs('2026-12-31');

const isWeekend = (date: Dayjs) => {
  const day = date.day();
  return day === 0 || day === 6;
};

export default function T14({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [campaignDates, setCampaignDates] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  useEffect(() => {
    if (successFired.current) return;
    if (
      campaignDates &&
      campaignDates[0] &&
      campaignDates[1] &&
      campaignDates[0].format('YYYY-MM-DD') === '2026-11-03' &&
      campaignDates[1].format('YYYY-MM-DD') === '2026-11-11'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [campaignDates, onSuccess]);

  return (
    <div style={{ maxWidth: 520 }}>
      <Card title="Campaign Management">
        <Paragraph type="secondary">
          Manage your campaign schedules for Q4 2026. Only business days are available.
        </Paragraph>
        <Button type="primary" onClick={() => setDrawerOpen(true)} data-testid="schedule-campaign-btn">
          Schedule campaign
        </Button>
      </Card>

      <Drawer
        title="Schedule campaign"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={480}
        placement="right"
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={12}>
            <Card size="small">
              <Statistic title="Budget" value={12500} prefix="$" />
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small">
              <Statistic title="Impressions" value={340000} />
            </Card>
          </Col>
        </Row>

        <Space wrap style={{ marginBottom: 16 }}>
          <Tag color="green">Q4 2026</Tag>
          <Tag>Business days only</Tag>
        </Space>

        <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 16 }}>
          Select a campaign date range within Q4 2026. Weekends are disabled.
        </Paragraph>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>
            Campaign dates
          </label>
          <RangePicker
            value={campaignDates}
            onChange={(dates) => setCampaignDates(dates)}
            format="YYYY-MM-DD"
            placeholder={['Start date', 'End date']}
            style={{ width: '100%' }}
            data-testid="campaign-dates-range"
            needConfirm
            disabledDate={(current) => isWeekend(current)}
            minDate={Q4_START}
            maxDate={Q4_END}
            defaultPickerValue={dayjs('2026-11-01')}
          />
        </div>

        <Text type="secondary" style={{ fontSize: 12 }}>
          Campaign quarter: Oct 1 – Dec 31, 2026
        </Text>
      </Drawer>
    </div>
  );
}
