import React, { useEffect, useState } from "react";
import { Modal, Button, Input, Col, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FileUploadComponent from "@/app/componants/ImageUpload";
import { postData, updateData } from "@/app/lib/ApiFuntions";


const vendorSchema = z.object({
  title: z.string().nonempty("Category Title is required"),
});

const CategoriesForm = ({ open, onCancel, onSubmit, initialValues }) => {
  console.log(initialValues,"CATAGRU initialValues")
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      title: "",
      image: "",
    },
  });

  const [url, setUrl] = useState(""); 

  
  useEffect(() => {
    if (initialValues) {
      setUrl(initialValues.image || "");
      reset(initialValues);
    } else {
      reset({
        title: "",
        image: "",
      });
    }
  }, [initialValues, reset]);


  const postCategory = async (formData, id, onSubmit = () => {}) => {
    const url = initialValues._id ? `/api/categories?id=${initialValues._id}` : "/api/categories"; 
    const method = initialValues._id ? updateData : postData; 
  
    try {
      const response = await method(url, formData); 
  
      if (response.success !== false) { 
        message.success(id ? "Category updated successfully!" : "Category added successfully!");
        onSubmit(response); 
        onCancel();
      } else {
        throw new Error(response.err || "Failed to save category");
      }
    } catch (error) {
      message.error(error.message || "Something went wrong");
    }
  };

  
  const handleFormSubmit = (data) => {
    if (!url) {
      message.error("Please upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("image", url); 

    const id = initialValues ? initialValues.id : null; 
    postCategory(formData, id); 

    reset({
      title: "",
      image: "",
    });
    setUrl(""); 
  };

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
          onClick={handleSubmit(handleFormSubmit)} // Ensure single submission
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
                <FileUploadComponent url={url} setUrl={setUrl} />
              </div>
            )}
          />
        </Col>
      </form>
    </Modal>
  );
};

export default CategoriesForm;
