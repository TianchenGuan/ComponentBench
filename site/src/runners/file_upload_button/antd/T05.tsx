'use client';

/**
 * file_upload_button-antd-T05: Confirm removal in Popconfirm (dark form section)
 *
 * setup_description: The page is a small "Expense report" form section in dark theme. Several 
 * non-required inputs (Amount, Category, Notes) appear above, and the target uploader appears 
 * below under a label "Receipts". The Ant Design Upload component uses the default text list, 
 * and it loads with one existing completed file: "invoice_2025-11.pdf" (status done). Clicking 
 * the remove (×) icon does not immediately remove the file; instead it opens an Ant Design 
 * Popconfirm anchored near the list item. The pop-up contains the message "Remove this file?" 
 * and two buttons: "Cancel" and "Remove". Only after clicking "Remove" is the file actually 
 * removed from the upload list.
 *
 * Success: In the "Receipts" uploader, the file list becomes empty (0 files).
 *          The confirmation pop-up has been accepted via the "Remove" button (not canceled).
 */

import React, { useState, useEffect } from 'react';
import { Upload, Button, Card, Typography, Input, Popconfirm, Space, Modal, List } from 'antd';
import { UploadOutlined, DeleteOutlined, FileOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { TaskComponentProps, SampleFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const { Title, Text } = Typography;

const SAMPLE_FILES: SampleFile[] = [
  { name: 'invoice_2025-11.pdf', type: 'application/pdf' },
  { name: 'receipt_001.pdf', type: 'application/pdf' },
  { name: 'expense_report.pdf', type: 'application/pdf' },
];

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: 'existing-1',
      name: 'invoice_2025-11.pdf',
      status: 'done',
    },
  ]);
  const [completed, setCompleted] = useState(false);
  const [confirmAccepted, setConfirmAccepted] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    if (fileList.length === 0 && confirmAccepted) {
      setCompleted(true);
      onSuccess();
    }
  }, [fileList, confirmAccepted, completed, onSuccess]);

  const handleConfirmRemove = (file: UploadFile) => {
    setConfirmAccepted(true);
    setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  const handleSelectFile = async (sample: SampleFile) => {
    setPickerOpen(false);
    
    const newFile: UploadFile = {
      uid: generateUid(),
      name: sample.name,
      status: 'uploading',
    };
    
    setFileList((prev) => [...prev, newFile]);
    
    await simulateUpload(500);
    setFileList((prev) =>
      prev.map((f) => (f.uid === newFile.uid ? { ...f, status: 'done' } : f))
    );
  };

  // Custom item render to add popconfirm on remove
  const itemRender = (originNode: React.ReactElement, file: UploadFile) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
        <span style={{ color: '#fff' }}>{file.name}</span>
        <Popconfirm
          title="Remove this file?"
          onConfirm={() => handleConfirmRemove(file)}
          okText="Remove"
          cancelText="Cancel"
          okButtonProps={{ danger: true }}
        >
          <Button
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            style={{ color: '#ff4d4f' }}
          />
        </Popconfirm>
      </div>
    );
  };

  const uploadProps: UploadProps = {
    fileList,
    itemRender,
    beforeUpload: () => false,
    openFileDialogOnClick: false,
    showUploadList: true,
  };

  return (
    <Card 
      title="Expense report" 
      style={{ width: 450, background: '#1f1f1f', borderColor: '#303030' }}
      headStyle={{ color: '#fff', borderColor: '#303030' }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* Amount field */}
        <div>
          <Text style={{ color: '#ccc', display: 'block', marginBottom: 4 }}>Amount</Text>
          <Input placeholder="Enter amount" style={{ background: '#141414', borderColor: '#434343', color: '#fff' }} />
        </div>
        
        {/* Category field */}
        <div>
          <Text style={{ color: '#ccc', display: 'block', marginBottom: 4 }}>Category</Text>
          <Input placeholder="Select category" style={{ background: '#141414', borderColor: '#434343', color: '#fff' }} />
        </div>
        
        {/* Notes field */}
        <div>
          <Text style={{ color: '#ccc', display: 'block', marginBottom: 4 }}>Notes</Text>
          <Input.TextArea rows={2} placeholder="Add notes" style={{ background: '#141414', borderColor: '#434343', color: '#fff' }} />
        </div>
        
        {/* Receipts uploader */}
        <div data-testid="uploader-receipts" onClick={() => setPickerOpen(true)}>
          <Title level={5} style={{ color: '#fff', marginBottom: 12 }}>Receipts</Title>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Select file</Button>
          </Upload>
        </div>
      </Space>

      <Modal
        title="Sample files"
        open={pickerOpen}
        onCancel={() => setPickerOpen(false)}
        footer={null}
        width={350}
      >
        <List
          dataSource={SAMPLE_FILES}
          renderItem={(item) => (
            <List.Item
              onClick={() => handleSelectFile(item)}
              style={{ cursor: 'pointer', padding: '12px 0' }}
            >
              <List.Item.Meta
                avatar={<FileOutlined style={{ fontSize: 20 }} />}
                title={item.name}
              />
            </List.Item>
          )}
        />
      </Modal>
    </Card>
  );
}
