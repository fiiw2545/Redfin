const Home = require("../schema/HomeSchema");

// ดึงข้อมูลบ้านทั้งหมด
const getAllHomes = async (req, res) => {
  try {
    const homes = await Home.find().sort({ listed_date: -1 }); // เรียงตามวันที่ใหม่สุด
    res.json(homes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ดึงข้อมูลบ้านตาม ID
const getHomeById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching home with ID:", id);

    // ดึงข้อมูลบ้านจากฐานข้อมูล
    const home = await Home.findById(id);

    // ถ้าไม่พบข้อมูล
    if (!home) {
      return res.status(404).json({
        success: false,
        message: "Home not found",
      });
    }

    // ส่งข้อมูลกลับไปยัง client
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

// Export ฟังก์ชันเพื่อให้ routes นำไปใช้
module.exports = {
  getAllHomes,
  getHomeById,
  createHome,
  updateHome,
  deleteHome,
  getImageHome,
};
