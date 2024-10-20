import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Input,
  Col,
  Row,
  Select,
  Radio,
  message,
  Form,
} from "antd";
import { useForm, Controller } from "react-hook-form";
import { fetchData, postData, updateData } from "@/app/lib/ApiFuntions";
import FileUploadComponent from "@/app/componants/ImageUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const { Option } = Select;

const schema = z.object({
  Item_Name: z.string().min(1, "Item name is required"),
  Category_Id: z.string().min(1, "Category is required"),
  Vendor: z.string().min(1, "Vendor is required"),
  Station: z.string().min(1, "Station is required"),
  Food_Type: z.enum(["Vegetarian", "Non-Vegetarian", "Vegan"], {
    required_error: "Food type is required",
  }),
  price: z
    .number()
    .positive("Price must be a positive number")
    .min(0.01, "Price must be at least 0.01"),
  discount: z
    .number()
    .min(0, "Discount cannot be less than 0")
    .max(100, "Discount cannot be more than 100")
    .optional(),
  Description: z.string().optional(), // Ensure this is part of the object
});

const MenuItemForm = ({
  open,
  onCancel,
  initialValues,
  fetchMenuItems,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      Item_Name: "",
      Category_Id: "",
      Vendor: "",
      Station: "",
      Food_Type: "",
      Price: "",
      Discount: "",
      Description: "",
      image: "",
    },
  });

  console.log(errors,"errors")
  console.log(initialValues,"initialValues")

  const [url, setUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedStationName, setSelectedStationName] = useState("");
  const [imageError, setImageError] = useState("");
  const [isreset, setIsreset] = useState(false);


  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetchData("/api/categories");
      if (response.success !== false) {
        setCategories(response.data);
      } else {
        message.error("Failed to fetch categories");
      }
    };

    const fetchStations = async () => {
      const response = await fetchData("/api/station?search=&page=0");
      console.log(response.data.name,"response")
      if (response.success !== false) {
        setStations(response.data);
      } else {
        message.error("Failed to fetch stations");
      }
    };

    fetchCategories();
    fetchStations();
  }, []);


  useEffect(() => {
    console.log("Selected station name changed:", selectedStationName);
    if (selectedStationName) {
      fetchVendors(selectedStationName);
    }
  }, [selectedStationName]);
  
  
  const fetchVendors = async (stationName) => {
    try {
      console.log("Station name for vendor fetch:", stationName);
      const response = await fetchData(`/api/vendors?page=1&limit=10&search=${stationName}`);

      console.log("Vendor fetch response:", response);
  
      if (response && response.success !== false) {
        setVendors(response.data);
      } else {
        console.error("Failed to fetch vendors:", response?.error);
        message.error("Failed to fetch vendors");
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      message.error("An error occurred while fetching vendors");
    }
  };
  
  
  useEffect(() => {
    if (initialValues) {
      setUrl(initialValues.image || "");
      reset(initialValues);
    } else {
      reset({
        Item_Name: "",
        Category_Id: "",
        Vendor: "",
        Station: "",
        Food_Type: "",
        Price: "",
        Discount: "",
        Description: "",
        image: "",
      });
    }
  }, [initialValues, reset]);

  useEffect(()=>{
    setIsreset(false)
  },[])

  
    const handleFormSubmit = (data) => {
      if (!url) {
        setImageError("Please upload an image."); 
        return;
      } else {
        setImageError(""); 
      }
    const formData = new FormData();
    formData.append("Item_Name", data.Item_Name);
    formData.append("Category_Id", data.Category_Id);
    formData.append("Vendor", data.Vendor);
    formData.append("Station", data.Station);
    formData.append("Food_Type", data.Food_Type);
    formData.append("Price", data.Price);
    formData.append("Discount", data.Discount);
    formData.append("Description", data.Description);
    formData.append("image", url);

    const id = initialValues ? initialValues.id : null;
    postCategory(formData, id);
  };

  const postCategory = async (formData, id) => {
    const url = initialValues
      ? `/api/menu?id=${initialValues?._id}`
      : "/api/menu";
    const method = initialValues ? updateData : postData;

    try {
      const response = await method(url, formData);

      if (response.success !== false) {
        message.success(
          id
            ? "Menu item updated successfully!"
            : "Menu item added successfully!"
        );
        fetchMenuItems();
        reset();
        setIsreset(true)
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
              {errors.Item_Name && (
                <p className="text-red-500">{errors.Item_Name.message}</p>
              )}
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
                      <Option key={category._id} value={category._id}>
                        {category.title}
                      </Option>
                    ))}
                  </Select>
                )}
              />
              {errors.Category_Id && (
                <p className="text-red-500">{errors.Category_Id.message}</p>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={20}>
        <Col span={12}>
<Form.Item label="Select Station">
  <Controller
    name="Station"
    control={control}
    render={({ field }) => (
      <Select
        {...field}
        onChange={(value) => {
          field.onChange(value);
          const selectedStation = stations.find(station => station._id === value);
          setSelectedStationName(selectedStation?.name || '');
        }}
        showSearch
        placeholder="Search for a station"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option?.children.toLowerCase().includes(input.toLowerCase())
        }
      >
        {stations?.map((station) => (
          <Select.Option key={station._id} value={station._id}>
            {station.name}
          </Select.Option>
        ))}
      </Select>
    )}
  />
  {errors.Station && (
    <p className="text-red-500">{errors.Station.message}</p>
  )}
</Form.Item>

</Col>

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
              {errors.Vendor && (
                <p className="text-red-500">{errors.Vendor.message}</p>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={20}>
          <Col span={12}>
            <Form.Item label="Price">
              <Controller
              type="number"
                name="Price"
                control={control}
                render={({ field }) => <Input type="number" {...field} />}
              />
              {errors.Price && (
                <p className="text-red-500">{errors.Price.message}</p>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Col span={12}>
              <Form.Item label="Discount (%)">
                <Controller
                  name="Discount"
                  control={control}
                  render={({ field }) => <Input type="number" {...field} />}
                />
                {errors.Discount && (
                  <p className="text-red-500">{errors.Discount.message}</p>
                )}
              </Form.Item>
            </Col>
          </Col>
        </Row>

        <Row gutter={20}>
          <Col span={12}>
          <Form.Item label="Food Type">
  <Controller
    name="Food_Type"
    control={control}
    render={({ field }) => (
      <Radio.Group {...field}>
        <Radio value="Vegetarian">Veg</Radio>
        <Radio value="Non-Vegetarian">Non-Veg</Radio>
        <Radio value="Vegan">Vegan</Radio>
      </Radio.Group>
    )}
  />
  {errors.Food_Type && (
    <p className="text-red-500">{errors.Food_Type.message}</p>
  )}
</Form.Item>

          </Col>
          <Col span={12}>
            <Form.Item label="Image">
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <FileUploadComponent {...field} url={url} setUrl={setUrl} isreset={isreset}  setImageError={setImageError} />
                )}
              />
            {imageError && (
                <p className="text-red-500">{imageError}</p>
              )}
            </Form.Item>
          </Col>
        </Row>

        <Col>
          <Form.Item label="Description">
            <Controller
              name="Description"
              control={control}
              render={({ field }) => <Input.TextArea rows={3} {...field} />}
            />
            {errors.Description && (
              <p className="text-red-500">{errors.Description.message}</p>
            )}
          </Form.Item>
        </Col>
      </Form>
    </Modal>
  );
};

export default MenuItemForm;
