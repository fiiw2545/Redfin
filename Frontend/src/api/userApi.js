import axios from "axios";

export const loginUser = async (data) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/login`, // Backend endpoint
      data
    );
    return response.data; // คืนค่าข้อมูลที่ได้รับจาก Backend
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};
