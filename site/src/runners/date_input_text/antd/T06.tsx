'use client';

/**
 * date_input_text-antd-T06: AntD match a date from a visual reference badge
 * 
 * Layout: dashboard-style card with two columns, centered in the viewport.
 * Left column: an Ant Design DatePicker labeled "Report date" (format YYYY-MM-DD) with placeholder "YYYY-MM-DD".
 * Right column: a prominent "Reference stamp" badge styled like a rubber stamp. It visually displays the target date as:
 *   "JUN 01 2026"
 * Initial state: "Report date" is empty.
 * Distractors (clutter=low): a small "Report title" text field is present but disabled and does not affect success.
 * Feedback: after entering a valid date, the DatePicker shows the formatted date text in the input.
 * 
 * Success: The "Report date" DatePicker value equals the reference date 2026-06-01.
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Input, Row, Col } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.format('YYYY-MM-DD') === '2026-06-01') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card title="Report Dashboard" style={{ width: 560 }}>
      <Row gutter={32}>
        <Col span={12}>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="report-title" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
              Report title
            </label>
            <Input
              id="report-title"
              placeholder="Monthly Summary"
              disabled
              value="Monthly Summary"
            />
          </div>

          <div>
            <label htmlFor="report-date" style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
              Report date
            </label>
            <DatePicker
              id="report-date"
              value={value}
              onChange={(date) => setValue(date)}
              format="YYYY-MM-DD"
              placeholder="YYYY-MM-DD"
              style={{ width: '100%' }}
              data-testid="report-date"
              allowClear
            />
          </div>
        </Col>

        <Col span={12}>
          <div
            data-testid="reference-stamp"
            style={{
              border: '4px solid #1677ff',
              borderRadius: 8,
              padding: '24px 16px',
              textAlign: 'center',
              transform: 'rotate(-5deg)',
              marginTop: 16,
            }}
          >
            <div style={{ fontSize: 12, color: '#666', marginBottom: 4, fontWeight: 600 }}>
              REFERENCE STAMP
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#1677ff', letterSpacing: 2 }}>
              JUN 01 2026
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
}
