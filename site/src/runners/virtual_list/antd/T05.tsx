'use client';

/**
 * virtual_list-antd-T05: Search within a virtualized employee list and select one
 *
 * Layout: a form_section centered on the page titled "New Code Review Request".
 * Target component: a virtualized "Reviewer" picker embedded inline (not a modal). It includes:
 *   - an AntD Input.Search labeled "Search reviewers"
 *   - a virtual list area below (height ~300px) with ~2,000 employees
 * Initial state: list unfiltered and scrolled to the top; no reviewer selected.
 *
 * Success: Employee 'emp-0742' (Jordan Lee) is selected
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, Input, Tag, Typography, Button } from 'antd';
import VirtualList from 'rc-virtual-list';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

interface EmployeeItem {
  key: string;
  id: string;
  name: string;
  department: 'Eng' | 'Data' | 'Design' | 'Product' | 'QA';
}

const deptColors: Record<string, string> = {
  Eng: 'blue',
  Data: 'green',
  Design: 'purple',
  Product: 'orange',
  QA: 'cyan',
};

// Generate 2000 employees
const generateEmployees = (): EmployeeItem[] => {
  const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Parker', 'Drew'];
  const lastNames = ['Lee', 'Kim', 'Chen', 'Patel', 'Smith', 'Johnson', 'Garcia', 'Martinez', 'Brown', 'Wilson'];
  const departments: EmployeeItem['department'][] = ['Eng', 'Data', 'Design', 'Product', 'QA'];
  
  return Array.from({ length: 2000 }, (_, i) => {
    const num = i + 1;
    let name = `${firstNames[i % firstNames.length]} ${lastNames[(i * 3) % lastNames.length]}`;
    // Special name for employee 742
    if (num === 742) name = 'Jordan Lee';
    return {
      key: `emp-${String(num).padStart(4, '0')}`,
      id: `EMP-${String(num).padStart(4, '0')}`,
      name,
      department: departments[i % departments.length],
    };
  });
};

const employees = generateEmployees();

export default function T05({ onSuccess }: TaskComponentProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const filteredEmployees = useMemo(() => {
    if (!searchText.trim()) return employees;
    const lower = searchText.toLowerCase();
    return employees.filter(e => 
      e.id.toLowerCase().includes(lower) || 
      e.name.toLowerCase().includes(lower)
    );
  }, [searchText]);

  const handleSelect = (key: string) => {
    setSelectedKey(key);
  };

  // Check success condition
  useEffect(() => {
    if (selectedKey === 'emp-0742') {
      onSuccess();
    }
  }, [selectedKey, onSuccess]);

  const selectedEmployee = employees.find(e => e.key === selectedKey);

  return (
    <Card 
      title="New Code Review Request" 
      style={{ width: 550 }}
    >
      {/* Clutter: unrelated form fields */}
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 4 }}>Repository</Text>
        <Input value="frontend/main" disabled style={{ marginBottom: 12 }} />
        <Text strong style={{ display: 'block', marginBottom: 4 }}>Branch</Text>
        <Input value="feature/new-dashboard" disabled style={{ marginBottom: 12 }} />
      </div>

      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 4 }}>Reviewer</Text>
        <Input.Search
          placeholder="Search reviewers"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 8 }}
        />
        <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
          Selected reviewer: {selectedEmployee ? `${selectedEmployee.id} — ${selectedEmployee.name}` : 'none'}
        </div>
        <div 
          style={{ 
            border: '1px solid #f0f0f0', 
            borderRadius: 4,
          }}
          data-testid="vl-primary"
        >
          <VirtualList
            data={filteredEmployees}
            height={300}
            itemHeight={48}
            itemKey="key"
          >
            {(item: EmployeeItem) => (
              <div
                key={item.key}
                data-item-key={item.key}
                aria-selected={selectedKey === item.key}
                onClick={() => handleSelect(item.key)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0',
                  backgroundColor: selectedKey === item.key ? '#e6f4ff' : 'transparent',
                }}
              >
                <Text>{item.id} — {item.name}</Text>
                <Tag color={deptColors[item.department]}>{item.department}</Tag>
              </div>
            )}
          </VirtualList>
        </div>
      </div>

      <Button type="primary" disabled>Create request</Button>
    </Card>
  );
}
