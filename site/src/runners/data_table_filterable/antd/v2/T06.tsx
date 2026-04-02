'use client';

/**
 * data_table_filterable-antd-v2-T06: Alert row subtable – clear and replace severity filter
 *
 * A monitoring page with two expanded parent rows, each containing a mini-table: "Alerts" and
 * "Incidents". Alerts has a pre-applied Severity = Medium filter. The task requires clearing that
 * and replacing it with exactly {Critical, High}. Incidents must remain unfiltered. Dark theme.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card, ConfigProvider, theme as antTheme, Tag } from 'antd';
import type { ColumnsType, FilterValue, TablePaginationConfig } from 'antd/es/table/interface';
import type { TaskComponentProps, FilterModel } from '../../types';

interface SubRow {
  key: string;
  id: string;
  title: string;
  severity: string;
  time: string;
}

const severityOptions = ['Critical', 'High', 'Medium', 'Low', 'Info'];

const alertsData: SubRow[] = [
  { key: 'a1', id: 'ALR-01', title: 'CPU spike on prod-3', severity: 'Critical', time: '10:02' },
  { key: 'a2', id: 'ALR-02', title: 'Memory pressure', severity: 'High', time: '10:05' },
  { key: 'a3', id: 'ALR-03', title: 'Disk usage warning', severity: 'Medium', time: '10:10' },
  { key: 'a4', id: 'ALR-04', title: 'Latency p99 elevated', severity: 'High', time: '10:12' },
  { key: 'a5', id: 'ALR-05', title: 'Health check flap', severity: 'Low', time: '10:14' },
  { key: 'a6', id: 'ALR-06', title: 'OOM kill detected', severity: 'Critical', time: '10:15' },
];

const incidentsData: SubRow[] = [
  { key: 'i1', id: 'INC-01', title: 'Service outage us-east', severity: 'Critical', time: '09:30' },
  { key: 'i2', id: 'INC-02', title: 'Partial degradation eu-west', severity: 'High', time: '09:45' },
  { key: 'i3', id: 'INC-03', title: 'DNS resolution slow', severity: 'Medium', time: '10:00' },
];

function buildModel(tableId: string, info: Record<string, FilterValue | null>): FilterModel {
  return {
    table_id: tableId,
    logic_operator: 'AND',
    global_filter: null,
    column_filters: Object.entries(info)
      .filter(([, v]) => v && v.length > 0)
      .map(([col, values]) => ({
        column: col.charAt(0).toUpperCase() + col.slice(1),
        operator: (values?.length ?? 0) > 1 ? 'in' : ('equals' as const),
        value: values?.length === 1 ? String(values[0]) : (values as string[]),
      })),
  };
}

function subCols(info: Record<string, FilterValue | null>): ColumnsType<SubRow> {
  return [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 90 },
    { title: 'Title', dataIndex: 'title', key: 'title', width: 200 },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      width: 100,
      filters: severityOptions.map(s => ({ text: s, value: s })),
      filteredValue: info.severity || null,
      onFilter: (v, rec) => rec.severity === v,
    },
    { title: 'Time', dataIndex: 'time', key: 'time', width: 80 },
  ];
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const [alertsFilter, setAlertsFilter] = useState<Record<string, FilterValue | null>>({
    severity: ['Medium'],
  });
  const [incidentsFilter, setIncidentsFilter] = useState<Record<string, FilterValue | null>>({});
  const [interacted, setInteracted] = useState(false);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (successFiredRef.current || !interacted) return;
    const sev = alertsFilter.severity;
    const incHas = Object.values(incidentsFilter).some(v => v && v.length > 0);
    if (
      sev && sev.length === 2 &&
      new Set(sev.map(String)).has('Critical') &&
      new Set(sev.map(String)).has('High') &&
      !incHas
    ) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [alertsFilter, incidentsFilter, interacted, onSuccess]);

  const parentData = [
    { key: 'p1', service: 'api-gateway', status: 'degraded' },
    { key: 'p2', service: 'worker-pool', status: 'healthy' },
  ];

  return (
    <ConfigProvider theme={{ algorithm: antTheme.darkAlgorithm }}>
      <div style={{ padding: 16, background: '#141414', width: 780 }}>
        <Tag color="red" style={{ marginBottom: 8 }}>Live monitoring</Tag>
        <Table
          dataSource={parentData}
          columns={[
            { title: 'Service', dataIndex: 'service', key: 'service' },
            { title: 'Status', dataIndex: 'status', key: 'status' },
          ]}
          pagination={false}
          size="small"
          rowKey="key"
          defaultExpandAllRows
          expandable={{
            expandedRowRender: (record) => {
              if (record.key === 'p1') {
                return (
                  <Card size="small" title="Alerts" style={{ marginBottom: 4 }}>
                    <Table<SubRow>
                      dataSource={alertsData}
                      columns={subCols(alertsFilter)}
                      pagination={false}
                      size="small"
                      rowKey="key"
                      onChange={(_p: TablePaginationConfig, f: Record<string, FilterValue | null>) => { setInteracted(true); setAlertsFilter(f); }}
                      data-testid="table-alerts"
                      data-filter-model={JSON.stringify(buildModel('alerts', alertsFilter))}
                    />
                  </Card>
                );
              }
              return (
                <Card size="small" title="Incidents" style={{ marginBottom: 4 }}>
                  <Table<SubRow>
                    dataSource={incidentsData}
                    columns={subCols(incidentsFilter)}
                    pagination={false}
                    size="small"
                    rowKey="key"
                    onChange={(_p: TablePaginationConfig, f: Record<string, FilterValue | null>) => setIncidentsFilter(f)}
                    data-testid="table-incidents"
                    data-filter-model={JSON.stringify(buildModel('incidents', incidentsFilter))}
                  />
                </Card>
              );
            },
          }}
        />
      </div>
    </ConfigProvider>
  );
}
