'use client';

/**
 * menubar-antd-T05: File → Export → CSV
 * 
 * Layout: isolated_card, centered.
 * Ant Design horizontal Menu with top-level items: File (SubMenu), Edit (SubMenu), View (SubMenu), Help (SubMenu).
 * - File dropdown items: New…, Open…, Export (SubMenu), Exit.
 * - Export submenu (second level) items: CSV, Excel, PDF.
 * - Interaction: submenus open on click (triggerSubMenuAction='click') to reduce accidental hover.
 * - Initial state: no menus open; active tab is "File" NOT selected (Home-like default is outside the menubar and ignored).
 * - No clutter.
 * 
 * Success: The selected menu path is File → Export → CSV.
 */

import React, { useState, useEffect } from 'react';
import { Menu, Card } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (
      selectedPath.length === 3 &&
      selectedPath[0] === 'File' &&
      selectedPath[1] === 'Export' &&
      selectedPath[2] === 'CSV' &&
      !successTriggered
    ) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedPath, successTriggered, onSuccess]);

  const menuItems: MenuProps['items'] = [
    {
      key: 'File',
      label: 'File',
      children: [
        { key: 'New', label: 'New…' },
        { key: 'Open', label: 'Open…' },
        {
          key: 'Export',
          label: 'Export',
          children: [
            { key: 'CSV', label: 'CSV' },
            { key: 'Excel', label: 'Excel' },
            { key: 'PDF', label: 'PDF' },
          ],
        },
        { key: 'Exit', label: 'Exit' },
      ],
    },
    {
      key: 'Edit',
      label: 'Edit',
      children: [
        { key: 'Undo', label: 'Undo' },
        { key: 'Redo', label: 'Redo' },
        { key: 'Cut', label: 'Cut' },
        { key: 'Copy', label: 'Copy' },
        { key: 'Paste', label: 'Paste' },
      ],
    },
    {
      key: 'View',
      label: 'View',
      children: [
        { key: 'Zoom In', label: 'Zoom In' },
        { key: 'Zoom Out', label: 'Zoom Out' },
        { key: 'Full Screen', label: 'Full Screen' },
      ],
    },
    {
      key: 'Help',
      label: 'Help',
      children: [
        { key: 'Documentation', label: 'Documentation' },
        { key: 'About', label: 'About' },
      ],
    },
  ];

  const handleClick: MenuProps['onClick'] = ({ keyPath }) => {
    // keyPath is reversed: [leaf, parent, grandparent, ...]
    const path = [...keyPath].reverse();
    setSelectedPath(path);
  };

  return (
    <Card style={{ width: 500 }} data-testid="menubar-card">
      <div style={{ fontSize: 12, color: '#999', marginBottom: 8, fontWeight: 500 }}>
        File {'>'} Export submenu includes: CSV, Excel, PDF
      </div>
      <Menu
        mode="horizontal"
        selectable={false}
        items={menuItems}
        onClick={handleClick}
        triggerSubMenuAction="click"
        data-testid="menubar-main"
      />
    </Card>
  );
}
