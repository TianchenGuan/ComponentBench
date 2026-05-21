'use client';

/**
 * autocomplete_freeform-antd-v2-T02: Settings panel alias — suggestion selection on the second field only
 *
 * Two AutoComplete fields (Owner alias, Escalation alias) in a dense settings panel.
 * Set "Escalation alias" to `plat-eu — Platform Europe` from suggestions.
 * Owner alias must stay `platform — Shared Platform`. Click "Save routing".
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AutoComplete, Button, Card, Divider, Segmented, Select, Space, Switch, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text, Title } = Typography;

interface AliasOption {
  value: string;
  label: string;
}

const aliasSuggestions: AliasOption[] = [
  { value: 'plat-us — Platform US', label: 'plat-us — Platform US' },
  { value: 'plat-eu — Platform Europe', label: 'plat-eu — Platform Europe' },
  { value: 'plat-ops — Platform Operations', label: 'plat-ops — Platform Operations' },
  { value: 'platform — Shared Platform', label: 'platform — Shared Platform' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [ownerAlias, setOwnerAlias] = useState('platform — Shared Platform');
  const [escalationAlias, setEscalationAlias] = useState('');
  const [escalationFromSuggestion, setEscalationFromSuggestion] = useState(false);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const handleSave = useCallback(() => {
    setSaved(true);
  }, []);

  useEffect(() => {
    if (successFired.current || !saved) return;
    if (
      escalationAlias === 'plat-eu — Platform Europe' &&
      escalationFromSuggestion &&
      ownerAlias === 'platform — Shared Platform'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, escalationAlias, escalationFromSuggestion, ownerAlias, onSuccess]);

  return (
    <div style={{ padding: 24, display: 'flex', gap: 16 }}>
      <Card title="Routing Settings" style={{ width: 460 }}>
        {/* Clutter: unrelated controls */}
        <Space direction="vertical" size="small" style={{ width: '100%', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Auto-retry failed routes</Text>
            <Switch defaultChecked />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Timeout (ms)</Text>
            <Segmented options={['500', '1000', '3000']} defaultValue="1000" size="small" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Region</Text>
            <Select defaultValue="us-east" size="small" style={{ width: 120 }}
              options={[{ value: 'us-east' }, { value: 'eu-west' }, { value: 'ap-south' }]}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text>Priority tier</Text>
            <Select defaultValue="normal" size="small" style={{ width: 120 }}
              options={[{ value: 'low' }, { value: 'normal' }, { value: 'high' }]}
            />
          </div>
        </Space>

        <Divider />

        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Owner alias</Text>
            <AutoComplete
              data-testid="owner-alias"
              style={{ width: '100%' }}
              options={aliasSuggestions}
              value={ownerAlias}
              onChange={(val) => setOwnerAlias(val)}
              filterOption={(input, option) =>
                option!.value.toLowerCase().includes(input.toLowerCase())
              }
            />
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Escalation alias</Text>
            <AutoComplete
              data-testid="escalation-alias"
              style={{ width: '100%' }}
              options={aliasSuggestions}
              value={escalationAlias}
              onChange={(val) => {
                setEscalationAlias(val);
                setEscalationFromSuggestion(false);
              }}
              onSelect={(val) => {
                setEscalationAlias(val);
                setEscalationFromSuggestion(true);
              }}
              filterOption={(input, option) =>
                option!.value.toLowerCase().includes(input.toLowerCase())
              }
              placeholder="Type to search aliases"
            />
          </div>
        </Space>

        <div style={{ marginTop: 20, textAlign: 'right' }}>
          <Button type="primary" onClick={handleSave}>Save routing</Button>
        </div>
      </Card>
    </div>
  );
}
