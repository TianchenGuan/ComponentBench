'use client';

/**
 * transfer_list-antd-T06: Edit approvers in a modal and apply
 *
 * Layout: modal flow. In the center of the page there is a card titled "Invoice approval".
 * Inside the card is a primary button labeled "Edit approvers". Clicking it opens an AntD Modal dialog.
 *
 * The modal title is "Edit approvers". The modal body contains one AntD Transfer component
 * labeled "Approvers". Columns are titled "Available departments" (left) and "Selected" (right).
 * No search box. At the bottom-right of the modal there are two buttons: "Cancel" and a primary "Apply changes".
 *
 * Initial state inside the transfer list:
 * - Selected (right) contains Finance and HR.
 * - Available (left) contains Security, Legal, Sales, Support.
 *
 * No other modal controls affect success; outside-the-modal UI is inert once the modal is open.
 *
 * Success: Target (right) list contains exactly: Finance, Security (order ignore).
 * Changes are committed by clicking the confirm control (Apply changes).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Modal, Transfer, Typography } from 'antd';
import type { TransferProps } from 'antd';
import type { TaskComponentProps, TransferItem } from '../types';
import { setsEqual } from '../types';

const { Text } = Typography;

const allItems: TransferItem[] = [
  { key: 'finance', title: 'Finance' },
  { key: 'hr', title: 'HR' },
  { key: 'security', title: 'Security' },
  { key: 'legal', title: 'Legal' },
  { key: 'sales', title: 'Sales' },
  { key: 'support', title: 'Support' },
];

const initialTargetKeys = ['finance', 'hr'];
const goalTargetKeys = ['finance', 'security'];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [targetKeyState, setTargetKeyState] = useState<string[]>(initialTargetKeys);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [committedKeys, setCommittedKeys] = useState<string[]>(initialTargetKeys);
  const successFired = useRef(false);

  useEffect(() => {
    // Check success only after Apply changes is clicked (committedKeys)
    if (!successFired.current && setsEqual(committedKeys, goalTargetKeys)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedKeys, onSuccess]);

  const handleChange: TransferProps['onChange'] = (newTargetKeys) => {
    setTargetKeyState(newTargetKeys as string[]);
  };

  const handleSelectChange: TransferProps['onSelectChange'] = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys] as string[]);
  };

  const handleApply = () => {
    setCommittedKeys([...targetKeyState]);
    setModalOpen(false);
  };

  const handleCancel = () => {
    // Reset to committed state
    setTargetKeyState([...committedKeys]);
    setSelectedKeys([]);
    setModalOpen(false);
  };

  const handleOpen = () => {
    setTargetKeyState([...committedKeys]);
    setSelectedKeys([]);
    setModalOpen(true);
  };

  return (
    <>
      <Card title="Invoice approval" style={{ width: 400 }}>
        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
          Configure which departments must approve invoices.
        </Text>
        <Button type="primary" onClick={handleOpen}>
          Edit approvers
        </Button>
      </Card>

      <Modal
        title="Edit approvers"
        open={modalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="apply" type="primary" onClick={handleApply} data-testid="apply-changes">
            Apply changes
          </Button>,
        ]}
        width={700}
        data-testid="modal-approvers"
      >
        <Text strong style={{ display: 'block', marginBottom: 12 }}>
          Approvers
        </Text>
        <Transfer
          dataSource={allItems}
          titles={['Available departments', 'Selected']}
          targetKeys={targetKeyState}
          selectedKeys={selectedKeys}
          onChange={handleChange}
          onSelectChange={handleSelectChange}
          render={(item) => item.title}
          listStyle={{ width: 250, height: 250 }}
          data-testid="transfer-approvers"
        />
      </Modal>
    </>
  );
}
