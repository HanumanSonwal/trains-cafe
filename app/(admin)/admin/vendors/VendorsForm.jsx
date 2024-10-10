import React, { useEffect } from 'react';
import { Modal, Button, Input, Select, Row, Col } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dynamic from 'next/dynamic';
import { postData, updateData } from '@/app/lib/ApiFuntions';

const { Option } = Select;

const TextEditor = dynamic(() => import('../../../componants/TextEditor'), { ssr: false });

const vendorSchema = z.object({
  Vendor_Name: z.string().nonempty('Please enter the vendor name'),
  Contact_No: z.string().nonempty('Please enter the contact number'),
  Alternate_Contact_No: z.string().optional(),
  Delivery_Charges: z.string().nonempty('Please enter the delivery charges'),
  Min_Order_Value: z.string().nonempty('Please enter the minimum order value'),
  Min_Order_Time: z.string().nonempty('Please enter the minimum order time'),
  Working_Time: z.string().nonempty('Please enter the working time'),
  Weekly_Off: z.string().nonempty('Please select the weekly off day'),
  Food_Type: z.string().nonempty('Please select the food type'),
  Description: z.string().nonempty('Please enter a Description'),
  Address: z.string().nonempty('Please enter the address'),
  Station: z.string().nonempty('Please select a station'),
});

const VendorsForm = ({ open, onCancel, onSubmit, initialValues }) => {
  console.log(initialValues,"initialValues")
  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(vendorSchema),
    defaultValues: initialValues || {
      Vendor_Name: '',
      Contact_No: '',
      Alternate_Contact_No: '', 
      Delivery_Charges: '',
      Min_Order_Value: '',
      Min_Order_Time: '',
      Working_Time: '',
      Weekly_Off: '',
      Food_Type: '',
      Description: '',
      Address: '',
      Station: '',
    },
  });


  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const handleFormSubmit = async (data) => {
    let response;
    if (initialValues) {
      
  
      response = await updateData(`/api/vendors/?id=${initialValues._id}`, data);
    } else {
    
      response = await postData('/api/vendors', data);
    }

    if (response && response.success !== false) {
      onSubmit(data);
      reset(); 
    } else {
   
      console.error('Error submitting the form:', response?.err);
    }
  };

  return (
    <Modal
      title={initialValues ? 'Edit Vendor' : 'Add Vendor'}
      open={open}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit(handleFormSubmit)}
          style={{ backgroundColor: '#D6872A', borderColor: '#D6872A' }}
        >
          {initialValues ? 'Save' : 'Submit'}
        </Button>
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
                  {errors.Vendor_Name && <p className="text-red-500">{errors.Vendor_Name.message}</p>}
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
                  {errors.Contact_No && <p className="text-red-500">{errors.Contact_No.message}</p>}
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
                  {errors.Alternate_Contact_No && <p className="text-red-500">{errors.Alternate_Contact_No.message}</p>}
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
                  <Select {...field} style={{ width: '100%' }}>
                    <Option value="Station 1">Station 1</Option>
                    <Option value="Station 2">Station 2</Option>
                    <Option value="Station 3">Station 3</Option>
                  </Select>
                  {errors.Station && <p className="text-red-500">{errors.Station.message}</p>}
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
                  {errors.Delivery_Charges && <p className="text-red-500">{errors.Delivery_Charges.message}</p>}
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
                  {errors.Min_Order_Value && <p className="text-red-500">{errors.Min_Order_Value.message}</p>}
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
                <div className="mb-4">
                  <label className="block mb-1">Min. Order Time (Minutes)</label>
                  <Input {...field} />
                  {errors.Min_Order_Time && <p className="text-red-500">{errors.Min_Order_Time.message}</p>}
                </div>
              )}
            />
          </Col>
          <Col span={12}>
            <Controller
              name="Working_Time"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label className="block mb-1">Working Time</label>
                  <Input {...field} />
                  {errors.Working_Time && <p className="text-red-500">{errors.Working_Time.message}</p>}
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
                  <Select {...field} style={{ width: '100%' }}>
                    <Option value="Monday">Monday</Option>
                    <Option value="Tuesday">Tuesday</Option>
                    <Option value="Wednesday">Wednesday</Option>
                    <Option value="Thursday">Thursday</Option>
                    <Option value="Friday">Friday</Option>
                    <Option value="Saturday">Saturday</Option>
                    <Option value="Sunday">Sunday</Option>
                  </Select>
                  {errors.Weekly_Off && <p className="text-red-500">{errors.Weekly_Off.message}</p>}
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
                  <Select {...field} style={{ width: '100%' }}>
                    <Option value="Veg & Non-Veg">Veg & Non-Veg</Option>
                    <Option value="Veg">Veg</Option>
                    <Option value="Non-Veg">Non-Veg</Option>
                  </Select>
                  {errors.Food_Type && <p className="text-red-500">{errors.Food_Type.message}</p>}
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
                    updatedValue={(content) => setValue('Description', content)}
                    height={200}
                  />
                {errors.Description && <p className="text-red-500">{errors.Description.message}</p>}
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
                    updatedValue={(content) => setValue('Address', content)}
                    height={200}
                  />
                {errors.Address && <p className="text-red-500">{errors.Address.message}</p>}
              </div>
            )}
          />
        </Col>
      </form>
    </Modal>
  );
};

export default VendorsForm;