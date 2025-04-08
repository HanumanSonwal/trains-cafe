import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Button,
  Input,
  Select,
  Row,
  Col,
  InputNumber,
  message,
} from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import { fetchData, postData, updateData } from "@/app/lib/ApiFuntions";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { vendorSchema } from "@/app/validation-schema/Vendor-Schema";
dayjs.extend(customParseFormat);

const { Option } = Select;

const TextEditor = dynamic(() => import("../../../componants/TextEditor"), {
  ssr: false,
});

const VendorsForm = ({ open, onCancel, onSubmit, initialValues }) => {
  console.log(initialValues, "initialValues");
  const [stations, setStations] = useState([]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vendorSchema),
    defaultValues: initialValues || {
      Vendor_Name: "",
      Contact_No: "",
      Alternate_Contact_No: "",
      Delivery_Charges: "",
      Min_Order_Value: "",
      Min_Order_Time: "",
      Working_Time: "",
      Weekly_Off: "",
      Food_Type: "",
      Description: "",
      Address: "",
      Station: "",
    },
  });

  const defaultValues = useMemo(
    () => ({
      Vendor_Name: initialValues?.Vendor_Name || "",
      Contact_No: initialValues?.Contact_No || "",
      Alternate_Contact_No: initialValues?.Alternate_Contact_No || "",
      Delivery_Charges: initialValues?.Delivery_Charges || "",
      Min_Order_Value: initialValues?.Min_Order_Value || "",
      Min_Order_Time: initialValues?.Min_Order_Time || "",
      Working_Time: initialValues?.Working_Time || "",
      Weekly_Off: initialValues?.Weekly_Off || "",
      Food_Type: initialValues?.Food_Type || "",
      Description: initialValues?.Description || "",
      Address: initialValues?.Address || "",
      Station: initialValues?.Station || "",
    }),
    [initialValues]
  );

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, defaultValues, reset]);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await fetchData("/api/station?search=&page=0");
        console.log(response, "responseresponse");
        if (response && response.success !== false) {
          setStations(response.data);
        }
      } catch (error) {
        console.error("Error fetching stations:", error);
      }
    };

    fetchStations();
  }, []);

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const handleFormSubmit = async (data) => {
    if (data.Working_Time && Array.isArray(data.Working_Time)) {
      const [start, end] = data.Working_Time;
      data.Working_Time = `${start.format("hh:mm A")} - ${end.format(
        "hh:mm A"
      )}`;
    }

    let response;
    try {
      if (initialValues) {
        response = await updateData(
          `/api/vendors/?id=${initialValues._id}`,
          data
        );
      } else {
        response = await postData("/api/vendors", data);
      }

      if (response && response.success !== false) {
        message.success("Vendor saved successfully!");
        onSubmit(data);
        reset();
        onCancel();
      } else {
        message.warning(response?.message || "Something went wrong! ⚠️");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      message.error("Server error occurred. Please try again later.");
    }
  };
  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <Modal
      title={initialValues ? "Edit Vendor" : "Add Vendor"}
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
        <Row gutter={16}>
          <Col span={12}>
            <Controller
              name="Vendor_Name"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label className="block mb-1">Vendor Name</label>
                  <Input {...field} />
                  {errors.Vendor_Name && (
                    <p className="text-red-500">{errors.Vendor_Name.message}</p>
                  )}
                </div>
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="Contact_No"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label className="block mb-1">Contact No.</label>
                  <Input {...field} />
                  {errors.Contact_No && (
                    <p className="text-red-500">{errors.Contact_No.message}</p>
                  )}
                </div>
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="Alternate_Contact_No"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label className="block mb-1">Alternate Contact No.</label>
                  <Input {...field} />
                  {errors.Alternate_Contact_No && (
                    <p className="text-red-500">
                      {errors.Alternate_Contact_No.message}
                    </p>
                  )}
                </div>
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="Station"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label className="block mb-1">Station</label>
                  <Select
                    {...field}
                    showSearch
                    placeholder="Select a station"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option?.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    style={{ width: "100%" }}
                  >
                    {stations.map((station) => (
                      <Option key={station._id} value={station._id}>
                        {station.name}
                      </Option>
                    ))}
                  </Select>
                  {errors.Station && (
                    <p className="text-red-500">{errors.Station.message}</p>
                  )}
                </div>
              )}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Controller
              name="Delivery_Charges"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label className="block mb-1">Delivery Charges</label>
                  <Input {...field} />
                  {errors.Delivery_Charges && (
                    <p className="text-red-500">
                      {errors.Delivery_Charges.message}
                    </p>
                  )}
                </div>
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="Min_Order_Value"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label className="block mb-1">Min. Order Value (Rs.)</label>
                  <Input {...field} />
                  {errors.Min_Order_Value && (
                    <p className="text-red-500">
                      {errors.Min_Order_Value.message}
                    </p>
                  )}
                </div>
              )}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Controller
              name="Min_Order_Time"
              control={control}
              render={({ field }) => (
                <div className="mb-4 w-full">
                  <label className="block mb-1">
                    Min. Order Time (Minutes)
                  </label>
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    placeholder="Enter minutes"
                    value={
                      field.value === "" || field.value === undefined
                        ? null
                        : Number(field.value)
                    } // ✅ handle all cases
                    onChange={(value) => field.onChange(value || "")}
                  />
                  {errors.Min_Order_Time && (
                    <p className="text-red-500">
                      {errors.Min_Order_Time.message}
                    </p>
                  )}
                </div>
              )}
            />
          </Col>
          {/* <Col span={12}>
          <Controller
  name="Working_Time"
  control={control}
  render={({ field }) => {
    const workingTime = field.value;
    const timeRange =
      typeof workingTime === "string" && workingTime.includes(" - ")
        ? workingTime.split(" - ").map((time) => dayjs(time, "hh:mm A"))
        : [null, null];

    return (
      <div className="mb-4">
        <label className="block mb-1">Working Time</label>
        <TimePicker.RangePicker
          format="hh:mm A"
          value={timeRange}
          onChange={(times) => {
            if (times) {
              const [start, end] = times;
              const formatted = `${start?.format("hh:mm A")} - ${end?.format("hh:mm A")}`;
              field.onChange(formatted);
            } else {
              field.onChange("");
            }
          }}
        />
        {errors.Working_Time && (
          <p className="text-red-500">{errors.Working_Time.message}</p>
        )}
      </div>
    );
  }}
/>

            
          </Col> */}

          <Col span={12}>
            <Controller
              name="Working_Time"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label className="block mb-1">Working Time</label>
                  <TimePicker.RangePicker
                    format="hh:mm A"
                    onChange={(times) => {
                      if (times) {
                        const [start, end] = times;
                        field.onChange({
                          start: start ? start.format("hh:mm A") : null,
                          end: end ? end.format("hh:mm A") : null,
                        });
                      } else {
                        field.onChange(null);
                      }
                    }}
                  />

                  {errors.Working_Time && (
                    <p className="text-red-500">
                      {errors.Working_Time.message}
                    </p>
                  )}
                </div>
              )}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Controller
              name="Weekly_Off"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label className="block mb-1">Weekly Off</label>
                  <Select {...field} style={{ width: "100%" }}>
                    <Option value="Monday">Monday</Option>
                    <Option value="Tuesday">Tuesday</Option>
                    <Option value="Wednesday">Wednesday</Option>
                    <Option value="Thursday">Thursday</Option>
                    <Option value="Friday">Friday</Option>
                    <Option value="Saturday">Saturday</Option>
                    <Option value="Sunday">Sunday</Option>
                  </Select>
                  {errors.Weekly_Off && (
                    <p className="text-red-500">{errors.Weekly_Off.message}</p>
                  )}
                </div>
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="Food_Type"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label className="block mb-1">Food Type</label>
                  <Select {...field} style={{ width: "100%" }}>
                    <Option value="Veg & Non-Veg">Veg & Non-Veg</Option>
                    <Option value="Veg">Veg</Option>
                    <Option value="Non-Veg">Non-Veg</Option>
                  </Select>
                  {errors.Food_Type && (
                    <p className="text-red-500">{errors.Food_Type.message}</p>
                  )}
                </div>
              )}
            />
          </Col>
        </Row>
        <Col>
          <Controller
            name="Description"
            control={control}
            render={({ field }) => (
              <div className="mb-2">
                <label className="block mb-1">Description</label>
                <TextEditor
                  previousValue={field.value}
                  updatedValue={(content) => setValue("Description", content)}
                  height={200}
                />
                {errors.Description && (
                  <p className="text-red-500">{errors.Description.message}</p>
                )}
              </div>
            )}
          />
        </Col>
        <Col>
          <Controller
            name="Address"
            control={control}
            render={({ field }) => (
              <div className="mb-2">
                <label className="block mb-1">Address</label>
                <TextEditor
                  previousValue={field.value}
                  updatedValue={(content) => setValue("Address", content)}
                  height={200}
                />
                {errors.Address && (
                  <p className="text-red-500">{errors.Address.message}</p>
                )}
              </div>
            )}
          />
        </Col>
      </form>
    </Modal>
  );
};

export default VendorsForm;
