'use client';

/**
 * datetime_picker_range-antd-v2-T23: Enterprise row — allowEmpty end, picker OK + row Save
 */

import React, { useState, useEffect, useRef } from 'react';
import { DatePicker, Button, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

const { RangePicker } = DatePicker;

type RowKey = 'startup' | 'enterprise';

interface RowData {
  key: RowKey;
  plan: string;
}

const STARTUP_RANGE: [Dayjs, Dayjs] = [
  dayjs('2027-04-01 00:00', 'YYYY-MM-DD HH:mm'),
  dayjs('2027-04-30 23:59', 'YYYY-MM-DD HH:mm'),
];

export default function T23({ onSuccess }: TaskComponentProps) {
  const [enterpriseValue, setEnterpriseValue] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [enterpriseSaved, setEnterpriseSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current || !enterpriseSaved) return;
    if (!enterpriseValue?.[0] || enterpriseValue[1] != null) return;
    const startOk = enterpriseValue[0].format('YYYY-MM-DD HH:mm') === '2027-05-01 00:00';
    if (startOk) {
      successFired.current = true;
      onSuccess();
    }
  }, [enterpriseSaved, enterpriseValue, onSuccess]);

  const columns: ColumnsType<RowData> = [
    {
      title: 'Plan',
      dataIndex: 'plan',
      key: 'plan',
      width: 120,
    },
    {
      title: 'Billing window',
      key: 'billing',
      render: (_, record) => {
        if (record.key === 'startup') {
          return (
            <RangePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              value={STARTUP_RANGE}
              disabled
              size="small"
              style={{ width: '100%' }}
              data-cb-instance="Startup / Billing window"
              data-testid="dt-range-startup-billing"
            />
          );
        }
        return (
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            value={enterpriseValue}
            onChange={(dates) => setEnterpriseValue(dates)}
            placeholder={['Start', 'End (optional)']}
            allowEmpty={[false, true]}
            size="small"
            style={{ width: '100%' }}
            data-cb-instance="Enterprise / Billing window"
            data-testid="dt-range-enterprise-billing"
            needConfirm
          />
        );
      },
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_, record) =>
        record.key === 'enterprise' ? (
          <Button size="small" type="primary" onClick={() => setEnterpriseSaved(true)}>
            Save
          </Button>
        ) : null,
    },
  ];

  const dataSource: RowData[] = [
    { key: 'startup', plan: 'Startup' },
    { key: 'enterprise', plan: 'Enterprise' },
  ];

  return (
    <div style={{ padding: 8, maxWidth: 720 }}>
      <Table<RowData>
        size="small"
        pagination={false}
        dataSource={dataSource}
        columns={columns}
        title={() => 'Billing plans'}
      />
    </div>
  );
}
