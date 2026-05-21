'use client';

/**
 * menu-antd-T05: Select nested menu path File → Export → PDF
 * 
 * Scene: theme=dark, spacing=comfortable, layout=settings_panel, placement=center, scale=default, instances=1.
 *
 * The UI is presented as a dark-themed settings panel centered in the viewport.
 *
 * Component:
 * - A vertical Ant Design Menu titled "File actions".
 * - Top-level sections are SubMenus with nested children.
 *
 * Structure:
 * - File
 *   - Export
 *     - PDF
 *     - CSV
 *   - Import
 * - Edit
 *   - Undo
 *   - Redo
 * - View
 *   - Zoom in
 *   - Zoom out
 *
 * Initial state:
 * - No leaf item is selected.
 * - All top-level sections start collapsed.
 *
 * Success: The selected leaf path in the File actions menu is exactly ["File", "Export", "PDF"].
 */

import React, { useState, useEffect } from 'react';
import { Menu, Card } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  {
    key: 'File',
    label: 'File',
    children: [
      {
        key: 'Export',
        label: 'Export',
        children: [
          { key: 'PDF', label: 'PDF' },
          { key: 'CSV', label: 'CSV' },
        ],
      },
      { key: 'Import', label: 'Import' },
    ],
  },
  {
    key: 'Edit',
    label: 'Edit',
    children: [
      { key: 'Undo', label: 'Undo' },
      { key: 'Redo', label: 'Redo' },
    ],
  },
  {
    key: 'View',
    label: 'View',
    children: [
      { key: 'Zoom in', label: 'Zoom in' },
      { key: 'Zoom out', label: 'Zoom out' },
    ],
  },
];

// Map of leaf keys to their full paths
const pathMap: Record<string, string[]> = {
  'PDF': ['File', 'Export', 'PDF'],
  'CSV': ['File', 'Export', 'CSV'],
  'Import': ['File', 'Import'],
  'Undo': ['Edit', 'Undo'],
  'Redo': ['Edit', 'Redo'],
  'Zoom in': ['View', 'Zoom in'],
  'Zoom out': ['View', 'Zoom out'],
};

export default function T05({ onSuccess }: TaskComponentProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [successTriggered, setSuccessTriggered] = useState(false);

  const selectedPath = selectedKey ? pathMap[selectedKey] : null;

  useEffect(() => {
    // Success when selected path is exactly ["File", "Export", "PDF"]
    if (
      selectedPath &&
      selectedPath.length === 3 &&
      selectedPath[0] === 'File' &&
      selectedPath[1] === 'Export' &&
      selectedPath[2] === 'PDF' &&
      !successTriggered
    ) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedPath, successTriggered, onSuccess]);

  const handleClick: MenuProps['onClick'] = ({ key }) => {
    if (pathMap[key]) {
      setSelectedKey(key);
    }
  };

  return (
    <Card 
      style={{ width: 400, background: '#1f1f1f', borderColor: '#303030' }}
      styles={{ header: { color: '#fff', borderColor: '#303030' }, body: { padding: 16 } }}
    >
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>
          Selected: <strong style={{ color: '#fff' }} data-testid="selected-path">
            {selectedPath ? selectedPath.join(' / ') : 'None'}
          </strong>
        </div>
      </div>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 8, fontWeight: 500 }}>
        File actions
      </div>
      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={selectedKey ? [selectedKey] : []}
        openKeys={openKeys}
        onOpenChange={setOpenKeys}
        items={menuItems}
        onClick={handleClick}
        style={{ borderRight: 'none', background: 'transparent' }}
        data-testid="menu-file-actions"
      />
    </Card>
  );
}
