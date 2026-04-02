'use client';

/**
 * toggle_button_group_multi-antd-T02: Clear status filters
 *
 * Layout: isolated_card centered in the viewport.
 *
 * A card titled "Status filters" contains a row of toggle-style buttons (multi-select). 
 * A small text link labeled "Clear" appears on the far right of the card header (same line as the title).
 *
 * - Options: New, In progress, Blocked, Done.
 * - Initial state: New and Done are selected (highlighted); In progress and Blocked are not selected.
 * - Clicking "Clear" removes all selections at once (equivalent to deselecting every button).
 * - No modal/popover; changes apply instantly; no Apply/Save button.
 * - No other distractors on the page (clutter=none).
 *
 * Success: Selected options equal exactly: (none selected)
 */

import React, { useState, useEffect } from 'react';
import { Card, Checkbox, Button } from 'antd';
import type { TaskComponentProps } from '../types';

const STATUSES = ['New', 'In progress', 'Blocked', 'Done'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['New', 'Done']);

  useEffect(() => {
    if (selected.length === 0) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  const handleClear = () => {
    setSelected([]);
  };

  return (
    <Card 
      title="Status filters"
      extra={
        <Button type="link" size="small" onClick={handleClear} data-testid="clear-button">
          Clear
        </Button>
      }
      style={{ width: 500 }}
      data-testid="status-filters-group"
    >
      <div style={{ marginBottom: 8, color: '#666' }}>
        Clear all selections.
      </div>
      <Checkbox.Group
        value={selected}
        onChange={(values) => setSelected(values as string[])}
        style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
      >
        {STATUSES.map(status => (
          <Checkbox
            key={status}
            value={status}
            style={{
              padding: '8px 16px',
              border: '1px solid #d9d9d9',
              borderRadius: 6,
              background: selected.includes(status) ? '#1677ff' : '#fff',
              color: selected.includes(status) ? '#fff' : '#333',
            }}
            data-testid={`status-${status.toLowerCase().replace(' ', '-')}`}
          >
            {status}
          </Checkbox>
        ))}
      </Checkbox.Group>
    </Card>
  );
}
