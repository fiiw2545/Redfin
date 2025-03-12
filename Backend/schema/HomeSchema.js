const mongoose = require("mongoose");

const HomeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // ต้องมีชื่อบ้านเสมอ
    price: { type: Number, required: true, index: true }, // ต้องมีราคาเสมอ
    details: {
      beds: { type: mongoose.Schema.Types.Mixed, required: true, index: true }, // ต้องมีจำนวนห้องนอน
      baths: { type: Number, required: true, index: true }, // ต้องมีจำนวนห้องน้ำ
      sqft: { type: Number, required: true }, // ต้องมีพื้นที่ใช้สอย
      lot_size: { type: Number, required: false }, // อาจไม่มี
      parking: { type: String, required: false }, // อาจไม่มี
    },
    address: {
      full: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      latitude: { type: Number, required: false }, // อาจไม่มี
      longitude: { type: Number, required: false }, // อาจไม่มี
    },
    images: [{ type: String, required: false }], // อาจไม่มีรูปภาพ
    furniture: [
      {
        name: { type: String, required: true },
        type: { type: String, required: false },
        brand: { type: String, required: false },
        condition: { type: String, required: false },
      },
    ],
    features: {
      has_walkthrough: { type: Boolean, default: false },
      has_video_tour: { type: Boolean, default: false },
      amenities: [{ type: String, required: false }],
    },
    tags: [{ type: String, required: false }],
    listed_date: { type: Date, required: false },
    sold_date: { type: Date, index: true },
    statusDetails: {
      // ฟิลด์เพิ่มเติมเพื่อแยกสถานะที่เกี่ยวข้อง
      forSaleStatus: {
        // สำหรับหัวข้อ For sale
        type: String,
        enum: ["Coming soon", "Active", "Under contract"],
      },
      soldStatus: {
        // สำหรับหัวข้อ Sold
        type: String,
        enum: [
          "Last 1 week",
          "Last 1 month",
          "Last 3 months",
          "Last 6 months",
          "Last 1 year",
          "Last 2 years",
          "Last 3 years",
        ],
      },
      forRentStatus: {
        type: Boolean,
        default: false,
      },
    },
    hoa_dues: { type: Number, required: false },
    year_built: { type: Number, required: false },
    property_type: { type: String, required: true }, // ต้องมีประเภทอสังหาฯ
    description: { type: String, required: false },
    agent: {
      name: { type: String, required: false },
      company: { type: String, required: false },
      phone: { type: String, required: false },
      email: { type: String, required: false },
    },
  },
  { timestamps: true }
);

// เพิ่ม compound index สำหรับการค้นหาที่ใช้บ่อย
HomeSchema.index({ status: 1, price: 1 });
HomeSchema.index({ status: 1, beds: 1 });

const Home = mongoose.model("Home", HomeSchema, "Home");

module.exports = Home;
