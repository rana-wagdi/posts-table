import { message } from "antd";

export const handleErrorRequest = (error:any) => {
  if (error.message) {
    for (let i = 0; i < error.message.length; i++) {
      message.error(error.message[i]);
    }
  }
  if (error.detail) {
    message.error(error.detail);
  }
};

export const handleSuccessRequest = (msg:any) => {
  message.success(msg);
};
