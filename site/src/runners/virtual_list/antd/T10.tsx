'use client';

/**
 * virtual_list-antd-T10: Clear selections in the correct list and save
 *
 * Layout: isolated_card centered titled "Notification Recipients".
 * Target components: two side-by-side virtualized checkbox lists:
 *   - Left: "Primary Recipients" (this is the TARGET)
 *   - Right: "CC Recipients" (distractor)
 * Initial state:
 *   - Primary Recipients: 3 emails are pre-checked.
 *   - CC Recipients: 2 different emails are pre-checked (must remain unchanged).
 * Confirmation: below both lists is a sticky footer bar with "Save changes" and "Discard".
 *
 * Success: Primary Recipients has 0 checked items AND "Save changes" is clicked
 */

import React, { useState, useEffect } from 'react';
import { Card, Typography, Checkbox, Button, message } from 'antd';
import VirtualList from 'rc-virtual-list';
import type { TaskComponentProps } from '../types';
import { selectionSetEquals } from '../types';

const { Text } = Typography;

interface RecipientItem {
  key: string;
  email: string;
}

// Generate recipients
const generateRecipients = (prefix: string, count: number): RecipientItem[] => {
  const domains = ['example.com', 'company.org', 'mail.co'];
  const names = ['alex.lee', 'jordan.kim', 'taylor.chen', 'morgan.patel', 'casey.smith', 
                 'riley.johnson', 'quinn.garcia', 'avery.martinez', 'parker.brown', 'drew.wilson'];
  
  return Array.from({ length: count }, (_, i) => ({
    key: `${prefix}-${String(i + 1).padStart(3, '0')}`,
    email: `${names[i % names.length]}${i > 9 ? i : ''}@${domains[i % domains.length]}`,
  }));
};

const primaryRecipients = generateRecipients('primary', 100);
const ccRecipients = generateRecipients('cc', 100);

// Pre-selected keys
const INITIAL_PRIMARY_KEYS = ['primary-001', 'primary-003', 'primary-005'];
const INITIAL_CC_KEYS = ['cc-002', 'cc-004'];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [primaryCheckedKeys, setPrimaryCheckedKeys] = useState<Set<string>>(new Set(INITIAL_PRIMARY_KEYS));
  const [ccCheckedKeys, setCcCheckedKeys] = useState<Set<string>>(new Set(INITIAL_CC_KEYS));
  const [hasSaved, setHasSaved] = useState(false);

  const handleTogglePrimary = (key: string) => {
    setPrimaryCheckedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleToggleCC = (key: string) => {
    setCcCheckedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleClearAllPrimary = () => {
    setPrimaryCheckedKeys(new Set());
  };

  const handleSave = () => {
    setHasSaved(true);
    message.success('Recipients updated');
  };

  const handleDiscard = () => {
    setPrimaryCheckedKeys(new Set(INITIAL_PRIMARY_KEYS));
    setCcCheckedKeys(new Set(INITIAL_CC_KEYS));
    message.info('Changes discarded');
  };

  // Check success condition
  useEffect(() => {
    if (hasSaved && selectionSetEquals(primaryCheckedKeys, [])) {
      onSuccess();
    }
  }, [hasSaved, primaryCheckedKeys, onSuccess]);

  return (
    <Card 
      title="Notification Recipients" 
      style={{ width: 700 }}
    >
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        {/* Primary Recipients (target) */}
        <div style={{ flex: 1 }} data-testid="vl-primary">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text strong>Primary Recipients</Text>
            <Button type="link" size="small" onClick={handleClearAllPrimary}>
              Clear all
            </Button>
          </div>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
            Primary selected: {primaryCheckedKeys.size}
          </div>
          <div style={{ border: '1px solid #f0f0f0', borderRadius: 4 }}>
            <VirtualList
              data={primaryRecipients}
              height={300}
              itemHeight={40}
              itemKey="key"
            >
              {(item: RecipientItem) => {
                const isChecked = primaryCheckedKeys.has(item.key);
                return (
                  <div
                    key={item.key}
                    data-item-key={item.key}
                    aria-checked={isChecked}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 12px',
                      borderBottom: '1px solid #f0f0f0',
                      gap: 8,
                    }}
                  >
                    <Checkbox
                      checked={isChecked}
                      onChange={() => handleTogglePrimary(item.key)}
                    />
                    <Text style={{ fontSize: 13 }}>{item.email}</Text>
                  </div>
                );
              }}
            </VirtualList>
          </div>
        </div>

        {/* CC Recipients (distractor) */}
        <div style={{ flex: 1 }} data-testid="vl-cc">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text strong>CC Recipients</Text>
            <Button type="link" size="small" onClick={() => setCcCheckedKeys(new Set())}>
              Clear all
            </Button>
          </div>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
            CC selected: {ccCheckedKeys.size}
          </div>
          <div style={{ border: '1px solid #f0f0f0', borderRadius: 4 }}>
            <VirtualList
              data={ccRecipients}
              height={300}
              itemHeight={40}
              itemKey="key"
            >
              {(item: RecipientItem) => {
                const isChecked = ccCheckedKeys.has(item.key);
                return (
                  <div
                    key={item.key}
                    data-item-key={item.key}
                    aria-checked={isChecked}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 12px',
                      borderBottom: '1px solid #f0f0f0',
                      gap: 8,
                    }}
                  >
                    <Checkbox
                      checked={isChecked}
                      onChange={() => handleToggleCC(item.key)}
                    />
                    <Text style={{ fontSize: 13 }}>{item.email}</Text>
                  </div>
                );
              }}
            </VirtualList>
          </div>
        </div>
      </div>

      {/* Footer buttons */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
        <Button onClick={handleDiscard}>Discard</Button>
        <Button type="primary" onClick={handleSave}>Save changes</Button>
      </div>
    </Card>
  );
}
