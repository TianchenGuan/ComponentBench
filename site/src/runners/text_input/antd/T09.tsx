'use client';

/**
 * text_input-antd-T09: Edit tagline and confirm via popconfirm
 * 
 * Scene is a modal_flow-style interaction on an otherwise simple page: a centered card titled "Organization
 * profile". The card contains a single Ant Design Input labeled "Tagline", pre-filled with "We ship fast".
 * Below it is a primary button labeled "Save tagline". Clicking "Save tagline" opens an Ant Design Popconfirm
 * overlay anchored to the button with the message "Save changes?" and two buttons: "Confirm" and "Cancel".
 * A small read-only preview line under the button shows the last saved tagline (initially "We ship fast").
 * This preview updates only after Confirm is clicked.
 * 
 * Success: The "Tagline" input value equals "Built for teams" (trim whitespace) AND the Popconfirm save step
 * has been confirmed by clicking the "Confirm" button, and the read-only preview reflects "Built for teams".
 */

import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Popconfirm, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T09({ onSuccess }: TaskComponentProps) {
  const [tagline, setTagline] = useState('We ship fast');
  const [savedTagline, setSavedTagline] = useState('We ship fast');

  useEffect(() => {
    if (savedTagline.trim() === 'Built for teams') {
      onSuccess();
    }
  }, [savedTagline, onSuccess]);

  const handleConfirm = () => {
    setSavedTagline(tagline);
  };

  return (
    <Card title="Organization profile" style={{ width: 400 }}>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="tagline" style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
          Tagline
        </label>
        <Input
          id="tagline"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          data-testid="tagline-input"
        />
      </div>
      
      <Popconfirm
        title="Save changes?"
        onConfirm={handleConfirm}
        okText="Confirm"
        cancelText="Cancel"
      >
        <Button type="primary" data-testid="save-tagline-btn">
          Save tagline
        </Button>
      </Popconfirm>
      
      <div style={{ marginTop: 16, padding: '8px 12px', background: '#f5f5f5', borderRadius: 4 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>Last saved tagline:</Text>
        <div data-testid="last-saved-tagline" id="last-saved-tagline">
          {savedTagline}
        </div>
      </div>
    </Card>
  );
}
