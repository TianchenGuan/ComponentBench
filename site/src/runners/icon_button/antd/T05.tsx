'use client';

/**
 * icon_button-antd-T05: Set View mode to List (icon button group)
 *
 * Layout: settings_panel centered in the viewport.
 * A settings panel titled "Display settings" contains a "View mode" row with three icon-only 
 * AntD Buttons: Grid, List, Cards.
 * Initial state: Grid is selected (aria-pressed="true" on Grid).
 * 
 * Success: The "View mode: List" IconButton has aria-pressed="true".
 */

import React, { useState } from 'react';
import { Button, Card, Space } from 'antd';
import { AppstoreOutlined, UnorderedListOutlined, CreditCardOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

type ViewMode = 'grid' | 'list' | 'cards';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const handleSelect = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === 'list') {
      onSuccess();
    }
  };

  return (
    <Card title="Display settings" style={{ width: 400 }}>
      {/* Static rows */}
      <div style={{ marginBottom: 16, color: '#666' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span>Theme</span>
          <span style={{ color: '#999' }}>Light</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Font size</span>
          <span style={{ color: '#999' }}>Medium</span>
        </div>
      </div>

      {/* Interactive row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
        <span>View mode: {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}</span>
        <Space size="small" data-cb-selected={viewMode} data-testid="view-mode-group">
          <Button
            type={viewMode === 'grid' ? 'primary' : 'text'}
            icon={<AppstoreOutlined />}
            onClick={() => handleSelect('grid')}
            aria-pressed={viewMode === 'grid'}
            aria-label="View mode: Grid"
            data-testid="antd-icon-btn-grid"
          />
          <Button
            type={viewMode === 'list' ? 'primary' : 'text'}
            icon={<UnorderedListOutlined />}
            onClick={() => handleSelect('list')}
            aria-pressed={viewMode === 'list'}
            aria-label="View mode: List"
            data-testid="antd-icon-btn-list"
          />
          <Button
            type={viewMode === 'cards' ? 'primary' : 'text'}
            icon={<CreditCardOutlined />}
            onClick={() => handleSelect('cards')}
            aria-pressed={viewMode === 'cards'}
            aria-label="View mode: Cards"
            data-testid="antd-icon-btn-cards"
          />
        </Space>
      </div>
    </Card>
  );
}
