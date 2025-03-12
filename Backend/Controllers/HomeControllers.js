const Home = require("../schema/HomeSchema");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// ดึงข้อมูลบ้านทั้งหมด
const getAllHomes = async (req, res) => {
  try {
    const homes = await Home.find().sort({ listed_date: -1 }); // เรียงตามวันที่ใหม่สุด
    res.json(homes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลบ้านตาม ID
const getHomeById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching home with ID:", id);

    // ตรวจสอบว่า ID เป็น ObjectId ที่ถูกต้องหรือไม่
    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ID format" });
    }

    const home = await Home.findById(id);

    if (!home) {
      return res.status(404).json({
        success: false,
        message: "Home not found",
      });
    }

    res.status(200).json({
      success: true,
      data: home,
    });
  } catch (error) {
    console.error("Error in getHomeById:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// เพิ่มข้อมูลบ้านใหม่
const createHome = async (req, res) => {
  try {
    const newHome = new Home(req.body);
    const savedHome = await newHome.save();
    res.status(201).json(savedHome);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// แก้ไขข้อมูลบ้าน
const updateHome = async (req, res) => {
  try {
    const updatedHome = await Home.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedHome) return res.status(404).json({ message: "บ้านไม่พบ" });
    res.json(updatedHome);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ลบข้อมูลบ้าน
const deleteHome = async (req, res) => {
  try {
    const deletedHome = await Home.findByIdAndDelete(req.params.id);
    if (!deletedHome) return res.status(404).json({ message: "บ้านไม่พบ" });
    res.json({ message: "ลบบ้านสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//ดึงภาพบ้านแต่ละหลัง
const getImageHome = async (req, res) => {
  try {
    const homeId = req.params.id;
    const home = await Home.findById(homeId);

    if (!home) {
      return res.status(404).json({ message: "บ้านไม่พบ" });
    }

    // ส่งคืน URL ของรูปภาพทั้งหมด
    const imageUrls = home.images.map((img) => `http://localhost:5000${img}`);
    res.json({ images: imageUrls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงรูปภาพ" });
  }
};

//ค้นหาบ้านตามค่าต่างๆ
const searchHomes = async (req, res) => {
  try {
    const {
      status,
      beds,
      baths,
      minPrice,
      maxPrice,
      homeTypes,
      comingSoon,
      active,
      underContract,
    } = req.query;

    console.log("🔍 ค่าที่ได้รับจาก Query:", req.query);

    const query = {};

    // ✅ ฟังก์ชันช่วยจัดการ trim() ค่า string
    const clean = (value) => (typeof value === "string" ? value.trim() : value);

    // ✅ แก้ไขโค้ดให้เช็ค status แบบไม่สนตัวพิมพ์ใหญ่เล็ก
    if (status) {
      query.status = new RegExp(`^${clean(status)}$`, "i"); // ทำให้ค้นหาแบบไม่สนตัวพิมพ์ใหญ่-เล็ก
    }

    // ✅ จัดการ Coming Soon, Active, Under Contract (รองรับตัวพิมพ์เล็ก-ใหญ่)
    const statusFilters = [];
    if (clean(comingSoon) === "true")
      statusFilters.push(new RegExp("^Coming soon$", "i"));
    if (clean(active) === "true")
      statusFilters.push(new RegExp("^Active$", "i"));
    if (clean(underContract) === "true")
      statusFilters.push(new RegExp("^Under contract$", "i"));

    if (statusFilters.length > 0) {
      query["statusDetail"] = { $in: statusFilters };
    }

    // ✅ จัดการ minPrice และ maxPrice
    const minPriceValue = parseFloat(clean(minPrice));
    const maxPriceValue = parseFloat(clean(maxPrice));

    if (!isNaN(minPriceValue) || !isNaN(maxPriceValue)) {
      query.price = {};
      if (!isNaN(minPriceValue)) query.price.$gte = minPriceValue;
      if (!isNaN(maxPriceValue)) query.price.$lte = maxPriceValue;
    }

    // ✅ จัดการ beds (รองรับ Studio เป็น 0)
    if (beds) {
      const bedsArray = clean(beds)
        .split(",")
        .map((bed) => (bed.toLowerCase() === "studio" ? 0 : parseInt(bed)))
        .filter((bed) => !isNaN(bed)); // กรอง NaN ออก

      if (bedsArray.length > 0) {
        query["details.beds"] = { $in: bedsArray };
      }
    }

    // ✅ จัดการ baths (รองรับ `1.5+`)
    if (baths) {
      const bathValue = parseFloat(clean(baths).replace("+", ""));
      if (!isNaN(bathValue)) {
        query["details.baths"] = { $gte: bathValue };
      }
    }

    // ✅ จัดการประเภทบ้าน (House, Townhouse)
    if (homeTypes) {
      query.property_type = { $in: clean(homeTypes).split(",").map(clean) };
    }

    console.log("🟢 คิวรีที่ส่งไปยัง MongoDB:", query);

    const homes = await Home.find(query);

    res.status(200).json({ success: true, data: homes });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการค้นหาบ้าน",
      error: error.message,
    });
  }
};

// Export ฟังก์ชันเพื่อให้ routes นำไปใช้
module.exports = {
  getAllHomes,
  getHomeById,
  createHome,
  updateHome,
  deleteHome,
  getImageHome,
  searchHomes,
};
