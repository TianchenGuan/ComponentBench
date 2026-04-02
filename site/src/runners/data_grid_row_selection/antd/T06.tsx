'use client';

/**
 * data_grid_row_selection-antd-T06: Select a reviewer in a modal and confirm
 *
 * The page uses a modal_flow layout: the main view shows a single primary button labeled "Choose reviewer".
 * Clicking it opens an Ant Design Modal titled "Choose reviewer". Inside the modal is a Table with a
 * single-selection control (rowSelection.type='radio'), so only one row can be selected.
 * Spacing is comfortable and scale is default. The modal table shows 8 employees with columns:
 * Employee ID, Name, Team.
 * Initial state: no row selected in the modal. The modal footer has buttons "Cancel" and a primary "OK".
 * Feedback: selecting a row checks its radio control and highlights the row; clicking OK closes the modal
 * and commits the selection to the underlying state.
 *
 * Success: selected_row_ids equals ['emp_E006'] AND require_confirm (OK clicked)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card, Button, Modal } from 'antd';
import type { ColumnsType, TableRowSelection } from 'antd/es/table/interface';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface EmployeeData {
  key: string;
  employeeId: string;
  name: string;
  team: string;
}

const employeesData: EmployeeData[] = [
  { key: 'emp_E001', employeeId: 'E-001', name: 'Alice Chen', team: 'Engineering' },
  { key: 'emp_E002', employeeId: 'E-002', name: 'Bob Martinez', team: 'Design' },
  { key: 'emp_E003', employeeId: 'E-003', name: 'Carol Williams', team: 'Product' },
  { key: 'emp_E004', employeeId: 'E-004', name: 'David Kim', team: 'Engineering' },
  { key: 'emp_E005', employeeId: 'E-005', name: 'Eva Schmidt', team: 'Marketing' },
  { key: 'emp_E006', employeeId: 'E-006', name: 'Nora Diaz', team: 'Engineering' },
  { key: 'emp_E007', employeeId: 'E-007', name: 'Frank Jones', team: 'Sales' },
  { key: 'emp_E008', employeeId: 'E-008', name: 'Grace Liu', team: 'Product' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSelectedKey, setModalSelectedKey] = useState<React.Key | null>(null);
  const [committedSelection, setCommittedSelection] = useState<string[]>([]);
  const hasSucceeded = useRef(false);

  const columns: ColumnsType<EmployeeData> = [
    { title: 'Employee ID', dataIndex: 'employeeId', key: 'employeeId' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Team', dataIndex: 'team', key: 'team' },
  ];

  const rowSelection: TableRowSelection<EmployeeData> = {
    type: 'radio',
    selectedRowKeys: modalSelectedKey ? [modalSelectedKey] : [],
    onChange: (newSelectedRowKeys) => {
      setModalSelectedKey(newSelectedRowKeys[0] ?? null);
    },
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setModalSelectedKey(null);
  };

  const handleOk = () => {
    if (modalSelectedKey) {
      setCommittedSelection([String(modalSelectedKey)]);
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setModalSelectedKey(null);
  };

  // Check success condition
  useEffect(() => {
    if (!hasSucceeded.current && selectionEquals(committedSelection, ['emp_E006'])) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [committedSelection, onSuccess]);

  return (
    <Card style={{ width: 300 }}>
      <Button type="primary" onClick={handleOpenModal} data-testid="choose-reviewer-btn">
        Choose reviewer
      </Button>

      <Modal
        title="Choose reviewer"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="OK"
        cancelText="Cancel"
        width={500}
      >
        <Table
          dataSource={employeesData}
          columns={columns}
          rowSelection={rowSelection}
          pagination={false}
          size="small"
          rowKey="key"
          data-testid="reviewer-table"
          data-modal-selected={JSON.stringify(modalSelectedKey ? [modalSelectedKey] : [])}
        />
      </Modal>

      <div
        style={{ display: 'none' }}
        data-testid="committed-selection"
        data-selected-row-ids={JSON.stringify(committedSelection)}
      />
    </Card>
  );
}
