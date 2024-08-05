const { db } = require("../db");
const crypto = require("crypto");
const { eq } = require("drizzle-orm");
const { users } = require("../db/schema");
const updateUserById = async (req, res) => {
  let { id: userId } = req.params;
  if (!userId) {
    userId = await getUserIdOrCreate(req, res);
  }
  const { salary } = req.body;
  try {
    const updatedUser = await db
      .update(users)
      .set({ salary })
      .where(eq(users.id, userId))
      .returning();
    if (updatedUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.json({ userId: updatedUser[0].id });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

const getUserById = async (req, res) => {
  let { id: userId } = req.params;
  if (!userId) {
    userId = await getUserIdOrCreate(userId);
  }
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.json({ id: user[0].id, salary: user[0].salary });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

const getUserIdOrCreate = async (userId) => {
  if (!userId) {
    userId = crypto.randomUUID();
    try {
      await db.insert(users).values({ id: userId, salary: 0 });
    } catch (error) {
      console.error("Error creating new user:", error);
      return null;
    }
  }
  return userId;
};

module.exports = {
  updateUserById,
  getUserIdOrCreate,
  getUserById,
};
