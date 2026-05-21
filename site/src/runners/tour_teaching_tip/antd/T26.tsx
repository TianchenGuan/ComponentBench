'use client';

/**
 * tour_teaching_tip-antd-T26: Table cell: scroll to reveal Row actions tour step
 *
 * setup_description:
 * A table_cell scene: the main content is a dense data table inside a fixed-height container (center placement).
 * The table shows many rows (e.g., 30+) with compact row height and per-row action icons (⋯) on the right; overall clutter is high.
 * An AntD Tour is open on page load on step 1 titled "Table overview" targeting the table header.
 * Step 2 is titled "Row actions" and targets the action icon (⋯) for a specific row labeled "Order #1025", which is initially out of view and requires scrolling the table container.
 * The Tour is configured with scrollIntoViewOptions=false, so it will not automatically scroll the table to the target row.
 * Mask is enabled; the Tour popup may be off-screen until the target row is scrolled into view.
 *
 * success_trigger: Tour overlay is open, current step title is "Row actions", current step index equals 1.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tour, Table, ConfigProvider } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import type { TourProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T26({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(true);
  const [current, setCurrent] = useState(0);
  const successCalledRef = useRef(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const targetRowActionRef = useRef<HTMLSpanElement>(null);

  // Generate 35 rows of data
  const tableData = Array.from({ length: 35 }, (_, i) => ({
    key: String(i + 1),
    orderId: `Order #${1001 + i}`,
    customer: `Customer ${String.fromCharCode(65 + (i % 26))}`,
    amount: Math.floor(Math.random() * 1000) + 50,
    status: i % 3 === 0 ? 'Completed' : i % 3 === 1 ? 'Pending' : 'Processing',
  }));

  const columns = [
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId', width: 120 },
    { title: 'Customer', dataIndex: 'customer', key: 'customer', width: 120 },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', width: 80, render: (v: number) => `$${v}` },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100 },
    {
      title: 'Actions',
      key: 'actions',
      width: 60,
      render: (_: unknown, record: { orderId: string }) => (
        <span
          ref={record.orderId === 'Order #1025' ? targetRowActionRef : undefined}
          data-testid={record.orderId === 'Order #1025' ? 'target-row-action' : undefined}
        >
          <MoreOutlined style={{ cursor: 'pointer' }} />
        </span>
      ),
    },
  ];

  const steps: TourProps['steps'] = [
    {
      title: 'Table overview',
      description: 'This table shows all orders with their details.',
      target: () => headerRef.current!,
      scrollIntoViewOptions: false,
    },
    {
      title: 'Row actions',
      description: 'Click the action icon to perform operations on Order #1025.',
      target: () => targetRowActionRef.current!,
      scrollIntoViewOptions: false,
    },
  ];

  useEffect(() => {
    if (open && current === 1 && !successCalledRef.current) {
      const titleNode = document.querySelector('.ant-tour-title');
      if (titleNode?.textContent === 'Row actions') {
        successCalledRef.current = true;
        onSuccess();
      }
    }
  }, [open, current, onSuccess]);

  useEffect(() => {
    const checkTour = () => {
      if (open && current === 1 && !successCalledRef.current) {
        const titleNode = document.querySelector('.ant-tour-title');
        if (titleNode?.textContent === 'Row actions') {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkTour);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [open, current, onSuccess]);

  return (
    <ConfigProvider componentSize="small">
      <Card
        title={<div ref={headerRef}>Orders Table</div>}
        style={{ width: 550, height: 400 }}
        bodyStyle={{ padding: 0, height: 'calc(100% - 56px)', overflow: 'auto' }}
        data-testid="orders-table-card"
      >
        <Table
          dataSource={tableData}
          columns={columns}
          pagination={false}
          size="small"
          scroll={{ y: 300 }}
        />
      </Card>

      <Tour
        open={open}
        onClose={() => setOpen(false)}
        current={current}
        onChange={setCurrent}
        steps={steps}
        mask={true}
        data-testid="tour-table"
      />
    </ConfigProvider>
  );
}
