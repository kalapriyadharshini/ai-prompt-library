import bcrypt from "bcrypt";
import express from "express";
import { prisma } from "../prisma";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //  ADD THIS BLOCK HERE
const existingUser = await prisma.user.findUnique({
  where: { email },
});

if (existingUser) {
  return res.status(400).json({
    success: false,
    message: "User already exists",
  });
}
    // 1. hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. save user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // res.json({
    //   success: true,
    //   message: "User created securely",
    //   user,
    // });
    const token = jwt.sign(
  { id: user.id, email: user.email },
  process.env.JWT_SECRET as string,
  { expiresIn: "1d" }
);
    res.json({
  success: true,
  message: "User created securely",
token,
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  },
});

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "User creation failed",
      error: error.message,
    });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }
const token = jwt.sign(
  { id: user.id, email: user.email },
  process.env.JWT_SECRET as string,
  { expiresIn: "1d" }
);
   res.json({
  success: true,
  message: "Login successful",
  token,
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
  },
});

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
});
export default router;