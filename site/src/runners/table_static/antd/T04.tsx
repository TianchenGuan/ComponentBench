'use client';

/**
 * table_static-antd-T04: Focus the table for keyboard navigation
 *
 * A centered isolated card contains a read-only Shortcut Keys table built with Ant Design Table. It lists
 * keyboard shortcuts with two columns: Action and Shortcut. The table wrapper is focusable (tabIndex=0) and shows a visible
 * outline when focused; a small text indicator below the table reads "Table focused" when the table wrapper has focus. Initial
 * state: focus is on the page body (table not focused). No other interactive elements are present.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Table, Card } from 'antd';
import type { TaskComponentProps } from '../types';

interface ShortcutData {
  key: string;
  action: string;
  shortcut: string;
}

const shortcutsData: ShortcutData[] = [
  { key: '1', action: 'Copy', shortcut: 'Ctrl+C' },
  { key: '2', action: 'Paste', shortcut: 'Ctrl+V' },
  { key: '3', action: 'Cut', shortcut: 'Ctrl+X' },
  { key: '4', action: 'Undo', shortcut: 'Ctrl+Z' },
  { key: '5', action: 'Redo', shortcut: 'Ctrl+Y' },
  { key: '6', action: 'Select All', shortcut: 'Ctrl+A' },
  { key: '7', action: 'Save', shortcut: 'Ctrl+S' },
  { key: '8', action: 'Find', shortcut: 'Ctrl+F' },
];

const columns = [
  { title: 'Action', dataIndex: 'action', key: 'action' },
  { title: 'Shortcut', dataIndex: 'shortcut', key: 'shortcut' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [isFocused, setIsFocused] = useState(false);
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const successFiredRef = useRef(false);

  const handleFocus = () => {
    setIsFocused(true);
    if (!successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <Card style={{ width: 400 }}>
      <div style={{ marginBottom: 16, fontWeight: 500 }}>Shortcut Keys</div>
      <div
        ref={tableWrapperRef}
        tabIndex={0}
        onFocus={handleFocus}
        onBlur={handleBlur}
        data-cb-focused={isFocused}
        style={{
          outline: isFocused ? '2px solid #1890ff' : 'none',
          outlineOffset: 2,
          borderRadius: 4,
        }}
      >
        <Table
          dataSource={shortcutsData}
          columns={columns}
          pagination={false}
          size="middle"
          rowKey="key"
        />
      </div>
      <div style={{ marginTop: 12, fontSize: 13, color: isFocused ? '#1890ff' : '#999' }}>
        {isFocused ? 'Table focused' : 'Click or tab to focus the table'}
      </div>
    </Card>
  );
}
