'use client';

/**
 * table_static-mantine-T10: Select multiple rows in a compact enrollment table
 *
 * The page is a form_section titled "Course Enrollment". The table is the only interactive element that
 * matters for success. Spacing is compact, reducing row padding. The read-only Course Enrollment table (Mantine Table) lists
 * courses with columns: Code, Title, Time. Row click toggles selection (multi-select) and selected rows are highlighted;
 * a small 'Selected' counter updates live. Initial state: no courses selected. The table contains similarly named codes
 * (CS201 vs CS205) to create realistic confusion.
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Text, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface CourseData {
  key: string;
  code: string;
  title: string;
  time: string;
}

const coursesData: CourseData[] = [
  { key: 'CS101', code: 'CS101', title: 'Introduction to Computer Science', time: 'MWF 9:00-10:00' },
  { key: 'CS102', code: 'CS102', title: 'Programming Fundamentals', time: 'TTh 10:30-12:00' },
  { key: 'CS201', code: 'CS201', title: 'Data Structures', time: 'MWF 11:00-12:00' },
  { key: 'CS205', code: 'CS205', title: 'Algorithms', time: 'TTh 1:00-2:30' },
  { key: 'CS210', code: 'CS210', title: 'Computer Architecture', time: 'MWF 2:00-3:00' },
  { key: 'MATH101', code: 'MATH101', title: 'Calculus I', time: 'MWF 8:00-9:00' },
  { key: 'MATH220', code: 'MATH220', title: 'Linear Algebra', time: 'TTh 3:00-4:30' },
  { key: 'MATH221', code: 'MATH221', title: 'Discrete Mathematics', time: 'MWF 10:00-11:00' },
  { key: 'PHYS101', code: 'PHYS101', title: 'Physics I', time: 'TTh 9:00-10:30' },
  { key: 'PHYS102', code: 'PHYS102', title: 'Physics II', time: 'MWF 1:00-2:00' },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Set<string>>(new Set());
  const successFiredRef = React.useRef(false);

  const handleRowClick = (record: CourseData) => {
    setSelectedRowKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(record.key)) {
        newSet.delete(record.key);
      } else {
        newSet.add(record.key);
      }
      return newSet;
    });
  };

  // Check for success condition: must include CS101, CS205, MATH220
  useEffect(() => {
    const required = ['CS101', 'CS205', 'MATH220'];
    const hasAllRequired = required.every(key => selectedRowKeys.has(key));
    
    if (hasAllRequired && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [selectedRowKeys, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 600 }}>
      <Text fw={600} size="lg" mb="md">Course Enrollment</Text>

      <Box mb="md" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text fw={500} size="sm">Available Courses</Text>
        <Text size="sm" c="dimmed">Selected: {selectedRowKeys.size}</Text>
      </Box>

      <Table fz="sm" verticalSpacing={4}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Code</Table.Th>
            <Table.Th>Title</Table.Th>
            <Table.Th>Time</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {coursesData.map((row) => (
            <Table.Tr
              key={row.key}
              onClick={() => handleRowClick(row)}
              aria-selected={selectedRowKeys.has(row.key)}
              data-row-key={row.key}
              style={{
                cursor: 'pointer',
                backgroundColor: selectedRowKeys.has(row.key) ? 'var(--mantine-color-blue-light)' : undefined,
              }}
            >
              <Table.Td>{row.code}</Table.Td>
              <Table.Td>{row.title}</Table.Td>
              <Table.Td>{row.time}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
