'use client';

/**
 * rating-antd-T08: Table cell edit: set Hotel B cleanliness to 4.5 (AntD)
 * 
 * Scene details: theme=light, spacing=compact, scale=default, placement=center.
 * Layout: table_cell with compact spacing.
 * A small table is centered on the page with exactly three rows: "Hotel A", "Hotel B", and "Hotel C".
 * In the "Cleanliness" column, each row contains an Ant Design Rate component.
 * Configuration for each Rate: count=5, allowHalf=true (half-star), allowClear=true.
 * Initial state: Hotel A cleanliness = 3.0, Hotel B cleanliness = 0.0, Hotel C cleanliness = 5.0.
 * Clutter/distractors: each row also has a "Notes" cell with a non-interactive tag and a "Details" link.
 * The target instance is specifically the Rate control in the "Hotel B" row.
 * 
 * Success: Target rating value equals 4.5 out of 5 on "Hotel B - Cleanliness".
 */

import React, { useState, useEffect } from 'react';
import { Card, Rate, Table, Tag, Typography } from 'antd';
import type { TaskComponentProps } from '../types';
import type { ColumnsType } from 'antd/es/table';

const { Link } = Typography;

interface HotelData {
  key: string;
  name: string;
  cleanliness: number;
  notes: string;
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [hotelData, setHotelData] = useState<HotelData[]>([
    { key: 'hotel-a', name: 'Hotel A', cleanliness: 3.0, notes: 'Pool available' },
    { key: 'hotel-b', name: 'Hotel B', cleanliness: 0.0, notes: 'Pet friendly' },
    { key: 'hotel-c', name: 'Hotel C', cleanliness: 5.0, notes: 'Breakfast included' },
  ]);

  useEffect(() => {
    const hotelB = hotelData.find(h => h.key === 'hotel-b');
    if (hotelB && hotelB.cleanliness === 4.5) {
      onSuccess();
    }
  }, [hotelData, onSuccess]);

  const handleRatingChange = (key: string, value: number) => {
    setHotelData(prev => prev.map(hotel => 
      hotel.key === key ? { ...hotel, cleanliness: value } : hotel
    ));
  };

  const columns: ColumnsType<HotelData> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: 'Cleanliness',
      dataIndex: 'cleanliness',
      key: 'cleanliness',
      width: 180,
      render: (value: number, record: HotelData) => (
        <Rate
          value={value}
          onChange={(v) => handleRatingChange(record.key, v)}
          allowHalf
          allowClear
          data-testid={`rating-${record.key}-cleanliness`}
          data-row={record.key}
          data-col="cleanliness"
        />
      ),
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Tag>{notes}</Tag>
          <Link>Details</Link>
        </div>
      ),
    },
  ];

  return (
    <Card title="Hotels" style={{ width: 550 }}>
      <Table
        dataSource={hotelData}
        columns={columns}
        pagination={false}
        size="small"
      />
    </Card>
  );
}
