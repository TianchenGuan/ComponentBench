'use client';

/**
 * file_dropzone-antd-T08: Scroll to Diagnostics and upload a specific log bundle (compact, small)
 *
 * setup_description: The page is a settings_panel with a scrollable main content area (light theme).
 * Spacing is compact and the component is rendered at small scale (smaller padding and typography than baseline).
 * Several settings sections appear above the fold (Network, Appearance, Privacy), each with toggles and dropdowns (distractors).
 * The target section "Diagnostics" is below the fold and is not initially visible without scrolling.
 * Inside "Diagnostics", there is one AntD Upload.Dragger labeled "Diagnostic logs".
 * It is configured to accept .zip files only (accept=.zip, multiple=false, maxCount=1) and uses auto-upload with a visible progress bar.
 * Clicking the drop area opens the in-page "Sample files" picker listing 4 zip files with similar names:
 * - logs-2026-01-31.zip
 * - logs-2026-02-01.zip   ← TARGET
 * - logs-2026-02-02.zip
 * - screenshots.zip
 * Initial state: no file uploaded. The scroll position starts at the top of the settings page.
 *
 * Success: The dropzone labeled "Diagnostic logs" contains exactly one file: logs-2026-02-01.zip with status "uploaded".
 */

import React, { useState, useEffect } from 'react';
import { Upload, Card, Typography, Modal, List, Switch, Select, Space } from 'antd';
import { InboxOutlined, FileZipOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { TaskComponentProps, SampleFile } from '../types';
import { simulateUpload, generateUid } from '../types';

const { Dragger } = Upload;
const { Title, Text } = Typography;

const SAMPLE_FILES: SampleFile[] = [
  { name: 'logs-2026-01-31.zip', type: 'application/zip' },
  { name: 'logs-2026-02-01.zip', type: 'application/zip' },
  { name: 'logs-2026-02-02.zip', type: 'application/zip' },
  { name: 'screenshots.zip', type: 'application/zip' },
];

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (completed) return;
    
    if (
      fileList.length === 1 &&
      fileList[0].name === 'logs-2026-02-01.zip' &&
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
      percent: 0,
    };
    
    setFileList([newFile]);
    
    await simulateUpload(300);
    setFileList([{ ...newFile, percent: 50 }]);
    await simulateUpload(300);
    setFileList([{ ...newFile, status: 'done', percent: 100 }]);
  };

  const handleRemove = (file: UploadFile) => {
    setFileList(prev => prev.filter(f => f.uid !== file.uid));
  };

  const uploadProps: UploadProps = {
    fileList,
    multiple: false,
    maxCount: 1,
    accept: '.zip',
    showUploadList: true,
    onRemove: handleRemove,
    beforeUpload: () => false,
    openFileDialogOnClick: false,
  };

  const sectionStyle = { marginBottom: 16, padding: '12px', background: '#fafafa', borderRadius: 4 };
  const labelStyle = { fontSize: 12, display: 'block', marginBottom: 4 };

  return (
    <Card 
      title="Settings" 
      style={{ width: 400, maxHeight: 400, overflow: 'auto' }}
      size="small"
    >
      {/* Network Section */}
      <div style={sectionStyle}>
        <Title level={5} style={{ fontSize: 14, marginBottom: 8 }}>Network</Title>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={labelStyle}>Use proxy</Text>
            <Switch size="small" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={labelStyle}>Timeout</Text>
            <Select size="small" defaultValue="30s" style={{ width: 80 }}>
              <Select.Option value="15s">15s</Select.Option>
              <Select.Option value="30s">30s</Select.Option>
              <Select.Option value="60s">60s</Select.Option>
            </Select>
          </div>
        </Space>
      </div>

      {/* Appearance Section */}
      <div style={sectionStyle}>
        <Title level={5} style={{ fontSize: 14, marginBottom: 8 }}>Appearance</Title>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={labelStyle}>Dark mode</Text>
            <Switch size="small" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={labelStyle}>Font size</Text>
            <Select size="small" defaultValue="medium" style={{ width: 80 }}>
              <Select.Option value="small">Small</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="large">Large</Select.Option>
            </Select>
          </div>
        </Space>
      </div>

      {/* Privacy Section */}
      <div style={sectionStyle}>
        <Title level={5} style={{ fontSize: 14, marginBottom: 8 }}>Privacy</Title>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={labelStyle}>Share analytics</Text>
            <Switch size="small" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={labelStyle}>Crash reports</Text>
            <Switch size="small" defaultChecked />
          </div>
        </Space>
      </div>

      {/* Diagnostics Section - TARGET */}
      <div style={sectionStyle}>
        <Title level={5} style={{ fontSize: 14, marginBottom: 8 }}>Diagnostics</Title>
        <Text style={{ ...labelStyle, marginBottom: 8 }}>Diagnostic logs</Text>
        
        <div data-testid="dropzone-diagnostic-logs" onClick={() => setPickerOpen(true)} style={{ cursor: 'pointer' }}>
          <Dragger
            {...uploadProps}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ fontSize: 24 }} />
            </p>
            <p className="ant-upload-text" style={{ fontSize: 12 }}>Click or drag file to upload</p>
          </Dragger>
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
              style={{ cursor: 'pointer' }}
            >
              <List.Item.Meta
                avatar={<FileZipOutlined />}
                title={item.name}
              />
            </List.Item>
          )}
        />
      </Modal>
    </Card>
  );
}
