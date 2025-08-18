import { message } from "antd";
import { useState } from "react";

const useNotification = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const success = (content = "Operation Successful") => {
    messageApi.open({
      type: "success",
      content,
    });
  };

  const error = (content = "An error occurred") => {
    messageApi.open({
      type: "error",
      content,
    });
  };

  const warning = (content = "Warning: Check your input") => {
    messageApi.open({
      type: "warning",
      content,
    });
  };

  return {
    success,
    error,
    warning,
    contextHolder, 
  };
};

export default useNotification;
