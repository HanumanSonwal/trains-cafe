"use client";

import React, { useState } from "react";
import {
  Button,
  Upload,
  message,
  Modal,
  Form,
  Row,
  Col,
  Table,
  Image,
} from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";

const BulkImportMenu = ({ open, onCancel, onSubmit }) => {
  const [uploadFileList, setUploadFileList] = useState([]); 
  const [excelData, setExcelData] = useState([]); 

  const handleFileChange = (info) => {
    const latestFileList = [...info.fileList].slice(-1); 
    setUploadFileList(latestFileList);

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
      setExcelData(jsonData);

      if (jsonData.length) {
        console.log("✅ Excel Data:", jsonData);
      } else {
        message.warning("No data found in Excel file.");
      }
    };

    reader.readAsArrayBuffer(rawFile);
  };

  const handleSubmit = () => {
    if (!excelData.length) {
      message.error("Please upload a file before submitting.");
      return;
    }

    if (onSubmit) onSubmit(excelData);
    handleClose(); 
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
        "DISCOUNT(%)",
        "DESCRIPTION",
        "GROUP_ID",
      ],
      ["1", "1", "1", "Sample Item", "https://", "0", "100", "10", "Desc", generatedId],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sampleData);
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

  const handleClose = () => {
    setUploadFileList([]);
    setExcelData([]);
    if (onCancel) onCancel();
  };

  const columns = [
    {
      title: "Item Name",
      dataIndex: "ITEM_NAME",
      key: "ITEM_NAME",
    },
    {
      title: "Image",
      dataIndex: "IMAGE",
      key: "IMAGE",
      render: (url) => (url ? <Image src={url} width={50} /> : "-"),
    },
    {
      title: "Price",
      dataIndex: "PRICE",
      key: "PRICE",
    },
    {
      title: "Group ID",
      dataIndex: "GROUP_ID",
      key: "GROUP_ID",
    },
  ];

  return (
    <Modal
      title="📦 Bulk Import Menu Items"
      open={open}
      onCancel={handleClose}
      footer={[
        <Button key="cancel" onClick={handleClose}>
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
      width={900}
    >
      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Upload File (.xlsx)">
              <Upload
                fileList={uploadFileList}
                onChange={handleFileChange}
                beforeUpload={() => false}
                accept=".xlsx"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Select Excel File</Button>
              </Upload>
            </Form.Item>
          </Col>

          {excelData.length > 0 && (
            <Col span={24}>
              <Table
                columns={columns}
                dataSource={excelData}
                pagination={false}
                scroll={{ y: 300 }} 
                rowKey={(row, index) => index}
                size="small"
              />
            </Col>
          )}
        </Row>
      </Form>
    </Modal>
  );
};

export default BulkImportMenu;
