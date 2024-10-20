"use client";
import React from "react";
import { Form, Input, Button, message } from "antd";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


const TextEditor = dynamic(() => import('../../../componants/TextEditor'), { ssr: false });


const contactInfoSchema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  contactNo: z.string().nonempty("Contact number is required"),
  address: z.string().nonempty("Address is required"), 
});

const ContactInfo = () => {

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({

  });

  const onSubmit = (data) => {
    console.log(data); 
    message.success("Contact info saved successfully!");
  };

  return (
  <div className="p-4" style={{ backgroundColor: '#FAF3CC', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
      <h2 className="text-lg font-semibold my-5" style={{ color: '#6F4D27' }}>Contact Info</h2>
      <Form className="mt-5" layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item label="Email ID">
          <Input
            placeholder="Enter your email"
            {...register("email")}
          />
          {errors.email && <span style={{ color: "red" }}>{errors.email.message}</span>}
        </Form.Item>
        <Form.Item label="Contact No">
          <Input
            placeholder="Enter your contact number"
            {...register("contactNo")}
          />
          {errors.contactNo && <span style={{ color: "red" }}>{errors.contactNo.message}</span>}
        </Form.Item>
        <Form.Item label="Address">
          <TextEditor
            previousValue=""  
            updatedValue={(content) => setValue('address', content)} 
            height={200}
          />
          {errors.address && <span style={{ color: "red" }}>{errors.address.message}</span>}
        </Form.Item>

    
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ backgroundColor: "#4CAF50", borderColor: "#4CAF50" }}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ContactInfo;
