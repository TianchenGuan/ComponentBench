'use client';

/**
 * select_with_search-antd-T08: Change Secondary region filter inside a modal (3 selects)
 *
 * Layout: dashboard page with a header row and a card labeled "Filters". The "Edit filters" button is in the Filters card.
 * When "Edit filters" is clicked, an Ant Design Modal opens (modal_flow). The modal contains three same-type searchable Selects:
 *  - "Primary region" (default: North America)
 *  - "Secondary region" (default: Europe) ← TARGET
 *  - "Tertiary region" (default: East Asia)
 * Each Select uses showSearch and opens its own dropdown popover within the modal.
 * Region options include: North America, South America, Europe, Middle East, East Asia, Southeast Asia, South Asia, Africa, Oceania.
 * Clutter (medium): the dashboard background includes charts and tables, but they are not interactive once the modal is open; within the modal there are also "Cancel" and "Save" buttons that do not affect success.
 * Success is determined only by the selected value in the "Secondary region" Select; saving/closing the modal is not required.
 *
 * Success: The selected value of the "Secondary region" Select equals "Southeast Asia".
 */

import React, { useState } from 'react';
import { Card, Select, Typography, Button, Modal, Space, Row, Col } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Title } = Typography;

const regionOptions = [
  { value: 'North America', label: 'North America' },
  { value: 'South America', label: 'South America' },
  { value: 'Europe', label: 'Europe' },
  { value: 'Middle East', label: 'Middle East' },
  { value: 'East Asia', label: 'East Asia' },
  { value: 'Southeast Asia', label: 'Southeast Asia' },
  { value: 'South Asia', label: 'South Asia' },
  { value: 'Africa', label: 'Africa' },
  { value: 'Oceania', label: 'Oceania' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [primaryRegion, setPrimaryRegion] = useState<string>('North America');
  const [secondaryRegion, setSecondaryRegion] = useState<string>('Europe');
  const [tertiaryRegion, setTertiaryRegion] = useState<string>('East Asia');

  const handleSecondaryChange = (newValue: string) => {
    setSecondaryRegion(newValue);
    if (newValue === 'Southeast Asia') {
      onSuccess();
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Dashboard header */}
      <div style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Dashboard</Title>
      </div>

      {/* Dashboard content with clutter */}
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Filters" size="small">
            <div style={{ marginBottom: 8 }}>
              <Text type="secondary">Current filters active</Text>
            </div>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
              Edit filters
            </Button>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Revenue" size="small">
            <div style={{ height: 80, background: '#f5f5f5', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text type="secondary">Chart placeholder</Text>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Users" size="small">
            <div style={{ height: 80, background: '#f5f5f5', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text type="secondary">Chart placeholder</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Edit Filters Modal */}
      <Modal
        title="Edit filters"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={() => setIsModalOpen(false)}>
            Save
          </Button>,
        ]}
        width={500}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Primary region</Text>
            <Select
              data-testid="primary-region-select"
              showSearch
              style={{ width: '100%' }}
              value={primaryRegion}
              onChange={setPrimaryRegion}
              options={regionOptions}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Secondary region</Text>
            <Select
              data-testid="secondary-region-select"
              showSearch
              style={{ width: '100%' }}
              value={secondaryRegion}
              onChange={handleSecondaryChange}
              options={regionOptions}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </div>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>Tertiary region</Text>
            <Select
              data-testid="tertiary-region-select"
              showSearch
              style={{ width: '100%' }}
              value={tertiaryRegion}
              onChange={setTertiaryRegion}
              options={regionOptions}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
            />
          </div>
        </Space>
      </Modal>
    </div>
  );
}
