import React, { useEffect, useState } from "react";
import { Modal, Button, Input, Form, message, Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import { postData, updateData } from "@/app/lib/ApiFuntions";
import FileUploadComponent from "@/app/componants/ImageUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const { Option } = Select;

const schema = z.object({
  slug: z.enum(["advertisements", "Banner"], {
    required_error: "Slug is required",
  }),
  title: z.string().min(1, "Title is required"),
  image: z.string().min(1, "Image is required"),
  description: z.string().optional(),
});

const AdvertisementsForm = ({ open, onCancel, initialValues, fetchAdvertisements }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      slug: "",
      title: "",
      image: "",
      description: "",
    },
  });

  const [url, setUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const [isReset, setIsReset] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setUrl(initialValues.image || "");
      reset(initialValues);
    } else {
      reset({
        slug: "",
        title: "",
        image: "",
        description: "",
      });
    }
  }, [initialValues, reset]);

  useEffect(() => {
    setIsReset(false);
  }, []);

  const handleFormSubmit = (data) => {
    if (!url) {
      setImageError("Please upload an image.");
      return;
    } else {
      setImageError("");
    }

    console.log(data);

    const formData = new FormData();
    formData.append("slug", data.slug);
    formData.append("title", data.title);
    formData.append("image", url);
    formData.append("description", data.description);

    const id = initialValues ? initialValues.id : null;
    postAdvertisement(formData, id);
  };

  const postAdvertisement = async (formData, id) => {
    const url = initialValues ? `/api/advertisements?id=${initialValues?._id}` : "/api/advertisements";
    const method = initialValues ? updateData : postData;

    try {
      const response = await method(url, formData);
      if (response.success !== false) {
        message.success(id ? "Advertisement updated successfully!" : "Advertisement added successfully!");
        fetchAdvertisements();
        reset();
        setIsReset(true);
        onCancel();
      } else {
        throw new Error(response.err || "Failed to save advertisement");
      }
    } catch (error) {
      message.error(error.message || "Something went wrong");
    }
  };

  return (
    <Modal
      open={open}
      width={600}
      onCancel={onCancel}
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
      <h2 className="text-lg font-semibold mb-4" style={{ color: "#6F4D27" }}>
        {initialValues ? "Edit Advertisement" : "Add Advertisement"}
      </h2>
      <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)}>
        <Form.Item label="Slug">
          <Controller
            name="slug"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Select slug">
                <Option value="advertisements">Advertisement</Option>
                <Option value="Banner">Banner</Option>
              </Select>
            )}
          />
          {errors.slug && <p className="text-red-500">{errors.slug.message}</p>}
        </Form.Item>

        <Form.Item label="Title">
          <Controller
            name="title"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Enter title" />}
          />
          {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        </Form.Item>

        <Form.Item label="Image">
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <FileUploadComponent {...field} url={url} setUrl={setUrl} isReset={isReset} setImageError={setImageError} />
            )}
          />
          {imageError && <p className="text-red-500">{imageError}</p>}
        </Form.Item>

        <Form.Item label="Description">
          <Controller
            name="description"
            control={control}
            render={({ field }) => <Input.TextArea rows={3} {...field} placeholder="Enter description" />}
          />
          {errors.description && <p className="text-red-500">{errors.description.message}</p>}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AdvertisementsForm;
