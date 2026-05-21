'use client';

/**
 * dialog_modal-antd-T10: Open the dialog that matches a visual reference
 *
 * Layout: dashboard with a simple two-column grid (cards for "Billing", "Analytics", and "Support").
 *
 * At the top of the dashboard there is a small non-interactive "Reference swatch" row showing:
 * - Label: "Target dialog header color"
 * - A solid PURPLE swatch
 *
 * There are three Ant Design Modal instances on the page:
 * 1) Card "Billing": button "Open invoice dialog" → Modal title "Invoices" with GREEN-tinted header strip
 * 2) Card "Analytics": button "Open audit dialog" → Modal title "Audit log" with PURPLE-tinted header strip
 * 3) Card "Support": button "Open tips dialog" → Modal title "Usage tips" with BLUE-tinted header strip
 *
 * Initial state: all modals are closed.
 * Success: The modal instance with PURPLE header strip (title 'Audit log') is open/visible.
 */

import React, { useState, useRef } from 'react';
import { Card, Button, Modal, Typography, Row, Col, Space } from 'antd';
import type { TaskComponentProps } from '../types';

const { Paragraph, Text, Title } = Typography;

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [invoicesOpen, setInvoicesOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [tipsOpen, setTipsOpen] = useState(false);
  const successCalledRef = useRef(false);

  const handleOpenInvoices = () => {
    setInvoicesOpen(true);
    setAuditOpen(false);
    setTipsOpen(false);
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Invoices',
    };
  };

  const handleOpenAudit = () => {
    setAuditOpen(true);
    setInvoicesOpen(false);
    setTipsOpen(false);
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Audit log',
    };
    
    // Success when Audit log (purple) modal opens
    if (!successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  const handleOpenTips = () => {
    setTipsOpen(true);
    setInvoicesOpen(false);
    setAuditOpen(false);
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: 'Usage tips',
    };
  };

  const handleClose = (modal: string) => {
    if (modal === 'invoices') setInvoicesOpen(false);
    if (modal === 'audit') setAuditOpen(false);
    if (modal === 'tips') setTipsOpen(false);
    window.__cbModalState = {
      open: false,
      close_reason: 'cancel',
      modal_instance: modal,
    };
  };

  return (
    <>
      {/* Reference swatch */}
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <Text strong>Target dialog header color:</Text>
          <div
            style={{
              width: 40,
              height: 24,
              backgroundColor: '#722ed1',
              borderRadius: 4,
            }}
            data-color="purple"
          />
        </Space>
      </Card>

      {/* Dashboard grid */}
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Billing">
            <Paragraph>Manage your invoices and payment methods.</Paragraph>
            <Button onClick={handleOpenInvoices} data-testid="cb-open-invoices">
              Open invoice dialog
            </Button>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Analytics">
            <Paragraph>View audit logs and activity reports.</Paragraph>
            <Button onClick={handleOpenAudit} data-testid="cb-open-audit">
              Open audit dialog
            </Button>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Support">
            <Paragraph>Get help and usage tips.</Paragraph>
            <Button onClick={handleOpenTips} data-testid="cb-open-tips">
              Open tips dialog
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Invoices Modal - GREEN header */}
      <Modal
        title={
          <div style={{ borderTop: '4px solid #52c41a', margin: '-20px -24px 0', padding: '16px 24px' }}>
            Invoices
          </div>
        }
        open={invoicesOpen}
        onOk={() => handleClose('invoices')}
        onCancel={() => handleClose('invoices')}
        data-testid="modal-invoices"
        data-header-color="green"
      >
        <Paragraph>Your recent invoices and billing history.</Paragraph>
      </Modal>

      {/* Audit Log Modal - PURPLE header */}
      <Modal
        title={
          <div style={{ borderTop: '4px solid #722ed1', margin: '-20px -24px 0', padding: '16px 24px' }}>
            Audit log
          </div>
        }
        open={auditOpen}
        onOk={() => handleClose('audit')}
        onCancel={() => handleClose('audit')}
        data-testid="modal-audit-log"
        data-header-color="purple"
      >
        <Paragraph>System activity and audit trail records.</Paragraph>
      </Modal>

      {/* Usage Tips Modal - BLUE header */}
      <Modal
        title={
          <div style={{ borderTop: '4px solid #1677ff', margin: '-20px -24px 0', padding: '16px 24px' }}>
            Usage tips
          </div>
        }
        open={tipsOpen}
        onOk={() => handleClose('tips')}
        onCancel={() => handleClose('tips')}
        data-testid="modal-usage-tips"
        data-header-color="blue"
      >
        <Paragraph>Helpful tips to get the most out of our platform.</Paragraph>
      </Modal>
    </>
  );
}
