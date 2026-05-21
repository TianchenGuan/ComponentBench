'use client';

/**
 * feed_infinite_scroll-antd-T08: Bulk select: apply 3 tickets in Primary queue
 * 
 * Layout: isolated_card with two stacked feeds.
 * Top feed is labeled "Primary queue"; bottom feed is labeled "Secondary queue".
 * Spacing mode is compact: rows are shorter and checkboxes are small.
 * Selection is two-phase: checking boxes marks items as "Selected (pending)" and
 * enables a feed-local button "Apply selection".
 * 
 * Success: committed_selected_item_ids equals [TCK-021, TCK-024, TCK-027] in Primary queue
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, List, Checkbox, Button, Typography, Badge, Spin } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

interface FeedItem {
  id: string;
  title: string;
}

function generateTickets(start: number, count: number): FeedItem[] {
  const titles = [
    'Password reset',
    'Account access',
    'Billing inquiry',
    'Feature request',
    'Bug report',
    'Login issue',
    'Subscription change',
    'Data export',
    'Integration help',
    'Performance issue',
  ];
  
  const items: FeedItem[] = [];
  for (let i = start; i < start + count; i++) {
    const id = `TCK-${String(i).padStart(3, '0')}`;
    items.push({
      id,
      title: titles[(i - 1) % titles.length],
    });
  }
  return items;
}

interface FeedProps {
  title: string;
  testId: string;
  items: FeedItem[];
  loading: boolean;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  pendingSelection: Set<string>;
  committedSelection: string[];
  onToggleSelection: (id: string) => void;
  onApply: () => void;
}

function Feed({ title, testId, items, loading, onScroll, pendingSelection, committedSelection, onToggleSelection, onApply }: FeedProps) {
  const hasChanges = pendingSelection.size > 0 && 
    (pendingSelection.size !== committedSelection.length || 
     Array.from(pendingSelection).some(id => !committedSelection.includes(id)));

  return (
    <Card 
      title={title}
      size="small"
      style={{ marginBottom: 16 }}
      data-testid={testId}
      data-committed-selected={JSON.stringify(committedSelection)}
    >
      <div
        style={{
          height: 200,
          overflow: 'auto',
        }}
        onScroll={onScroll}
      >
        <List
          size="small"
          dataSource={items}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              data-item-id={item.id}
              style={{ padding: '4px 8px' }}
            >
              <Checkbox
                checked={pendingSelection.has(item.id)}
                onChange={() => onToggleSelection(item.id)}
                style={{ marginRight: 8 }}
              />
              <div style={{ flex: 1 }}>
                <Text strong style={{ fontSize: 12 }}>{item.id}</Text>
                <Text style={{ fontSize: 12 }}> — {item.title}</Text>
              </div>
            </List.Item>
          )}
        />
        {loading && (
          <div style={{ textAlign: 'center', padding: 8 }}>
            <Spin size="small" />
          </div>
        )}
      </div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: 8,
        padding: '8px 0',
        borderTop: '1px solid #f0f0f0',
      }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Selected (pending): {pendingSelection.size}
          {committedSelection.length > 0 && (
            <span> | {committedSelection.length} selected (saved)</span>
          )}
        </Text>
        <Button
          size="small"
          type="primary"
          disabled={pendingSelection.size === 0}
          onClick={onApply}
        >
          Apply selection
        </Button>
      </div>
    </Card>
  );
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [primaryItems, setPrimaryItems] = useState<FeedItem[]>(() => generateTickets(1, 30));
  const [secondaryItems, setSecondaryItems] = useState<FeedItem[]>(() => generateTickets(101, 30));
  const [primaryLoading, setPrimaryLoading] = useState(false);
  const [secondaryLoading, setSecondaryLoading] = useState(false);
  
  const [primaryPending, setPrimaryPending] = useState<Set<string>>(new Set());
  const [primaryCommitted, setPrimaryCommitted] = useState<string[]>([]);
  const [secondaryPending, setSecondaryPending] = useState<Set<string>>(new Set());
  const [secondaryCommitted, setSecondaryCommitted] = useState<string[]>([]);
  
  const successCalledRef = useRef(false);

  // Check for success condition
  useEffect(() => {
    if (successCalledRef.current) return;
    
    const targetIds = ['TCK-021', 'TCK-024', 'TCK-027'];
    const isMatch = primaryCommitted.length === 3 &&
      targetIds.every(id => primaryCommitted.includes(id));
    
    if (isMatch) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [primaryCommitted, onSuccess]);

  const handlePrimaryScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    if (scrollHeight - scrollTop - clientHeight < 100 && !primaryLoading && primaryItems.length < 50) {
      setPrimaryLoading(true);
      setTimeout(() => {
        setPrimaryItems(prev => [...prev, ...generateTickets(prev.length + 1, 10)]);
        setPrimaryLoading(false);
      }, 500);
    }
  }, [primaryLoading, primaryItems.length]);

  const handleSecondaryScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    if (scrollHeight - scrollTop - clientHeight < 100 && !secondaryLoading && secondaryItems.length < 50) {
      setSecondaryLoading(true);
      setTimeout(() => {
        setSecondaryItems(prev => [...prev, ...generateTickets(100 + prev.length + 1, 10)]);
        setSecondaryLoading(false);
      }, 500);
    }
  }, [secondaryLoading, secondaryItems.length]);

  return (
    <div style={{ width: 500 }}>
      <Feed
        title="Primary queue"
        testId="feed-PrimaryQueue"
        items={primaryItems}
        loading={primaryLoading}
        onScroll={handlePrimaryScroll}
        pendingSelection={primaryPending}
        committedSelection={primaryCommitted}
        onToggleSelection={(id) => {
          setPrimaryPending(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
              next.delete(id);
            } else {
              next.add(id);
            }
            return next;
          });
        }}
        onApply={() => {
          setPrimaryCommitted(Array.from(primaryPending));
        }}
      />
      
      <Feed
        title="Secondary queue"
        testId="feed-SecondaryQueue"
        items={secondaryItems}
        loading={secondaryLoading}
        onScroll={handleSecondaryScroll}
        pendingSelection={secondaryPending}
        committedSelection={secondaryCommitted}
        onToggleSelection={(id) => {
          setSecondaryPending(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
              next.delete(id);
            } else {
              next.add(id);
            }
            return next;
          });
        }}
        onApply={() => {
          setSecondaryCommitted(Array.from(secondaryPending));
        }}
      />
    </div>
  );
}
