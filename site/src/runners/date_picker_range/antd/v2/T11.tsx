'use client';

/**
 * date_picker_range-antd-v2-T11: Comparison window cross-month on the correct picker with OK
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, DatePicker, InputNumber, Switch, Typography, Space, Tag, Row, Col } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const PRIMARY_FIXED: [Dayjs, Dayjs] = [dayjs('2027-01-01'), dayjs('2027-01-14')];
const ARCHIVE_FIXED: [Dayjs, Dayjs] = [dayjs('2026-12-01'), dayjs('2026-12-31')];

export default function T11({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const [primaryValue] = useState<[Dayjs, Dayjs]>(PRIMARY_FIXED);
  const [comparisonValue, setComparisonValue] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [archiveValue] = useState<[Dayjs, Dayjs]>(ARCHIVE_FIXED);

  const [showInactive, setShowInactive] = useState(false);
  const [retention, setRetention] = useState<number | null>(90);
  const [compression, setCompression] = useState(true);

  useEffect(() => {
    if (successFired.current) return;
    if (
      comparisonValue &&
      comparisonValue[0] &&
      comparisonValue[1] &&
      comparisonValue[0].format('YYYY-MM-DD') === '2027-01-28' &&
      comparisonValue[1].format('YYYY-MM-DD') === '2027-02-06' &&
      primaryValue[0].format('YYYY-MM-DD') === '2027-01-01' &&
      primaryValue[1].format('YYYY-MM-DD') === '2027-01-14' &&
      archiveValue[0].format('YYYY-MM-DD') === '2026-12-01' &&
      archiveValue[1].format('YYYY-MM-DD') === '2026-12-31'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [comparisonValue, primaryValue, archiveValue, onSuccess]);

  return (
    <div style={{ maxWidth: 520 }}>
      <Space wrap style={{ marginBottom: 12 }}>
        <Tag color="blue">Analytics</Tag>
        <Tag>Settings</Tag>
        <Switch size="small" checked={showInactive} onChange={setShowInactive} />
        <Text type="secondary" style={{ fontSize: 12 }}>Show inactive</Text>
        <Switch size="small" checked={compression} onChange={setCompression} />
        <Text type="secondary" style={{ fontSize: 12 }}>Compression</Text>
      </Space>

      <Card size="small" title="Analytics settings" styles={{ header: { fontSize: 14 } }}>
        <Row gutter={[12, 12]}>
          <Col span={12}>
            <Text type="secondary" style={{ fontSize: 12 }}>Retention (days)</Text>
            <InputNumber size="small" value={retention} onChange={setRetention} style={{ width: '100%' }} />
          </Col>
          <Col span={12}>
            <Text type="secondary" style={{ fontSize: 12 }}>Snapshot interval</Text>
            <InputNumber size="small" defaultValue={7} style={{ width: '100%' }} />
          </Col>
        </Row>

        <div style={{ marginTop: 16, marginBottom: 12 }}>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6, fontSize: 13 }}>
            Primary window
          </label>
          <RangePicker
            value={primaryValue}
            format="YYYY-MM-DD"
            style={{ width: '100%' }}
            size="small"
            data-testid="primary-window-range"
            disabled
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6, fontSize: 13 }}>
            Comparison window
          </label>
          <RangePicker
            value={comparisonValue}
            onChange={(dates) => setComparisonValue(dates)}
            format="YYYY-MM-DD"
            placeholder={['Start date', 'End date']}
            style={{ width: '100%' }}
            size="small"
            data-testid="comparison-window-range"
            needConfirm
            defaultPickerValue={dayjs('2027-01-01')}
          />
        </div>

        <div>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6, fontSize: 13 }}>
            Archive window
          </label>
          <RangePicker
            value={archiveValue}
            format="YYYY-MM-DD"
            style={{ width: '100%' }}
            size="small"
            data-testid="archive-window-range"
            disabled
          />
        </div>
      </Card>
    </div>
  );
}
