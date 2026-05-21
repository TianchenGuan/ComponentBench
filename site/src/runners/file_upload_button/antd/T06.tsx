'use client';

/**
 * file_upload_button-antd-T06: Upload the file that matches a reference card (visual guidance)
 *
 * setup_description: The main content is anchored near the top-left of the viewport (not centered). 
 * An isolated card titled "Attach a file" contains the target Ant Design Upload component labeled 
 * "Attachment" with a "Select file" button and an empty upload list. Next to the uploader, a 
 * non-interactive Reference card shows the target file (a file icon plus the filename text). 
 * The Reference card is the only place where the target filename is provided; the instruction 
 * intentionally refers to the reference instead of naming the file. The Upload component is 
 * single-file (multiple=false) and auto-uploads; after selection, the file appears in the list 
 * with status done.
 *
 * Success: The "Attachment" uploader contains exactly one uploaded file whose name matches the 
 *          filename displayed in the Reference card ("quarterly_report.pdf"), with status "done".
 */

import React, { useState, useEffect } from 'react';
import { Upload, Button, Card, Typography, Modal, List } from 'antd';
import { UploadOutlined, FileOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { TaskComponentProps, SampleFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const { Text } = Typography;

const REFERENCE_FILE = 'quarterly_report.pdf';

const SAMPLE_FILES: SampleFile[] = [
  { name: 'quarterly_report.pdf', type: 'application/pdf' },
  { name: 'annual_report.pdf', type: 'application/pdf' },
  { name: 'monthly_summary.pdf', type: 'application/pdf' },
];

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [completed, setCompleted] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Check success condition
  useEffect(() => {
    if (completed) return;
    
    if (
      fileList.length === 1 &&
      fileList[0].name === REFERENCE_FILE &&
      fileList[0].status === 'done'
    ) {
      setCompleted(true);
      onSuccess();
    }
  }, [fileList, completed, onSuccess]);

  const handleSelectFile = async (sample: SampleFile) => {
    setPickerOpen(false);
    
    const newFile: UploadFile = {
      uid: generateUid(),
      name: sample.name,
      status: 'uploading',
    };
    
    setFileList([newFile]);
    
    await simulateUpload(500);
    setFileList([{ ...newFile, status: 'done' }]);
  };

  const uploadProps: UploadProps = {
    multiple: false,
    fileList,
    beforeUpload: () => false,
    openFileDialogOnClick: false,
    onRemove: (file) => {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    },
  };

  return (
    <Card title="Attach a file" style={{ width: 500 }}>
      <div style={{ display: 'flex', gap: 24 }}>
        {/* Uploader */}
        <div data-testid="uploader-attachment" style={{ flex: 1 }} onClick={() => setPickerOpen(true)}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Attachment</Text>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Select file</Button>
          </Upload>
        </div>
        
        {/* Reference card */}
        <div
          style={{
            padding: 16,
            background: '#fafafa',
            borderRadius: 8,
            border: '1px solid #e8e8e8',
            minWidth: 180,
          }}
        >
          <Text strong style={{ display: 'block', marginBottom: 12 }}>Reference</Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileOutlined style={{ fontSize: 24, color: '#1677ff' }} />
            <Text data-testid="reference-file-name">{REFERENCE_FILE}</Text>
          </div>
        </div>
      </div>

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
