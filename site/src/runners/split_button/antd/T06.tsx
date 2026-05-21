'use client';

/**
 * split_button-antd-T06: Inbox: search in split-button menu and select Archive conversation
 *
 * Layout: settings_panel titled "Conversation actions" centered in the viewport.
 * Target component: a `Dropdown.Button` split button labeled "Conversation".
 *
 * Custom dropdown panel: Top search Input + scrollable menu list of ~12 actions
 * Initial state: Selected action is "Move to inbox". Menu closed.
 *
 * Success: selectedAction equals "archive_conversation"
 */

import React, { useState } from 'react';
import { Card, Dropdown, Button, Input, Menu } from 'antd';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const allActions = [
  { key: 'move_to_inbox', label: 'Move to inbox' },
  { key: 'mark_unread', label: 'Mark as unread' },
  { key: 'mute_notifications', label: 'Mute notifications' },
  { key: 'assign_to_me', label: 'Assign to me' },
  { key: 'archive_conversation', label: 'Archive conversation' },
  { key: 'snooze', label: 'Snooze…' },
  { key: 'add_label', label: 'Add label…' },
  { key: 'mark_spam', label: 'Mark as spam' },
  { key: 'block_sender', label: 'Block sender' },
  { key: 'forward', label: 'Forward…' },
  { key: 'print', label: 'Print' },
  { key: 'show_original', label: 'Show original' },
];

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [selectedAction, setSelectedAction] = useState('move_to_inbox');
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false);

  const filteredActions = allActions.filter(a => 
    a.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActionLabel = (key: string) => {
    const action = allActions.find(a => a.key === key);
    return action?.label || key;
  };

  const handleSelect = (key: string) => {
    setSelectedAction(key);
    setMenuOpen(false);
    setSearchTerm('');
    if (key === 'archive_conversation' && !hasTriggeredSuccess) {
      setHasTriggeredSuccess(true);
      onSuccess();
    }
  };

  const dropdownRender = () => (
    <div style={{ 
      background: '#fff', 
      borderRadius: 8, 
      boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
      padding: 8,
      width: 240
    }}>
      <Input
        placeholder="Search actions…"
        prefix={<SearchOutlined style={{ color: '#bbb' }} />}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ marginBottom: 8 }}
        autoFocus
      />
      <div style={{ maxHeight: 200, overflowY: 'auto' }}>
        <Menu
          items={filteredActions.map(a => ({
            key: a.key,
            label: a.label,
            onClick: () => handleSelect(a.key),
          }))}
          selectable={false}
        />
      </div>
    </div>
  );

  return (
    <Card title="Conversation actions" style={{ width: 500 }}>
      {/* Distractors: sidebar-like sections */}
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ width: 120, borderRight: '1px solid #eee', paddingRight: 16 }}>
          <div style={{ color: '#999', fontSize: 12, marginBottom: 8 }}>Folders</div>
          <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>Inbox</div>
          <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>Starred</div>
          <div style={{ fontSize: 13, color: '#666' }}>Archived</div>
        </div>
        
        <div style={{ flex: 1 }}>
          {/* Read-only message snippet (distractor) */}
          <div style={{ 
            padding: 12, 
            background: '#fafafa', 
            borderRadius: 4, 
            marginBottom: 16,
            fontSize: 13,
            color: '#666'
          }}>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>From: support@example.com</div>
            <div>Your ticket #12345 has been updated...</div>
          </div>

          <div
            data-testid="split-button-root"
            data-selected-action={selectedAction}
          >
            <Dropdown
              open={menuOpen}
              onOpenChange={setMenuOpen}
              dropdownRender={dropdownRender}
              trigger={['click']}
            >
              <Button.Group>
                <Button>{getActionLabel(selectedAction)}</Button>
                <Button icon={<DownOutlined />} />
              </Button.Group>
            </Dropdown>
          </div>
        </div>
      </div>
    </Card>
  );
}
