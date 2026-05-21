'use client';

/**
 * split_button-antd-T05: Project: switch Actions split-button to Duplicate
 *
 * Layout: form_section titled "Project settings" centered on the page.
 * Target component: An Ant Design `Dropdown.Button` split button labeled "Actions" aligned to the right of the section header.
 *
 * Other UI (clutter=low):
 * - Two text inputs ("Project name", "Owner").
 * - A Switch labeled "Private project".
 * - A helper paragraph about permissions.
 *
 * Menu items: "Save changes" (currently selected), "Duplicate", "Export settings…", "Archive" (disabled), Divider, "Delete" (danger)
 *
 * Success: selectedAction equals "duplicate"
 */

import React, { useState } from 'react';
import { Card, Dropdown, Button, Input, Switch, Space } from 'antd';
import { DownOutlined, SaveOutlined, CopyOutlined, ExportOutlined, InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [selectedAction, setSelectedAction] = useState('save_changes');
  const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false);

  const menuItems: MenuProps['items'] = [
    { key: 'save_changes', label: 'Save changes', icon: <SaveOutlined /> },
    { key: 'duplicate', label: 'Duplicate', icon: <CopyOutlined /> },
    { key: 'export_settings', label: 'Export settings…', icon: <ExportOutlined /> },
    { key: 'archive', label: 'Archive', icon: <InboxOutlined />, disabled: true },
    { type: 'divider' },
    { key: 'delete', label: 'Delete', icon: <DeleteOutlined />, danger: true },
  ];

  const getActionLabel = (key: string) => {
    const labels: Record<string, string> = {
      'save_changes': 'Save changes',
      'duplicate': 'Duplicate',
      'export_settings': 'Export settings…',
      'archive': 'Archive',
      'delete': 'Delete',
    };
    return labels[key] || key;
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setSelectedAction(e.key);
    if (e.key === 'duplicate' && !hasTriggeredSuccess) {
      setHasTriggeredSuccess(true);
      onSuccess();
    }
  };

  return (
    <Card 
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Project settings</span>
          <div
            data-testid="split-button-root"
            data-selected-action={selectedAction}
            aria-label="Actions split button"
          >
            <Dropdown.Button
              menu={{ items: menuItems, onClick: handleMenuClick }}
              icon={<DownOutlined />}
              size="small"
            >
              {getActionLabel(selectedAction)}
            </Dropdown.Button>
          </div>
        </div>
      }
      style={{ width: 480 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Project name input */}
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: 13, fontWeight: 500 }}>
            Project name
          </label>
          <Input defaultValue="My Project" />
        </div>

        {/* Owner input */}
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontSize: 13, fontWeight: 500 }}>
            Owner
          </label>
          <Input defaultValue="user@example.com" />
        </div>

        {/* Private project switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Switch defaultChecked={false} />
          <span style={{ fontSize: 13 }}>Private project</span>
        </div>

        {/* Helper paragraph */}
        <div style={{ fontSize: 12, color: '#666', padding: 12, background: '#fafafa', borderRadius: 4 }}>
          Private projects are only visible to you and explicitly added collaborators. 
          Public projects can be viewed by all team members.
        </div>
      </div>
    </Card>
  );
}
