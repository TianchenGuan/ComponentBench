'use client';

/**
 * masked_input-antd-v2-T05: Reference badge copied into secondary member ID
 *
 * Dark dashboard_panel top-left with compact spacing and medium clutter.
 * A card titled "Member badges" shows a bold reference badge with the target
 * ID AB-5731-XZ. Two masked member-ID inputs (AB-####-XZ pattern): Primary
 * member ID (AB-1000-XZ) and Secondary member ID (empty). A card-level
 * "Apply IDs" button commits. Only Secondary member ID should change.
 *
 * Success: Secondary member ID committed = 'AB-5731-XZ' via 'Apply IDs',
 * Primary unchanged at 'AB-1000-XZ'.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Tag, Typography, Space, Statistic, Row, Col } from 'antd';
import { IMaskInput } from 'react-imask';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '4px 8px',
  fontSize: 13,
  lineHeight: 1.5,
  border: '1px solid #434343',
  borderRadius: 4,
  outline: 'none',
  background: '#141414',
  color: '#fff',
  fontFamily: 'monospace',
};

const TARGET_ID = 'AB-5731-XZ';

export default function T05({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);
  const [primaryDraft, setPrimaryDraft] = useState('AB-1000-XZ');
  const [secondaryDraft, setSecondaryDraft] = useState('');
  const [primarySaved, setPrimarySaved] = useState('AB-1000-XZ');
  const [secondarySaved, setSecondarySaved] = useState('');

  const handleApply = () => {
    setPrimarySaved(primaryDraft);
    setSecondarySaved(secondaryDraft);
  };

  useEffect(() => {
    if (successFired.current) return;
    if (secondarySaved === TARGET_ID && primarySaved === 'AB-1000-XZ') {
      successFired.current = true;
      onSuccess();
    }
  }, [secondarySaved, primarySaved, onSuccess]);

  return (
    <div style={{ position: 'fixed', top: 24, left: 24, width: 380 }}>
      {/* clutter */}
      <Card size="small" style={{ marginBottom: 8, background: '#1f1f1f', borderColor: '#303030' }}>
        <Row gutter={12}>
          <Col span={12}><Statistic title={<Text style={{ color: '#888', fontSize: 11 }}>Active members</Text>} value={1204} valueStyle={{ color: '#fff', fontSize: 16 }} /></Col>
          <Col span={12}><Statistic title={<Text style={{ color: '#888', fontSize: 11 }}>Pending</Text>} value={38} valueStyle={{ color: '#faad14', fontSize: 16 }} /></Col>
        </Row>
      </Card>

      <Card
        title={<Text style={{ color: '#fff' }}>Member badges</Text>}
        size="small"
        style={{ background: '#1f1f1f', borderColor: '#303030' }}
        styles={{ header: { borderColor: '#303030' } }}
      >
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <Text style={{ color: '#888', fontSize: 12, display: 'block', marginBottom: 6 }}>Reference badge:</Text>
          <Tag
            color="blue"
            style={{ fontSize: 18, padding: '6px 14px', fontWeight: 600, fontFamily: 'monospace' }}
            data-testid="reference-badge"
          >
            {TARGET_ID}
          </Tag>
        </div>

        <div style={{ marginBottom: 12 }}>
          <Text style={{ color: '#e0e0e0', fontWeight: 500, display: 'block', marginBottom: 4, fontSize: 12 }}>Primary member ID</Text>
          <IMaskInput
            mask="aa-0000-aa"
            definitions={{ a: /[A-Za-z]/, '0': /[0-9]/ }}
            prepare={(s: string) => s.toUpperCase()}
            placeholder="AA-####-AA"
            value={primaryDraft}
            onAccept={(val: string) => setPrimaryDraft(val)}
            data-testid="primary-member-id"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <Text style={{ color: '#e0e0e0', fontWeight: 500, display: 'block', marginBottom: 4, fontSize: 12 }}>Secondary member ID</Text>
          <IMaskInput
            mask="aa-0000-aa"
            definitions={{ a: /[A-Za-z]/, '0': /[0-9]/ }}
            prepare={(s: string) => s.toUpperCase()}
            placeholder="AA-####-AA"
            value={secondaryDraft}
            onAccept={(val: string) => setSecondaryDraft(val)}
            data-testid="secondary-member-id"
            style={inputStyle}
          />
        </div>

        <Button type="primary" size="small" block onClick={handleApply}>Apply IDs</Button>
      </Card>
    </div>
  );
}
