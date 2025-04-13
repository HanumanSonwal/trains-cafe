// "use client";
// import React, { useState } from "react";
// import { Button, Upload, message, Modal, Form, Row, Col } from "antd";
// import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";

// const BulkImportMenu = ({ open, onCancel, onSubmit }) => {
//   const [fileList, setFileList] = useState([]);

//   const handleFileChange = (info) => {
//     setFileList(info.fileList.slice(-1)); // Restrict to a single file
//   };

//   const handleSubmit = () => {
//     if (!fileList.length) {
//       message.error("Please upload a file before submitting.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", fileList[0].originFileObj);
//     onSubmit(formData); // Call the parent onSubmit function with the form data
//   };

//   const handleDownloadSampleCSV = () => {
//     const sampleCSV = [
//       ["Item Name", "Price", "Discount", "Category"],
//       ["Sample Item 1", "10.00", "0", "Category 1"],
//       ["Sample Item 2", "20.00", "10", "Category 2"],
//     ];

//     const csvContent = sampleCSV
//       .map((row) => row.join(","))
//       .join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     link.href = url;
//     link.setAttribute("download", "sample.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <Modal
//       title="Bulk Import Menu Items"
//       open={open}
//       onCancel={onCancel}
//       footer={[
//         <Button key="cancel" onClick={onCancel}>
//           Cancel
//         </Button>,
//         <Button
//           key="download"
//           icon={<DownloadOutlined />}
//           onClick={handleDownloadSampleCSV}
//         >
//           Download Sample CSV
//         </Button>,
//         <Button
//           key="submit"
//           type="primary"
//           onClick={handleSubmit}
//           style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
//         >
//           Import
//         </Button>,
//       ]}
//     >
//       <Form layout="vertical">
//         <Row gutter={16}>
//           <Col span={24}>
//             <Form.Item label="Upload File">
//               <Upload
//                 fileList={fileList}
//                 onChange={handleFileChange}
//                 beforeUpload={() => false} // Prevent auto-upload
//                 accept=".csv" // Limit to CSV files
//               >
//                 <Button icon={<UploadOutlined />}>
//                   Select CSV File
//                 </Button>
//               </Upload>
//             </Form.Item>
//           </Col>
//         </Row>
//       </Form>
//     </Modal>
//   );
// };

// export default BulkImportMenu;

"use client";
import React, { useState } from "react";
import { Button, Upload, message, Modal, Form, Row, Col } from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";

const BulkImportMenu = ({ open, onCancel, onSubmit }) => {
  const [fileList, setFileList] = useState([]);
  const [uploadId, setUploadId] = useState(null);

  const handleFileChange = (e, val) => {
    console.log({
      e,
      val,
    });

    return;
    setFileList(info.fileList.slice(-1));

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });

      // CSV file has only one sheet
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      const parsedData = XLSX.utils.sheet_to_json(ws, { header: 1 });
      setData(parsedData);
    };

    reader.readAsBinaryString(file);
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

    const sampleCSV = [
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
      ["", "", "", "", "", "", "", "", "", generatedId],
    ];

    const csvContent = sampleCSV.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", "sample_menu_upload.csv");
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
            <Form.Item label="Upload File (.csv)">
              <Upload
                fileList={fileList}
                onChange={(e, val) => handleFileChange(e, val)}
                beforeUpload={() => false}
                accept=".csv"
              >
                <Button icon={<UploadOutlined />}>Select CSV File</Button>
              </Upload>
            </Form.Item>
            {uploadId && (
              <p>
                <strong>Upload ID:</strong> {uploadId}
              </p>
            )}
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default BulkImportMenu;
