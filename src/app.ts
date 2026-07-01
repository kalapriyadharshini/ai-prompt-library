import express from "express";
import { prisma } from "./prisma";

const app = express();
app.use(express.json());

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

export default app;