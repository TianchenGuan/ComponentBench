'use client';

/**
 * rating-antd-T07: Modal review flow: rate 3 and submit (AntD)
 * 
 * Scene details: theme=light, spacing=comfortable, scale=default, placement=center.
 * Layout: modal_flow. The page shows a product summary card with a primary button labeled "Write a review".
 * Clicking "Write a review" opens an Ant Design Modal centered on the screen.
 * Inside the modal:
 *   • One Ant Design Rate component labeled "Overall rating" (count=5, allowHalf=false, allowClear=true).
 *   • Two buttons in the modal footer: "Cancel" and "Submit review".
 * Initial state: the modal is closed; the rating value inside the modal starts empty (0) when opened.
 * Feedback: after clicking "Submit review", the modal closes and a small toast "Review saved" appears.
 * Success requires both the correct rating value and pressing "Submit review".
 * 
 * Success: Target rating value equals 3 out of 5 AND "Submit review" is clicked.
 */

import React, { useState } from 'react';
import { Card, Rate, Button, Modal, Typography, message } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T07({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ratingValue, setRatingValue] = useState<number>(0);

  const handleOpenModal = () => {
    setRatingValue(0); // Reset rating when opening
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    if (ratingValue === 3) {
      setIsModalOpen(false);
      message.success('Review saved');
      onSuccess();
    } else {
      setIsModalOpen(false);
      message.info('Review saved (but goal not met)');
    }
  };

  return (
    <>
      <Card title="Product page" style={{ width: 400 }}>
        <Text style={{ display: 'block', marginBottom: 16 }}>
          Check out this amazing product! Share your thoughts with others.
        </Text>
        <Button type="primary" onClick={handleOpenModal}>
          Write a review
        </Button>
      </Card>

      <Modal
        title="Write a review"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit} data-testid="submit-review">
            Submit review
          </Button>,
        ]}
      >
        <div style={{ padding: '16px 0' }}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Overall rating</Text>
          <Rate
            value={ratingValue}
            onChange={setRatingValue}
            allowClear
            data-testid="rating-overall"
          />
        </div>
      </Modal>
    </>
  );
}
