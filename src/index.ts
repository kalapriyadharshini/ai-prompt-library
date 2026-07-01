// import express from "express";
// const app = express();
// app.use(express.json());
// app.get("/health", (req, res) => {
//   res.json({ message: "Backend + DB ready 🚀" });
// });
// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });

// import express from "express";
// import { prisma } from "./prisma";
// const app = express();
// app.use(express.json());

// // health check
// app.get("/health", (req, res) => {
//   res.json({ message: "Backend + DB working 🚀" });
// });

// // test DB route
// app.get("/users", async (req, res) => {
//   const users = await prisma.user.findMany();
//   res.json(users);
// });

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });
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
      message: "DB Connected ",
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "DB NOT connected ",
      error,
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});