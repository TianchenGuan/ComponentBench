'use client';

/**
 * date_picker_range-antd-v2-T13: Project window start-only range with explicit OK among two fields
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, DatePicker, Typography, Tag, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const AUDIT_FIXED: [Dayjs, Dayjs] = [dayjs('2026-09-01'), dayjs('2026-09-30')];

export default function T13({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const [auditValue] = useState<[Dayjs, Dayjs]>(AUDIT_FIXED);
  const [projectValue, setProjectValue] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  useEffect(() => {
    if (successFired.current) return;
    if (
      projectValue &&
      projectValue[0] &&
      projectValue[0].format('YYYY-MM-DD') === '2026-10-03' &&
      !projectValue[1] &&
      auditValue[0].format('YYYY-MM-DD') === '2026-09-01' &&
      auditValue[1].format('YYYY-MM-DD') === '2026-09-30'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [projectValue, auditValue, onSuccess]);

  return (
    <div style={{ maxWidth: 480 }}>
      <Card size="small" title="Release panel" styles={{ header: { fontSize: 14 } }}>
        <Space wrap style={{ marginBottom: 12 }}>
          <Tag color="purple">Release</Tag>
          <Tag>v3.2.1</Tag>
          <Text type="secondary" style={{ fontSize: 12 }}>Milestone: Q4-2026</Text>
        </Space>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6, fontSize: 13 }}>
            Audit window
          </label>
          <RangePicker
            value={auditValue}
            format="YYYY-MM-DD"
            style={{ width: '100%' }}
            data-testid="audit-window-range"
            disabled
          />
        </div>

        <div>
          <label style={{ fontWeight: 500, display: 'block', marginBottom: 6, fontSize: 13 }}>
            Project window
          </label>
          <RangePicker
            value={projectValue}
            onChange={(dates) => setProjectValue(dates)}
            format="YYYY-MM-DD"
            placeholder={['Start date', 'End date']}
            style={{ width: '100%' }}
            data-testid="project-window-range"
            needConfirm
            allowEmpty={[false, true]}
            defaultPickerValue={dayjs('2026-10-01')}
          />
          <Text type="secondary" style={{ fontSize: 11, display: 'block', marginTop: 4 }}>
            End date is optional for open-ended projects
          </Text>
        </div>
      </Card>
    </div>
  );
}
