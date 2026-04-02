'use client';

/**
 * time_input_text-antd-T08: Set Secondary cutoff time among three small inputs
 * 
 * Layout: isolated_card centered. Light theme with compact spacing.
 * The card is titled "Cutoff times" and contains THREE AntD TimePicker instances, all size='small':
 * 1) "Primary cutoff" (prefilled 08:00)
 * 2) "Secondary cutoff" (empty)  ← TARGET
 * 3) "Tertiary cutoff" (prefilled 20:00)
 * - Configuration (all): format='HH:mm', minuteStep=5, allowClear=true, needConfirm=true.
 * - Each field has a small clock icon; clicking opens the popup panel. The panel has an "OK" button.
 * - Distractors (clutter=low): a short hint text under the card and a non-interactive info icon; nothing else.
 * 
 * Success: The TimePicker instance labeled "Secondary cutoff" has committed value 06:30 (24-hour).
 *          An explicit confirmation click on the picker panel "OK" control is required (needConfirm=true).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, TimePicker, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T08({ onSuccess }: TaskComponentProps) {
  const [primaryCutoff] = useState<Dayjs | null>(dayjs('08:00', 'HH:mm'));
  const [secondaryCutoff, setSecondaryCutoff] = useState<Dayjs | null>(null);
  const [tertiaryCutoff] = useState<Dayjs | null>(dayjs('20:00', 'HH:mm'));
  const confirmedRef = useRef(false);

  useEffect(() => {
    if (confirmedRef.current && secondaryCutoff && secondaryCutoff.format('HH:mm') === '06:30') {
      onSuccess();
    }
  }, [secondaryCutoff, onSuccess]);

  const handleSecondaryChange = (time: Dayjs | null) => {
    setSecondaryCutoff(time);
    confirmedRef.current = true;
  };

  return (
    <Card title="Cutoff times" style={{ width: 400 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label htmlFor="primary-cutoff" style={{ fontWeight: 500, marginBottom: 4, display: 'block', fontSize: 13 }}>
            Primary cutoff
          </label>
          <TimePicker
            id="primary-cutoff"
            value={primaryCutoff}
            format="HH:mm"
            minuteStep={5}
            allowClear
            needConfirm
            size="small"
            style={{ width: '100%' }}
            data-testid="cutoff-primary"
          />
        </div>
        <div>
          <label htmlFor="secondary-cutoff" style={{ fontWeight: 500, marginBottom: 4, display: 'block', fontSize: 13 }}>
            Secondary cutoff
          </label>
          <TimePicker
            id="secondary-cutoff"
            value={secondaryCutoff}
            onChange={handleSecondaryChange}
            format="HH:mm"
            minuteStep={5}
            allowClear
            needConfirm
            size="small"
            style={{ width: '100%' }}
            data-testid="cutoff-secondary"
          />
        </div>
        <div>
          <label htmlFor="tertiary-cutoff" style={{ fontWeight: 500, marginBottom: 4, display: 'block', fontSize: 13 }}>
            Tertiary cutoff
          </label>
          <TimePicker
            id="tertiary-cutoff"
            value={tertiaryCutoff}
            format="HH:mm"
            minuteStep={5}
            allowClear
            needConfirm
            size="small"
            style={{ width: '100%' }}
            data-testid="cutoff-tertiary"
          />
        </div>
      </div>
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
        <InfoCircleOutlined style={{ color: '#999' }} />
        <Text type="secondary" style={{ fontSize: 12 }}>
          Cutoff times define processing boundaries
        </Text>
      </div>
    </Card>
  );
}
