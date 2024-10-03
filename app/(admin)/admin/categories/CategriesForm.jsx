import React, { useEffect, useState } from "react";
import { Modal, Button, Input, Col, message, Upload } from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UploadOutlined } from "@ant-design/icons";

const vendorSchema = z.object({
  title: z.string().nonempty("Please enter the category title"),
  image: z.any().refine((val) => val && val.length > 0, "Please upload an image"),
});

const CategoriesForm = ({ open, onCancel, onSubmit, initialValues }) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vendorSchema),
    defaultValues: initialValues || {
      title: "",
      image: [],
    },
  });

  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (initialValues && initialValues.image) {
      const initialFile = {
        uid: "-1",
        name: "thumbnail",
        status: "done",
        url: initialValues.image,
      };
      setFileList([initialFile]);
      setValue("image", [initialFile]);
    }
    reset(initialValues);
  }, [initialValues, reset, setValue]);

  // Function to handle the POST API request with FormData
  const postCategory = async (formData) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        body: formData, // Sending FormData
      });

      if (response.ok) {
        const result = await response.json();
        message.success("Category added successfully!");
        onSubmit(result); // Trigger the parent component's onSubmit if needed
      } else {
        throw new Error("Failed to add category");
      }
    } catch (error) {
      message.error(error.message || "Something went wrong");
    }
  };

  const handleFormSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("image", data.image[0]?.originFileObj);

    postCategory(formData); // Make the POST request with FormData
    reset({
      title: "",
      image: [],
    });
    setFileList([]);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setValue("image", newFileList);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Modal
      title={initialValues ? "Edit Category" : "Add Category"}
      open={open}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit(handleFormSubmit)}
          style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
        >
          {initialValues ? "Save" : "Submit"}
        </Button>,
      ]}
    >
      <form>
        <Col span={24} className="mb-4">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <div className="mb-4">
                <label className="block mb-1">Category Title</label>
                <Input {...field} />
                {errors.title && <p className="text-red-500">{errors.title.message}</p>}
              </div>
            )}
          />
        </Col>

        <Col span={24} className="mb-4">
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <div className="mb-4">
                <label className="block mb-1">Thumbnail Image</label>
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
                {errors.image && <p className="text-red-500">{errors.image.message}</p>}
              </div>
            )}
          />
        </Col>
      </form>
      <Modal open={previewOpen} footer={null} onCancel={() => setPreviewOpen(false)}>
        <img alt="preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </Modal>
  );
};

export default CategoriesForm;
