'use client';

/**
 * masked_input-antd-v2-T06: Raw mode account number inside modal with apply
 *
 * modal_flow layout, center placement. A button "Edit payout account" opens a
 * Modal with one masked 12-digit account-number input and a Formatted/Raw
 * toggle. Formatted mode groups as "0000 1234 5678"; Raw mode shows plain
 * digits with no spaces. Field starts empty in Formatted mode. A small Apply
 * button under the field commits. Task requires Raw mode with exact value
 * 000012345678 committed, modal closed.
 *
 * Success: Account number committed = '000012345678', raw_mode = true,
 * saved = true, overlay closed.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Modal, Typography, Radio, Space, Tag } from 'antd';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '4px 8px',
  fontSize: 14,
  lineHeight: 1.5,
  border: '1px solid #d9d9d9',
  borderRadius: 4,
  outline: 'none',
  fontFamily: 'monospace',
  letterSpacing: 1,
};

export default function T06({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [rawMode, setRawMode] = useState(false);
  const [draft, setDraft] = useState('');
  const [savedValue, setSavedValue] = useState('');
  const [savedRaw, setSavedRaw] = useState(false);

  const handleApply = () => {
    setSavedValue(draft);
    setSavedRaw(rawMode);
    setModalOpen(false);
  };

  useEffect(() => {
    if (successFired.current) return;
    if (savedValue === '000012345678' && savedRaw && !modalOpen) {
      successFired.current = true;
      onSuccess();
    }
  }, [savedValue, savedRaw, modalOpen, onSuccess]);

  return (
    <div style={{ padding: 24 }}>
      <Card style={{ maxWidth: 420 }}>
        <Space direction="vertical">
          <Text>Configure your payout account details.</Text>
          <Space size="small">
            <Tag color="green">Verified</Tag>
            <Tag>USD</Tag>
          </Space>
          <Button type="primary" onClick={() => setModalOpen(true)}>Edit payout account</Button>
        </Space>
      </Card>

      <Modal
        title="Payout account"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={400}
      >
        <div style={{ marginBottom: 12 }}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Account number</Text>
          <Radio.Group
            value={rawMode ? 'raw' : 'formatted'}
            onChange={e => {
              const isRaw = e.target.value === 'raw';
              setRawMode(isRaw);
              setDraft('');
            }}
            size="small"
            style={{ marginBottom: 8 }}
          >
            <Radio.Button value="formatted">Formatted</Radio.Button>
            <Radio.Button value="raw">Raw</Radio.Button>
          </Radio.Group>

          <IMaskInput
            key={rawMode ? 'raw' : 'fmt'}
            mask={rawMode ? '000000000000' : '0000 0000 0000'}
            definitions={{ '0': /[0-9]/ }}
            placeholder={rawMode ? '############' : '#### #### ####'}
            value={draft}
            onAccept={(val: string) => setDraft(val)}
            data-testid="account-number"
            style={inputStyle}
          />
        </div>

        <Button type="primary" size="small" block onClick={handleApply}>Apply</Button>
      </Modal>
    </div>
  );
}
