'use client';

/**
 * tooltip-antd-T08: Show a context-menu triggered tooltip in a table cell
 *
 * Light theme, comfortable spacing, table_cell layout anchored to the bottom-right of the viewport.
 * A small one-row "Users" table is shown with columns: Name, Role, Actions.
 * In the Actions cell there are THREE small action icons, each wrapped in AntD Tooltip:
 * - Edit icon → "Edit user"
 * - Deactivate icon → "Deactivate user" (TARGET)
 * - Reset icon → "Reset password"
 * All three tooltips are configured with trigger='contextMenu' (they open on right-click instead of hover).
 * Clutter: medium (table header, row text, and a non-functional search input above the table). Initial state: no tooltip visible.
 */

import React, { useEffect, useRef } from 'react';
import { Card, Tooltip, Button, Table, Input } from 'antd';
import { EditOutlined, StopOutlined, UndoOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkTooltip = () => {
      const tooltipContent = document.querySelector('.ant-tooltip:not(.ant-tooltip-hidden)');
      if (tooltipContent && tooltipContent.textContent?.includes('Deactivate user')) {
        if (!successCalledRef.current) {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkTooltip);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => observer.disconnect();
  }, [onSuccess]);

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <div style={{ display: 'flex', gap: 4 }}>
          <Tooltip title="Edit user" trigger="contextMenu">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              data-testid="tooltip-trigger-edit"
            />
          </Tooltip>
          <Tooltip title="Deactivate user" trigger="contextMenu">
            <Button
              type="text"
              size="small"
              icon={<StopOutlined />}
              data-testid="tooltip-trigger-deactivate"
            />
          </Tooltip>
          <Tooltip title="Reset password" trigger="contextMenu">
            <Button
              type="text"
              size="small"
              icon={<UndoOutlined />}
              data-testid="tooltip-trigger-reset"
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const data = [
    { key: '1', name: 'John Smith', role: 'Admin' },
  ];

  return (
    <Card title="Users" style={{ width: 450 }}>
      <Input.Search placeholder="Search users..." style={{ marginBottom: 16 }} />
      <Table columns={columns} dataSource={data} pagination={false} size="small" />
    </Card>
  );
}
