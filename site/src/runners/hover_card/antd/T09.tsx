'use client';

/**
 * hover_card-antd-T09: Dismiss a hover-card prompt with Cancel (dark theme)
 *
 * Layout: settings_panel anchored at the bottom-right of the viewport. Dark theme, comfortable spacing, default scale.
 *
 * The panel is titled "Notifications" and contains several toggles and explanatory text (clutter=low).
 * - A small pill badge labeled "Beta tips" appears next to the section header.
 * - Hovering over "Beta tips" opens an AntD Popover hover card containing:
 *   * Title: "Try beta tips?"
 *   * Body: a short explanation line
 *   * Two action buttons at the bottom: "Confirm" and "Cancel"
 * - Clicking either button dismisses the hover card and records the choice (no other UI state is required for success).
 *
 * Initial state: hover card closed; no prior choice recorded.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Popover, Typography, Button, Switch } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [decision, setDecision] = useState<'confirm' | 'cancel' | null>(null);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (decision === 'cancel' && !open && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [decision, open, onSuccess]);

  const handleConfirm = () => {
    setDecision('confirm');
    setOpen(false);
  };

  const handleCancel = () => {
    setDecision('cancel');
    setOpen(false);
  };

  const hoverCardContent = (
    <div 
      style={{ width: 240 }} 
      data-testid="hover-card-content"
      data-cb-instance="Beta tips"
    >
      <Text style={{ display: 'block', marginBottom: 12, color: '#e0e0e0' }}>
        Enable beta tips to receive early previews of new features and improvements.
      </Text>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button size="small" onClick={handleCancel} data-testid="cancel-button">
          Cancel
        </Button>
        <Button type="primary" size="small" onClick={handleConfirm} data-testid="confirm-button">
          Confirm
        </Button>
      </div>
    </div>
  );

  return (
    <Card 
      title={<span style={{ color: '#fff' }}>Notifications</span>}
      style={{ 
        width: 350, 
        backgroundColor: '#1f1f1f', 
        borderColor: '#333'
      }}
      headStyle={{ backgroundColor: '#141414', borderBottom: '1px solid #333' }}
      bodyStyle={{ backgroundColor: '#1f1f1f' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text style={{ color: '#e0e0e0' }}>Feature updates</Text>
          <Popover 
            content={hoverCardContent}
            title={<span style={{ color: '#fff' }}>Try beta tips?</span>}
            trigger="hover"
            open={open}
            onOpenChange={setOpen}
            overlayStyle={{ background: '#2a2a2a' }}
            overlayInnerStyle={{ backgroundColor: '#2a2a2a', border: '1px solid #444' }}
          >
            <span
              data-testid="beta-tips-trigger"
              data-cb-instance="Beta tips"
              style={{ 
                color: '#1677ff', 
                cursor: 'pointer',
                padding: '2px 8px',
                borderRadius: 12,
                backgroundColor: '#1a3353',
                fontSize: 12
              }}
            >
              Beta tips
            </span>
          </Popover>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#e0e0e0' }}>Email notifications</Text>
          <Switch size="small" defaultChecked />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#e0e0e0' }}>Push notifications</Text>
          <Switch size="small" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#e0e0e0' }}>Weekly digest</Text>
          <Switch size="small" defaultChecked />
        </div>
      </div>
    </Card>
  );
}
