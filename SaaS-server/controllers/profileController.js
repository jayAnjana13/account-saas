import User from "../models/userModel.js";

const profileData = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("profile");

    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }
    res.status(200).json({
      profileInfo: user.profile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const fetchProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).populate("profile");
    if (!user) {
      return res.status(404).json({ message: "Profile non found" });
    }
    res.status(200).json({ success: true, profile: user.profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error in fetching profile data" });
  }
};

export { profileData, fetchProfile };
