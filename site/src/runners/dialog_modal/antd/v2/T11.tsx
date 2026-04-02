'use client';

/**
 * dialog_modal-antd-v2-T11: Billing address row → Escape only
 */

import React, { useRef, useState } from 'react';
import { Button, Card, Modal, Space, Typography } from 'antd';
import type { TaskComponentProps } from '../../types';

const { Paragraph } = Typography;

export default function T11({ onSuccess }: TaskComponentProps) {
  const [ship, setShip] = useState(false);
  const [bill, setBill] = useState(false);
  const [office, setOffice] = useState(false);
  const successCalledRef = useRef(false);

  const open = (kind: 'ship' | 'bill' | 'office') => {
    setShip(kind === 'ship');
    setBill(kind === 'bill');
    setOffice(kind === 'office');
    const title =
      kind === 'ship' ? 'Shipping address' : kind === 'bill' ? 'Billing address' : 'Office address';
    window.__cbModalState = {
      open: true,
      close_reason: null,
      modal_instance: title,
      last_opened_instance: title,
    };
  };

  const modal = (
    title: 'Shipping address' | 'Billing address' | 'Office address',
    openM: boolean,
    set: (v: boolean) => void,
    testId: string,
  ) => (
    <Modal
      title={title}
      open={openM}
      closable
      maskClosable={false}
      keyboard
      footer={null}
      onCancel={() => {
        set(false);
        window.__cbModalState = {
          open: false,
          close_reason: 'escape_key',
          modal_instance: title,
          last_opened_instance: title,
        };
        if (title === 'Billing address' && !successCalledRef.current) {
          successCalledRef.current = true;
          setTimeout(() => onSuccess(), 100);
        }
      }}
      data-testid={testId}
    >
      <Paragraph style={{ marginBottom: 0 }}>Edit {title.toLowerCase()} for this account.</Paragraph>
    </Modal>
  );

  return (
    <Card size="small" title="Addresses" style={{ maxWidth: 520 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Paragraph style={{ marginBottom: 0 }} strong>
            Shipping address
          </Paragraph>
          <Button size="small" onClick={() => open('ship')} data-testid="cb-edit-shipping">
            Edit
          </Button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Paragraph style={{ marginBottom: 0 }} strong>
            Billing address
          </Paragraph>
          <Button size="small" onClick={() => open('bill')} data-testid="cb-edit-billing">
            Edit
          </Button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Paragraph style={{ marginBottom: 0 }} strong>
            Office address
          </Paragraph>
          <Button size="small" onClick={() => open('office')} data-testid="cb-edit-office">
            Edit
          </Button>
        </div>
      </Space>
      {modal('Shipping address', ship, setShip, 'modal-shipping')}
      {modal('Billing address', bill, setBill, 'modal-billing')}
      {modal('Office address', office, setOffice, 'modal-office')}
    </Card>
  );
}
