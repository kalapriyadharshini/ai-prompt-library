import express from "express";
import { prisma } from "./prisma";
import authRoutes from "./routes/auth.routes";
import { auth } from "./middleware/auth";
import promptRoutes from "./routes/prompt.routes";
const app = express();
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/prompts", promptRoutes);
// DB test route
app.get("/db-test", async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT 1`;

    res.json({
      success: true,
      message: "DB Connected",
      result: JSON.parse(JSON.stringify(result, (_, v) =>
        typeof v === "bigint" ? v.toString() : v
      )),
    });

  } catch (error: any) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "DB NOT connected",
      error: error.message,
    });
  }
});
app.get("/profile", auth, (req, res) => {
  res.json({
    success: true,
    message: "Welcome! You are authorized.",
    user: (req as any).user,
  });
});
export default app;