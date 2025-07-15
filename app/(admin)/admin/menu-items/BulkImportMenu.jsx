"use client";
import React, { useState } from "react";
import { Button, Upload, message, Modal, Form, Row, Col } from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";

const BulkImportMenu = ({ open, onCancel, onSubmit }) => {
  const [fileList, setFileList] = useState([]);

  const handleFileChange = (info) => {
    const latestFileList = [...info.fileList].slice(-1); // only keep latest file

    const file = latestFileList[0];
    if (!file) return;

    const rawFile = file.originFileObj;

    const reader = new FileReader();
    reader.onload = (e) => {
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      const jsonData = XLSX.utils.sheet_to_json(ws, { defval: "" });
      setFileList(jsonData);
      if (jsonData.length) {
        console.log("✅ Excel Data:", jsonData);
      } else {
        message.warning("No data found in Excel file.");
      }
    };

    reader.readAsArrayBuffer(rawFile);
  };

  const handleSubmit = () => {
    if (!fileList.length) {
      message.error("Please upload a file before submitting.");
      return;
    }

    if (onSubmit) onSubmit(fileList);
  };

  const handleDownloadSampleCSV = () => {
    const generatedId = crypto.randomUUID();

    const sampleData = [
      [
        "STATION_ID",
        "VENDOR_ID",
        "CATEGORY_ID",
        "ITEM_NAME",
        "IMAGE",
        "FOOD_TYPE(0=Veg | 1=Nonveg)",
        "PRICE",
        "DISCOUNT",
        "DESCRIPTION",
        "GROUP_ID",
      ],
      ["", "", "", "", "", "", "", "", "", generatedId],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sampleData);
    // worksheet["!cols"] = Array(sampleData[0].length).fill({});

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
                beforeUpload={() => false} // prevent auto-upload
                accept=".xlsx"
                maxCount={1}
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
