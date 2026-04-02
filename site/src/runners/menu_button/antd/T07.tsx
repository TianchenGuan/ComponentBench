'use client';

/**
 * menu_button-antd-T07: Change date format and apply
 * 
 * Layout: isolated_card anchored near the top-right of the viewport (placement=top_right).
 * The card contains one menu button labeled "Date format: MM/DD/YYYY".
 * Clicking opens a dropdown panel with three formats: "MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD".
 * Below the list is a footer row with two small buttons: "Cancel" and primary "Apply".
 * 
 * Important: clicking a format only stages the choice (a small dot indicator moves),
 * but the trigger button label does not update until Apply is clicked.
 * 
 * Initial state: MM/DD/YYYY is the applied value.
 * Success: The applied Date format value equals "YYYY-MM-DD" (after clicking Apply).
 */

import React, { useState, useEffect } from 'react';
import { Button, Card, Dropdown, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const dateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'];

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [appliedFormat, setAppliedFormat] = useState('MM/DD/YYYY');
  const [stagedFormat, setStagedFormat] = useState('MM/DD/YYYY');
  const [open, setOpen] = useState(false);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (appliedFormat === 'YYYY-MM-DD' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [appliedFormat, successTriggered, onSuccess]);

  const handleApply = () => {
    setAppliedFormat(stagedFormat);
    setOpen(false);
    message.success('Saved');
  };

  const handleCancel = () => {
    setStagedFormat(appliedFormat);
    setOpen(false);
  };

  const dropdownContent = (
    <div style={{ background: '#fff', border: '1px solid #d9d9d9', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', minWidth: 200 }}>
      <div style={{ padding: '8px 0' }}>
        {dateFormats.map(format => (
          <div
            key={format}
            onClick={() => setStagedFormat(format)}
            style={{
              padding: '8px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: stagedFormat === format ? '#f0f5ff' : 'transparent',
            }}
          >
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: stagedFormat === format ? '#1677ff' : 'transparent',
              border: '1px solid #d9d9d9',
            }} />
            {format}
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid #d9d9d9', padding: 8, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button size="small" onClick={handleCancel} data-testid="menu-button-date-format-cancel">
          Cancel
        </Button>
        <Button type="primary" size="small" onClick={handleApply} data-testid="menu-button-date-format-apply">
          Apply
        </Button>
      </div>
    </div>
  );

  return (
    <Card title="Date settings" style={{ width: 350 }}>
      <Dropdown
        dropdownRender={() => dropdownContent}
        trigger={['click']}
        open={open}
        onOpenChange={setOpen}
      >
        <Button data-testid="menu-button-date-format">
          Date format: {appliedFormat} <DownOutlined />
        </Button>
      </Dropdown>
    </Card>
  );
}
