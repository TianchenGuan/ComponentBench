'use client';

/**
 * dialog_modal-antd-v2-T02: Match shield reference → Audit trail, backdrop dismiss
 */

import React, { useRef, useState } from 'react';
import { Button, Card, Col, Flex, Modal, Row, Space, Tag, Typography } from 'antd';
import { SafetyOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';

const { Paragraph, Text } = Typography;

export default function T02({ onSuccess }: TaskComponentProps) {
  const [chat, setChat] = useState(false);
  const [audit, setAudit] = useState(false);
  const [billing, setBilling] = useState(false);
  const successCalledRef = useRef(false);

  const openOne = (which: 'chat' | 'audit' | 'bill') => {
    setChat(which === 'chat');
    setAudit(which === 'audit');
    setBilling(which === 'bill');
    const title =
      which === 'chat' ? 'Chat theme' : which === 'audit' ? 'Audit trail' : 'Billing summary';
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: title,
      last_opened_instance: title,
    };
  };

  const dismiss = (title: 'Chat theme' | 'Audit trail' | 'Billing summary', close: () => void) => {
    close();
    window.__cbModalState = {
      open: false,
      close_reason: 'backdrop_click',
      modal_instance: title,
      last_opened_instance: title,
    };
    if (title === 'Audit trail' && !successCalledRef.current) {
      successCalledRef.current = true;
      setTimeout(() => onSuccess(), 100);
    }
  };

  const modal = (
    title: 'Chat theme' | 'Audit trail' | 'Billing summary',
    open: boolean,
    set: (v: boolean) => void,
    body: string,
    testId: string,
  ) => (
    <Modal
      title={title}
      open={open}
      closable
      maskClosable
      keyboard={false}
      footer={null}
      onCancel={() => dismiss(title, () => set(false))}
      data-testid={testId}
    >
      <Paragraph style={{ marginBottom: 0 }}>{body}</Paragraph>
    </Modal>
  );

  return (
    <div style={{ maxWidth: 720 }}>
      <Card size="small" style={{ marginBottom: 12 }}>
        <Space align="center">
          <SafetyOutlined style={{ fontSize: 22, color: '#8c8c8c' }} />
          <Text strong>Reference</Text>
          <Tag color="default">shield badge</Tag>
        </Space>
      </Card>
      <Flex wrap="wrap" gap={6} style={{ marginBottom: 10 }}>
        <Tag>CPU 42%</Tag>
        <Tag color="blue">Alerts 0</Tag>
        <Tag>Queue depth 3</Tag>
      </Flex>
      <Row gutter={[12, 12]}>
        <Col xs={24} md={8}>
          <Card size="small" title="Workspace A">
            <Paragraph type="secondary" style={{ fontSize: 12 }}>
              Theme presets for chat surfaces.
            </Paragraph>
            <Button size="small" onClick={() => openOne('chat')} data-testid="cb-open-chat">
              Open dialog
            </Button>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            size="small"
            title={
              <Space>
                <SafetyOutlined style={{ color: '#8c8c8c' }} />
                Workspace B
              </Space>
            }
          >
            <Paragraph type="secondary" style={{ fontSize: 12 }}>
              Compliance and audit exports.
            </Paragraph>
            <Button size="small" onClick={() => openOne('audit')} data-testid="cb-open-audit">
              Open dialog
            </Button>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card size="small" title="Workspace C">
            <Paragraph type="secondary" style={{ fontSize: 12 }}>
              Invoice summaries.
            </Paragraph>
            <Button size="small" onClick={() => openOne('bill')} data-testid="cb-open-billing">
              Open dialog
            </Button>
          </Card>
        </Col>
      </Row>
      {modal('Chat theme', chat, setChat, 'Pick a chat color preset.', 'modal-chat-theme')}
      {modal(
        'Audit trail',
        audit,
        setAudit,
        'Recent audit events for this workspace.',
        'modal-audit-trail',
      )}
      {modal(
        'Billing summary',
        billing,
        setBilling,
        'Last billing cycle totals.',
        'modal-billing-summary',
      )}
    </div>
  );
}
