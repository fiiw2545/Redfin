import { useState } from "react";
import axios from "axios";

const styles = {
  addHomeContainer: {
    width: "80%",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  formSection: {
    marginBottom: "20px",
  },
  formSectionTitle: {
    fontSize: "20px",
    marginBottom: "10px",
    color: "#333",
    textDecoration: "underline",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxSizing: "border-box",
    fontSize: "16px",
  },
  textarea: {
    resize: "vertical",
    padding: "15px",
  },
  button: {
    padding: "12px 20px",
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
    transition: "background-color 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#45a049",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  },
  errorMessages: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "5px",
  },
  errorMessageItem: {
    marginBottom: "5px",
  },
  furnitureItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  imagePreview: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  imagePreviewImg: {
    width: "150px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "5px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  addHomeForm: {
    display: "flex",
    flexDirection: "column",
  },
};

const AddHome = () => {
  const [home, setHome] = useState({
    name: "",
    price: "",
    details: {
      beds: "",
      baths: "",
      sqft: "",
      lot_size: "",
      parking: "",
    },
    address: {
      full: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      latitude: "",
      longitude: "",
    },
    features: {
      has_walkthrough: false,
      has_video_tour: false,
      amenities: [],
    },
    agent: {
      name: "",
      company: "",
      phone: "",
      email: "",
    },
    property_type: "",
    description: "",
    images: [],
    furniture: [{ name: "", type: "", brand: "", condition: "" }],
    tags: [],
    listed_date: "",
    sold_date: "",
    status: "Coming soon",
    for_rent: false,
    hoa_dues: "",
    year_built: "",
  });

  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [description, setDescription] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // การจัดการกับ checkbox
    if (type === "checkbox") {
      if (name === "features.has_walkthrough") {
        setHome((prev) => ({
          ...prev,
          features: { ...prev.features, has_walkthrough: checked },
        }));
      } else if (name === "features.has_video_tour") {
        setHome((prev) => ({
          ...prev,
          features: { ...prev.features, has_video_tour: checked },
        }));
      } else if (name === "amenities") {
        const updatedAmenities = checked
          ? [...home.features.amenities, value]
          : home.features.amenities.filter((item) => item !== value);

        setHome((prev) => ({
          ...prev,
          features: { ...prev.features, amenities: updatedAmenities },
        }));
      }
    } else if (name.includes(".")) {
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

  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setHome((prevState) => ({
        ...prevState,
        tags: [...prevState.tags, value],
      }));
    } else {
      setHome((prevState) => ({
        ...prevState,
        tags: prevState.tags.filter((tag) => tag !== value),
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setHome((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const handleFurnitureChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFurniture = [...home.furniture];
    updatedFurniture[index] = { ...updatedFurniture[index], [name]: value };
    setHome((prev) => ({ ...prev, furniture: updatedFurniture }));
  };

  const addFurniture = () => {
    setHome((prev) => ({
      ...prev,
      furniture: [
        ...prev.furniture,
        { name: "", type: "", brand: "", condition: "" },
      ],
    }));
  };

  const removeFurniture = (index) => {
    const updatedFurniture = home.furniture.filter((_, i) => i !== index);
    setHome((prev) => ({ ...prev, furniture: updatedFurniture }));
  };

  const handleUpload = async () => {
    if (home.images.length === 0) return alert("กรุณาเลือกรูปภาพ");
    setLoading(true);

    try {
      const uploadPromises = home.images.map(async (image) => {
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
      setImageUrls(urls);
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
    setErrorMessages([]);

    const fullAddress = `${home.address.street}, ${home.address.city}, ${home.address.state}, ${home.address.zip}`;

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
            lot_size: Number(home.details.lot_size),
          },
          address: {
            ...home.address,
            full: fullAddress,
          },
          images: imageUrls,
        },
        { withCredentials: true }
      );

      alert("เพิ่มบ้านสำเร็จ!");
      setHome({
        name: "",
        price: "",
        details: { beds: "", baths: "", sqft: "", lot_size: "", parking: "" },
        address: {
          full: "",
          street: "",
          city: "",
          state: "",
          zip: "",
          latitude: "",
          longitude: "",
        },
        features: {
          has_walkthrough: false,
          has_video_tour: false,
          amenities: [],
        },
        agent: { name: "", company: "", phone: "", email: "" },
        property_type: "",
        description: "",
        images: [],
        furniture: [{ name: "", type: "", brand: "", condition: "" }],
        tags: [],
        listed_date: "",
        sold_date: "",
        status: "Coming soon",
        for_rent: false,
        hoa_dues: "",
        year_built: "",
      });
      setImageUrls([]);
    } catch (error) {
      console.error("Error adding home:", error);
      setErrorMessages([
        error.response?.data?.message || "เกิดข้อผิดพลาดในการเพิ่มบ้าน",
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-home-container">
      <h2>เพิ่มข้อมูลบ้าน</h2>
      {errorMessages.length > 0 && (
        <div className="error-messages">
          <ul>
            {errorMessages.map((msg, index) => (
              <li key={index} style={{ color: "red" }}>
                {msg}
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="add-home-form">
        {/* General Info */}
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
            <option value="Condo">คอนโดมิเนียม</option>
            <option value="House">บ้านเดี่ยว</option>
            <option value="Townhouse">ทาวน์เฮาส์</option>
            <option value="Land">ที่ดิน</option>
          </select>
        </div>

        {/* Property Details */}
        <div className="form-section">
          <h3>รายละเอียดอสังหาริมทรัพย์</h3>
          <input
            type="number"
            name="details.beds"
            value={home.details.beds}
            placeholder="จำนวนห้องนอน"
            onChange={handleChange}
          />
          <input
            type="number"
            name="details.baths"
            value={home.details.baths}
            placeholder="จำนวนห้องน้ำ"
            onChange={handleChange}
          />
          <input
            type="number"
            name="details.sqft"
            value={home.details.sqft}
            placeholder="พื้นที่ใช้สอย (ตร.ม.)"
            onChange={handleChange}
          />
          <input
            type="number"
            name="details.lot_size"
            value={home.details.lot_size}
            placeholder="ขนาดที่ดิน (ไร่)"
            onChange={handleChange}
          />
          <input
            type="text"
            name="details.parking"
            value={home.details.parking}
            placeholder="ที่จอดรถ"
            onChange={handleChange}
          />
        </div>

        {/* Address */}
        <div className="form-section">
          <h3>ที่อยู่</h3>
          <input
            type="text"
            name="address.street"
            value={home.address.street}
            placeholder="ถนน"
            onChange={handleChange}
          />
          <input
            type="text"
            name="address.city"
            value={home.address.city}
            placeholder="เมือง"
            onChange={handleChange}
          />
          <input
            type="text"
            name="address.state"
            value={home.address.state}
            placeholder="จังหวัด"
            onChange={handleChange}
          />
          <input
            type="text"
            name="address.zip"
            value={home.address.zip}
            placeholder="รหัสไปรษณีย์"
            onChange={handleChange}
          />
        </div>

        {/* Latitude and Longitude */}
        <div className="form-section">
          <h3>ตำแหน่ง (ละติจูด, ลองติจูด)</h3>
          <input
            type="number"
            name="address.latitude"
            value={home.address.latitude}
            placeholder="ละติจูด"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="address.longitude"
            value={home.address.longitude}
            placeholder="ลองติจูด"
            onChange={handleChange}
            required
          />
        </div>

        {/* Status */}
        <div className="form-section">
          <h3>สถานะบ้าน</h3>
          <select name="status" value={home.status} onChange={handleChange}>
            <option value="Coming soon">พร้อมขาย</option>
            <option value="Sold">ขายแล้ว</option>
          </select>
        </div>

        {/*การเช่า */}
        <div className="form-section">
          <h3>สถานะการให้เช่า</h3>
          <select
            name="for_rent"
            value={home.for_rent ? "true" : "false"}
            onChange={(e) =>
              setHome({ ...home, for_rent: e.target.value === "true" })
            }
          >
            <option value="true">ให้เช่า</option>
            <option value="false">ไม่ให้เช่า</option>
          </select>
        </div>

        {/* Listed Date */}
        <div className="form-section">
          <h3>วันที่ประกาศ</h3>
          <input
            type="date"
            name="listed_date"
            value={home.listed_date}
            onChange={handleChange}
          />
        </div>

        {/* HOA Dues */}
        <div className="form-section">
          <h3>ค่าใช้จ่ายของ HOA</h3>
          <input
            type="number"
            name="hoa_dues"
            value={home.hoa_dues}
            onChange={handleChange}
            placeholder="ค่าใช้จ่ายของ HOA (หากมี)"
          />
        </div>

        {/* Year Built */}
        <div className="form-section">
          <h3>ปีที่สร้าง</h3>
          <input
            type="number"
            name="year_built"
            value={home.year_built}
            onChange={handleChange}
            placeholder="ปีที่สร้าง"
          />
        </div>

        {/* Tags */}
        <div className="form-section">
          <h3>เลือก Tags</h3>
          <div>
            <input
              type="checkbox"
              name="tags"
              value="Listed by Redfin"
              checked={home.tags.includes("Listed by Redfin")}
              onChange={handleTagChange}
            />
            <label>Listed by Redfin</label>
          </div>
          <div>
            <input
              type="checkbox"
              name="tags"
              value="3D Walkthrough"
              checked={home.tags.includes("3D Walkthrough")}
              onChange={handleTagChange}
            />
            <label>3D Walkthrough</label>
          </div>
        </div>

        {/* Features */}
        <div className="form-section">
          <h3>คุณสมบัติ</h3>
          <div>
            <input
              type="checkbox"
              name="features.has_walkthrough"
              checked={home.features.has_walkthrough}
              onChange={handleChange}
            />
            <label>มีการนำเสนอเสมือนจริง</label>
          </div>
          <div>
            <input
              type="checkbox"
              name="features.has_video_tour"
              checked={home.features.has_video_tour}
              onChange={handleChange}
            />
            <label>มีวีดีโอทัวร์</label>
          </div>
          <div>
            <input
              type="checkbox"
              name="amenities"
              value="swimming_pool"
              checked={home.features.amenities.includes("swimming_pool")}
              onChange={handleChange}
            />
            <label>สระว่ายน้ำ</label>
          </div>
          <div>
            <input
              type="checkbox"
              name="amenities"
              value="gym"
              checked={home.features.amenities.includes("gym")}
              onChange={handleChange}
            />
            <label>ฟิตเนส</label>
          </div>
        </div>

        {/* Furniture */}
        <div className="form-section">
          <h3>เฟอร์นิเจอร์</h3>
          {home.furniture.map((furniture, index) => (
            <div key={index}>
              <input
                type="text"
                name="name"
                value={furniture.name}
                placeholder="ชื่อเฟอร์นิเจอร์"
                onChange={(e) => handleFurnitureChange(index, e)}
              />
              <input
                type="text"
                name="type"
                value={furniture.type}
                placeholder="ประเภทเฟอร์นิเจอร์"
                onChange={(e) => handleFurnitureChange(index, e)}
              />
              <input
                type="text"
                name="brand"
                value={furniture.brand}
                placeholder="แบรนด์"
                onChange={(e) => handleFurnitureChange(index, e)}
              />
              <input
                type="text"
                name="condition"
                value={furniture.condition}
                placeholder="สภาพ"
                onChange={(e) => handleFurnitureChange(index, e)}
              />
              <button type="button" onClick={() => removeFurniture(index)}>
                ลบ
              </button>
            </div>
          ))}
          <button type="button" onClick={addFurniture}>
            เพิ่มเฟอร์นิเจอร์
          </button>
        </div>

        {/* Image Upload */}
        <div className="form-section">
          <h3>อัพโหลดรูปภาพ</h3>
          <input type="file" multiple onChange={handleImageChange} />
          <button type="button" onClick={handleUpload}>
            อัปโหลดรูปภาพ
          </button>
        </div>

        {/* About */}
        <div className="form-section">
          <h3>รายละเอียด</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)} // เปลี่ยนค่าของ description
            placeholder="กรุณากรอกรายละเอียด"
          />
        </div>

        {/* Seller Information */}
        <div className="form-section">
          <h3>ข้อมูลผู้ขาย</h3>
          <input
            type="text"
            name="agent.name"
            value={home.agent.name}
            placeholder="ชื่อผู้ขาย"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="agent.company"
            value={home.agent.company}
            placeholder="บริษัท"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="agent.phone"
            value={home.agent.phone}
            placeholder="เบอร์โทรศัพท์"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="agent.email"
            value={home.agent.email}
            placeholder="อีเมล"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-section">
          <button type="submit" disabled={loading}>
            {loading ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHome;
