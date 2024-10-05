// import React, { useEffect, useState } from "react";
// import { Modal, Button, Input, Col, message } from "antd";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import FileUploadComponent from "@/app/componants/ImageUpload";

// const vendorSchema = z.object({
//   title: z.string().nonempty("Please enter the category title"),
//   image: z.string().nonempty("Please upload an image"), // Make sure it's a string URL
// });

// const CategoriesForm = ({ open, onCancel, onSubmit, initialValues }) => {
//   const {
//     control,
//     handleSubmit,
//     reset,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     // resolver: zodResolver(vendorSchema),
//     defaultValues: initialValues || {
//       title: "",
//       image: "",
//     },
//   });

//   const [url, setUrl] = useState(""); 

//   useEffect(() => {
//     if (initialValues && initialValues.image) {
//       setUrl(initialValues.image);
//       setValue("image", initialValues.image);
//     }
//     reset(initialValues);
//   }, [initialValues, reset, setValue]);

//   const postCategory = async (formData) => {
//     try {
//       const response = await fetch("/api/categories", {
//         method: "POST",
//         body: formData, 
//       });
  
//       if (response.ok) {
//         const result = await response.json();
//         message.success("Category added successfully!");
//         onSubmit(result);
//       } else {
//         const errorResponse = await response.json();
//         console.log(errorResponse,"errorResponse")
//         throw new Error(errorResponse.message || "Failed to add category");
//       }
//     } catch (error) {
//       message.error(error.message || "Something went wrong");
//     }
//   };
  

//   const handleFormSubmit = (data) => {
//     const formData = new FormData();
//     formData.append("title", data.title);
//     formData.append("image", url);
//     postCategory(formData);
//     reset({
//       title: "",
//       image: "",
//     });
//   };

//   return (
//     <Modal
//       title={initialValues ? "Edit Category" : "Add Category"}
//       open={open}
//       onCancel={onCancel}
//       width={800}
//       footer={[
//         <Button
//           key="submit"
//           type="primary"
//           onClick={handleSubmit(handleFormSubmit)}
//           style={{ backgroundColor: "#D6872A", borderColor: "#D6872A" }}
//         >
//           {initialValues ? "Save" : "Submit"}
//         </Button>,
//       ]}
//     >
//       <form>
//         <Col span={24} className="mb-4">
//           <Controller
//             name="title"
//             control={control}
//             render={({ field }) => (
//               <div className="mb-4">
//                 <label className="block mb-1">Category Title</label>
//                 <Input {...field} />
//                 {errors.title && <p className="text-red-500">{errors.title.message}</p>}
//               </div>
//             )}
//           />
//         </Col>

//         <Col span={24} className="mb-4">
//           <Controller
//             name="image"
//             control={control}
//             render={({ field }) => (
//               <div className="mb-4">
//                 <label className="block mb-1">Thumbnail Image</label>
//                 <FileUploadComponent url={url} setUrl={setUrl} />
//                 {errors.image && <p className="text-red-500">{errors.image.message}</p>}
//               </div>
//             )}
//           />
//         </Col>
//       </form>
//     </Modal>
//   );
// };

// export default CategoriesForm;

import React, { useEffect, useState } from "react";
import { Modal, Button, Input, Col, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FileUploadComponent from "@/app/componants/ImageUpload";

// Zod schema for form validation
const vendorSchema = z.object({
  title: z.string().nonempty("Please enter the category title"),
  image: z.string().nonempty("Please upload an image"), // Ensure image is a string URL
});

const CategoriesForm = ({ open, onCancel, onSubmit, initialValues }) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    // resolver: zodResolver(vendorSchema),
    defaultValues: {
      title: "",
      image: "",
    },
  });

  const [url, setUrl] = useState(""); 

  // Handle initial values when editing
  useEffect(() => {
    if (initialValues) {
      setUrl(initialValues.image || "");
      reset(initialValues); // Reset form with initial values
    } else {
      reset({
        title: "",
        image: "",
      });
    }
  }, [initialValues, reset]);

  // Combined function for both add and edit category
  const postCategory = async (formData, id) => {
    const method = id ? "PUT" : "POST"; // Determine method based on presence of `id`
    const url = id ? `/api/categories/${id}` : "/api/categories"; // Endpoint for post/edit

    try {
      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        message.success(id ? "Category updated successfully!" : "Category added successfully!");
        onSubmit(result); // Call parent submit handler
      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to save category");
      }
    } catch (error) {
      message.error(error.message || "Something went wrong");
    }
  };

  // Handle form submission
  const handleFormSubmit = (data) => {
    if (!url) {
      message.error("Please upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("image", url); // Append image URL or file

    const id = initialValues ? initialValues.id : null; // Determine if it's edit mode
    postCategory(formData, id); // Pass form data and ID for edit

    reset({
      title: "",
      image: "",
    });
    setUrl(""); // Clear uploaded image URL
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
                {errors.image && <p className="text-red-500">{errors.image.message}</p>}
              </div>
            )}
          />
        </Col>
      </form>
    </Modal>
  );
};

export default CategoriesForm;
