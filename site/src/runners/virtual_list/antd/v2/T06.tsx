'use client';

/**
 * virtual_list-antd-v2-T06
 * Jobs table: open row picker, choose exact lead, save the row
 *
 * Dark-theme table with row-scoped popovers. Agent must open Pipeline 21's
 * "Assign lead" picker, select MEM-0204 (Morgan Lee), and click "Save row".
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Popover, Tag, Typography, Table } from 'antd';
import VirtualList from 'rc-virtual-list';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface Member { key: string; code: string; name: string; }

const firstNames = ['Aisha', 'Ben', 'Carlos', 'Diana', 'Eli', 'Fiona', 'Gael', 'Hana', 'Ivan', 'Julia',
  'Kai', 'Lena', 'Mason', 'Nora', 'Oscar', 'Priya', 'Quinn', 'Riley', 'Sam', 'Morgan'];
const lastNames = ['Patel', 'Nguyen', 'Park', 'Lee', 'Santos', 'Chen', 'Kim', 'Alvarez', 'Singh', 'Rivera'];

function buildMembers(): Member[] {
  const list: Member[] = [];
  for (let i = 0; i < 400; i++) {
    list.push({
      key: `mem-${String(i).padStart(4, '0')}`,
      code: `MEM-${String(i).padStart(4, '0')}`,
      name: `${firstNames[i % firstNames.length]} ${lastNames[Math.floor(i / firstNames.length) % lastNames.length]}`,
    });
  }
  list[41] = { key: 'mem-0041', code: 'MEM-0041', name: 'Morgan Lee' };
  list[204] = { key: 'mem-0204', code: 'MEM-0204', name: 'Morgan Lee' };
  return list;
}

const members = buildMembers();

interface PipelineRow { id: number; name: string; status: string; }
const pipelines: PipelineRow[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `Pipeline ${i + 1}`,
  status: ['Running', 'Idle', 'Failed', 'Queued'][i % 4],
}));

function RowPicker({
  rowName, onSave, members: mems,
}: { rowName: string; onSave: (key: string) => void; members: Member[]; }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const content = (
    <div style={{ width: 300 }}>
      <div style={{ border: '1px solid #333', borderRadius: 4 }}>
        <VirtualList data={mems} height={260} itemHeight={40} itemKey="key">
          {(item: Member) => (
            <div
              key={item.key}
              data-item-key={item.key}
              aria-selected={selected === item.key}
              onClick={() => setSelected(item.key)}
              style={{
                padding: '8px 10px',
                cursor: 'pointer',
                borderBottom: '1px solid #222',
                backgroundColor: selected === item.key ? '#177ddc33' : 'transparent',
                color: '#d9d9d9',
                fontSize: 12,
              }}
            >
              {item.code} — {item.name}
            </div>
          )}
        </VirtualList>
      </div>
      <Button
        size="small" type="primary" block
        style={{ marginTop: 6 }}
        disabled={!selected}
        onClick={() => { if (selected) { onSave(selected); setOpen(false); } }}
      >
        Save row
      </Button>
    </div>
  );

  return (
    <Popover content={content} trigger="click" open={open} onOpenChange={setOpen} placement="left">
      <Button size="small">Assign lead</Button>
    </Popover>
  );
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const [savedRows, setSavedRows] = useState<Record<number, string>>({});
  const successRef = useRef(false);

  useEffect(() => {
    if (successRef.current) return;
    if (savedRows[21] === 'mem-0204') {
      successRef.current = true;
      onSuccess();
    }
  }, [savedRows, onSuccess]);

  const columns = [
    { title: 'Pipeline', dataIndex: 'name', key: 'name' },
    { title: 'Status', dataIndex: 'status', key: 'status',
      render: (s: string) => <Tag color={s === 'Running' ? 'blue' : s === 'Failed' ? 'red' : 'default'}>{s}</Tag>,
    },
    { title: 'Lead', key: 'lead',
      render: (_: unknown, row: PipelineRow) => savedRows[row.id]
        ? <Text style={{ color: '#d9d9d9', fontSize: 12 }}>{savedRows[row.id]}</Text>
        : <Text style={{ color: '#666', fontSize: 12 }}>—</Text>,
    },
    { title: '', key: 'action',
      render: (_: unknown, row: PipelineRow) => (
        <RowPicker
          rowName={row.name}
          members={members}
          onSave={(key) => setSavedRows(prev => ({ ...prev, [row.id]: key }))}
        />
      ),
    },
  ];

  return (
    <div style={{ background: '#0a0a0a', padding: 16, borderRadius: 8, minWidth: 640 }}>
      <Card
        size="small" title="Pipelines"
        headStyle={{ background: '#1f1f1f', color: '#fff', borderBottom: '1px solid #333' }}
        bodyStyle={{ background: '#141414', padding: 0 }}
      >
        <Table
          dataSource={pipelines}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 10, size: 'small' }}
          style={{ background: '#141414' }}
        />
      </Card>
    </div>
  );
}
