'use client';

/**
 * pin_input_otp-antd-T06: OTP in modal with Verify confirmation
 * 
 * A centered page with a single primary button "Verify phone". Clicking it opens
 * an Ant Design Modal. Inside the modal is helper text "Enter the 6-digit code"
 * and a 6-box OTP input. The modal footer has two buttons: "Cancel" and "Verify".
 * "Verify" is disabled until all 6 boxes are filled.
 * Initial state before opening: modal closed. After opening: OTP boxes empty.
 * 
 * Success: OTP value equals '275931' AND Verify button is clicked (committed).
 */

import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal, Input } from 'antd';
import type { TaskComponentProps } from '../types';

const { OTP } = Input;

export default function T06({ onSuccess }: TaskComponentProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [value, setValue] = useState('');
  const successCalledRef = useRef(false);

  const handleVerify = () => {
    if (value === '275931' && !successCalledRef.current) {
      successCalledRef.current = true;
      setModalOpen(false);
      onSuccess();
    }
  };

  // Reset on mount
  useEffect(() => {
    successCalledRef.current = false;
  }, []);

  return (
    <>
      <Button
        type="primary"
        size="large"
        onClick={() => {
          setValue('');
          setModalOpen(true);
        }}
        data-testid="verify-phone-button"
      >
        Verify phone
      </Button>

      <Modal
        title="Phone verification"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="verify"
            type="primary"
            disabled={value.length !== 6}
            onClick={handleVerify}
            data-testid="verify-confirm-button"
          >
            Verify
          </Button>,
        ]}
      >
        <div style={{ marginBottom: 16 }}>Enter the 6-digit code</div>
        <div data-testid="otp-phone-verify">
          <OTP
            length={6}
            value={value}
            onChange={setValue}
          />
        </div>
      </Modal>
    </>
  );
}
