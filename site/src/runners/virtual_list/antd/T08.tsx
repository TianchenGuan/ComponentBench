'use client';

/**
 * virtual_list-antd-T08: Open a modal list, choose an approver, and apply
 *
 * Theme: dark.
 * Layout: modal_flow. The main page shows a compact "Request Approval" card with a single button.
 * Target component: clicking "Choose approver" opens an AntD Modal titled "Select an approver".
 * Inside the modal:
 *   - a virtualized list (height ~320px) of ~1,200 approvers
 *   - a sticky modal footer with two buttons: "Cancel" and primary "Apply"
 * Interaction model: single-select within the modal list. Selection is NOT committed until "Apply" is clicked.
 * Initial state: modal closed; no approver selected.
 *
 * Success: Select 'apr-0031' (Priya Nair) and click Apply
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Tag, Typography, Select } from 'antd';
import VirtualList from 'rc-virtual-list';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

interface ApproverItem {
  key: string;
  id: string;
  name: string;
  team: 'Finance' | 'Legal' | 'Engineering' | 'HR' | 'Operations';
}

const teamColors: Record<string, string> = {
  Finance: 'green',
  Legal: 'purple',
  Engineering: 'blue',
  HR: 'cyan',
  Operations: 'orange',
};

// Generate 1200 approvers
const generateApprovers = (): ApproverItem[] => {
  const firstNames = ['Priya', 'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Parker'];
  const lastNames = ['Nair', 'Kim', 'Chen', 'Patel', 'Smith', 'Johnson', 'Garcia', 'Martinez', 'Brown', 'Wilson'];
  const teams: ApproverItem['team'][] = ['Finance', 'Legal', 'Engineering', 'HR', 'Operations'];
  
  return Array.from({ length: 1200 }, (_, i) => {
    const num = i + 1;
    let name = `${firstNames[i % firstNames.length]} ${lastNames[(i * 3) % lastNames.length]}`;
    // Special name for approver 31
    if (num === 31) name = 'Priya Nair';
    return {
      key: `apr-${String(num).padStart(4, '0')}`,
      id: `APR-${String(num).padStart(4, '0')}`,
      name,
      team: teams[i % teams.length],
    };
  });
};

const approvers = generateApprovers();

export default function T08({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [tempSelectedKey, setTempSelectedKey] = useState<string | null>(null);
  const [confirmedApprover, setConfirmedApprover] = useState<ApproverItem | null>(null);

  const handleApply = () => {
    if (tempSelectedKey) {
      const approver = approvers.find(a => a.key === tempSelectedKey);
      if (approver) {
        setConfirmedApprover(approver);
        setModalOpen(false);
      }
    }
  };

  const handleCancel = () => {
    setTempSelectedKey(confirmedApprover?.key || null);
    setModalOpen(false);
  };

  // Check success condition
  useEffect(() => {
    if (confirmedApprover?.key === 'apr-0031') {
      onSuccess();
    }
  }, [confirmedApprover, onSuccess]);

  return (
    <>
      <Card 
        title="Request Approval" 
        style={{ width: 400 }}
        data-confirmed-approver={confirmedApprover?.key || 'none'}
      >
        <div style={{ marginBottom: 16 }}>
          <Text>Approver: {confirmedApprover ? `${confirmedApprover.id} — ${confirmedApprover.name}` : 'none'}</Text>
        </div>
        <Button type="primary" onClick={() => setModalOpen(true)}>
          Choose approver
        </Button>
      </Card>

      <Modal
        title="Select an approver"
        open={modalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button 
            key="apply" 
            type="primary" 
            onClick={handleApply}
            disabled={!tempSelectedKey}
          >
            Apply
          </Button>,
        ]}
        width={500}
      >
        {/* Non-functional distractor */}
        <div style={{ marginBottom: 12 }}>
          <Select
            placeholder="Sort by"
            disabled
            style={{ width: 150 }}
            options={[{ value: 'name', label: 'Name' }]}
          />
        </div>
        
        <div 
          style={{ 
            border: '1px solid #f0f0f0', 
            borderRadius: 4,
          }}
          data-testid="vl-modal"
        >
          <VirtualList
            data={approvers}
            height={320}
            itemHeight={48}
            itemKey="key"
          >
            {(item: ApproverItem) => (
              <div
                key={item.key}
                data-item-key={item.key}
                aria-selected={tempSelectedKey === item.key}
                onClick={() => setTempSelectedKey(item.key)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0',
                  backgroundColor: tempSelectedKey === item.key ? '#e6f4ff' : 'transparent',
                }}
              >
                <Text>{item.id} — {item.name}</Text>
                <Tag color={teamColors[item.team]}>{item.team}</Tag>
              </div>
            )}
          </VirtualList>
        </div>
      </Modal>
    </>
  );
}
