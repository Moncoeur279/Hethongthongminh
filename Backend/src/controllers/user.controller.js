const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email", "createdAt"],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user.id,
      username: user.name,
      email: user.email,
      joinedAt: user.createdAt,
    });
  } catch (err) {
    console.error("[user.profile] error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
