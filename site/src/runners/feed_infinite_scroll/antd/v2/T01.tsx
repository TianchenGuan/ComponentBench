'use client';

/**
 * feed_infinite_scroll-antd-v2-T01
 * Audit log modal: reveal the target entry, expand it, and apply
 *
 * Layout: modal_flow, compact spacing, top_right placement, medium clutter.
 * A security card has a "View audit log" button -> AntD Modal with a fixed-height
 * feed of AntD List rows + on-scroll loading. Target AUD-142 is below initial load.
 * Expand inline details, then click "Use selected audit entry" to commit.
 */

import React, { useState, useRef, useCallback } from 'react';
import { Card, Modal, Button, List, Spin, Typography, Tag } from 'antd';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';

const { Text } = Typography;

interface AuditEntry {
  id: string;
  title: string;
  timestamp: string;
}

const AUDIT_TITLES: Record<number, string> = {
  1: 'Session initiated', 2: 'Password changed', 3: 'Role assigned',
  4: 'API key generated', 5: 'User locked', 6: 'Permissions updated',
  7: 'MFA enabled', 8: 'Bulk export started', 9: 'Service restarted',
  10: 'Config snapshot saved', 15: 'Certificate renewed', 20: 'Firewall rule added',
  30: 'Database backup triggered', 42: 'Token rotation scheduled',
  50: 'IP whitelist updated', 60: 'Webhook registered', 70: 'Audit policy changed',
  80: 'Account deactivated', 90: 'Compliance scan passed', 100: 'Key pair rotated',
};

function genAuditEntries(start: number, count: number): AuditEntry[] {
  const out: AuditEntry[] = [];
  for (let i = start; i < start + count; i++) {
    out.push({
      id: `AUD-${String(i).padStart(3, '0')}`,
      title: AUDIT_TITLES[i] || `Audit event ${i}`,
      timestamp: `${(i * 7) % 24}h ago`,
    });
  }
  return out;
}

const TOTAL = 180;
const PAGE = 20;
const TARGET_ID = 'AUD-142';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [items, setItems] = useState<AuditEntry[]>(() => genAuditEntries(1, PAGE));
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const successRef = useRef(false);
  const feedRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop - clientHeight < 120 && !loading && items.length < TOTAL) {
        setLoading(true);
        setTimeout(() => {
          setItems((prev) => [...prev, ...genAuditEntries(prev.length + 1, PAGE)]);
          setLoading(false);
        }, 400);
      }
    },
    [loading, items.length],
  );

  const handleConfirm = () => {
    if (expandedId === TARGET_ID && !successRef.current) {
      setSaved(true);
      successRef.current = true;
      setModalOpen(false);
      onSuccess();
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 24 }}>
      <Card
        style={{ width: 380 }}
        title={
          <span>
            <SafetyCertificateOutlined style={{ marginRight: 8 }} />
            Security overview
          </span>
        }
      >
        <Tag color="green">Compliance: OK</Tag>
        <Tag color="blue">MFA active</Tag>
        <div style={{ marginTop: 16 }}>
          <Button type="primary" onClick={() => setModalOpen(true)}>
            View audit log
          </Button>
        </div>
      </Card>

      <Modal
        title="Audit log"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        width={520}
        footer={
          <Button
            type="primary"
            disabled={!expandedId}
            onClick={handleConfirm}
            data-testid="confirm-audit"
          >
            Use selected audit entry
          </Button>
        }
        style={{ top: 40 }}
      >
        <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>
          Loaded {items.length} / {TOTAL}
        </div>
        <div
          ref={feedRef}
          data-testid="feed-audit-log"
          style={{ height: 360, overflow: 'auto' }}
          onScroll={handleScroll}
        >
          <List
            dataSource={items}
            renderItem={(item) => {
              const isExpanded = expandedId === item.id;
              return (
                <List.Item
                  key={item.id}
                  data-item-id={item.id}
                  style={{
                    cursor: 'pointer',
                    background: isExpanded ? '#e6f4ff' : 'transparent',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '8px 12px',
                  }}
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div style={{ width: '100%' }}>
                    <Text strong style={{ fontSize: 13 }}>{item.id}</Text>
                    <Text style={{ fontSize: 13 }}> — {item.title}</Text>
                    <Text type="secondary" style={{ fontSize: 11, float: 'right' }}>
                      {item.timestamp}
                    </Text>
                  </div>
                  {isExpanded && (
                    <div
                      style={{
                        marginTop: 6,
                        padding: '6px 8px',
                        background: '#f5f5f5',
                        borderRadius: 4,
                        fontSize: 12,
                        width: '100%',
                      }}
                    >
                      Details for {item.id}: {item.title}. Recorded at {item.timestamp}.
                      Full trace and metadata available in the compliance dashboard.
                    </div>
                  )}
                </List.Item>
              );
            }}
          />
          {loading && (
            <div style={{ textAlign: 'center', padding: 12 }}>
              <Spin size="small" />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
