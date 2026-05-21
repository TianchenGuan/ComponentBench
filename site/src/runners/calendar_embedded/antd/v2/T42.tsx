'use client';

/**
 * calendar_embedded-antd-v2-T42: Team C date with global Apply; A/B unchanged
 */

import React, { useState, useEffect } from 'react';
import { Card, Calendar, Button, Space, Tag, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

const START = dayjs('2027-01-01');
const TARGET = '2027-02-01';

type Team = 'A' | 'B' | 'C';

export default function T42({ onSuccess }: TaskComponentProps) {
  const [visible, setVisible] = useState<Record<Team, Dayjs>>({ A: START, B: START, C: START });
  const [pending, setPending] = useState<Record<Team, Dayjs | null>>({ A: null, B: null, C: null });
  const [applied, setApplied] = useState<Record<Team, Dayjs | null>>({ A: null, B: null, C: null });

  useEffect(() => {
    if (
      applied.C?.format('YYYY-MM-DD') === TARGET &&
      applied.A === null &&
      applied.B === null
    ) {
      onSuccess();
    }
  }, [applied, onSuccess]);

  const apply = () => {
    setApplied({ ...pending });
  };

  const teamCal = (team: Team, label: string) => (
    <div style={{ flex: 1, minWidth: 200 }} data-testid={`team-calendar-${team}`}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{label}</div>
      <Calendar
        fullscreen={false}
        value={pending[team] ?? visible[team]}
        onSelect={(d) => setPending((p) => ({ ...p, [team]: d }))}
        onPanelChange={(d) => setVisible((v) => ({ ...v, [team]: d.startOf('month') }))}
        data-testid={`calendar-team-${team}`}
      />
      <div style={{ marginTop: 8, fontSize: 12 }}>
        <span style={{ fontWeight: 500 }}>Applied date: </span>
        <span data-testid={`applied-team-${team}`}>
          {applied[team] ? applied[team]!.format('YYYY-MM-DD') : '—'}
        </span>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, padding: 8 }} data-testid="team-scheduling-dashboard">
      <Space wrap style={{ marginBottom: 12 }}>
        <Typography.Title level={5} style={{ margin: 0 }}>
          Team scheduling
        </Typography.Title>
        <Tag>Live</Tag>
        <Tag color="processing">Sync on</Tag>
      </Space>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>{teamCal('A', 'Team A')}{teamCal('B', 'Team B')}{teamCal('C', 'Team C')}</div>
      <div style={{ marginTop: 16 }}>
        <Button type="primary" onClick={apply} data-testid="apply-changes">
          Apply changes
        </Button>
      </div>
    </div>
  );
}
