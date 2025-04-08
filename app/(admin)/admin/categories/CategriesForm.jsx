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

const CategoriesForm = ({ open, onCancel, onSubmit, initialValues ,fetchCategories}) => {
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
  const [isreset, setIsreset] = useState(false);

  
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

  useEffect(()=>{
    setIsreset(false)
  },[])



  const postCategory = async (formData, id, onSubmit = () => {}) => {
    const url = initialValues ? `/api/categories?id=${initialValues?._id}` : "/api/categories"; 
    const method = initialValues ? updateData : postData; 
  
    try {
      const response = await method(url, formData); 
  
      if (response.success !== false) { 
        message.success(id ? "Category updated successfully!" : "Category added successfully!");
        onSubmit(response); 
        fetchCategories();
    setIsreset(true);
        
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
    setIsreset(true);
  };
  const handleCancel = () => {
    reset();
    onCancel();
    setIsreset(true);
  };

  return (
    <Modal
      title={initialValues ? "Edit Category" : "Add Category"}
      open={open}
      onCancel={handleCancel}
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
                <FileUploadComponent {...field} url={url} isreset={isreset}  setUrl={setUrl} />
              </div>
            )}
          />
        </Col>
      </form>
    </Modal>
  );
};

export default CategoriesForm;
