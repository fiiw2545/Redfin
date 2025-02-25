import { useState } from "react";
import axios from "axios";

const AddHome = () => {
  const [home, setHome] = useState({
    name: "",
    price: "",
    details: {
      beds: "",
      baths: "",
      sqft: "",
      yearBuilt: "", // เพิ่มปีที่สร้าง
      lotSize: "", // เพิ่มขนาดที่ดิน
    },
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      neighborhood: "", // เพิ่มย่าน/เขต
    },
    property_type: "",
    description: "",
    features: [], // เพิ่มคุณสมบัติพิเศษ
    status: "available", // สถานะบ้าน (available, pending, sold)
  });

  const [images, setImages] = useState([]); // เก็บหลายรูป
  const [imageUrls, setImageUrls] = useState([]); // เก็บ URL หลายรูป
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // จัดการข้อมูลแบบ nested
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setHome((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setHome((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const handleUpload = async () => {
    if (images.length === 0) return alert("กรุณาเลือกรูปภาพ");
    setLoading(true);

    try {
      const uploadPromises = images.map(async (image) => {
        const formData = new FormData();
        formData.append("image", image);

        const res = await axios.post(
          "http://localhost:5000/api/homes/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
        return res.data.imageUrl;
      });

      const urls = await Promise.all(uploadPromises);
      setImageUrls((prev) => [...prev, ...urls]);
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/homes",
        {
          ...home,
          price: Number(home.price),
          details: {
            ...home.details,
            beds: Number(home.details.beds),
            baths: Number(home.details.baths),
            sqft: Number(home.details.sqft),
            yearBuilt: Number(home.details.yearBuilt),
            lotSize: Number(home.details.lotSize),
          },
          images: imageUrls,
        },
        { withCredentials: true }
      );

      alert("เพิ่มบ้านสำเร็จ!");
      // รีเซ็ตฟอร์ม
      setHome({
        name: "",
        price: "",
        details: { beds: "", baths: "", sqft: "", yearBuilt: "", lotSize: "" },
        address: { street: "", city: "", state: "", zip: "", neighborhood: "" },
        property_type: "",
        description: "",
        features: [],
        status: "available",
      });
      setImages([]);
      setImageUrls([]);
    } catch (error) {
      console.error("Error adding home:", error);
      alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการเพิ่มบ้าน");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-home-container">
      <h2>เพิ่มข้อมูลบ้าน</h2>
      <form onSubmit={handleSubmit} className="add-home-form">
        <div className="form-section">
          <h3>ข้อมูลทั่วไป</h3>
          <input
            type="text"
            name="name"
            value={home.name}
            placeholder="ชื่อประกาศ"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            value={home.price}
            placeholder="ราคา"
            onChange={handleChange}
            required
          />
          <select
            name="property_type"
            value={home.property_type}
            onChange={handleChange}
            required
          >
            <option value="">เลือกประเภทอสังหาริมทรัพย์</option>
            <option value="house">บ้านเดี่ยว</option>
            <option value="townhouse">ทาวน์เฮาส์</option>
            <option value="condo">คอนโดมิเนียม</option>
            <option value="land">ที่ดิน</option>
          </select>
        </div>

        <div className="form-section">
          <h3>รายละเอียดอสังหาริมทรัพย์</h3>
          <input
            type="number"
            name="details.beds"
            value={home.details.beds}
            placeholder="จำนวนห้องนอน"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="details.baths"
            value={home.details.baths}
            placeholder="จำนวนห้องน้ำ"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="details.sqft"
            value={home.details.sqft}
            placeholder="พื้นที่ใช้สอย (ตร.ม.)"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="details.yearBuilt"
            value={home.details.yearBuilt}
            placeholder="ปีที่สร้าง"
            onChange={handleChange}
          />
          <input
            type="number"
            name="details.lotSize"
            value={home.details.lotSize}
            placeholder="ขนาดที่ดิน (ตร.วา)"
            onChange={handleChange}
          />
        </div>

        <div className="form-section">
          <h3>ที่ตั้ง</h3>
          <input
            type="text"
            name="address.street"
            value={home.address.street}
            placeholder="ที่อยู่"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address.neighborhood"
            value={home.address.neighborhood}
            placeholder="ย่าน/เขต"
            onChange={handleChange}
          />
          <input
            type="text"
            name="address.city"
            value={home.address.city}
            placeholder="เมือง/อำเภอ"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address.state"
            value={home.address.state}
            placeholder="จังหวัด"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address.zip"
            value={home.address.zip}
            placeholder="รหัสไปรษณีย์"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-section">
          <h3>รูปภาพ</h3>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            accept="image/*"
          />
          <button
            type="button"
            onClick={handleUpload}
            disabled={loading || images.length === 0}
          >
            {loading ? "กำลังอัปโหลด..." : "อัปโหลดรูปภาพ"}
          </button>
          <div className="image-preview">
            {imageUrls.map((url, index) => (
              <img
                key={index}
                src={`http://localhost:5000${url}`}
                alt={`Preview ${index + 1}`}
                width="100"
              />
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>รายละเอียดเพิ่มเติม</h3>
          <textarea
            name="description"
            value={home.description}
            placeholder="รายละเอียดเพิ่มเติม"
            onChange={handleChange}
            rows="4"
          />
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={loading || imageUrls.length === 0}
        >
          {loading ? "กำลังบันทึก..." : "เพิ่มข้อมูลบ้าน"}
        </button>
      </form>
    </div>
  );
};

export default AddHome;
