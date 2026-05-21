'use client';

/**
 * virtual_list-antd-v2-T07
 * Results pane: choose the row matching the reference badges
 *
 * Split panel with a "Reference badges" card and a virtualized "Candidate matches"
 * list. Agent must find R-311 whose badge pair matches the reference, select it,
 * and click "Use selected match". High-contrast theme.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tag, Typography } from 'antd';
import VirtualList from 'rc-virtual-list';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const badgeColors = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
const badgeLabels = ['Core', 'Edge', 'Beta', 'GA', 'Legacy', 'Canary', 'Stable', 'Preview', 'LTS', 'Nightly', 'RC'];
const names = ['Query engine', 'Auth proxy', 'Cache layer', 'Worker pool', 'Stream relay', 'Config store', 'Log sink', 'Metric hub'];

interface CandidateItem {
  key: string;
  code: string;
  name: string;
  badge1: { color: string; label: string; };
  badge2: { color: string; label: string; };
}

const REF_BADGE1 = { color: 'cyan', label: 'Canary' };
const REF_BADGE2 = { color: 'purple', label: 'RC' };

function buildCandidates(): CandidateItem[] {
  return Array.from({ length: 240 }, (_, i) => {
    const isTarget = i === 131;
    return {
      key: `r-${i + 180}`,
      code: `R-${i + 180}`,
      name: names[i % names.length],
      badge1: isTarget ? REF_BADGE1 : { color: badgeColors[i % badgeColors.length], label: badgeLabels[i % badgeLabels.length] },
      badge2: isTarget ? REF_BADGE2 : { color: badgeColors[(i + 5) % badgeColors.length], label: badgeLabels[(i + 3) % badgeLabels.length] },
    };
  });
}

const candidates = buildCandidates();

export default function T07({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const successRef = useRef(false);

  useEffect(() => {
    if (successRef.current) return;
    if (saved && selected === 'r-311') {
      successRef.current = true;
      onSuccess();
    }
  }, [saved, selected, onSuccess]);

  return (
    <div style={{ display: 'flex', gap: 16, padding: 16, background: '#000', borderRadius: 8, minWidth: 700 }}>
      <Card size="small" title="Reference badges" style={{ width: 200, flexShrink: 0 }}
        headStyle={{ background: '#111', color: '#fff', borderBottom: '1px solid #333' }}
        bodyStyle={{ background: '#0a0a0a' }}
        data-testid="ref-badges-r311"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 8 }}>
          <Tag color={REF_BADGE1.color}>{REF_BADGE1.label}</Tag>
          <Tag color={REF_BADGE2.color}>{REF_BADGE2.label}</Tag>
        </div>
        <Text style={{ color: '#999', fontSize: 11, display: 'block', marginTop: 8 }}>
          Match both badges and ID R-311
        </Text>
      </Card>

      <Card size="small" title="Candidate matches" style={{ flex: 1 }}
        headStyle={{ background: '#111', color: '#fff', borderBottom: '1px solid #333' }}
        bodyStyle={{ background: '#0a0a0a', padding: 8 }}
      >
        <div style={{ border: '1px solid #333', borderRadius: 4 }}>
          <VirtualList data={candidates} height={340} itemHeight={44} itemKey="key">
            {(item: CandidateItem) => (
              <div
                key={item.key}
                data-item-key={item.key}
                aria-selected={selected === item.key}
                onClick={() => { setSelected(item.key); setSaved(false); }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 10px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #222',
                  backgroundColor: selected === item.key ? '#177ddc33' : 'transparent',
                  fontSize: 12,
                }}
              >
                <span style={{ color: '#d9d9d9' }}>{item.code} — {item.name}</span>
                <span>
                  <Tag color={item.badge1.color} style={{ fontSize: 11 }}>{item.badge1.label}</Tag>
                  <Tag color={item.badge2.color} style={{ fontSize: 11 }}>{item.badge2.label}</Tag>
                </span>
              </div>
            )}
          </VirtualList>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <Text style={{ color: '#666', fontSize: 11 }}>Selected: {selected ?? 'none'}</Text>
          <Button size="small" type="primary" onClick={() => setSaved(true)} disabled={!selected}>
            Use selected match
          </Button>
        </div>
      </Card>
    </div>
  );
}
