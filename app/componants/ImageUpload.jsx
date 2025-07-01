// // import React, { useState } from "react";
// // import { Upload, message, Image, Button } from "antd";
// // import { UploadOutlined } from "@ant-design/icons";

// // const FileUploadComponent = ({ url, setUrl }) => {
// //   const [fileList, setFileList] = useState([]);

// //   const handleFileUpload = async (file) => {
// //     const formData = new FormData();
// //     formData.append("file", file);

// //     try {
// //       const response = await fetch("/api/fileUpload/local", {
// //         method: "POST",
// //         body: formData,
// //       });

// //       const result = await response.json();

// //       if (result.success) {
// //         message.success("File uploaded successfully");
// //         setUrl(result.url); 
// //         console.log("File URL:", result.url);
// //       } else {
// //         message.error(result.message || "File upload failed");
// //       }
// //     } catch (error) {
// //       message.error("Error uploading file");
// //       console.error(error);
// //     }
// //   };

// //   const handleChange = ({ fileList: newFileList }) => {
// //     setFileList(newFileList);

// //     if (newFileList.length > 0) {
// //       handleFileUpload(newFileList[0].originFileObj);
// //     }
// //   };

// //   return (
// //     <div>
// //       <Upload
// //         listType="picture"
// //         beforeUpload={() => false}
// //         onChange={handleChange}
// //         fileList={fileList}
// //         showUploadList={false}
// //       >
// //         <Button icon={<UploadOutlined />}>Select File</Button>
// //       </Upload>

// //       {url && ( 
// //         <div style={{ marginTop: "16px" }}>
// //           <h3>Uploaded Image:</h3>
// //           <Image
// //             src={url}
// //             alt="Uploaded Image"
// //             width={150} 
            
// //           />
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default FileUploadComponent;

// import React, { useEffect, useState } from "react";
// import { PlusOutlined } from "@ant-design/icons";
// import { Upload, message, Image, Button } from "antd";

// // Helper function to convert file to Base64 for preview
// const getBase64 = (file) =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });

// const FileUploadComponent = ({ url, setUrl }) => {
//   const [fileList, setFileList] = useState([]);
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState("");

//   // Update fileList when editing category with pre-existing image
//   useEffect(() => {
//     if (url) {
//       setFileList([
//         {
//           uid: "-1", // unique identifier for the file
//           name: "image.png", // You can set this to the actual image name if available
//           status: "done", // Status of the upload
//           url: url, // The image URL to display in preview
//         },
//       ]);
//     }
//   }, [url]);

//   const handleFileUpload = async (file) => {
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await fetch("/api/fileUpload/local", {
//         method: "POST",
//         body: formData,
//       });

//       const result = await response.json();

//       if (result.success) {
//         message.success("File uploaded successfully");
//         setUrl(result.url);
//         console.log("File URL:", result.url);
//       } else {
//         message.error(result.message || "File upload failed");
//       }
//     } catch (error) {
//       message.error("Error uploading file");
//       console.error(error);
//     }
//   };

//   const handleChange = ({ fileList: newFileList }) => {
//     setFileList(newFileList);

//     if (newFileList.length > 0 && newFileList[0].originFileObj) {
//       handleFileUpload(newFileList[0].originFileObj);
//     }
//   };

//   const handlePreview = async (file) => {
//     if (!file.url && !file.preview) {
//       file.preview = await getBase64(file.originFileObj);
//     }
//     setPreviewImage(file.url || file.preview);
//     setPreviewOpen(true);
//   };

//   const uploadButton = (
//     <Button icon={<PlusOutlined />}>Upload</Button>
//   );

//   return (
//     <div>
//       <Upload
//         listType="picture-card"
//         fileList={fileList}
//         onPreview={handlePreview}
//         onChange={handleChange}
//         beforeUpload={() => false} // Prevent auto-upload, handle it manually
//       >
//         {fileList.length >= 1 ? null : uploadButton}
//       </Upload>

//       {previewImage && (
//         <Image
//           preview={{
//             visible: previewOpen,
//             onVisibleChange: (visible) => setPreviewOpen(visible),
//             afterOpenChange: (visible) => !visible && setPreviewImage(""),
//           }}
//           src={previewImage}
//           wrapperStyle={{ display: "none" }}
//         />
//       )}
//     </div>
//   );
// };

// export default FileUploadComponent;

// import React, { useEffect, useState } from "react";
// import { PlusOutlined } from "@ant-design/icons";
// import { Upload, message, Image, Button } from "antd";
// import { useForm, Controller } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";

// // File validation schema using Zod
// const schema = z.object({
//   file: z
//     .instanceof(File)
//     .refine((file) => file.size <= 2 * 1024 * 1024, {
//       message: "File size must be less than 2MB",
//     })
//     .refine(
//       (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
//       {
//         message: "Only .jpeg, .png and .gif formats are supported",
//       }
//     ),
// });

// const FileUploadComponent = ({ url, setUrl, isreset }) => {
//   const [fileList, setFileList] = useState([]);
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState("");

//   const { control, setValue, formState: { errors } } = useForm({
//     resolver: zodResolver(schema),
//   });

//   // Reset preview and file list when isreset is true
//   useEffect(() => {
//     if (isreset) {
//       setPreviewImage("");
//       setFileList([]);
//       setUrl(""); // Reset URL
//     }
//   }, [isreset]);

//   // Update file list when `url` changes
//   useEffect(() => {
//     if (url) {
//       setFileList([
//         {
//           uid: "-1",
//           name: "image.png",
//           status: "done",
//           url: url,
//         },
//       ]);
//     }
//   }, [url]);

//   // Function to handle file upload
//   const handleFileUpload = async (file) => {
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await fetch("/api/fileUpload/local", {
//         method: "POST",
//         body: formData,
//       });

//       const result = await response.json();

//       if (result.success) {
//         message.success("File uploaded successfully");
//         setUrl(result.url);
//         setValue("file", result.url); // Update form state
//       } else {
//         message.error(result.message || "File upload failed");
//       }
//     } catch (error) {
//       message.error("Error uploading file");
//       console.error(error);
//     }
//   };

//   // Handle file selection and change
//   const handleChange = ({ fileList: newFileList }) => {
//     setFileList(newFileList);

//     if (newFileList.length > 0 && newFileList[0].originFileObj) {
//       handleFileUpload(newFileList[0].originFileObj);
//     } else {
//       setUrl(""); // Reset URL if file removed
//     }
//   };

//   // Handle image preview
//   const handlePreview = async (file) => {
//     if (!file.url && !file.preview) {
//       file.preview = await getBase64(file.originFileObj);
//     }
//     setPreviewImage(file.url || file.preview);
//     setPreviewOpen(true);
//   };

//   return (
//     <form>
//       <Controller
//         name="file"
//         control={control}
//         render={({ field }) => (
//           <Upload
//             listType="picture-card"
//             fileList={fileList}
//             onPreview={handlePreview}
//             onChange={(info) => {
//               handleChange(info);
//               field.onChange(info.fileList);
//             }}
//             beforeUpload={() => false} // Prevent automatic upload
//           >
//             {fileList.length >= 1 ? null : (
//               <Button icon={<PlusOutlined />}>Upload</Button>
//             )}
//           </Upload>
//         )}
//       />
//       {errors.file && <p style={{ color: "red" }}>{errors.file.message}</p>}

//       {previewImage && (
//         <Image
//           preview={{
//             visible: previewOpen,
//             onVisibleChange: (visible) => setPreviewOpen(visible),
//             afterOpenChange: (visible) => !visible && setPreviewImage(""),
//           }}
//           src={previewImage}
//           wrapperStyle={{ display: "none" }}
//           alt="Preview"
//         />
//       )}
//     </form>
//   );
// };

// export default FileUploadComponent;

import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Upload, message, Image, Button } from "antd";

const FileUploadComponent = ({ url, setUrl, isreset }) => {
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // Reset fileList when form is reset
  useEffect(() => {
    if (isreset) {
      setFileList([]);
      setPreviewImage("");
      setUrl("");
    }
  }, [isreset]);


  useEffect(() => {
    if (url) {
      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: url,
        },
      ]);
    }
  }, [url]);

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/fileUpload/local", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        message.success("File uploaded successfully");
        setUrl(result.url);
      } else {
        message.error(result.message || "File upload failed");
      }
    } catch (error) {
      message.error("Error uploading file");
      console.error(error);
    }
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      handleFileUpload(newFileList[0].originFileObj);
    } else {
      setUrl(""); // Reset on remove
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={() => false} 
      >
        {fileList.length >= 1 ? null : (
          <Button icon={<PlusOutlined />}>Upload</Button>
        )}
      </Upload>

      {previewImage && (
        <Image
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
          wrapperStyle={{ display: "none" }}
        />
      )}
    </>
  );
};


const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default FileUploadComponent;
