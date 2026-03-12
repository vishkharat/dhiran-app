import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {

    const { username, password } = req.body;

    if (
      username === process.env.ADMIN_USER &&
      password === process.env.ADMIN_PASS
    ) {

      const token = jwt.sign(
        { user: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        success: true,
        token
      });

    }

    res.status(401).json({
      success: false,
      message: "Invalid username or password"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};