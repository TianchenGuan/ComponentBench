'use client';

/**
 * hover_card-antd-T07: Expand 'More details' inside a hover card
 *
 * Layout: isolated_card centered (light theme, comfortable spacing).
 *
 * The card shows a single invoice row:
 * - Label: "Invoice"
 * - Value: "INV-203" (rendered as a pill-shaped token). This token is the hover target.
 *
 * Hovering the token opens an AntD Popover hover card with:
 * - Header: "INV-203 • Paid"
 * - Body: a short summary line and a collapsed "More details" region.
 * - The collapsed region is controlled by a text button/link labeled "More details" (initially collapsed).
 * - When expanded, two additional lines appear ("Paid on …", "Payment method …").
 *
 * Initial state: hover card closed; details section collapsed.
 * No other interactive components influence success.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Popover, Typography, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (open && detailsExpanded && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [open, detailsExpanded, onSuccess]);

  const hoverCardContent = (
    <div 
      style={{ width: 260 }} 
      data-testid="hover-card-content"
      data-cb-instance="Invoice INV-203"
      data-details-expanded={detailsExpanded}
    >
      <div style={{ marginBottom: 12 }}>
        <Text strong>INV-203</Text>
        <span style={{ 
          marginLeft: 8, 
          padding: '2px 8px', 
          backgroundColor: '#f6ffed', 
          color: '#52c41a', 
          borderRadius: 4,
          fontSize: 12
        }}>
          Paid
        </span>
      </div>
      <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
        Total amount: $1,250.00
      </Text>
      <Button
        type="link"
        size="small"
        onClick={() => setDetailsExpanded(!detailsExpanded)}
        data-testid="more-details-button"
        style={{ padding: 0, height: 'auto' }}
      >
        More details {detailsExpanded ? <UpOutlined /> : <DownOutlined />}
      </Button>
      {detailsExpanded && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
          <div style={{ fontSize: 13, marginBottom: 4 }}>
            <Text type="secondary">Paid on:</Text> January 15, 2024
          </div>
          <div style={{ fontSize: 13 }}>
            <Text type="secondary">Payment method:</Text> Credit Card (****4242)
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Card title="Invoice Details" style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text type="secondary">Invoice</Text>
        <Popover 
          content={hoverCardContent}
          trigger="hover"
          open={open}
          onOpenChange={(visible) => {
            setOpen(visible);
            if (!visible) {
              setDetailsExpanded(false);
            }
          }}
        >
          <span
            data-testid="invoice-trigger"
            data-cb-instance="Invoice INV-203"
            style={{ 
              color: '#1677ff', 
              cursor: 'pointer',
              padding: '4px 12px',
              borderRadius: 16,
              backgroundColor: '#f0f5ff',
              fontWeight: 500
            }}
          >
            INV-203
          </span>
        </Popover>
      </div>
    </Card>
  );
}
