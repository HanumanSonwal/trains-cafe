"use client";
import React, { useState } from "react";
import { Button, Upload, message, Modal, Form, Row, Col } from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";

const BulkImportMenu = ({ open, onCancel, onSubmit }) => {
  const [fileList, setFileList] = useState([]);
  const [uploadId, setUploadId] = useState(null);

  const handleFileChange = (info) => {
    setFileList(info.fileList.slice(-1));
  };

  const handleSubmit = () => {
    if (!fileList.length) {
      message.error("Please upload a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileList[0].originFileObj);
    formData.append("uploadId", uploadId);
    onSubmit(formData);
  };

  const handleDownloadSampleCSV = () => {
    const generatedId = crypto.randomUUID();
    setUploadId(generatedId);

    const sampleData = [
      [
        "STATION_ID",
        "VENDOR_ID",
        "CATEGORY_ID",
        "ITEM_NAME",
        "IMAGE",
        "FOOD_TYPE(0=Veg | 1=Nonveg)",
        "PRICE",
        "DISCOUNT(%)",
        "DESCRIPTION",
        "GROUP_ID",
      ],
      [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        generatedId, 
      ],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sampleData);

    worksheet["!cols"] = Array(sampleData[0].length).fill({});
    worksheet["!cols"][9] = { hidden: true }; 

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SampleMenu");

    const blob = new Blob(
      [XLSX.write(workbook, { bookType: "xlsx", type: "array" })],
      { type: "application/octet-stream" }
    );

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", "sample_menu_upload.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal
      title="📦 Bulk Import Menu Items"
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
          Download Sample Excel
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
            <Form.Item label="Upload File (.xlsx)">
              <Upload
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false}
                accept=".xlsx"
              >
                <Button icon={<UploadOutlined />}>Select Excel File</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default BulkImportMenu;
