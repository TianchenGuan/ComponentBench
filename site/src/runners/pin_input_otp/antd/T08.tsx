'use client';

/**
 * pin_input_otp-antd-T08: Three OTP instances anchored bottom-right
 * 
 * An isolated_card placed near the bottom-right corner titled "Backup codes".
 * It contains three visually similar OTP inputs stacked vertically: "Primary backup code",
 * "Secondary backup code", and "Tertiary backup code". Each is a 6-box Ant Design
 * Input composite with auto-advance. Initial state: all three OTP inputs are empty.
 * 
 * Success: Target OTP value equals '449820' in the "Secondary backup code" instance only.
 */

import React, { useState, useEffect } from 'react';
import { Card, Input } from 'antd';
import type { TaskComponentProps } from '../types';

const { OTP } = Input;

export default function T08({ onSuccess }: TaskComponentProps) {
  const [primaryCode, setPrimaryCode] = useState('');
  const [secondaryCode, setSecondaryCode] = useState('');
  const [tertiaryCode, setTertiaryCode] = useState('');

  useEffect(() => {
    if (secondaryCode === '449820') {
      onSuccess();
    }
  }, [secondaryCode, onSuccess]);

  return (
    <Card title="Backup codes" style={{ width: 400 }}>
      {/* Primary backup code */}
      <div style={{ marginBottom: 20 }} aria-labelledby="primary-label">
        <label id="primary-label" style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>
          Primary backup code
        </label>
        <div data-testid="otp-backup-primary" aria-label="Primary backup code">
          <OTP
            length={6}
            value={primaryCode}
            onChange={setPrimaryCode}
          />
        </div>
      </div>

      {/* Secondary backup code */}
      <div style={{ marginBottom: 20 }} aria-labelledby="secondary-label">
        <label id="secondary-label" style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>
          Secondary backup code
        </label>
        <div data-testid="otp-backup-secondary" aria-label="Secondary backup code">
          <OTP
            length={6}
            value={secondaryCode}
            onChange={setSecondaryCode}
          />
        </div>
      </div>

      {/* Tertiary backup code */}
      <div aria-labelledby="tertiary-label">
        <label id="tertiary-label" style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>
          Tertiary backup code
        </label>
        <div data-testid="otp-backup-tertiary" aria-label="Tertiary backup code">
          <OTP
            length={6}
            value={tertiaryCode}
            onChange={setTertiaryCode}
          />
        </div>
      </div>
    </Card>
  );
}
