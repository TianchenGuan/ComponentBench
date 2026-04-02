'use client';

/**
 * context_menu-antd-v2-T11: Gamma row — Columns submenu toggles (Owner ON, Status OFF, Due date ON, Cost center OFF)
 */

import React, { useEffect, useRef, useState } from 'react';
import { Dropdown, Table, Space, Tag } from 'antd';
import type { MenuProps, TableColumnsType } from 'antd';
import type { TaskComponentProps } from '../../types';

type ColState = {
  Owner: boolean;
  Status: boolean;
  'Due date': boolean;
  'Cost center': boolean;
  Tags: boolean;
};

interface Row {
  key: string;
  name: string;
  val: string;
}

const initialGamma: ColState = {
  Owner: false,
  Status: true,
  'Due date': false,
  'Cost center': true,
  Tags: true,
};

const rows: Row[] = [
  { key: 'a', name: 'Alpha', val: '—' },
  { key: 'b', name: 'Beta', val: '—' },
  { key: 'g', name: 'Gamma', val: '—' },
  { key: 'd', name: 'Delta', val: '—' },
];

export default function T11({ onSuccess }: TaskComponentProps) {
  const [gammaCols, setGammaCols] = useState<ColState>({ ...initialGamma });
  const [menuOpen, setMenuOpen] = useState(false);
  const suppressCloseRef = useRef(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      gammaCols.Owner === true &&
      gammaCols.Status === false &&
      gammaCols['Due date'] === true &&
      gammaCols['Cost center'] === false
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [gammaCols, onSuccess]);

  const toggle = (k: keyof ColState) => {
    suppressCloseRef.current = true;
    setGammaCols((c) => ({ ...c, [k]: !c[k] }));
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && suppressCloseRef.current) {
      suppressCloseRef.current = false;
      return;
    }
    setMenuOpen(open);
  };

  const items: MenuProps['items'] = [
    { key: 'details', label: 'View details' },
    {
      key: 'cols',
      label: 'Columns',
      children: [
        {
          key: 'Owner',
          label: `${gammaCols.Owner ? '✓ ' : ''}Owner`,
        },
        {
          key: 'Status',
          label: `${gammaCols.Status ? '✓ ' : ''}Status`,
        },
        {
          key: 'Due date',
          label: `${gammaCols['Due date'] ? '✓ ' : ''}Due date`,
        },
        {
          key: 'Cost center',
          label: `${gammaCols['Cost center'] ? '✓ ' : ''}Cost center`,
        },
        {
          key: 'Tags',
          label: `${gammaCols.Tags ? '✓ ' : ''}Tags`,
        },
      ],
    },
    { key: 'export', label: 'Export row' },
  ];

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'Owner' || key === 'Status' || key === 'Due date' || key === 'Cost center' || key === 'Tags') {
      toggle(key as keyof ColState);
    }
  };

  const columns: TableColumnsType<Row> = [
    {
      title: 'Row',
      dataIndex: 'name',
      key: 'name',
      width: 88,
      render: (name: string, record) =>
        record.name === 'Gamma' ? (
          <Dropdown
            open={menuOpen}
            onOpenChange={handleOpenChange}
            menu={{ items, onClick, triggerSubMenuAction: 'click' }}
            trigger={['contextMenu']}
          >
            <span style={{ cursor: 'context-menu' }} data-instance-label="Gamma" data-testid="gamma-row-hit">
              {name}
            </span>
          </Dropdown>
        ) : (
          <span>{name}</span>
        ),
    },
    { title: 'Value', dataIndex: 'val', key: 'val' },
  ];

  return (
    <div style={{ width: 400, fontSize: 11 }}>
      <Space size={4} wrap style={{ marginBottom: 6 }}>
        <Tag>Filter</Tag>
        <Tag>Team</Tag>
      </Space>
      <Table<Row> size="small" bordered pagination={false} dataSource={rows} columns={columns} />
      <div style={{ marginTop: 6, fontSize: 10, color: '#999' }} data-cols={JSON.stringify(gammaCols)}>
        Gamma columns (debug)
      </div>
    </div>
  );
}
