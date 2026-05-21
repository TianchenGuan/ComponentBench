'use client';

/**
 * checkbox_tristate-antd-T05: Set Primary consent to Partial (Indeterminate)
 *
 * Layout: form_section card titled "Consent settings", centered in the viewport.
 * There are two Ant Design tri-state checkboxes stacked vertically:
 *   1) "Primary consent" (target) - Initial state: Unchecked
 *   2) "Secondary consent" (distractor) - Initial state: Checked
 * Below the checkboxes are non-required form fields (a text input for "Contact email"
 * and a dropdown for "Region"), included only as low clutter.
 * There is no Save/Apply; state changes are immediate.
 * Success: "Primary consent" is Indeterminate.
 */

import React, { useState } from 'react';
import { Card, Checkbox, Input, Select, Form } from 'antd';
import type { TaskComponentProps, TristateValue } from '../types';
import { cycleTristateValue } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [primaryState, setPrimaryState] = useState<TristateValue>('unchecked');
  const [secondaryState, setSecondaryState] = useState<TristateValue>('checked');

  const handlePrimaryClick = () => {
    const newState = cycleTristateValue(primaryState);
    setPrimaryState(newState);
    if (newState === 'indeterminate') {
      onSuccess();
    }
  };

  const handleSecondaryClick = () => {
    setSecondaryState(cycleTristateValue(secondaryState));
  };

  return (
    <Card title="Consent settings" style={{ width: 450 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div onClick={handlePrimaryClick} style={{ cursor: 'pointer' }}>
          <Checkbox
            checked={primaryState === 'checked'}
            indeterminate={primaryState === 'indeterminate'}
            data-testid="consent-primary"
          >
            Primary consent
          </Checkbox>
        </div>
        <div onClick={handleSecondaryClick} style={{ cursor: 'pointer' }}>
          <Checkbox
            checked={secondaryState === 'checked'}
            indeterminate={secondaryState === 'indeterminate'}
            data-testid="consent-secondary"
          >
            Secondary consent
          </Checkbox>
        </div>
      </div>
      <div style={{ marginTop: 24, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
        <Form layout="vertical" size="small">
          <Form.Item label="Contact email" style={{ marginBottom: 12 }}>
            <Input placeholder="email@example.com" />
          </Form.Item>
          <Form.Item label="Region" style={{ marginBottom: 0 }}>
            <Select placeholder="Select region" options={[
              { value: 'us', label: 'United States' },
              { value: 'eu', label: 'Europe' },
              { value: 'asia', label: 'Asia' },
            ]} />
          </Form.Item>
        </Form>
      </div>
    </Card>
  );
}
