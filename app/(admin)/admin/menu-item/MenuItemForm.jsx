import React, { useEffect, useState } from "react";
import { Modal, Button, Input, Col, Row, Select, Radio, message, Form } from "antd";
import { useForm, Controller } from "react-hook-form";
import { postData, updateData } from "@/app/lib/ApiFuntions";
import FileUploadComponent from "@/app/componants/ImageUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from 'axios'; 

const { Option } = Select;
const menuSchema = z.object({
  Item_Name: z.string().min(1, "Item Name is required"),
  Category_Id: z.string().min(1, "Category is required"),
  Vendor: z.string().min(1, "Vendor is required"),
  Food_Type: z.enum(['veg', 'non-veg'], "Select a valid food type"), 
  Price: z
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than 0"),
  Discount: z
    .number({ invalid_type_error: "Discount must be a number" })
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot be more than 100"),
  Description: z.string().min(5, "Description should be at least 5 characters long"),
  image: z.string().min(1, "Image is required"), 
});

const MenuItemForm = ({ open, onCancel, onSubmit, initialValues, fetchMenuItems }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    // resolver: zodResolver(menuSchema),
    defaultValues: {
      Item_Name: "",
      Category_Id: "",
      Vendor: "",
      Food_Type: "",
      Price: "",
      Discount: "",
      Description: "",
      image: "",
    },
  });

  const [url, setUrl] = useState(""); 
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]); 

  console.log(categories,"categories")

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
       
        setCategories(response.data.data);
      } catch (error) {
        message.error("Failed to fetch categories");
      }
    };

    const fetchVendors = async () => {
      try {
        const response = await axios.get('/api/vendors'); 
        console.log(response,"response cata")
        setVendors(response.data.data);
      } catch (error) {
        message.error("Failed to fetch vendors");
      }
    };

    fetchCategories();
    fetchVendors();
  }, []);

  useEffect(() => {
    if (initialValues) {
      setUrl(initialValues.image || "");
      reset(initialValues);
    } else {
      reset({
        Item_Name: "",
        Category_Id: "",
        Vendor: "",
        Food_Type: "",
        Price: "",
        Discount: "",
        Description: "",
        image: "",
      });
    }
  }, [initialValues, reset]);

  const handleFormSubmit = (data) => {
    if (!url) {
      message.error("Please upload an image.");
      return;
    }
    const formData = new FormData();
    formData.append("Item_Name", data.Item_Name);
    formData.append("Category_Id", data.Category_Id);
    formData.append("Vendor", data.Vendor);
    formData.append("Food_Type", data.Food_Type);
    formData.append("Price", data.Price);
    formData.append("Discount", data.Discount);
    formData.append("Description", data.Description);
    formData.append("image", url); 

    const id = initialValues ? initialValues.id : null;
    postCategory(formData, id); 
  };

  const postCategory = async (formData, id) => {
    const url = initialValues ? `/api/menu?id=${initialValues?._id}` : "/api/menu";
    const method = initialValues ? updateData : postData;

    try {
      const response = await method(url, formData);

      if (response.success !== false) {
        message.success(id ? "Menu item updated successfully!" : "Menu item added successfully!");
        fetchMenuItems();
        onCancel();
      } else {
        throw new Error(response.err || "Failed to save category");
      }
    } catch (error) {
      message.error(error.message || "Something went wrong");
    }
  };

  return (
    <Modal
      open={open}
      width={1000}
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
        {initialValues ? "Edit Menu Item" : "Add Menu Item"}
      </h2>
      <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)}>
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item label="Item Name">
              <Controller
                name="Item_Name"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
              {errors.Item_Name && <p className="text-red-500">{errors.Item_Name.message}</p>}
            </Form.Item>
          </Col>
          <Col span={12}>
  <Form.Item label="Select Category">
    <Controller
      name="Category_Id"
      control={control}
      render={({ field }) => (
        <Select {...field}>
        {categories?.map((category) => (
          <Option key={category._id } value={category._id}>
            {category.title}
          </Option>
        ))}
      </Select>
      
      )}
    />
    {errors.Category_Id && <p className="text-red-500">{errors.Category_Id.message}</p>}
  </Form.Item>
</Col>

        </Row>

        <Row gutter={20}>
          <Col span={12}>
            <Form.Item label="Select Vendor">
              <Controller
                name="Vendor"
                control={control}
                render={({ field }) => (
                  <Select {...field}>
                  {vendors?.map((vendor) => (
                    <Option key={vendor._id} value={vendor._id}>
                      {vendor.Vendor_Name}
                    </Option>
                  ))}
                </Select>
                
                )}
              />
              {errors.Vendor && <p className="text-red-500">{errors.Vendor.message}</p>}
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Food Type">
              <Controller
                name="Food_Type"
                control={control}
                render={({ field }) => (
                  <Radio.Group {...field}>
                    <Radio value="veg">Veg</Radio>
                    <Radio value="non-veg">Non-Veg</Radio>
                  </Radio.Group>
                )}
              />
              {errors.Food_Type && <p className="text-red-500">{errors.Food_Type.message}</p>}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={20}>
          <Col span={12}>
            <Form.Item label="Price">
              <Controller
                name="Price"
                control={control}
                render={({ field }) => <Input type="number" {...field} />}
              />
              {errors.Price && <p className="text-red-500">{errors.Price.message}</p>}
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Discount (%)">
              <Controller
                name="Discount"
                control={control}
                render={({ field }) => <Input type="number" {...field} />}
              />
              {errors.Discount && <p className="text-red-500">{errors.Discount.message}</p>}
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Image">
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <FileUploadComponent {...field} url={url} setUrl={setUrl} />
            )}
          />
          {errors.image && <p className="text-red-500">{errors.image.message}</p>}
        </Form.Item>

        <Form.Item label="Description">
          <Controller
            name="Description"
            control={control}
            render={({ field }) => <Input.TextArea rows={4} {...field} />}
          />
          {errors.Description && <p className="text-red-500">{errors.Description.message}</p>}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MenuItemForm;
