'use client';

/**
 * text_input-antd-T07: Copy ticket code from reference badge (dark)
 * 
 * Scene is an isolated card centered in the viewport with a dark theme. At the top of the card, a pill-shaped
 * badge labeled "Reference ticket" displays the target code (e.g., a short string like "TK-3841"). Below the
 * badge is a single Ant Design Input labeled "Ticket code". The input starts empty. A second, non-target badge
 * labeled "Example" shows a different code as a distractor. No other text inputs exist. No overlays or
 * confirmation buttons are required; success is based solely on the input matching the reference badge text.
 * 
 * Success: The "Ticket code" input value equals the reference badge text "TK-3841" exactly (case-sensitive; preserve internal punctuation).
 */

import React, { useState, useEffect } from 'react';
import { Card, Input, Badge, Tag } from 'antd';
import type { TaskComponentProps } from '../types';

const REFERENCE_CODE = 'TK-3841';
const DISTRACTOR_CODE = 'EX-9999';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value.trim() === REFERENCE_CODE) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card 
      title="Ticket lookup" 
      style={{ width: 400, background: '#1f1f1f', borderColor: '#303030' }}
      headStyle={{ color: '#fff', borderColor: '#303030' }}
      bodyStyle={{ background: '#1f1f1f' }}
    >
      <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
        <div>
          <div style={{ color: '#999', fontSize: 12, marginBottom: 4 }}>Reference ticket</div>
          <Tag 
            color="blue" 
            style={{ fontSize: 14, padding: '4px 12px' }}
            data-testid="ref-ticket"
          >
            {REFERENCE_CODE}
          </Tag>
        </div>
        <div>
          <div style={{ color: '#999', fontSize: 12, marginBottom: 4 }}>Example</div>
          <Tag 
            color="default" 
            style={{ fontSize: 14, padding: '4px 12px' }}
            data-testid="example-ticket"
          >
            {DISTRACTOR_CODE}
          </Tag>
        </div>
      </div>
      
      <div>
        <label htmlFor="ticket-code" style={{ fontWeight: 500, marginBottom: 4, display: 'block', color: '#fff' }}>
          Ticket code
        </label>
        <Input
          id="ticket-code"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          data-testid="ticket-code-input"
          style={{ background: '#141414', borderColor: '#434343', color: '#fff' }}
        />
      </div>
    </Card>
  );
}
