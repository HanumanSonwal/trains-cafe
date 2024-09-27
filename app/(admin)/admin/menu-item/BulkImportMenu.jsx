"use client";
import React, { useState } from "react";
import { Button, Upload, message, Modal, Form, Row, Col } from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";

const BulkImportMenu = ({ open, onCancel, onSubmit }) => {
  const [fileList, setFileList] = useState([]);

  const handleFileChange = (info) => {
    setFileList(info.fileList.slice(-1)); // Restrict to a single file
  };

  const handleSubmit = () => {
    if (!fileList.length) {
      message.error("Please upload a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileList[0].originFileObj);
    onSubmit(formData); // Call the parent onSubmit function with the form data
  };

  const handleDownloadSampleCSV = () => {
    const sampleCSV = [
      ["Item Name", "Price", "Discount", "Category"],
      ["Sample Item 1", "10.00", "0", "Category 1"],
      ["Sample Item 2", "20.00", "10", "Category 2"],
    ];

    const csvContent = sampleCSV
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", "sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal
      title="Bulk Import Menu Items"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="download"
          icon={<DownloadOutlined />}
          onClick={handleDownloadSampleCSV}
        >
          Download Sample CSV
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
        >
          Import
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Upload File">
              <Upload
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false} // Prevent auto-upload
                accept=".csv" // Limit to CSV files
              >
                <Button icon={<UploadOutlined />}>
                  Select CSV File
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default BulkImportMenu;

