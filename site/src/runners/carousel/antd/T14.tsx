'use client';

/**
 * carousel-antd-T14: Table cell carousel: set Listing B to image 3
 *
 * The page uses a table_cell layout: a compact listings table near the bottom-right.
 * Two rows ("Listing A" and "Listing B") each contain a small Ant Design Carousel in the "Photos" column.
 * Each row's carousel contains 4 slides labeled "Image 1"–"Image 4".
 * Initial state: Listing A is on Image 1 (listA-img1) and Listing B is on Image 4 (listB-img4).
 * Only Listing B's carousel is checked.
 *
 * Success: Listing B active_slide_id equals listB-img3
 */

import React, { useState, useEffect, useRef } from 'react';
import { Carousel, Card, Table, Button, Tag, Typography } from 'antd';
import type { CarouselRef } from 'antd/es/carousel';
import type { ColumnsType } from 'antd/es/table';
import type { TaskComponentProps } from '../types';

const { Title } = Typography;

interface ListingData {
  key: string;
  name: string;
  price: string;
  status: string;
}

const listingASlides = [
  { id: 'listA-img1', title: 'Image 1' },
  { id: 'listA-img2', title: 'Image 2' },
  { id: 'listA-img3', title: 'Image 3' },
  { id: 'listA-img4', title: 'Image 4' },
];

const listingBSlides = [
  { id: 'listB-img1', title: 'Image 1' },
  { id: 'listB-img2', title: 'Image 2' },
  { id: 'listB-img3', title: 'Image 3' },
  { id: 'listB-img4', title: 'Image 4' },
];

const LISTING_B_INITIAL_INDEX = 3; // "Image 4"

export default function T14({ onSuccess }: TaskComponentProps) {
  const [listingBActiveId, setListingBActiveId] = useState(listingBSlides[LISTING_B_INITIAL_INDEX].id);
  const listingBRef = useRef<CarouselRef>(null);
  const successFired = useRef(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && listingBRef.current) {
      initialized.current = true;
      listingBRef.current.goTo(LISTING_B_INITIAL_INDEX, false);
    }
  }, []);

  useEffect(() => {
    if (listingBActiveId === 'listB-img3' && !successFired.current) {
      successFired.current = true;
      onSuccess();
    }
  }, [listingBActiveId, onSuccess]);

  const handleListingBChange = (current: number) => {
    setListingBActiveId(listingBSlides[current].id);
  };

  const columns: ColumnsType<ListingData> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: 'Photos',
      key: 'photos',
      width: 150,
      render: (_, record) => {
        if (record.key === 'listingA') {
          return (
            <div data-testid="listing-a-carousel" style={{ width: 120 }}>
              <Carousel autoplay={false} arrows={false} dots={true} dotPosition="bottom">
                {listingASlides.map((slide) => (
                  <div key={slide.id}>
                    <div
                      style={{
                        height: 60,
                        background: '#e8e8e8',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-start',
                        padding: 4,
                        fontSize: 10,
                      }}
                    >
                      {slide.title}
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          );
        }
        return (
          <div
            data-testid="carousel-root"
            data-instance-id="listing-b-photos"
            data-active-slide-id={listingBActiveId}
            style={{ width: 120 }}
          >
            <Carousel
              ref={listingBRef}
              autoplay={false}
              arrows={false}
              dots={true}
              dotPosition="bottom"
              afterChange={handleListingBChange}
              initialSlide={LISTING_B_INITIAL_INDEX}
            >
              {listingBSlides.map((slide) => (
                <div key={slide.id}>
                  <div
                    data-slide-id={slide.id}
                    style={{
                      height: 60,
                      background: '#d4edda',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'flex-start',
                      padding: 4,
                      fontSize: 10,
                    }}
                  >
                    {slide.title}
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        );
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 80,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'green' : 'orange'}>{status}</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 60,
      render: () => <Button size="small" type="link">View</Button>,
    },
  ];

  const data: ListingData[] = [
    { key: 'listingA', name: 'Listing A', price: '$250', status: 'Active' },
    { key: 'listingB', name: 'Listing B', price: '$320', status: 'Pending' },
  ];

  return (
    <Card style={{ width: 550 }} size="small">
      <Title level={5} style={{ marginBottom: 16 }}>Listings</Title>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        size="small"
      />
    </Card>
  );
}
