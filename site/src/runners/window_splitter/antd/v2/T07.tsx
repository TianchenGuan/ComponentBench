'use client';

/**
 * window_splitter-antd-v2-T07: Secondary splitter to ~35/65, then Save layout
 *
 * Modal with two splitters. Adjust "Secondary — Release notes" so Notes ≈35% / Draft ≈65%
 * (±5 percentage points). No live % readout. Commit with "Save layout".
 */

import React, { useState, useRef } from 'react';
import { Button, Modal, Splitter, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

const TARGET_FIRST = 35;
const TOL = 5;

function normalizePercents(raw: number[]): number[] {
  const total = raw.reduce((a, b) => a + b, 0);
  if (total <= 0) return [50, 50];
  return raw.map((s) => (s / total) * 100);
}

function isTargetSplit(s: number[]): boolean {
  return Math.abs(s[0] - TARGET_FIRST) <= TOL && Math.abs(s[1] - (100 - TARGET_FIRST)) <= TOL;
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [primary, setPrimary] = useState<number[]>([50, 50]);
  const [secondaryDraft, setSecondaryDraft] = useState<number[]>([48, 52]);
  const successFired = useRef(false);

  const handleSaveLayout = () => {
    if (successFired.current) return;
    if (isTargetSplit(secondaryDraft)) {
      successFired.current = true;
      onSuccess();
    }
  };

  return (
    <div style={{ padding: 12 }}>
      <Button type="primary" onClick={() => setOpen(true)}>
        Layout lab
      </Button>

      <Modal
        title="Layout lab"
        open={open}
        onCancel={() => setOpen(false)}
        width={720}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={handleSaveLayout}>
              Save layout
            </Button>
          </div>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            Primary — Editor/Preview
          </Text>
          <Splitter
            style={{ height: 160, boxShadow: '0 0 4px rgba(0,0,0,0.08)' }}
            onResize={(raw) => setPrimary(normalizePercents(raw))}
          >
            <Splitter.Panel min="15%" max="85%" size={primary[0]}>
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#fafafa',
                }}
              >
                Editor
              </div>
            </Splitter.Panel>
            <Splitter.Panel size={primary[1]}>
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f0f0f0',
                }}
              >
                Preview
              </div>
            </Splitter.Panel>
          </Splitter>
        </div>

        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            Secondary — Release notes
          </Text>
          <Splitter
            style={{ height: 160, boxShadow: '0 0 4px rgba(0,0,0,0.08)' }}
            onResize={(raw) => setSecondaryDraft(normalizePercents(raw))}
          >
            <Splitter.Panel min="10%" max="90%" size={secondaryDraft[0]}>
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#fafafa',
                }}
              >
                Notes
              </div>
            </Splitter.Panel>
            <Splitter.Panel size={secondaryDraft[1]}>
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f0f0f0',
                }}
              >
                Draft
              </div>
            </Splitter.Panel>
          </Splitter>
          <Text type="secondary" style={{ fontSize: 11, marginTop: 8, display: 'block' }}>
            Drag the divider so Notes is narrower than Draft (about one-third of the row), then Save layout.
          </Text>
        </div>
      </Modal>
    </div>
  );
}
